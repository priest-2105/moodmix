document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.auth-modal');
    const login_container = document.querySelector('.login-container');
    const signup_container = document.querySelector('.signup-container');
    const alreadyhaveanaccount_Btn = document.querySelector('#alreadyhaveanaccountbtn');

    // Add event listener for clicks on the modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            // Only scale when clicking the modal, not the signup_container or form elements
            modal.classList.add('active');
            setTimeout(() => {
                modal.classList.remove('active');
            }, 500);
        }
    });

    // Add click event on the signup_container to stop it from bubbling to the modal
    signup_container.addEventListener('click', (e) => {
        e.stopPropagation();
        signup_container.classList.add('active');
        setTimeout(() => {
            signup_container.classList.remove('active');
        }, 200);
    });



    alreadyhaveanaccount_Btn.addEventListener('click', () => {

            login_container.style.display = 'block';
            signup_container.style.display = 'none';

    });

});


