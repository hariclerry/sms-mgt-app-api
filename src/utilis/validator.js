/**
 * @file contains implementation for fields validation
 */

//Third party imports
const Joi = require('joi');

// Validate user registration
function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    phoneNumber: Joi.number().integer()
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

// Validate user login
function validateLogin(req) {
  const schema = {
    phoneNumber: Joi.number().integer()
    .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };

  return Joi.validate(req, schema);
}

// Validate contact
function validateContact(record) {
  const schema = {
    contactName: Joi.string()
      .min(3)
      .max(15)
      .required(),
    contactNumber: Joi.number()
      .integer()
      .required()
  };

  return Joi.validate(record, schema);
}

// Validate update contact
function validateUpdateContact(record) {
  const schema = {
    contactName: Joi.string()
      .min(3)
      .max(15)
      .required()
  };

  return Joi.validate(record, schema);
}

// Validate sms
function validateSms(record) {
  const schema = {
    content: Joi.string()
      .min(3)
      .max(60)
      .required()
  };

  return Joi.validate(record, schema);
}

exports.validate = validateContact;
exports.validateUpdateContact = validateUpdateContact;
exports.validateSms = validateSms;
exports.validateUser = validateUser;
exports.validateLogin = validateLogin;
