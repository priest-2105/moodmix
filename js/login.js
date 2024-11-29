document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.login-modal');
    const container = document.querySelector('.login-container');

    // Add event listener for clicks on the modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            // Only scale when clicking the modal, not the container or form elements
            modal.classList.add('active');
            setTimeout(() => {
                modal.classList.remove('active');
            }, 500);
        }
    });

    // Add click event on the container to stop it from bubbling to the modal
    container.addEventListener('click', (e) => {
        e.stopPropagation();
        container.classList.add('active');
        setTimeout(() => {
            container.classList.remove('active');
        }, 200);
    });
});




const donthaveanacount_Btn = document.querySelector('.donthaveanacountbtn');




donthaveanacount_Btn.addEventListener('click', () => {

    

});