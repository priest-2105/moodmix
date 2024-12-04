// document.addEventListener('DOMContentLoaded', () => {
//     const modal = document.querySelector('.auth-modal');
//     const login_container = document.querySelector('.login-container');
//     const signup_container = document.querySelector('.signup-container');
//     const alreadyhaveanaccount_Btn = document.querySelector('#alreadyhaveanaccountbtn');

//     // Add event listener for clicks on the modal
//     modal.addEventListener('click', (e) => {
//         if (e.target === modal) {
//             // Only scale when clicking the modal, not the signup_container or form elements
//             modal.classList.add('active');
//             setTimeout(() => {
//                 modal.classList.remove('active');
//             }, 500);
//         }
//     });

//     // Add click event on the signup_container to stop it from bubbling to the modal
//     signup_container.addEventListener('click', (e) => {
//         e.stopPropagation();
//         signup_container.classList.add('active');
//         setTimeout(() => {
//             signup_container.classList.remove('active');
//         }, 200);
//     });



//     alreadyhaveanaccount_Btn.addEventListener('click', () => {

//             login_container.style.display = 'block';
//             signup_container.style.display = 'none';

//     });

// });



import auth from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const signupContainer = document.querySelector('.signup-container');
  const loginContainer = document.querySelector('.login-container');
  const alreadyHaveAccountBtn = document.getElementById('alreadyhaveanaccountbtn');
  const signupForm = signupContainer.querySelector('form');

  // Check if the signup form exists
  if (!signupForm) {
    console.error('Sign-up form is missing in the HTML.');
    return;
  }

  // Switch to login view
  alreadyHaveAccountBtn.addEventListener('click', () => {
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
  });

  // Handle sign-up form submission
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const email = signupForm.querySelector('input[name="email"]').value;
    const username = signupForm.querySelector('input[name="username"]').value;
    const password = signupForm.querySelector('input[name="password"]').value;

    // Basic validation (can be extended)
    if (!email || !username || !password) {
      alert('Please fill all the fields!');
      return;
    }

    console.log('Sign-up submitted', { email, username, password });

    // Placeholder for API call to register user
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Sign-up successful!');
        // Handle success, e.g., redirect to login page or login automatically
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
      } else {
        alert('Sign-up failed, please try again.');
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      alert('An error occurred, please try again later.');
    }
  });
});
