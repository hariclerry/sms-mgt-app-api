/**
 * @file contains all the routes for the implemented endpoints
 */

// local imports
const contacts = require('../controllers/contacts');
const users = require('../controllers/users');
const sms = require('../controllers/sms');
const auth = require('../middleware/auth');

// constants
const {
  createContact,
  deleteContact,
  fetchAllContacts,
  fetchContact,
  updateContact
} = contacts;

 const {
  sendSms,
  deleteSms,
  fetchSms,
  fetchAllSms
 } = sms;

const { createUser, loginUser } = users;

module.exports = app => {
  //contact routes
  app
    .route('/api/v1/contacts')
    .post(auth, createContact)
    .get(auth, fetchAllContacts);
  app
    .route('/api/v1/contacts/:contactId')
    .post(auth, sendSms)
    .patch(auth, updateContact)
    .delete(auth, deleteContact)
    .get(auth, fetchContact);

  // sms routes
  app
  .route('/api/v1/contacts/:contactId/sms')
  .post(auth, sendSms)
  .get(auth, fetchAllSms)
  app
    .route('/api/v1/contacts/:contactId/sms/:smsId')
    .delete(auth, deleteSms)
    .get(auth, fetchSms);

  //user routes
  app.route('/api/v1/user').post(createUser);
  app.route('/api/v1/user/login').post(loginUser);
};
