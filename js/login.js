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

  // Check for required elements
  if (!modal || !loginContainer || !signupContainer || !forgotPasswordContainer) {
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
    console.log('donthaveanacountbt');
    
  });

  // Switch to forgot password view
  forgotPasswordBtn.addEventListener('click', () => {
    loginContainer.style.display = 'none';
    forgotPasswordContainer.style.display = 'block';
  });

  // Handle login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted');
    modal.style.display = 'none';
    // Perform additional login validation or API call here
  });

  // Handle Spotify login redirection
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    auth.fetchToken(code).then((data) => {
      if (data) {
        alert('Login successful!');
        console.log('Access Token:', data.access_token);
      }
    });
  }

  // Spotify Login Button
  loginButton.addEventListener('click', () => {
    const authURL = auth.getAuthURL();
    window.location.href = authURL;
  });
});
