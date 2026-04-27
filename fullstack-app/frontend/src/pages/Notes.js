import React, { useState, useEffect } from 'react';
import { notesAPI } from '../services/api';
import toast from 'react-hot-toast';

const NOTE_COLORS = ['#ffffff', '#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3', '#ede9fe', '#fee2e2', '#e0f2fe'];

const NoteModal = ({ note, onClose, onSave }) => {
  const [form, setForm] = useState({ title: '', content: '', color: '#ffffff', ...note });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{note?.id ? 'Edit Note' : 'New Note'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <input
            className="note-title-input"
            placeholder="Note title..."
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            maxLength={100}
            autoFocus
          />
          <textarea
            className="note-content-input"
            placeholder="Start writing..."
            value={form.content}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            rows={8}
          />
          <div className="color-picker">
            <span className="color-picker-label">Color:</span>
            {NOTE_COLORS.map(c => (
              <button
                key={c}
                className={`color-dot ${form.color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c, border: c === '#ffffff' ? '1px solid #e5e7eb' : 'none' }}
                onClick={() => setForm(p => ({ ...p, color: c }))}
              />
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : (note?.id ? 'Save Changes' : 'Create Note')}
          </button>
        </div>
      </div>
    </div>
  );
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await notesAPI.getAll();
      setNotes(res.data.notes);
    } catch { toast.error('Failed to load notes'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleCreate = async (form) => {
    const res = await notesAPI.create(form);
    setNotes(prev => [res.data.note, ...prev]);
    toast.success('Note created! 📝');
  };

  const handleUpdate = async (form) => {
    const res = await notesAPI.update(editNote.id, form);
    setNotes(prev => prev.map(n => n.id === editNote.id ? res.data.note : n));
    toast.success('Note updated!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    setDeleting(id);
    try {
      await notesAPI.delete(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      toast.success('Note deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const handlePin = async (note) => {
    try {
      const res = await notesAPI.update(note.id, { is_pinned: !note.is_pinned });
      setNotes(prev => prev.map(n => n.id === note.id ? res.data.note : n)
        .sort((a, b) => b.is_pinned - a.is_pinned || new Date(b.updated_at) - new Date(a.updated_at)));
      toast.success(note.is_pinned ? 'Unpinned' : 'Pinned 📌');
    } catch { toast.error('Failed to update'); }
  };

  const openEdit = (note) => { setEditNote(note); setShowModal(true); };
  const openCreate = () => { setEditNote(null); setShowModal(true); };

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="page notes-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Notes</h1>
            <p className="page-subtitle">{notes.length} note{notes.length !== 1 ? 's' : ''} total</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ New Note</button>
        </div>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{search ? '🔍' : '📋'}</div>
            <h3>{search ? 'No notes found' : 'No notes yet'}</h3>
            <p>{search ? `No results for "${search}"` : 'Create your first note!'}</p>
            {!search && <button className="btn btn-primary" onClick={openCreate}>Create Note</button>}
          </div>
        ) : (
          <div className="notes-masonry">
            {filtered.map(note => (
              <div
                key={note.id}
                className="note-card"
                style={{ backgroundColor: note.color || '#ffffff' }}
              >
                <div className="note-card-header">
                  <h3 className="note-card-title">{note.title}</h3>
                  <div className="note-card-actions">
                    <button
                      className={`note-action-btn ${note.is_pinned ? 'active' : ''}`}
                      onClick={() => handlePin(note)}
                      title={note.is_pinned ? 'Unpin' : 'Pin'}
                    >
                      📌
                    </button>
                    <button className="note-action-btn" onClick={() => openEdit(note)} title="Edit">
                      ✏️
                    </button>
                    <button
                      className="note-action-btn danger"
                      onClick={() => handleDelete(note.id)}
                      disabled={deleting === note.id}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {note.content && (
                  <p className="note-card-content">{note.content}</p>
                )}
                <div className="note-card-footer">
                  {note.is_pinned === 1 && <span className="pin-badge">Pinned</span>}
                  <span className="note-date">
                    {new Date(note.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <NoteModal
          note={editNote}
          onClose={() => setShowModal(false)}
          onSave={editNote?.id ? handleUpdate : handleCreate}
        />
      )}
    </div>
  );
};

export default Notes;
