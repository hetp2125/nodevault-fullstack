const express = require('express');
const { prepare } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// GET /api/users - Admin only: list all users
router.get('/', authorize('admin'), (req, res) => {
  const users = prepare('SELECT id, name, email, role, avatar, bio, created_at FROM users ORDER BY created_at DESC').all();
  res.json({ success: true, users });
});

// GET /api/users/:id/notes - Admin or own user
router.get('/:id/notes', (req, res) => {
  const targetId = parseInt(req.params.id);
  if (req.user.role !== 'admin' && req.user.id !== targetId) {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  const notes = prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC').all(targetId);
  res.json({ success: true, notes });
});

module.exports = router;
