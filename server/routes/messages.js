const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/messages
router.get('/', (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all().map(m => ({
      ...m,
      read: Boolean(m.read),
      date: m.created_at
    }));
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/messages - Submit from contact form
router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }

    const id = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

    db.prepare(`
      INSERT INTO messages (id, name, email, subject, message, read)
      VALUES (?, ?, ?, ?, ?, 0)
    `).run(id, name, email, subject || 'Portfolio Inquiry', message);

    res.json({
      success: true,
      data: {
        id,
        name,
        email,
        subject: subject || 'Portfolio Inquiry',
        message,
        read: false,
        date: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/messages/:id/read - Mark message as read
router.put('/:id/read', (req, res) => {
  try {
    const id = req.params.id;
    db.prepare('UPDATE messages SET read = 1 WHERE id = ?').run(id);
    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/messages/:id
router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id;
    db.prepare('DELETE FROM messages WHERE id = ?').run(id);
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
