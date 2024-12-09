require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5501;

// Serve static files
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
  }
}));
// Endpoint to securely provide the client ID
app.get('/api/spotify-credentials', (req, res) => {
  res.json({ clientId: process.env.SPOTIFY_APP_CLIENT_ID });
});


app.listen(5501, () => {
  console.log('Server running on http://localhost:5501');
});
