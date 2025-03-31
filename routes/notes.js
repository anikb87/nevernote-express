const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

// Auth Middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Get Notes
router.get('/', ensureAuthenticated, async (req, res) => {
  const notes = await Note.find({ userId: req.session.userId });
  res.json(notes);
});

// Create Note
router.post('/', ensureAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const note = new Note({
    userId: req.session.userId,
    title,
    content,
  });
  await note.save();
  res.json(note);
});

// Update Note
router.put('/:id', ensureAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const updatedNote = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.session.userId },
    { title, content },
    { new: true }
  );
  res.json(updatedNote);
});

// Delete Note
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
  res.json({ message: 'Note deleted' });
});

module.exports = router;
