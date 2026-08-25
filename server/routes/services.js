const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/services
router.get('/', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services').all().map(s => ({
      ...s,
      bullets: s.bullets ? JSON.parse(s.bullets) : []
    }));
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/services
router.post('/', (req, res) => {
  try {
    const s = req.body;
    const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>`;

    const info = db.prepare(`
      INSERT INTO services (title, description, bullets, icon)
      VALUES (@title, @description, @bullets, @icon)
    `).run({
      title: s.title || 'New Service',
      description: s.description || '',
      bullets: JSON.stringify(s.bullets || []),
      icon: s.icon || defaultIcon
    });

    res.json({ success: true, data: { id: info.lastInsertRowid, ...s } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/services/:id
router.put('/:id', (req, res) => {
  try {
    const id = req.params.id;
    const s = req.body;

    const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    db.prepare(`
      UPDATE services SET
        title = @title,
        description = @description,
        bullets = @bullets,
        icon = @icon
      WHERE id = @id
    `).run({
      id,
      title: s.title !== undefined ? s.title : existing.title,
      description: s.description !== undefined ? s.description : existing.description,
      bullets: s.bullets !== undefined ? JSON.stringify(s.bullets) : existing.bullets,
      icon: s.icon !== undefined ? s.icon : existing.icon
    });

    res.json({ success: true, message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/services/:id
router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id;
    db.prepare('DELETE FROM services WHERE id = ?').run(id);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
