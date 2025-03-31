const express = require('express');
const Note = require('../models/Note');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Get all notes
router.get('/notes', verifyToken, async (req, res) => {
  const notes = await Note.find({ userId: req.user.id });
  res.json(notes);
});

// Create note
router.post('/notes', verifyToken, async (req, res) => {
  const { title, content } = req.body;
  const newNote = new Note({
    userId: req.user.id,
    title,
    content,
  });
  await newNote.save();
  res.json(newNote);
});

// Update note
router.put('/notes/:id', verifyToken, async (req, res) => {
  const { title, content } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true }
  );
  res.json(updatedNote);
});

// Delete note
router.delete('/notes/:id', verifyToken, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: 'Note deleted' });
});

module.exports = router;
