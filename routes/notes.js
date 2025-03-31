const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};

router.get('/notes', ensureAuthenticated, async (req, res) => {
  const notes = await Note.find({ userId: req.session.user.id });
  res.json(notes);
});

router.post('/notes', ensureAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const newNote = new Note({
    userId: req.session.user.id,
    title,
    content
  });
  await newNote.save();
  res.json(newNote);
});

router.put('/notes/:id', ensureAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true }
  );
  res.json(updatedNote);
});

router.delete('/notes/:id', ensureAuthenticated, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: 'Note deleted' });
});

module.exports = router;
