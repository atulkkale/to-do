const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
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
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.password.length < 60) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
  if (this.otp.length < 60) {
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(this.otp, salt);
    this.otp = hashedOtp;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
