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
      return res.status(400).send(utils.responseMsg(validationResult));
    }
    // Check if task already exists
    const taskList = await Task.find({ taskOwner: req.user._id });
    if (taskList.some((e) => e.taskName === req.body.taskName.toLowerCase()))
      return res.status(403).send(utils.responseMsg('Task already exists!'));
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
      return res.status(400).send(utils.responseMsg('Invalid Request Id!'));
    const validationResult = utils.validateData(
      updateTaskSchema,
      req.body,
      taskSchemaOpt
    );
    if (validationResult)
      return res.status(400).send(utils.responseMsg(validationResult));
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
      return res.status(400).send(utils.responseMsg(validationResult));
    }
    // Pagination
    let pagination = false;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    if (page && limit) pagination = true;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const tasks = {};
    tasks.docs = await Task.find({ taskOwner: req.user._id })
      .limit(limit)
      .skip(startIndex);
    tasks.page = page;
    tasks.limit = limit;
    tasks.totalDocs = await Task.count({ taskOwner: req.user._id });
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
  res.send('rearrange');
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    // Validation
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      return res.status(400).send(utils.responseMsg('Invalid Request Id!'));
    // Delete the task
    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      taskOwner: req.user._id,
    });
    if (!deletedTask)
      return res.status(404).send(utils.responseMsg('Task not found!'));
    // Update the order
    await Task.updateMany(
      {
        taskOwner: req.user._id,
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
