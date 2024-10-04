const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Local strategy for username and password authentication
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log('Deserializing user with id:', id);
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Registration route
router.post('/auth/register', async (req, res) => {
  const { username, password, displayName, email } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({ username, password, displayName, email });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/auth/login', passport.authenticate('local', {
  successRedirect: '/notes',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

// Logout route
router.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
