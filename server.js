const express = require('express');
const path = require('path');
const config = require('./config');

const app = express();
const port = config.port;

// Log environment variables for debugging
console.log('SPOTIFY_APP_CLIENT_ID:', config.clientId);
console.log('SPOTIFY_APP_REDIRECT_URI:', config.redirectUri);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to securely provide the client ID
app.get('/api/spotify-credentials', (req, res) => {
  res.json({ clientId: config.clientId });
});

// Endpoint to securely provide the redirect URI
app.get('/api/spotify-redirect-uri', (req, res) => {
  res.json({ redirectUri: config.redirectUri });
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
