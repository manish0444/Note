// src/app/[noteId]/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '../../components/Editor';
import PasswordModal from '../../components/PasswordModal';
import { useParams } from 'next/navigation';


export default function NotePage() {
    const params = useParams();
    const noteId = params?.noteId;
    const router = useRouter();
    const [note, setNote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (noteId) {
        checkNoteAccess();
      }
    }, [noteId]);
  
    const checkNoteAccess = async () => {
      try {
        const response = await fetch(`/api/notes/${noteId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Note not found');
        }
        
        const data = await response.json();
        setNote(data);
        setIsAuthenticated(!data.isPasswordProtected);
      } catch (error) {
        console.error('Error fetching note:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handlePasswordSubmit = async (password) => {
      try {
        const response = await fetch(`/api/notes/${noteId}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Incorrect password');
        }
  
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error verifying password:', error);
        throw error;
      }
    };
  
    if (!noteId) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Invalid Note ID</h1>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create New Note
            </button>
          </div>
        </div>
      );
    }
  
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Note
          </button>
        </div>
      );
    }
  
    if (!isAuthenticated) {
      return (
        <PasswordModal 
          onSubmit={handlePasswordSubmit} 
          isProtected={true} 
          onClose={() => router.push('/')}
        />
      );
    }
  
    return (
      <div className="h-screen">
        <Editor 
          noteId={noteId} 
          initialContent={note?.content || ''} 
          onError={(error) => {
            console.error('Editor error:', error);
            setError('Failed to save changes');
          }}
        />
      </div>
    );
  }