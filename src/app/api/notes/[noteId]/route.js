// src/app/api/notes/[noteId]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Note from '../../../../models/Note';


export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { noteId } = params;

    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    const note = await Note.findOne({ noteId });

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      noteId: note.noteId,
      content: note.content,
      isPasswordProtected: !!note.password,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    });

  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { noteId } = params;

    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content } = body;

    const updatedNote = await Note.findOneAndUpdate(
      { noteId },
      { 
        content,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      noteId: updatedNote.noteId,
      content: updatedNote.content,
      isPasswordProtected: !!updatedNote.password,
      updatedAt: updatedNote.updatedAt
    });

  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}