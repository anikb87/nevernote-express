const express = require('express');
const Note = require('../models/Note');
const router = express.Router();

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
};

// Get all notes for the authenticated user
router.get('/notes', ensureAuthenticated, async (req, res) => {
  const notes = await Note.find({ userId: req.user.id });
  res.json(notes);
});

// Create a new note
router.post('/notes', async (req, res) => {
  console.log(req.user);
  const { title, content } = req.body;
  const newNote = new Note({
    userId: req.user.id,
    title,
    content
  });
  await newNote.save();
  res.json(newNote);
});

// Update a note
router.put('/notes/:id', ensureAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
  res.json(updatedNote);
});

// Delete a note
router.delete('/notes/:id', ensureAuthenticated, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: 'Note deleted' });
});

module.exports = router;
