require('dotenv').config();
const express = require('express');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const { clientId, redirectUri, port } = require('./config');

const app = express();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL
});

// Log environment variables for debugging
console.log('SPOTIFY_APP_CLIENT_ID:', clientId);
console.log('SPOTIFY_APP_REDIRECT_URI:', redirectUri);

// Middleware to add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Serve static files from the "assets" directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Endpoint to securely provide the client ID and redirect URI
app.get('/api/spotify-credentials', (req, res) => {
  res.json({ clientId, redirectUri });
});

// Serve JavaScript files
app.get('/js/:file', (req, res) => {
  res.sendFile(path.join(__dirname, 'js', req.params.file));
});

// Serve CSS files
app.get('/css/:file', (req, res) => {
  res.sendFile(path.join(__dirname, 'css', req.params.file));
});

// Serve the index.html file from its current location
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state'];
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;

    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }

    spotifyApi.authorizationCodeGrant(code).then(data => {
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];
        const expiresIn = data.body['expires_in'];

        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);

        console.log('The access token is ' + accessToken);
        console.log('The refresh token is ' + refreshToken);

        res.send('Login successful! You can now use the /search and /play endpoints.');

        setInterval(async () => {
            const data = await spotifyApi.refreshAccessToken();
            const accessTokenRefreshed = data.body['access_token'];
            spotifyApi.setAccessToken(accessTokenRefreshed);
        }, expiresIn / 2 * 1000);

    }).catch(error => {
        console.error('Error getting Tokens:', error);
        res.send('Error getting tokens');
    });
});

app.get('/search', (req, res) => {
    const { q } = req.query;

    spotifyApi.searchTracks(q).then(searchData => {
        const trackUri = searchData.body.tracks.items[0].uri;
        res.send({ uri: trackUri });
    }).catch(err => {
        console.error('Search Error:', err);
        res.send('Error occurred during search');
    });
});

app.get('/play', (req, res) => {
    const { uri } = req.query;

    spotifyApi.play({ uris: [uri] }).then(() => {
        res.send('Playback started');
    }).catch(err => {
        console.error('Play Error:', err);
        res.send('Error occurred during playback');
    });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
