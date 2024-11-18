// src/models/Note.js
import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  noteId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  content: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent multiple compilation of the model
const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);
export default Note;