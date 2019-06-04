/**
 * @file contains implementation for fields validation
 */

//Third party imports
const Joi = require('joi');

// Validates user registration
function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
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

// Validates user login
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

// Validates locations
// function validateRecord(record) {
//   const schema = {
//     locationName: Joi.string()
//       .min(3)
//       .max(50)
//       .required(),
//     numberOfFemale: Joi.number()
//       .integer()
//       .required(),
//     numberOfMale: Joi.number()
//       .integer()
//       .required()
//   };

//   return Joi.validate(record, schema);
// }

// exports.validate = validateRecord;
exports.validateUser = validateUser;
exports.validateLogin = validateLogin;
