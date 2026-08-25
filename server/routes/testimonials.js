const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/testimonials
router.get('/', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM testimonials').all();
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/testimonials
router.post('/', (req, res) => {
  try {
    const t = req.body;
    const info = db.prepare(`
      INSERT INTO testimonials (name, role, quote, full_quote, rating)
      VALUES (@name, @role, @quote, @full_quote, @rating)
    `).run({
      name: t.name || 'Anonymous',
      role: t.role || 'Client',
      quote: t.quote || '',
      full_quote: t.fullQuote || t.full_quote || t.quote || '',
      rating: parseInt(t.rating, 10) || 5
    });

    res.json({ success: true, data: { id: info.lastInsertRowid, ...t } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/testimonials/:id
router.put('/:id', (req, res) => {
  try {
    const id = req.params.id;
    const t = req.body;

    const existing = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }

    db.prepare(`
      UPDATE testimonials SET
        name = @name,
        role = @role,
        quote = @quote,
        full_quote = @full_quote,
        rating = @rating
      WHERE id = @id
    `).run({
      id,
      name: t.name !== undefined ? t.name : existing.name,
      role: t.role !== undefined ? t.role : existing.role,
      quote: t.quote !== undefined ? t.quote : existing.quote,
      full_quote: (t.fullQuote || t.full_quote) !== undefined ? (t.fullQuote || t.full_quote) : existing.full_quote,
      rating: t.rating !== undefined ? parseInt(t.rating, 10) : existing.rating
    });

    res.json({ success: true, message: 'Testimonial updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/testimonials/:id
router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id;
    db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
