const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
});

userSchema.pre('save', async function (next) {
  if (this.password.length < 60) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
  next();
});

userSchema.methods.generateJwtToken = async function () {
  try {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: 300,
    });
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = mongoose.model('User', userSchema);
