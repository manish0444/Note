// src/components/CreateNote.js
'use client';
import { useState } from 'react';
import PasswordModal from '../components/PasswordModal';  // Fixed import path

export default function CreateNote({ onSuccess }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const createNote = async (password = '') => {
    try {
      setIsCreating(true);
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create note');
      }

      const data = await response.json();
      if (data.noteId) {
        onSuccess(data.noteId);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => createNote()}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Public Note'}
        </button>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Protected Note'}
        </button>
      </div>

      {showPasswordModal && (
        <PasswordModal
          onSubmit={async (password) => {
            await createNote(password);
            setShowPasswordModal(false);
          }}
          isProtected={false}
        />
      )}
    </div>
  );
}