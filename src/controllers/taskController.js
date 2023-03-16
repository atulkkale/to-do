const Task = require('../models/task');
const utils = require('../helpers/utils');
const Joi = require('joi');
const mongoose = require('mongoose');

const taskSchemaOpt = { abortEarly: false };

exports.createTask = async (req, res) => {
  try {
    // Validation
    const createTaskSchema = Joi.object().keys({
      taskName: Joi.string().lowercase().min(2).max(20).required(),
      taskDate: Joi.date().required(),
      taskStatus: Joi.string().lowercase().valid('completed', 'incomplete'),
    });
    const validationResult = utils.validateData(
      createTaskSchema,
      req.body,
      taskSchemaOpt
    );
    if (validationResult) {
      return res.status(403).send(utils.responseMsg(validationResult));
    }
    // Check if task already exists
    const taskList = await Task.find({ taskOwner: req.user._id });
    if (taskList.some((e) => e.taskName === req.body.taskName.toLowerCase()))
      return res.status(409).send(utils.responseMsg('Task already exists!'));
    // Add task
    await Task.create({
      ...req.body,
      order: ++taskList.length,
      taskOwner: req.user._id,
    });
    return res
      .status(200)
      .send(utils.responseMsg(null, true, 'Task successfully created.'));
  } catch (error) {
    console.log(error);
    return res.status(500).send(utils.responseMsg(error.message));
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    // Validation
    const updateTaskSchema = Joi.object()
      .keys({
        taskName: Joi.string().lowercase().min(2).max(20).optional(),
        taskDate: Joi.date().optional(),
        taskStatus: Joi.string()
          .lowercase()
          .valid('completed', 'incomplete')
          .optional(),
      })
      .or('taskName', 'taskDate', 'taskStatus')
      .required();
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      return res.status(403).send(utils.responseMsg('Invalid Request Id!'));
    const validationResult = utils.validateData(
      updateTaskSchema,
      req.body,
      taskSchemaOpt
    );
    if (validationResult)
      return res.status(403).send(utils.responseMsg(validationResult));
    // Updating task
    const task = await Task.updateOne(
      { _id: id, taskOwner: req.user._id },
      req.body,
      {
        runValidators: true,
      }
    );
    if (!task.matchedCount)
      return res.status(404).send(utils.responseMsg('Task not found!'));
    return res
      .status(200)
      .send(utils.responseMsg(null, true, 'Task successfully updated.'));
  } catch (error) {
    console.log(error);
    return res.status(500).send(utils.responseMsg(error.message));
  }
};

exports.getTasks = async (req, res) => {
  try {
    // Validation
    const getTaskSchema = Joi.object().keys({
      page: Joi.number().integer(),
      limit: Joi.number().integer(),
    });
    const validationResult = utils.validateData(
      getTaskSchema,
      req.query,
      taskSchemaOpt
    );
    if (validationResult) {
      return res.status(403).send(utils.responseMsg(validationResult));
    }
    // Pagination
    const userID = req.user._id;
    let pagination = false;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    if (page && limit) pagination = true;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const tasks = {};
    tasks.docs = await Task.find({ taskOwner: userID })
      .sort({ order: 1 })
      .skip(startIndex)
      .limit(limit);
    tasks.page = page;
    tasks.limit = limit;
    tasks.totalDocs = await Task.count({ taskOwner: userID });
    tasks.totalPages = Math.ceil(tasks.totalDocs / limit);
    if (endIndex < tasks.totalDocs) {
      tasks.hasNextPage = true;
      tasks.nextPage = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      tasks.hasPrevPage = true;
      tasks.prevPage = {
        page: page - 1,
        limit: limit,
      };
    }
    return res
      .status(200)
      .send(utils.responseMsg(null, true, tasks, pagination));
  } catch (error) {
    console.log(error);
    return res.status(500).send(utils.responseMsg(error.message));
  }
};

exports.rearrangeTasks = async (req, res) => {
  try {
    // Validation
    const rearrangeTasksSchema = Joi.array().items(Joi.string().required());
    const validationResult = utils.validateData(
      rearrangeTasksSchema,
      req.body,
      taskSchemaOpt
    );
    if (validationResult) {
      return res.status(403).send(utils.responseMsg(validationResult));
    }
    const userId = req.user.id;
    const userUpdatedTasks = await Task.find({
      taskOwner: userId,
      taskName: { $in: req.body },
    });
    const tasksCount = await Task.count({ taskOwner: userId });
    if (userUpdatedTasks.length !== tasksCount)
      return res
        .status(403)
        .send(utils.responseMsg('Please enter all tasks to rearrange!'));
    // Rearranging tasks
    const taskBulkOp = [];
    for (let task of userUpdatedTasks) {
      const taskIndex = req.body.indexOf(task.taskName) + 1;
      const taskUpdateOp = {
        updateOne: {
          filter: { _id: task._id },
          update: { $set: { order: taskIndex } },
        },
      };
      taskBulkOp.push(taskUpdateOp);
    }
    await Task.bulkWrite(taskBulkOp);
    return res
      .status(200)
      .send(utils.responseMsg(null, true, 'Task rearranged successfully.'));
  } catch (error) {
    console.log(error);
    return res.status(500).send(utils.responseMsg(error.message));
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    // Validation
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      return res.status(403).send(utils.responseMsg('Invalid Request Id!'));
    // Delete the task
    const { userId } = req.user._id;
    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      taskOwner: userId,
    });
    if (!deletedTask)
      return res.status(404).send(utils.responseMsg('Task not found!'));
    // Update the order
    await Task.updateMany(
      {
        taskOwner: userId,
        order: { $gt: deletedTask.order },
      },
      {
        $inc: {
          order: -1,
        },
      }
    );
    return res
      .status(200)
      .send(utils.responseMsg(null, true, 'Task successfully deleted.'));
  } catch (error) {
    console.log(error);
    return res.status(500).send(utils.responseMsg(error.message));
  }
};
