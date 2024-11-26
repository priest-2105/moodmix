// Variables Declarations

const sidebarOpenBtn = document.querySelector('#sidebarOpenBtn');
const sidebarCloseBtn = document.querySelector('#sidebarCloseBtn');
const sidebarMain = document.querySelector('.navigation-sidebar');
const mobileSearchBar_El = document.querySelector('.mobile-header-search-bar');
const mobileOpenSearchBtn = document.querySelector('#sidebarOpenSearch');
const mobileCloseSearchBtn = document.querySelector('.mobile-close-search-btn');
const sideBarFiller = document.querySelector('.sidebar-filler');
const playButtons = document.querySelectorAll('.play-button');
const pauseButtons = document.querySelectorAll('.pause-button');
const bottomMusicPlayerInner_El = document.querySelector('.bottom-music-player-inner');
const mobileBottomMusicPlayer_El = document.querySelector('.mobile-bottom-music-player');
const closeMobilePlayer_El = document.querySelector('#closeMobilePlayer');






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


// Mobile close search button 
mobileCloseSearchBtn.addEventListener('click', () => {

    mobileSearchBar_El.style.display = 'none';
    mobileCloseSearchBtn.style.display = 'none';
    mobileOpenSearchBtn.style.display = 'block';
    sidebarOpenBtn.style.display = 'block';
})


//  Play pause buttons functionality

playButtons.forEach((playButton, index) => {
    playButton.addEventListener('click', () => {
        playButton.style.display = 'none';  
        pauseButtons[index].style.display = 'block'; 
    });
});

pauseButtons.forEach((pauseButton, index) => {
    pauseButton.addEventListener('click', () => {
        pauseButton.style.display = 'none';  
        playButtons[index].style.display = 'block'; 
    });
});



// Click functionality for Mobile bottom music player 

const mediaQuery = window.matchMedia('(max-width: 628px)');

// Function to apply styles based on screen size
function applyStylesForScreenSize(e) {
    if (e.matches) {
    bottomMusicPlayerInner_El.addEventListener('click', () => {
        mobileBottomMusicPlayer_El.classList.add('mobile-bottom-music-player-active');
    })
  }
}


closeMobilePlayer_El.addEventListener('click', () => {
    mobileBottomMusicPlayer_El.classList.remove('mobile-bottom-music-player-active');
})

// Attach a listener to handle screen size changes
mediaQuery.addEventListener('change', applyStylesForScreenSize);

// Initial check and apply styles
applyStylesForScreenSize(mediaQuery);

