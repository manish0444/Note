// src/app/page.js
'use client';
import { useState } from 'react';
import CreateNote from '../components/CreateNote';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Secure Notepad</h1>
        <CreateNote onSuccess={(noteId) => router.push(`/${noteId}`)} />
        <div className="mt-8 text-center text-gray-600">
          <p>Create a new secure note with optional password protection.</p>
          <p>All notes are automatically saved and accessible via their unique URL.</p>
        </div>
      </div>
    </div>
  );
}