/**
 * @file contains all endpoints for creating or registering a new user and user login
 */

//Third party imports
const bcrypt = require('bcrypt');

//local imports
const { User } = require('../models/user');
const { validateUser, validateLogin } = require('../utilis/validator');

module.exports = {
  /**
   * @function createUser
   * called when creating a new user
   */
  async createUser(req, res) {
    try {
      const { name, phoneNumber, password } = req.body;
      const { error } = validateUser(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      let user = await User.findOne({ phoneNumber });
      if (user)
        return res.status(400).send({ message: 'User already registered.' });

      user = new User({ name, phoneNumber, password });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();

      res.status(201).send({
        user: { userId: user._id, Name: user.name, Email: user.email },
        message: 'Successfully registered'
      });
    } catch (error) {
      res.status(500).send({ Error: error.message });
    }
  },

  /**
   * @function loginUser
   * called when logging in a user
   */
  async loginUser(req, res) {
    try {
      const { phoneNumber, password } = req.body;
      const { error } = validateLogin(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      let user = await User.findOne({ phoneNumber });
      if (!user)
        return res.status(400).send({ message: 'Invalid email or password.' });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.status(400).send({ message: 'Invalid password.' });

      const token = user.generateAuthToken();
      res.status(200).send({ token, message: 'Login successful.' });
    } catch (error) {
      res.status(500).send({ Error: error.message });
    }
  }
};
