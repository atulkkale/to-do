const User = require('../models/user');
const Joi = require('joi');
const utils = require('../helpers/utils');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const { generateOTP } = require('../services/authServices');
const jwt = require('jsonwebtoken');

const validationSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(18).required(),
});

const validationSchemaOpt = { abortEarly: false };

exports.register = async (req, res) => {
  try {
    // Edge case
    req.body.password = String(req.body.password);
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
    const { email } = req.body;
    const hasUser = await User.findOne({ email: email });
    if (hasUser) {
      return res.status(409).send(utils.responseMsg('User already exists!'));
    }
    // Generate OTP
    const otp = generateOTP();
    req.body.otp = otp;
    // Send OTP
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    const mailMessage = {
      to: email,
      from: 'kaleatul9@gmail.com',
      subject: 'To Do app OTP verification',
      text: `your OTP is: ${otp}`,
      html: `<h1>your OTP is <strong>${otp}</strong></h1><br><p>Regards,</p><p><strong>Atul Kale.</strong></p>`,
    };
    await sgMail.send(mailMessage);
    // Registering the User
    await User.create(req.body);
    return res
      .status(200)
      .send(
        utils.responseMsg(
          null,
          true,
          'Your registration has been successful. OTP has been send to your registered email address.'
        )
      );
  } catch (error) {
    console.log(error);
    res.status(500).send(utils.responseMsg(error.message));
  }
};

exports.login = async (req, res) => {
  try {
    // Edge case
    req.body.password = String(req.body.password);
    // Validation
    const validationResult = utils.validateData(
      validationSchema,
      req.body,
      validationSchemaOpt
    );
    if (validationResult) {
      return res.status(400).send(utils.responseMsg(validationResult));
    }
    // Log in
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const authenticatedUser = await bcrypt.compare(password, user.password);
      if (authenticatedUser) {
        if (user.isVerified) {
          // Generate JWT token
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: 300,
          });
          res.cookie('jwtToken', token, {
            expires: new Date(Date.now() + 300000),
            httpOnly: true,
          });
          return res
            .status(200)
            .send(utils.responseMsg(null, true, 'Login Successful'));
        } else {
          return res
            .status(401)
            .send(
              utils.responseMsg(
                'Email is not verified! Please verify the email to login.'
              )
            );
        }
      } else {
        return res.status(401).send(utils.responseMsg('Password not matched!'));
      }
    } else {
      return res
        .status(404)
        .send(utils.responseMsg('User not exists. Please register!'));
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(utils.responseMsg(error.message));
  }
};

exports.verify = async (req, res) => {
  try {
    // Validation
    const verifySchema = Joi.object({
      email: Joi.string().email().required(),
      otp: Joi.number().min(100000).max(999999).integer().required(),
    });

    const verifySchemaOpt = { abortEarly: false };

    const validationResult = utils.validateData(
      verifySchema,
      req.body,
      verifySchemaOpt
    );
    if (validationResult) {
      return res.status(400).send(utils.responseMsg(validationResult));
    }
    // Verify OTP
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send(utils.responseMsg('User not found'));
    }
    const verifiedUser = await bcrypt.compare(String(otp), user.otp);
    if (verifiedUser) {
      user.isVerified = true;
      await user.save();
      return res
        .status(200)
        .send(
          utils.responseMsg(
            null,
            true,
            'OTP verification successful. Email verified.'
          )
        );
    } else {
      return res.status(401).send(utils.responseMsg('OTP did not match!'));
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(utils.responseMsg(error.message));
  }
};
