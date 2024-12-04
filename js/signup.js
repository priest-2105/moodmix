document.addEventListener('DOMContentLoaded', () => {
    const signupContainer = document.querySelector('.signup-container');
    const loginContainer = document.querySelector('.login-container');
    const alreadyHaveAccountBtn = document.getElementById('alreadyhaveanaccountbtn');
    const signupForm = document.getElementById('signupForm');
  
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