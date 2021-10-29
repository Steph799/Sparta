const bcrypt = require('bcrypt');
const User = require('../models/user');
const express = require('express');
const router = express.Router();
const { invalid, userExist, successfulRegistered, processFailed} = require('../shared/constants');

//log in
router.post('/login', async (req, res) => {
  try {
   
    let user = await User.findOne({ userName: req.body.userName });
    if (!user) return res.status(400).send(invalid);
  
    const validPassword = await bcrypt.compare(req.body.password,user.password);
     
    if (!validPassword) return res.status(400).send(invalid);
    const token = user.generateUserToken();
    res.send(token);
  } catch (error) {
    res.status(500).send(`${processFailed} ${error.message}`);
  }
});

// User register
router.post('/', async (req, res) => {
  try {
    // Validate Register 
    const { error } = User.validateRegister(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    // Check if user is already registered
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send(userExist);
  
    // Create a new user & save it
    user = new User(req.body);
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.header('x-auth-token', user.generateUserToken()).status(201).send(successfulRegistered);
  } catch (error) {
    res.status(500).send(`${processFailed} ${error.message}`);
  }
});

module.exports = router;
