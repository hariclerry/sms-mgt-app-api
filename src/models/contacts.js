/**
 * @file creates the sub contact schema
 */

// Third party imports
const mongoose = require('mongoose');

// local imports
const smsSchema = require('./sms').schema;

//constants
const Schema = mongoose.Schema;

// create schema
const contactSchema = Schema({
  contactName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: Number,
    required: true
  },
  sms: [smsSchema],
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contacts', contactSchema);
