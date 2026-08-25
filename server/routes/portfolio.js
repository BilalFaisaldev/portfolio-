const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/portfolio - Return aggregated data
router.get('/', (req, res) => {
  try {
    const personalRow = db.prepare('SELECT * FROM personal_info WHERE id = 1').get() || {};
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all().map(p => ({
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : [],
      featured: Boolean(p.featured)
    }));

    const services = db.prepare('SELECT * FROM services').all().map(s => ({
      ...s,
      bullets: s.bullets ? JSON.parse(s.bullets) : []
    }));

    const process = db.prepare('SELECT * FROM process_steps').all();
    const testimonials = db.prepare('SELECT * FROM testimonials').all();

    const personal = {
      name: personalRow.name || "Bilal Faisal",
      roleBadge: personalRow.role_badge || "Senior Full Stack & Cloud Engineer",
      headlineStart: personalRow.headline_start || "Engineering",
      headlineGradient: personalRow.headline_gradient || "Scalable Web Platforms",
      headlineEnd: personalRow.headline_end || "& High-Performance Cloud Architectures.",
      subheadline: personalRow.subheadline || "",
      avatarText: personalRow.avatar_text || "BF",
      statusBadge: personalRow.status_badge || "Available for Q2/Q3 Projects & Contracts",
      githubUrl: personalRow.github_url || "",
      linkedinUrl: personalRow.linkedin_url || "",
      email: personalRow.email || "contact@bilalfaisal.dev",
      phone: personalRow.phone || "+92 300 1234567",
      calendlyUrl: personalRow.calendly_url || "https://calendly.com/",
      location: personalRow.location || "Islamabad, PK (Remote Worldwide)",
      heroStats: personalRow.hero_stats ? JSON.parse(personalRow.hero_stats) : [],
      about: personalRow.about_data ? JSON.parse(personalRow.about_data) : {}
    };

    res.json({
      success: true,
      data: {
        personal,
        projects,
        services,
        process,
        testimonials
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/portfolio/personal - Update personal profile info
router.put('/personal', (req, res) => {
  try {
    const update = req.body;
    const existing = db.prepare('SELECT * FROM personal_info WHERE id = 1').get() || {};

    const updatedData = {
      name: update.name !== undefined ? update.name : existing.name,
      role_badge: update.roleBadge !== undefined ? update.roleBadge : existing.role_badge,
      headline_start: update.headlineStart !== undefined ? update.headlineStart : existing.headline_start,
      headline_gradient: update.headlineGradient !== undefined ? update.headlineGradient : existing.headline_gradient,
      headline_end: update.headlineEnd !== undefined ? update.headlineEnd : existing.headline_end,
      subheadline: update.subheadline !== undefined ? update.subheadline : existing.subheadline,
      avatar_text: update.avatarText !== undefined ? update.avatarText : existing.avatar_text,
      status_badge: update.statusBadge !== undefined ? update.statusBadge : existing.status_badge,
      github_url: update.githubUrl !== undefined ? update.githubUrl : existing.github_url,
      linkedin_url: update.linkedinUrl !== undefined ? update.linkedinUrl : existing.linkedin_url,
      email: update.email !== undefined ? update.email : existing.email,
      phone: update.phone !== undefined ? update.phone : existing.phone,
      calendly_url: update.calendlyUrl !== undefined ? update.calendlyUrl : existing.calendly_url,
      location: update.location !== undefined ? update.location : existing.location,
      hero_stats: update.heroStats ? JSON.stringify(update.heroStats) : existing.hero_stats,
      about_data: update.about ? JSON.stringify(update.about) : existing.about_data
    };

    db.prepare(`
      UPDATE personal_info SET
        name = @name,
        role_badge = @role_badge,
        headline_start = @headline_start,
        headline_gradient = @headline_gradient,
        headline_end = @headline_end,
        subheadline = @subheadline,
        avatar_text = @avatar_text,
        status_badge = @status_badge,
        github_url = @github_url,
        linkedin_url = @linkedin_url,
        email = @email,
        phone = @phone,
        calendly_url = @calendly_url,
        location = @location,
        hero_stats = @hero_stats,
        about_data = @about_data
      WHERE id = 1
    `).run(updatedData);

    res.json({ success: true, message: "Personal profile updated successfully." });
  } catch (error) {
    console.error('Error updating personal info:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
