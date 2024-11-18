// src/app/api/notes/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Note from '../../../models/Note';
import { generateNoteId, hashPassword, sanitizeNote } from '../../../lib/utils';

export async function POST(request) {
  try {
    await dbConnect();
    const { password } = await request.json();

    const noteId = generateNoteId();
    const hashedPassword = await hashPassword(password);

    const note = await Note.create({
      noteId,
      password: hashedPassword,
      content: '',
    });

    return NextResponse.json(sanitizeNote(note));
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}