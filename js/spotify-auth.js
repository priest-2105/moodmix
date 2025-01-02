let clientId;
const redirectUrl = 'http://127.0.0.1:9000/index.html';  

async function fetchClientId() {
  try {
    const response = await fetch('/api/spotify-credentials');
    const data = await response.json();
    clientId = data.clientId;
  } catch (error) {
    console.error('Error fetching client ID:', error);
  }
}

// Function to initiate Spotify OAuth flow
async function loginWithSpotify() {
  if (!clientId) {
    await fetchClientId();
  }
  const scopes = 'user-read-private user-read-email playlist-read-private';
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_url=${encodeURIComponent(redirectUrl)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
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
  await fetchClientId();
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