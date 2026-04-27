import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || profileForm.name.length < 2) {
      setErrors({ name: 'Name must be at least 2 characters' });
      return;
    }
    setProfileLoading(true);
    try {
      const res = await authAPI.updateProfile(profileForm);
      updateUser(res.data.user);
      toast.success('Profile updated! ✅');
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordForm.currentPassword) errs.currentPassword = 'Current password required';
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) errs.newPassword = 'Min 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) errs.newPassword = 'Must include upper, lower, number';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setPasswordLoading(true);
    try {
      await authAPI.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast.success('Password changed! 🔐');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="page profile-page">
      <div className="container container-sm">
        <h1 className="page-title">Profile Settings</h1>

        <div className="profile-header-card">
          <div className="profile-avatar-lg">{initials}</div>
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <span className="role-badge">{user?.role}</span>
          </div>
        </div>

        <div className="tabs">
          {['profile', 'password', 'danger'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setErrors({}); }}
            >
              {tab === 'profile' && '👤 Profile'}
              {tab === 'password' && '🔐 Password'}
              {tab === 'danger' && '⚠️ Account'}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="tab-content">
            <form onSubmit={handleProfileSave} className="settings-form">
              <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                <label>Full Name</label>
                <input
                  className="form-input"
                  value={profileForm.name}
                  onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                  maxLength={50}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Email Address <span className="readonly-badge">read-only</span></label>
                <input className="form-input" value={user?.email} readOnly disabled />
              </div>
              <div className="form-group">
                <label>Bio <span className="optional-badge">optional</span></label>
                <textarea
                  className="form-input"
                  value={profileForm.bio}
                  onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell us a bit about yourself..."
                  rows={3}
                  maxLength={200}
                />
              </div>
              <div className="form-group">
                <label>Member Since</label>
                <input className="form-input" value={new Date(user?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} readOnly disabled />
              </div>
              <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                {profileLoading ? <span className="btn-spinner"></span> : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="tab-content">
            <form onSubmit={handlePasswordChange} className="settings-form">
              <div className={`form-group ${errors.currentPassword ? 'has-error' : ''}`}>
                <label>Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                  autoComplete="current-password"
                />
                {errors.currentPassword && <span className="form-error">{errors.currentPassword}</span>}
              </div>
              <div className={`form-group ${errors.newPassword ? 'has-error' : ''}`}>
                <label>New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                  autoComplete="new-password"
                />
                {errors.newPassword && <span className="form-error">{errors.newPassword}</span>}
              </div>
              <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
              <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                {passwordLoading ? <span className="btn-spinner"></span> : 'Change Password'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="tab-content">
            <div className="danger-zone">
              <h3>Danger Zone</h3>
              <p>Once you sign out, you'll need your credentials to sign back in.</p>
              <button className="btn btn-danger" onClick={() => {
                if (window.confirm('Are you sure you want to sign out?')) logout();
              }}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
