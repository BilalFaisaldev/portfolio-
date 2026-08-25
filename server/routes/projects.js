const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/projects
router.get('/', (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all().map(p => ({
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : [],
      featured: Boolean(p.featured)
    }));
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/projects - Create
router.post('/', (req, res) => {
  try {
    const p = req.body;
    const id = p.id || p.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
    
    db.prepare(`
      INSERT INTO projects (
        id, type, title, subtitle, short_description, full_description, tags, live_url, github_url, featured
      ) VALUES (
        @id, @type, @title, @subtitle, @short_description, @full_description, @tags, @live_url, @github_url, @featured
      )
    `).run({
      id,
      type: p.type || 'client',
      title: p.title || 'Untitled Project',
      subtitle: p.subtitle || '',
      short_description: p.shortDescription || p.short_description || '',
      full_description: p.fullDescription || p.full_description || '',
      tags: JSON.stringify(p.tags || []),
      live_url: p.liveUrl || p.live_url || '',
      github_url: p.githubUrl || p.github_url || '',
      featured: p.featured ? 1 : 0
    });

    res.json({ success: true, data: { id, ...p } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/projects/:id - Update
router.put('/:id', (req, res) => {
  try {
    const id = req.params.id;
    const p = req.body;

    const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    db.prepare(`
      UPDATE projects SET
        type = @type,
        title = @title,
        subtitle = @subtitle,
        short_description = @short_description,
        full_description = @full_description,
        tags = @tags,
        live_url = @live_url,
        github_url = @github_url,
        featured = @featured
      WHERE id = @id
    `).run({
      id,
      type: p.type !== undefined ? p.type : existing.type,
      title: p.title !== undefined ? p.title : existing.title,
      subtitle: p.subtitle !== undefined ? p.subtitle : existing.subtitle,
      short_description: (p.shortDescription || p.short_description) !== undefined ? (p.shortDescription || p.short_description) : existing.short_description,
      full_description: (p.fullDescription || p.full_description) !== undefined ? (p.fullDescription || p.full_description) : existing.full_description,
      tags: p.tags !== undefined ? JSON.stringify(p.tags) : existing.tags,
      live_url: (p.liveUrl || p.live_url) !== undefined ? (p.liveUrl || p.live_url) : existing.live_url,
      github_url: (p.githubUrl || p.github_url) !== undefined ? (p.githubUrl || p.github_url) : existing.github_url,
      featured: p.featured !== undefined ? (p.featured ? 1 : 0) : existing.featured
    });

    res.json({ success: true, message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id;
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
