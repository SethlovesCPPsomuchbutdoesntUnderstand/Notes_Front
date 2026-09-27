import React, { useState, useEffect } from 'react';

interface Note {
  id: number;
  content: string;
  created_at: string;
}

export const NotesWidget: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/notes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      } else if (res.status === 401) {
        window.dispatchEvent(new Event('session-expired'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newNote })
      });
      if (res.ok) {
        const data = await res.json();
        setNotes([data, ...notes]);
        setNewNote('');
      } else if (res.status === 401) {
        window.dispatchEvent(new Event('session-expired'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNotes(notes.filter(note => note.id !== id));
      } else if (res.status === 401) {
        window.dispatchEvent(new Event('session-expired'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: '#fff', border: '1px solid var(--input-border)', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginTop: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>My Notes</h3>
      
      <form onSubmit={addNote} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input 
          type="text" 
          value={newNote} 
          onChange={e => setNewNote(e.target.value)} 
          placeholder="Jot down a quick note..."
          style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--input-border)', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '0 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 500, cursor: 'pointer' }}>Add</button>
      </form>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No notes yet. Start typing above!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notes.map(note => (
            <li key={note.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--input-border)', borderRadius: '6px', backgroundColor: 'var(--bg-color)' }}>
              <span style={{ fontSize: '15px' }}>{note.content}</span>
              <button 
                onClick={() => deleteNote(note.id)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7, padding: '4px' }}
                title="Delete note"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
