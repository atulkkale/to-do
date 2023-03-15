const jwt = require('jsonwebtoken');
const User = require('../models/user');
const utils = require('../helpers/utils');
const mongoose = require('mongoose');

exports.cookieJwtAuth = async (req, res, next) => {
  try {
    if (!req.cookies.jwtToken) {
      return res.status(401).send(utils.responseMsg('Unauthorized'));
    }
    const userID = jwt.verify(req.cookies.jwtToken, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(userID),
    });
    if (!user) {
      return res.status(401).send(utils.responseMsg('Unauthorized'));
    }
    req.user = user;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).send(utils.responseMsg('Unauthorized'));
  }
};
