const express = require('express');
const Note = require('../models/Note');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

// Get all notes for the authenticated user
router.get('/notes', authenticateJWT, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
});

// Create a new note
router.post('/notes', authenticateJWT, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newNote = new Note({
      userId: req.user.userId,
      title,
      content
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create note' });
  }
});

// Update a note
router.put('/notes/:id', authenticateJWT, async (req, res) => {
  const { title, content } = req.body;

  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update note' });
  }
});

// Delete a note
router.delete('/notes/:id', authenticateJWT, async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note' });
  }
});

module.exports = router;
