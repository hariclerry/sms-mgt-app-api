/**
 * @file contains all endpoints for contact
 * creates, updates, fetches and deletes contact
 */

//Third party imports
const mongoose = require('mongoose');

// local imports
const Contacts = require('../models/contacts');
const { validate, validateUpdateContact } = require('../utilis/validator');

module.exports = {
  /**
   * @function fetchAllContacts
   * called when fetching all contact
   */
  async fetchAllContacts(req, res) {
    try {
      const listOfContacts = await Contacts.find().sort('contactName');
      res.status(200).send(listOfContacts);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  /**
   * @function createContact
   * called when creating a new contact
   */
  async createContact(req, res) {
    try {
      const { contactName, contactNumber } = req.body;
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const contacts = await Contacts.findOne({ contactNumber });
      if (contacts)
        return res.status(409).json({
          message: `Contact with ${contactNumber} already exists`
        });

      let newContact = new Contacts({
        contactName,
        contactNumber
      });

      const savedContact = await newContact.save();

      res.status(201).send({ data: savedContact, status: 'Success' });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  /**
   * @function updateContact
   * called when updating a contact
  */
  async updateContact(req, res) {
    try {
      const { contactName } = req.body;
      const { contactId } = req.params;
      const { error } = validateUpdateContact(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return res.status(400).send({ message: `Invalid contact ID` });
      }

      const contact = await Contacts.findByIdAndUpdate(
        req.params.contactId,
        {
          contactName
        },
        { new: true }
      );

      const savedContact = await contact.save();

      if (!contact) {
        return res
          .status(404)
          .send({ message: `contact with ID ${contactId} was not found` });
      }

      res.status(200).send({ data: savedContact, status: 'Success' });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  /**
   * @function deleteContact
   * called when deleting a contact
   */
  async deleteContact(req, res) {
    const { contactId } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return res.status(400).send({ message: `Invalid contact ID` });
      }
      const contact = await Contacts.findByIdAndRemove(contactId);

      if (!contact)
        return res
          .status(404)
          .send({ message: `Contact with ID ${contactId} was not found` });

      res.status(200).send({
        message: `Contact with ID ${contactId} deleted successfully`
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  /**
   * @function  fetchContact
   * called when fetching a single contact
   */
  async fetchContact(req, res) {
    const { contactId } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return res.status(400).send({ message: `Invalid Contact ID` });
      }
      const contact = await Contacts.findById(contactId);

      if (!contact) {
        return res
          .status(404)
          .send({ message: `Contact with ID ${contactId} was not found` });
      }
      res.send({ data: contact, status: 'Success' });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
};
