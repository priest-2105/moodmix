// Variables Declarations

const sidebarOpenBtn = document.querySelector('#sidebarOpenBtn');
const sidebarCloseBtn = document.querySelector('#sidebarCloseBtn');
const sidebarMain = document.querySelector('.navigation-sidebar');
const mobileSearchBar_El = document.querySelector('.mobile-header-search-bar');
const mobileOpenSearchBtn = document.querySelector('#sidebarOpenSearch');
const mobileCloseSearchBtn = document.querySelector('.mobile-close-search-btn');
const sideBarFiller = document.querySelector('.sidebar-filler')
// End Variables Declarations






// Events 


// Event listener to open sidebar 
sidebarOpenBtn.addEventListener('click', () => {
        sideBarFiller.style.display = 'block';
        sideBarFiller.addEventListener('click', () => {
            sidebarMain.classList.remove('sidebar-toggle');
            sideBarFiller.style.display = 'none';
        });
        document.body.appendChild(sideBarFiller);
    
    sidebarMain.classList.add('sidebar-toggle');
});



// Event listener to close sidebar
sidebarCloseBtn.addEventListener('click', () => { 
    sidebarMain.classList.remove('sidebar-toggle');
    sideBarFiller.style.display = 'none';
})


//End of  Events 





// Mobile Search toggling logic


mobileOpenSearchBtn.addEventListener('click', () => {

    mobileSearchBar_El.style.display = 'block';
    mobileCloseSearchBtn.style.display = 'block';
    mobileOpenSearchBtn.style.display = 'none';
    sidebarOpenBtn.style.display = 'none';
    

})


mobileCloseSearchBtn.addEventListener('click', () => {

    mobileSearchBar_El.style.display = 'none';
    mobileCloseSearchBtn.style.display = 'none';
    mobileOpenSearchBtn.style.display = 'block';
    sidebarOpenBtn.style.display = 'block';
})
