import config from '../config.js';

let clientId = config.clientId;
let redirectUri = config.redirectUri;

async function fetchSpotifyCredentials() {
  try {
    const [clientIdResponse, redirectUriResponse] = await Promise.all([
      fetch('http://localhost:5501/api/spotify-credentials'),
      fetch('http://localhost:5501/api/spotify-redirect-uri')
    ]);
    const clientIdData = await clientIdResponse.json();
    const redirectUriData = await redirectUriResponse.json();
    clientId = clientIdData.clientId;
    redirectUri = redirectUriData.redirectUri;
    console.log('Fetched clientId:', clientId); // Log for debugging
    console.log('Fetched redirectUri:', redirectUri); // Log for debugging
  } catch (error) {
    console.error('Error fetching Spotify credentials:', error);
  }
}

const auth = (() => {
  const scopes = 'user-read-private user-read-email playlist-read-private';

  const getStoredToken = () => {
    return localStorage.getItem('spotify_access_token');
  };

  const setToken = (token) => {
    localStorage.setItem('spotify_access_token', token);
  };

  const clearToken = () => {
    localStorage.removeItem('spotify_access_token');
  };

  const getLoginURL = async () => {
    if (!clientId || !redirectUri) {
      await fetchSpotifyCredentials();
    }
    return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
  };

  const login = async () => {
    const loginURL = await getLoginURL();
    window.location.href = loginURL;
  };

  const handleRedirect = () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');

    if (token) {
      setToken(token);
      window.location.hash = '';
      window.location.href = '/';
    }
  };

  const initialize = async () => {
    await fetchSpotifyCredentials();
    handleRedirect();

    const loginButton = document.getElementById('spotify-login-button');
    if (loginButton) {
      loginButton.addEventListener('click', login); // Directly call login without async
    }
  };

  return {
    getStoredToken,
    setToken,
    clearToken,
    getLoginURL,
    login,
    initialize
  };
})();

export default auth;