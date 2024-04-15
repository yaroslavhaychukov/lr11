const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Invalid email address.',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isLength(value, { min: 6 }) && /[a-zA-Z]/.test(value),
      message: 'Password should be at least 6 characters long and contain at least one letter.',
    },
  },
  photo: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'master'],
  },
  workshop: {
    type: String, 
  },

});

const User = mongoose.model('User', userSchema);

module.exports = User;
