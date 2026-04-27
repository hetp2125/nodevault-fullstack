import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notesAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pinned: 0, recentWeek: 0 });
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, notesRes] = await Promise.all([
          notesAPI.getStats(),
          notesAPI.getAll(),
        ]);
        setStats(statsRes.data.stats);
        setRecentNotes(notesRes.data.notes.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return '🌅 Good morning';
    if (h < 17) return '☀️ Good afternoon';
    return '🌙 Good evening';
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <p className="greeting">{greeting()},</p>
            <h1 className="page-title">{user?.name} 👋</h1>
            <p className="page-subtitle">Here's what's happening with your notes today.</p>
          </div>
          <Link to="/notes" className="btn btn-primary">+ New Note</Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Notes</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📌</div>
            <div className="stat-info">
              <span className="stat-value">{stats.pinned}</span>
              <span className="stat-label">Pinned</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <span className="stat-value">{stats.recentWeek}</span>
              <span className="stat-label">This Week</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <span className="stat-value">{user?.role}</span>
              <span className="stat-label">Account Role</span>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Notes</h2>
            <Link to="/notes" className="view-all-link">View all →</Link>
          </div>

          {recentNotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No notes yet</h3>
              <p>Create your first note to get started!</p>
              <Link to="/notes" className="btn btn-primary">Create Note</Link>
            </div>
          ) : (
            <div className="notes-preview-grid">
              {recentNotes.map(note => (
                <div key={note.id} className="note-preview-card" style={{ borderLeftColor: note.color !== '#ffffff' ? note.color : '#6366f1' }}>
                  {note.is_pinned === 1 && <span className="note-pin">📌</span>}
                  <h3 className="note-preview-title">{note.title}</h3>
                  <p className="note-preview-content">{note.content || 'No content'}</p>
                  <span className="note-preview-date">{new Date(note.updated_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link to="/notes" className="quick-action-card">
              <span className="qa-icon">✏️</span>
              <span>Write a note</span>
            </Link>
            <Link to="/profile" className="quick-action-card">
              <span className="qa-icon">⚙️</span>
              <span>Edit profile</span>
            </Link>
            <Link to="/notes" className="quick-action-card">
              <span className="qa-icon">🔍</span>
              <span>Search notes</span>
            </Link>
          </div>
        </div>

        <div className="account-info-card">
          <h3>Account Information</h3>
          <div className="account-details">
            <div className="account-detail"><span className="detail-label">Name</span><span>{user?.name}</span></div>
            <div className="account-detail"><span className="detail-label">Email</span><span>{user?.email}</span></div>
            <div className="account-detail"><span className="detail-label">Member since</span><span>{new Date(user?.created_at).toLocaleDateString()}</span></div>
            <div className="account-detail"><span className="detail-label">Role</span><span className="role-badge">{user?.role}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
