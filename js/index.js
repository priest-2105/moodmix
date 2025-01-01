import '../css/styles.css';
import '../css/footer-player.css';
import '../css/main.css';
import '../css/navbar-styles.css';
import '../css/sidebar-styles.css';
import '../css/section-styles.css';
import '../css/login.css';
import '../css/signup.css';
import '../css/forgotpassword.css';

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
