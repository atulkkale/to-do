const otpGenerator = require('otp-generator');

exports.generateOTP = () => {
  const OTP_CONFIG = {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  };
  return otpGenerator.generate(6, OTP_CONFIG);
};
