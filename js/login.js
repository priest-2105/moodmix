import auth from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.auth-modal');
  const signupContainer = document.querySelector('.signup-container');
  const forgotPasswordContainer = document.querySelector('.forgot-password-container');
  const loginContainer = document.querySelector('.login-container');
  const dontHaveAccountBtn = document.getElementById('donthaveanacountbtn');
  const forgotPasswordBtn = document.querySelector('.forgot-password-btn');
  const loginButton = document.querySelector('#login-button');
  const loginForm = document.querySelector('#loginForm');
  const spotifyLoginButton = document.getElementById('spotify-login-button');

  // Check for required elements
  if (!modal || !loginContainer || !signupContainer || !forgotPasswordContainer || !spotifyLoginButton) {
    console.error('Required elements are missing in the HTML.');
    return;
  }

  // Modal click interaction
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('active');
      setTimeout(() => modal.classList.remove('active'), 500);
    }
  });

  // Prevent modal close when clicking inside login container
  loginContainer.addEventListener('click', (e) => {
    e.stopPropagation();
    loginContainer.classList.add('active');
    setTimeout(() => loginContainer.classList.remove('active'), 200);
  });

  // Switch to sign-up view
  dontHaveAccountBtn.addEventListener('click', () => {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
  });

  // Switch to forgot password view
  forgotPasswordBtn.addEventListener('click', () => {
    loginContainer.style.display = 'none';
    forgotPasswordContainer.style.display = 'block';
  });

  // Handle login form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[name="email"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;

    console.log('Login submitted', { email, password });

    // Placeholder for API call to authenticate user
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful!');
        updateUIAfterLogin(data);
      } else {
        alert('Login failed, please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred, please try again later.');
    }
  });

  // Handle Spotify login
  spotifyLoginButton.addEventListener('click', () => {
    const authURL = auth.getAuthURL();
    window.location.href = authURL;
  });

  // Handle Spotify login callback
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    auth.fetchToken(code).then((data) => {
      if (data) {
        console.log('Spotify login successful!');
        console.log('Access Token:', data.access_token);
        updateUIAfterLogin(data);
      }
    });
  }

  // Function to update UI after successful login
  function updateUIAfterLogin(userData) {
    modal.style.display = 'none';
    // Add any other UI updates here, such as showing user profile info
    console.log('User data:', userData);
  }

  // Check if user is already authenticated
  if (auth.isAuthenticated()) {
    updateUIAfterLogin({ message: 'User already authenticated' });
  }
});