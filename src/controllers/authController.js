const User = require('../models/user');
const Joi = require('joi');
const utils = require('../helpers/utils');

const validationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(18).required(),
});

const validationSchemaOpt = { abortEarly: false };

exports.register = async (req, res) => {
  try {
    // Validation
    const validationResult = utils.validateData(
      validationSchema,
      req.body,
      validationSchemaOpt
    );
    if (validationResult) {
      return res.status(400).send(utils.responseMsg(validationResult));
    }
    // Checking if user already exists
    const hasUser = await User.findOne({ email: req.body.email });
    if (hasUser) {
      return res.status(409).send(utils.responseMsg('User already exists!'));
    }
    // Registering the User
    await User.create(req.body);
    res
      .status(200)
      .send(
        utils.responseMsg(
          null,
          true,
          'Your registration has been successful. In order to log in, please verify your email address.'
        )
      );
  } catch (error) {
    console.log(error);
    res.status(500).send(utils.responseMsg(error));
  }
};

exports.login = (req, res) => {
  res.send('login');
};
