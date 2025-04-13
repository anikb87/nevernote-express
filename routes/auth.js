// routes/auth.js

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Accept any username and password combo (temporary dev logic)
  let user = await User.findOne({ username });

  if (!user) {
    user = new User({ username, password });
    await user.save();
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});

module.exports = router;
