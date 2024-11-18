// src/app/api/notes/[noteId]/verify/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import Note from '../../../../../models/Note';
import { verifyPassword } from '../../../../../lib/utils';

export async function POST(request, { params }) {
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
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
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

    if (!note.password) {
      return NextResponse.json(
        { error: 'Note is not password protected' },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(password, note.password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Password verified successfully'
    });

  } catch (error) {
    console.error('Error verifying password:', error);
    return NextResponse.json(
      { error: 'Failed to verify password' },
      { status: 500 }
    );
  }
}