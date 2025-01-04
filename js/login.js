import auth from './auth.js';
import playlistLoader from './playlist-loader.js';
import { loginWithSpotify } from './spotify-auth.js'; // Import the loginWithSpotify function

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.auth-modal');
  const loginContainer = document.querySelector('.login-container');
  const spotifyLoginButton = document.getElementById('spotify-login-button');
  const profileSection = document.querySelector('.profile-section');

  const updateUIWithUserInfo = async () => {
    const token = auth.getStoredToken();
    if (token) {
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        profileSection.innerHTML = `<img src="${data.images && data.images[0] ? data.images[0].url : './assets/images/profile-img.png'}" alt="${data.display_name || 'User'}">`;
        localStorage.setItem('user_profile', JSON.stringify(data));
        modal.style.display = 'none';
        await playlistLoader.loadPlaylists();
      } catch (error) {
        console.error('Error fetching user data:', error);
        auth.clearToken();
        showLoginModal();
      }
    } else {
      showLoginModal();
    }
  };

  const showLoginModal = () => {
    modal.style.display = 'block';
    loginContainer.style.display = 'block';
  };

  spotifyLoginButton.addEventListener('click', loginWithSpotify); // Call loginWithSpotify

  // Check if returning from Spotify auth
  const token = auth.getToken();
  if (token) {
    auth.setToken(token);
    window.location.hash = '';
    updateUIWithUserInfo();
  } else if (auth.getStoredToken()) {
    updateUIWithUserInfo();
  } else {
    showLoginModal();
  }
});