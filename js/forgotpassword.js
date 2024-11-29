document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.auth-modal');
    const signup_container = document.querySelector('.signup-container');
    const login_container = document.querySelector('.login-container');
    const backtologin_Btn = document.getElementById('backtologinbtn');

    // Add event listener for clicks on the modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            // Only scale when clicking the modal, not the login_container or form elements
            modal.classList.add('active');
            setTimeout(() => {
                modal.classList.remove('active');
            }, 500);
        }
    });

    // Add click event on the login_container to stop it from bubbling to the modal
    login_container.addEventListener('click', (e) => {
        e.stopPropagation();
        login_container.classList.add('active');
        setTimeout(() => {
            login_container.classList.remove('active');
        }, 200);
    });


    backtologin_Btn.addEventListener('click', () => {

        login_container.style.display = 'none';
        signup_container.style.display = 'block';
        console.log('backtologinbtn clicked');
        
    });

});


