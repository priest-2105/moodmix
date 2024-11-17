// Variables Declarations

const sidebarOpenBtn = document.querySelector('#sidebarOpenBtn');
const sidebarCloseBtn = document.querySelector('#sidebarCloseBtn');
const sidebarMain = document.querySelector('.navigation-sidebar');

// End Variables Declarations




// Events 


// Event listener to open sidebar 
sidebarOpenBtn.addEventListener('click', () => {
    if (!document.querySelector('.sidebar-filler')) {
        const sideBarFiller = document.createElement('div');
        sideBarFiller.classList.add('sidebar-filler');
        sideBarFiller.addEventListener('click', () => {
            sidebarMain.classList.remove('sidebar-toggle');
            sideBarFiller.remove();
        });
        document.body.appendChild(sideBarFiller);
    }
    sidebarMain.classList.add('sidebar-toggle');
});



// Event listener to close sidebar
sidebarCloseBtn.addEventListener('click', () => { 
    sidebarMain.classList.remove('sidebar-toggle');
    const existingFiller = document.querySelector('.sidebar-filler');
    if (existingFiller) {
        existingFiller.remove();
    }
})




//End of  Events 
