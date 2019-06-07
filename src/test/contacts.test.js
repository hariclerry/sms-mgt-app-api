/**
 * @file contains integration test for contact, sms and user
 */

// Third party imports
const request = require('supertest');
const mongoose = require('mongoose');

// local imports
const Contacts = require('../models/contacts');
const Sms = require('../models/sms');
const { User } = require('../models/user');
const app = require('../app');

describe('/api/contacts', () => {
  afterEach(async () => {
    await User.remove({});
    await Contacts.remove({});
  });

  //User test
  describe('POST /', () => {
    let user;
    const exec = async () => {
      return await request(app)
        .post('/api/v1/user')
        .send({ user });
    };

    beforeEach(() => {
      user = {
        name: 'Jane Doe',
        phoneNumber: 'janedoe@gmail.com',
        password: 'jane12345'
      };
    });

    it('should return 400 if character validation fails for user', async () => {
      user = {
        name: 'Doe',
        phoneNumber: 778903034,
        password: 12345
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 201 if a user has been created', async () => {
      const res = await request(app)
        .post('/api/v1/user')
        .send({
          name: 'Jane Doe',
          phoneNumber: 778903034,
          password: 'jane12345'
        });
      expect(res.status).toBe(201);
    });

    it('should return 400 if a user password or email is invalid', async () => {
      const res = await request(app)
        .post('/api/v1/user/login')
        .send({
          phoneNumber: 78903034,
          password: 'jane12345'
        });
      expect(res.status).toBe(400);
    });

    it('should return 400 if a user password is invalid', async () => {
      const user = new User({
        name: 'Jane Doe',
        phoneNumber: 778903034,
        password: 'jane12345'
      });
      await user.save();
      const res = await request(app)
        .post('/api/v1/user/login')
        .send({
          phoneNumber: 778903034,
          password: 'jane12345'
        });
      expect(res.status).toBe(400);
    });
  });

  // Contact test
  describe('GET /', () => {
    let token;
    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    it('should return all contacts', async () => {
      const contacts = [
        { contactName: 'Susan' },
        { contactNumber: 8940005066 },
        { sms: [] },
      ];

      await Contacts.collection.insertMany(contacts);

      const res = await request(app)
        .get('/api/v1/contacts')
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(3);
      expect(res.body.data.some(g => g.contactName === 'Susan')).toBeTruthy();
      expect(res.body.data.some(g => g.contactNumber === 8940005066)).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a contact if valid id is passed', async () => {
      const token = new User().generateAuthToken();
      const contacts = {
        contactName: 'Susan',
        contactNumber: 8940005066,
        sms: []
      };

      const contact = new Contacts(contacts);
      await contact.save();

      const res = await request(app)
        .get('/api/v1/contacts/' + contact.id)
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
    });

    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateAuthToken();
      const res = await request(app)
        .get('/api/v1/contacts/1000')
        .set('x-auth-token', token);

      expect(res.status).toBe(400);
    });

    it('should return 404 if no contact with the given id exists', async () => {
      const token = new User().generateAuthToken();
      const id = mongoose.Types.ObjectId();
      const res = await request(app)
        .get('/api/v1/contacts/' + id)
        .set('x-auth-token', token);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let contacts;
    let token;
    const exec = async () => {
      return await request(app)
        .post('/api/v1/contacts')
        .send({ contacts })
        .set('x-auth-token', token);
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      contacts = {
        contactName: 'Susan',
        contactNumber: 7788933546
      };
    });

    it('should return 400 if character validation fails', async () => {
      contacts = {
        contactName: 'Sus',
        contactNumber: 778893354699999
      };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 201 if a contact has been created', async () => {
      contacts.total = contacts.contactNumber + contacts.numberOfMale;
      const res = await request(app)
        .post('/api/v1/contacts')
        .set('x-auth-token', token)
        .send({
          contactName: 'Susan',
          contactNumber: 7788933546
        });

      expect(res.status).toBe(201);
    });
  });

  describe('PATCH /:id', () => {
    let savedcontact;
    let contactId;
    let token;

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      token = new User().generateAuthToken();
      savedcontact = new Contacts({
        contactName: 'Lagum Lanyero',
        contactNumber: 748959955
      });
      await savedcontact.save();

      contactId = savedcontact._id;
      newcontacts = {
        contactName: 'Lanyero',
      };
    });

    it('should return 400 if contact has invalid characters or input', async () => {
      const res = await request(app)
        .patch('/api/v1/contacts/' + contactId)
        .set('x-auth-token', token)
        .send({
          contactName: 'La',
        });

      expect(res.status).toBe(400);
    });

    it('should return 500 if contact with the given id was not found', async () => {
      contactId = mongoose.Types.ObjectId();
      console.log('contactId######', contactId)

      const res = await request(app)
        .patch('/api/v1/contacts/' + contactId)
        .set('x-auth-token', token)
        .send({
          contactName: 'Lagum Lanyero'
        });

      expect(res.status).toBe(500);
    });

    it('should return 404 if contact with invalid id', async () => {
      contactId = 3;

      const res = await request(app)
        .patch('/api/v1/contacts/' + contactId)
        .set('x-auth-token', token)
        .send({
          contactName: 'Lagum Lanyero'
        });

      expect(res.status).toBe(400);
    });

    it('should update contact', async () => {
      const res = await request(app)
        .patch('/api/v1/contacts/' + contactId)
        .set('x-auth-token', token)
        .send({
          contactName: 'Lanyero',
        });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /:contactId', () => {
    let contactId;
    let token;

    const exec = async () => {
      return await request(app)
        .delete('/api/v1/contacts' + contactId)
        .set('x-auth-token', token)
        .send();
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      token = new User().generateAuthToken();
      savedcontact = new Contacts({
        contactName: 'Lanyero',
        contactNumber: 7489894855
      });
      await savedcontact.save();

      contactId = savedcontact._id;
    });

    it('should return 400 if id is invalid', async () => {
      contactId = 3;

      const res = await request(app)
        .delete('/api/v1/contacts/' + contactId)
        .set('x-auth-token', token)
        .send();

      expect(res.status).toBe(400);
    });

    it('should return 404 if no contact with the given id was found', async () => {
      contactId = mongoose.Types.ObjectId();

      const res = await request(app)
        .delete('/api/v1/contacts/' + contactId)
        .set('x-auth-token', token)
        .send();

      expect(res.status).toBe(404);
    });

    it('should delete the contact if id is valid', async () => {
      await request(app)
        .delete('/api/v1/contacts/' + contactId)
        .set('x-auth-token', token)
        .send();

      const contactInDb = await Contacts.findById(contactId);

      expect(contactInDb).toBeNull();
    });
  });

  // sms test
  describe('GET /:id', () => {
    it('should return a sms if valid id is passed', async () => {
      const token = new User().generateAuthToken();
      const sms = {
        Content: 'Good to see you again!',
        contactNumber: 784849992,
        contactName: 'Harriet'
      };

      const contact = new Contacts(sms);
      await contact.save();

      const res = await request(app)
        .get('/api/v1/contact/:contactId/sms/' + contact._id)
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
    });

    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateAuthToken();
      const res = await request(app)
        .get('/api/v1/contacts/:contactId/sms/10')
        .set('x-auth-token', token);

      expect(res.status).toBe(400);
    });

    it('should return 400 if no sms with the given id exists', async () => {
      const token = new User().generateAuthToken();
      const id = mongoose.Types.ObjectId();
      const res = await request(app)
        .get('/api/v1/contacts/:contactId/sms/' + id)
        .set('x-auth-token', token);

      expect(res.status).toBe(400);
    });
  });

  describe('POST /', () => {
    let sms;
    let token;
    const exec = async () => {
      return await request(app)
        .post('/api/v1/contacts/:contactId/sms')
        .set('x-auth-token', token)
        .send({ sms });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      sms = {
        Content: 'G!',
        contactNumber: 784849992,
        contactName: 'Harriet'
      };
    });

    it('should return 400 if character validation fails', async () => {

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /:contactId', () => {
    let contactId;
    let token;

    const exec = async () => {
      return await request(app)
        .delete('/api/genres/' + contactId)
        .set('x-auth-token', token)
        .set('x-auth-token', token)
        .send();
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      token = new User().generateAuthToken();
      savedcontact = new Contacts({
        contactName: 'Updated contact',
        contactNumber: 50
      });
      await savedcontact.save();

      contactId = savedcontact._id;
    });

    it('should return 400 if id is invalid', async () => {
      contactId = 3;

      const res = await request(app)
        .delete('/api/v1/contacts/:contactId/sms/' + contactId)
        .set('x-auth-token', token)
        .send();

      expect(res.status).toBe(400);
    });

    it('should return 400 if no contact with the given id was found', async () => {
      contactId = mongoose.Types.ObjectId();

      const res = await request(app)
        .delete('/api/v1/contacts/:contactId/sms/' + contactId)
        .set('x-auth-token', token)
        .send();

      expect(res.status).toBe(400);
    });
  });
});
