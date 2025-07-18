// ✅ Load .env before anything else
require('dotenv').config();

const express = require('express');
const path = require('path');
const feedbackRoutes = require('./api/feedback');

const app = express();

// ✅ Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ✅ API routes
app.use('/api', feedbackRoutes);

// ✅ Serve Feedback Form at "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Serve Admin Dashboard explicitly
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin/index.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
// ✅ Handle 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});