const express = require('express');
const jwt = require('jsonwebtoken');
const Note = require('../models/Note');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'Missing token' });

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user;
    next();
  });
};

// Get all notes
router.get('/', verifyToken, async (req, res) => {
  const notes = await Note.find({ username: req.user.username });
  res.json(notes);
});

// Create note
router.post('/', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  const newNote = new Note({
    username: req.user.username,
    title,
    content
  });

  await newNote.save();
  res.json(newNote);
});

// Update note
router.put('/:id', verifyToken, async (req, res) => {
  const { title, content } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
  res.json(updatedNote);
});

// Delete note
router.delete('/:id', verifyToken, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: 'Note deleted' });
});

module.exports = router;
