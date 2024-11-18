// components/Editor.js
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function Editor({ noteId, initialContent = '' }) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Auto-save functionality
  useEffect(() => {
    const saveTimeout = setTimeout(async () => {
      if (content !== initialContent && !saving) {
        setSaving(true);
        try {
          const response = await fetch(`/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
          });
          
          if (!response.ok) throw new Error('Failed to save');
          
        } catch (error) {
          console.error('Error saving:', error);
        } finally {
          setSaving(false);
        }
      }
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [content, noteId, initialContent]);

  return (
    <div className="h-screen w-full">
      <div className="p-2 text-sm text-gray-500">
        {saving ? 'Saving...' : 'All changes saved'}
      </div>
      <MonacoEditor
        height="90vh"
        defaultLanguage="markdown"
        theme="vs-dark"
        value={content}
        onChange={(value) => setContent(value)}
        options={{
          minimap: { enabled: false },
          wordWrap: 'on',
          lineNumbers: 'on',
          fontSize: 16,
        }}
      />
    </div>
  );
}