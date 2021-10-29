const User = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const userAuth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();
const { userNotFound, idNotFound, defaultRounds, successfulUserDelete, processFailed } = require('../shared/constants');


// Get all users- only admin can see all
router.get('/', [userAuth, admin], async (req, res) => {
  try {
    const users = await User.find().sort('lastName');
    res.send(users);
  } catch (error) {
    res.status(500).send(`${processFailed} ${error.message}`);
  }
});

// Get user by id
router.get('/:me', [userAuth], async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); //exclude the password property
    if (!user) return res.status(400).send(idNotFound);

    res.send(user);
  } catch (error) {
    res.status(500).send(`${processFailed} ${error.message}`);
  }
});

//only admin can add a vip user
router.post('/', [userAuth, admin], async (req, res) => {
  try {
    let user = await User.findOne({ userName: req.body.userName });
    if (user) return res.status(400).send('User already registered');

    const { firstName, lastName, id, email, userName, password, isAdmin } =
      req.body;
    user = new User({ firstName: firstName, lastName: lastName, id: id, email: email, userName: userName, isAdmin: isAdmin });

    const salt = await bcrypt.genSalt(defaultRounds);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    const token = user.generateUserToken();
    res.header('x-auth-token', token).send(user);
  } catch (error) {
    res.status(500).send(`${processFailed} ${error.message}`);
  }
});

//admin/user can do it      
router.delete('/:id', [userAuth, admin], async (req, res) => {
  try {
    const reqId = req.params.id;

    // Validate id parameter (format)
    const isObjectIdValid = mongoose.isValidObjectId(reqId);
    if (!isObjectIdValid) return res.status(400).send(userNotFound);

    // Check if user exists
    const isExists = User.exists({ _id: reqId }); //and not req.params.id?
    if (!isExists) return res.status(400).send(idNotFound);

    await User.remove({ _id: reqId });
    return res.status(200).send(successfulUserDelete);
  } catch (error) {
    res.status(500).send(`${processFailed} ${error.message}`);
  }
});

///user can do it
router.put('/', [userAuth], async (req, res) => {
  try {
    const isObjectIdValid = mongoose.isValidObjectId(req.user._id); //not the right format
    if (!isObjectIdValid) return res.status(400).send(userNotFound);

    if (req.body.password) {
      //only if the user changes its password
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true, });
    if (!user) return res.status(404).send(idNotFound);

    res.send(user);
  } catch (error) {
    res.status(500).send(`${processFailed} ${error.message}`);
  }
});

module.exports = router;
