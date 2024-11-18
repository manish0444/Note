// src/lib/utils.js
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

export const generateNoteId = () => {
  return nanoid(10);
};

export const hashPassword = async (password) => {
  if (!password) return null;
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) return false;
  return await bcrypt.compare(password, hashedPassword);
};

export const validateNoteId = (noteId) => {
  // Add validation logic here if needed
  return typeof noteId === 'string' && noteId.length === 10;
};

export const sanitizeNote = (note) => {
  if (!note) return null;
  
  return {
    noteId: note.noteId,
    content: note.content,
    isPasswordProtected: !!note.password,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
};