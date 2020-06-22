/**
 * @file contains all endpoints for sms
 * creates, updates, fetches and deletes sms
 */

//Third party imports
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

// local imports
const Contacts = require('../models/contacts');
const Sms = require('../models/sms');
const { validateSms } = require('../utilis/validator');

module.exports = {
  /**
   * @function sendSms
   * called when sending a new sms
   */
  async sendSms(req, res) {
    try {
      const { content } = req.body;
      const { error } = validateSms(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const usertoken = req.headers['x-auth-token'];
      const decoded = jwt.verify(usertoken, config.get('jwtPrivateKey'));
      const contacts = await Contacts.findById(req.params.contactId);
      if (!contacts)
        return res.status(404).json({
          message: `Contact with given ID does not exist`
        });

      let newSms = new Sms({
        content
      });
      newSms.senderNumber = decoded.phoneNumber;
      newSms.receiverNumber = contacts.contactNumber;

      contacts.sms.push(newSms);

      const savedSms = await contacts.save();

      res.status(201).send({ data: savedSms, status: 'Success' });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  /**
   * @function deleteSms
   * called when deleting a sms
   */
  async deleteSms(req, res) {
    const { contactId, smsId } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return res.status(400).send({ message: `Invalid sms ID` });
      }
      const contact = await Contacts.findById(contactId);
      const smses = contact.sms.id(smsId);
      smses.remove();
      contact.save();

      if (!contact)
        return res
          .status(404)
          .send({ message: `Contact with ID ${contactId} was not found` });

      res
        .status(200)
        .send({ message: `Sms with ID ${smsId} deleted successfully` });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  /**
   * @function fetchSms
   * called when fetching a single sms sms
   */
  async fetchSms(req, res) {
    const { contactId, smsId } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return res.status(400).send({ message: `Invalid contact ID` });
      }
      const contact = await Contacts.findById(contactId);
      const smses = contact.sms.id(smsId);
      res.status(200).send({ data: smses, status: 'Success' });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

   /**
   * @method fetchAllSms
   * called when fetching books
   */

  async fetchAllSms(req, res) {
    const { contactId } = req.params;
    try {
      const contact = await Contacts.findById(contactId);
      const sms = await contact.sms;
      res.status(200).send(sms);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
};
