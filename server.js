require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5500;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to securely provide the client ID
app.get('/api/spotify-credentials', (req, res) => {
  res.json({ clientId: process.env.SPOTIFY_APP_CLIENT_ID });
});

// Endpoint to securely provide the redirect URI
app.get('/api/spotify-redirect-uri', (req, res) => {
  res.json({ redirectUri: process.env.SPOTIFY_APP_REDIRECT_URI });
});

// Serve JavaScript files
app.get('/js/:file', (req, res) => {
  res.sendFile(path.join(__dirname, 'js', req.params.file));
});

// Serve CSS files
app.get('/css/:file', (req, res) => {
  res.sendFile(path.join(__dirname, 'css', req.params.file));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
