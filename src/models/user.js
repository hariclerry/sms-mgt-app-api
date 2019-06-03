/**
 * @file creates the user schema
 * handles token generation logic
 */

// Third party imports
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

//constants
const Schema = mongoose.Schema;

// create schema
const userSchema = Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  phoneNumber: {
    type: Number,
    required: true,
    minlength: 9,
    maxlength: 12,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * @function generateAuthToken
 * called generating token
 */
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
  return token;
};

const User = mongoose.model('User', userSchema);
module.exports.User = User;
