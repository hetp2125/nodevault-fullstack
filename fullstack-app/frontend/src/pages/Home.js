import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1"></div>
          <div className="hero-orb orb-2"></div>
          <div className="hero-orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">✦ Secure Note Management</div>
          <h1 className="hero-title">
            Your thoughts,<br />
            <span className="gradient-text">beautifully organized.</span>
          </h1>
          <p className="hero-subtitle">
            NoteVault is a secure and note-taking application with real authentication,
            persistent storage, and a beautiful interface built for modern workflows.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-lg">Start for free →</Link>
                <Link to="/login" className="btn btn-ghost btn-lg">Sign in</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Everything you need</h2>
          <div className="features-grid">
            {[
              { icon: '🔐', title: 'Secure Auth', desc: 'JWT-based authentication with bcrypt password hashing and rate limiting.' },
              { icon: '💾', title: 'Persistent Storage', desc: 'SQLite database with proper schema design and foreign key constraints.' },
              { icon: '📝', title: 'Smart Notes', desc: 'Create, pin, color-code and organize your notes with full CRUD operations.' },
              { icon: '⚡', title: 'Fast & Modern', desc: 'React frontend with React Router, Context API, and optimistic updates.' },
              { icon: '🛡️', title: 'Production Ready', desc: 'Helmet security headers, CORS, input validation, and global error handling.' },
              { icon: '📱', title: 'Responsive', desc: 'Fully responsive design that looks great on all screen sizes.' },
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tech-stack">
        <div className="container">
          <h2 className="section-title">Built with modern tech</h2>
          <div className="tech-grid">
            {['React', 'Node.js', 'Express', 'SQLite', 'JWT', 'bcrypt', 'Axios', 'React Router'].map((t, i) => (
              <div key={i} className="tech-badge">{t}</div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} NoteVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
