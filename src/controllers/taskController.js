const Task = require('../models/task');
const utils = require('../helpers/utils');
const Joi = require('joi');

exports.createTask = async (req, res, next) => {
  try {
    // Validation
    const taskSchema = Joi.object().keys({
      taskName: Joi.string().lowercase().min(2).max(20).required(),
      taskDate: Joi.date(),
      taskStatus: Joi.string().lowercase().valid('completed', 'incomplete'),
    });

    const taskSchemaOpt = { abortEarly: false };
    const validationResult = utils.validateData(
      taskSchema,
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

exports.updateTask = async (req, res, next) => {
  res.send('update');
};

exports.getTasks = async (req, res, next) => {
  res.send('get');
};

exports.rearrangeTasks = async (req, res, next) => {
  res.send('rearrange');
};
