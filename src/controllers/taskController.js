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
    res
      .status(200)
      .send(utils.responseMsg(null, true, 'Task successfully created.'));
  } catch (error) {
    console.log(error);
    res.status(500).send(utils.responseMsg(error.message));
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
    res
      .status(200)
      .send(utils.responseMsg(null, true, 'Task successfully updated.'));
  } catch (error) {
    console.log(error);
    res.status(500).send(utils.responseMsg(error.message));
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    console.log(tasks[0]);
    res.send('get');
  } catch (error) {
    console.log(error);
    res.status(500).send(utils.responseMsg(error.message));
  }
};

exports.rearrangeTasks = async (req, res) => {
  res.send('rearrange');
};

exports.deleteTask = async (req, res) => {
  res.send('deleteTask');
};
