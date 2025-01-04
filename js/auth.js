import { clientId, redirectUri } from './client-config.js';

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

  const getLoginURL = () => {
    return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
  };

  const login = () => {
    const loginURL = getLoginURL();
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

  const initialize = () => {
    handleRedirect();

    const loginButton = document.getElementById('spotify-login-button');
    if (loginButton) {
      loginButton.addEventListener('click', login);
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

// Additional functions for handling user profile and playlists
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

function updateUIWithUserInfo(userProfile) {
  const profileSection = document.querySelector('.profile-section');
  if (profileSection) {
    profileSection.innerHTML = `<img src="${userProfile.images && userProfile.images[0] ? userProfile.images[0].url : './assets/images/profile-img.png'}" alt="${userProfile.display_name || 'User'}">`;
  }
}

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
  const accessToken = localStorage.getItem('spotify_access_token');
  if (accessToken) {
    const userProfile = JSON.parse(localStorage.getItem('user_profile'));
    if (userProfile) {
      updateUIWithUserInfo(userProfile);
    } else {
      await fetchUserProfile(accessToken);
    }
    await fetchAndStoreUserPlaylists(accessToken);
  }

  // Add login button event listener
  const loginButton = document.getElementById('login-button');
  if (loginButton) {
    loginButton.addEventListener('click', auth.login);
  }

  // Handle OAuth callback
  if (window.location.hash) {
    auth.handleRedirect();
  }
}

// Call initApp when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);