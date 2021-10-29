const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { re, names, minId, maxId, emailFormatError, matchedEmailFormat, userNameLength, passwordLength } = require('../shared/constants');

const validateEmail = (email) => re.test(email)

const userSchema = new mongoose.Schema({
  firstName: names,
  lastName: names,
  id: { type: Number, min: minId, max: maxId, required: true, unique: true },
  email: {
    type: String, required: true, trim: true, lowercase: true, unique: true,
    validate: [validateEmail, emailFormatError], match: [matchedEmailFormat, emailFormatError]
  },
  userName: { type: String, required: true, minLength: userNameLength, unique: true },
  password: { type: String, required: true, minLength: passwordLength, unique: true },
  isAdmin: { type: Boolean, default: false }
});

userSchema.methods.generateUserToken = function () {
  const user = this;

  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      email: user.email,
      userName: user.userName,
      isAdmin: user.isAdmin,
    }, process.env.jwtPrivateKey
  );
};

module.exports = User = mongoose.model('User', userSchema);
