const express = require('express');
const { body, validationResult } = require('express-validator');
const { prepare } = require('../database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/notes
router.get('/', (req, res) => {
  const notes = prepare(
    'SELECT * FROM notes WHERE user_id = ? ORDER BY is_pinned DESC, updated_at DESC'
  ).all(req.user.id);
  res.json({ success: true, notes });
});

// POST /api/notes
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required (max 100 chars)'),
  body('content').optional().trim(),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Invalid color'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, content = '', color = '#ffffff' } = req.body;

  const result = prepare(
    'INSERT INTO notes (user_id, title, content, color) VALUES (?, ?, ?, ?)'
  ).run(req.user.id, title, content, color);

  const note = prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, note });
});

// PUT /api/notes/:id
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('content').optional().trim(),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/),
  body('is_pinned').optional().isBoolean(),
], (req, res) => {
  const note = prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);

  if (!note) {
    return res.status(404).json({ success: false, message: 'Note not found.' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, content, color, is_pinned } = req.body;
  const updates = [];
  const values = [];

  if (title !== undefined) { updates.push('title = ?'); values.push(title); }
  if (content !== undefined) { updates.push('content = ?'); values.push(content); }
  if (color !== undefined) { updates.push('color = ?'); values.push(color); }
  if (is_pinned !== undefined) { updates.push('is_pinned = ?'); values.push(is_pinned ? 1 : 0); }

  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: 'Nothing to update.' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(req.params.id, req.user.id);

  prepare(`UPDATE notes SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);
  const updated = prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);

  res.json({ success: true, note: updated });
});

// DELETE /api/notes/:id
router.delete('/:id', (req, res) => {
  const note = prepare('SELECT id FROM notes WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);

  if (!note) {
    return res.status(404).json({ success: false, message: 'Note not found.' });
  }

  prepare('DELETE FROM notes WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true, message: 'Note deleted.' });
});

// GET /api/notes/stats
router.get('/stats', (req, res) => {
  const total = prepare('SELECT COUNT(*) as count FROM notes WHERE user_id = ?').get(req.user.id);
  const pinned = prepare('SELECT COUNT(*) as count FROM notes WHERE user_id = ? AND is_pinned = 1').get(req.user.id);
  const recent = prepare("SELECT COUNT(*) as count FROM notes WHERE user_id = ? AND created_at >= datetime('now', '-7 days')").get(req.user.id);

  res.json({ success: true, stats: { total: total.count, pinned: pinned.count, recentWeek: recent.count } });
});

module.exports = router;
