const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Login
router.post('/auth/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body); // Add this
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    req.session.user = { username };
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error); // Add this
    res.status(500).json({ message: 'Server error' });
  }
});


// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
