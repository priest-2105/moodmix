require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Endpoint to securely provide the client ID
app.get('/api/spotify-credentials', (req, res) => {
  res.json({ clientId: process.env.SPOTIFY_APP_CLIENT_ID });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});