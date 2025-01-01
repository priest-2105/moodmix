require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 9000; // Ensure the port is set to 9000

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Endpoint to securely provide the client ID
app.get('/api/spotify-credentials', (req, res) => {
  res.json({ clientId: process.env.SPOTIFY_APP_CLIENT_ID });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
