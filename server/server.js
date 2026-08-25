const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize database & seed
require('./database');
require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  if (!req.url.startsWith('/css') && !req.url.startsWith('/js')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'portfolio-backend-sqlite',
    uptime: process.uptime()
  });
});

// Mount API Routes
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/services', require('./routes/services'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/messages', require('./routes/messages'));

// Serve Static Frontend files (index.html, about.html, services.html, projects.html, contact.html, admin/)
const publicDir = path.join(__dirname, '..');
app.use(express.static(publicDir));

// Fallback for SPA/HTML routes if not an API route
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API Endpoint not found' });
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Portfolio Full-Stack Application is LIVE!`);
  console.log(`🌐 Frontend:   http://localhost:${PORT}`);
  console.log(`👑 Admin:      http://localhost:${PORT}/admin/`);
  console.log(`🔌 API Health: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});
