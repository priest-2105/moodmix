import auth from './auth.js';
import playlistLoader from './playlist-loader.js';
import './login.js';
import './signup.js';
import './forgotpassword.js';
import './slider.js';
import './basic-responsiveness.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  auth.initialize();
  playlistLoader.loadPlaylists();
});
