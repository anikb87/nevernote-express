const express = require('express');
const Note = require('../models/Note');
const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

// Get all notes
router.get('/notes', ensureAuthenticated, async (req, res) => {
  const notes = await Note.find({ userId: req.session.user._id });
  res.json(notes);
});

// Create note
router.post('/notes', ensureAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const note = new Note({
    userId: req.session.user._id,
    title,
    content,
  });
  await note.save();
  res.json(note);
});

// Update note
router.put('/notes/:id', ensureAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const updated = await Note.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true }
  );
  res.json(updated);
});

// Delete note
router.delete('/notes/:id', ensureAuthenticated, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: 'Note deleted' });
});

module.exports = router;
