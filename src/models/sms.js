/**
 * @file creates the sub location schema
 */

// Third party imports
const mongoose = require('mongoose');

// local imports
// const userSchema = require('./user').schema;

//constants
const Schema = mongoose.Schema;

// create schema
const smsSchema = Schema({
  senderNumber: {
    type: Number,
    required: true
  },
  receiverNumber: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  },
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User'
  // } ,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sms', smsSchema);
