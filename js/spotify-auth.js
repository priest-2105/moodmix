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
    console.log('Fetched clientId:', clientId); 
    console.log('Fetched redirectUri:', redirectUri); 
  } catch (error) {
    console.error('Error fetching Spotify credentials:', error);
  }
}

// Function to initiate Spotify OAuth flow
export async function loginWithSpotify() { 
  if (!clientId || !redirectUri) {
    await fetchSpotifyCredentials();
  }
  const scopes = 'user-read-private user-read-email playlist-read-private';
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
  window.location.href = authUrl;
}

// Function to handle the OAuth callback
function handleCallback() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');

  if (accessToken) {
    // Save the access token to local storage
    localStorage.setItem('spotify_access_token', accessToken);
    // Fetch user profile and save to local storage
    fetchUserProfile(accessToken);
  }
}

// ... (rest of your existing spotify-auth.js code)

// Initialize the app
async function initApp() {
  await fetchSpotifyCredentials(); // Ensure clientId and redirectUri are fetched before using them
  const accessToken = localStorage.getItem('spotify_access_token');
  if (accessToken) {
    const userProfile = JSON.parse(localStorage.getItem('user_profile'));
    if (userProfile) {
      updateUIWithUserInfo(userProfile);
    } else {
      fetchUserProfile(accessToken);
    }
    fetchAndStoreUserPlaylists(accessToken);
  }

  // Add login button event listener
  const loginButton = document.getElementById('login-button');
  if (loginButton) {
    loginButton.addEventListener('click', loginWithSpotify);
  }

  // Handle OAuth callback
  if (window.location.hash) {
    handleCallback();
  }
}

// Call initApp when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);