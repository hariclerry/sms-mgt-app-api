/**
 * @file contains all endpoints for location
 * creates, updates, fetches and deletes location
 */

//Third party imports
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

// local imports
const Contacts = require('../models/contacts');
const Sms = require('../models/sms');
const { User } = require('../models/user');
// const { validate } = require('../utilis/validator');

module.exports = {
  // /**
  //  * @function fetchAllLocations
  //  * called when fetching all location
  //  */
  // async fetchAllLocations(req, res) {
  //   try {
  //     const populationRecord = await MainLocation.find().sort('locationName');
  //     res.status(200).send({data: populationRecord, status: 'Success'});
  //   } catch (error) {
  //     res.status(500).send(error.message);
  //   }
  // },

  /**
   * @function createLocation
   * called when creating a new location
   */
  async createContact(req, res) {
    try {
      const { contactName, contactNumber } = req.body;
      // const { error } = validate(req.body);
      // if (error) return res.status(400).send(error.details[0].message);
      // const userId = await Contacts.find().populate('sms');
      // console.log('*************userId', userId)

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
   * @function createLocation
   * called when creating a new location
   */
  async sendSms(req, res) {
    try {
      const { content, status } = req.body;
      // const { error } = validate(req.body);
      // if (error) return res.status(400).send(error.details[0].message);
    
      const usertoken = req.headers['x-auth-token'];
      const decoded = jwt.verify(usertoken, config.get('jwtPrivateKey'));
       console.log('savedSms&&&&&&&&', decoded.phoneNumber)
      const contacts = await Contacts.findById(req.params.id);
      if (!contacts)
        return res.status(409).json({
          message: `Contact with already exists`
        });

      let newSms = new Sms({
        content,
        status
      });
      newSms.senderNumber = decoded.phoneNumber
      newSms.receiverNumber = contacts.contactNumber;

      contacts.sms.push(newSms);

      const savedSms = await contacts.save();

      res.status(201).send({ data: savedSms, status: 'Success' });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  // /**
  //  * @function updateLocation
  //  * called when updating a location
  //  */
  // async updateLocation(req, res) {
  //   try {
  //     const { locationName, numberOfFemale, numberOfMale } = req.body;
  //     const { locationId } = req.params;
  //     const { error } = validate(req.body);
  //     if (error) return res.status(400).send(error.details[0].message);

  //     if (!mongoose.Types.ObjectId.isValid(locationId)) {
  //       return res.status(400).send({ message: `Invalid location ID` });
  //     }

  //     const populationRecord = await MainLocation.findByIdAndUpdate(
  //       req.params.locationId,
  //       {
  //         locationName,
  //         numberOfFemale,
  //         numberOfMale
  //       },
  //       { new: true }
  //     );
  //     populationRecord.total =
  //       parseInt(numberOfFemale, 10) + parseInt(numberOfMale, 10);

  //     const savedPopulation = await populationRecord.save();

  //     if (!populationRecord) {
  //       return res
  //         .status(404)
  //         .send({ message: `Location with ID ${locationId} was not found` });
  //     }

  //     res.status(200).send({data: savedPopulation, status: 'Success'});
  //   } catch (error) {
  //     res.status(500).send(error.message);
  //   }
  // },

  /**
   * @function deleteLocation
   * called when deleting a location
   */
  async deleteContact(req, res) {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: `Invalid contact ID` });
      }
      const populationRecord = await Contacts.findByIdAndRemove(id);

      if (!populationRecord)
        return res
          .status(404)
          .send({ message: `Location with ID ${id} was not found` });

      res.status(200).send({
        message: `Location with ID ${id} deleted successfully`
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  // /**
  //  * @function fetchLocation
  //  * called when fetching a single location
  //  */
  // async fetchLocation(req, res) {
  //   const { locationId } = req.params;
  //   try {
  //     if (!mongoose.Types.ObjectId.isValid(locationId)) {
  //       return res.status(400).send({ message: `Invalid location ID` });
  //     }
  //     const populationRecord = await MainLocation.findById(locationId);

  //     if (!populationRecord.id) {
  //       return res
  //         .status(404)
  //         .send({ message: `Location with ID ${locationId} was not found` });
  //     }
  //     if (populationRecord.subLocation && populationRecord.subLocation.length) {
  //       populationRecord.total =
  //         populationRecord.subLocation.reduce((acc, subPopulation) => {
  //           return acc + subPopulation.subTotal;
  //         }, 0) +
  //         populationRecord.numberOfFemale +
  //         populationRecord.numberOfMale;
  //     } else {
  //       populationRecord.total =
  //         populationRecord.numberOfFemale + populationRecord.numberOfMale;
  //     }
  //     res.send({data: populationRecord, status: 'Success'});
  //   } catch (error) {
  //     res.status(500).send(error.message);
  //   }
  // }
};
