const hamburgerToggle_div = document.getElementById('hamburgerToggle');
const navList_Div = document.getElementById('navList')
const closeMenu_B = document.getElementById('closeMenu');
const galleryItem_Div = document.getElementById('galleryItem');
const galleryItemContainer_Div = document.getElementById('galleryItemContainer');


closeMenu_B.addEventListener('click', () => {

    navList_Div.classList.toggle('show');
    
});

hamburgerToggle_div.addEventListener('click', () => {

    navList_Div.classList.toggle('show');
    
});



document.addEventListener('DOMContentLoaded', function () {
    const glide = new Glide('.glide', {
        type: 'carousel',
        startAt: 0,
        perView: 2.3,
        focusAt: '0',
        gap: 20,
        peek: {
            before: 40,
            after: 0
          },
          breakpoints: {
            1024: {
                perView: 2 
            },
            768: {
                perView: 1.5 
            },
            480: {
                perView: 1 
            }
        }
    });

    glide.mount();

    // Function to update the background, button color, header, and description
    function updateSlideContent() {
        const currentSlide = document.querySelector('.glide__slide--active');

        if (currentSlide) {
            const backgroundImage = currentSlide.getAttribute('data-bg');
            const buttonColor = currentSlide.getAttribute('data-button-color');
            const headerText = currentSlide.getAttribute('data-header');
            const descriptionText = currentSlide.getAttribute('data-description');

            document.querySelector('.body').style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.904)), ${backgroundImage}`;
            document.getElementById('exploreButton').style.backgroundColor = buttonColor;
            document.getElementById('headerText').innerText = headerText;
            document.getElementById('descriptionText').innerText = descriptionText;
        }
    }

    // Update content when the glide index changes
    glide.on('run.after', function () {
        updateSlideContent();
    });

    // Initial activation of the first slide
    updateSlideContent();
});

