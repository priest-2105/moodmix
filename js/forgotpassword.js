document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.auth-modal');
    const login_container = document.querySelector('.login-container');
    const forgot_password_container = document.querySelector('.forgot-password-container');
    const alreadyhaveanaccount_Btn = document.querySelector('#backtologinbtnbtn');

    // Add event listener for clicks on the modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            // Only scale when clicking the modal, not the forgot_password_container or form elements
            modal.classList.add('active');
            setTimeout(() => {
                modal.classList.remove('active');
            }, 500);
        }
    });

    // Add click event on the forgot_password_container to stop it from bubbling to the modal
    forgot_password_container.addEventListener('click', (e) => {
        e.stopPropagation();
        forgot_password_container.classList.add('active');
        setTimeout(() => {
            forgot_password_container.classList.remove('active');
        }, 200);
    });



    alreadyhaveanaccount_Btn.addEventListener('click', () => {

            login_container.style.display = 'block';
            forgot_password_container.style.display = 'none';

    });

});


