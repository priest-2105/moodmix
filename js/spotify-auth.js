let clientId;
let redirectUri;

async function fetchSpotifyCredentials() {
  try {
    const response = await fetch('http://localhost:5501/api/spotify-credentials'); // Update the URL to include the correct server port
    const data = await response.json();
    clientId = data.clientId;
    redirectUri = data.redirectUri;
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
    // Clear the hash from the URL
    window.location.hash = '';
    window.location.href = 'http://localhost:5500'; // Redirect to the main application page
  }
}

// Function to fetch user profile
async function fetchUserProfile(accessToken) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const userProfile = await response.json();
    localStorage.setItem('user_profile', JSON.stringify(userProfile));
    updateUIWithUserInfo(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
}

// Function to update UI with user info
function updateUIWithUserInfo(userProfile) {
  const profileSection = document.querySelector('.profile-section');
  if (profileSection) {
    profileSection.innerHTML = `<img src="${userProfile.images && userProfile.images[0] ? userProfile.images[0].url : './assets/images/profile-img.png'}" alt="${userProfile.display_name || 'User'}">`;
  }
}

// Function to fetch and store user playlists
async function fetchAndStoreUserPlaylists(accessToken) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const playlists = await response.json();
    localStorage.setItem('user_playlists', JSON.stringify(playlists.items));
  } catch (error) {
    console.error('Error fetching user playlists:', error);
  }
}

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
  const loginButton = document.getElementById('spotify-login-button');
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