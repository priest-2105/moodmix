document.addEventListener('DOMContentLoaded', function () {
    // Check if Glide is defined
    if (typeof Glide !== 'undefined') {
        const glide = new Glide('.glide', {
            type: 'carousel',
            startAt: 0,
            perView: 4,
            focusAt: '0',
            gap: 20,
            peek: { before: 0, after: 0 },
            breakpoints: {
                1024: { perView: 2.8 },
                768: { perView: 2 },
                480: { perView: 1 },
            }
        });

        function updateSlideContent() {
            const currentSlide = document.querySelector('.glide__slide--active');
            if (currentSlide) {
                const backgroundImage = currentSlide.getAttribute('data-bg');
                const buttonColor = currentSlide.getAttribute('data-button-color');
                const headerText = currentSlide.getAttribute('data-header');
                const descriptionText = currentSlide.getAttribute('data-description');
                
                // Only update if elements exist
                const bodyEl = document.querySelector('.body');
                if (bodyEl) bodyEl.style.backgroundImage = 
                    `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.904)), ${backgroundImage}`;
                
                const exploreButton = document.getElementById('exploreButton');
                if (exploreButton) exploreButton.style.backgroundColor = buttonColor;
                
                const headerTextEl = document.getElementById('headerText');
                if (headerTextEl) headerTextEl.innerText = headerText;
                
                const descriptionTextEl = document.getElementById('descriptionText');
                if (descriptionTextEl) descriptionTextEl.innerText = descriptionText;
            }
        }

        // Attach events using data attributes
        const leftArrow = document.querySelector('[data-glide-dir="<"]');
        const rightArrow = document.querySelector('[data-glide-dir=">"]');

        if (leftArrow) {
            leftArrow.addEventListener('click', () => {
                glide.go('<');
            });
        }

        if (rightArrow) {
            rightArrow.addEventListener('click', () => {
                glide.go('>');
            });
        }

        // Glide events
        glide.on('move.after', updateSlideContent);
        
        // Mount the glide
        glide.mount();

        // Update content for the initial slide
        updateSlideContent();
    } else {
        console.error('Glide.js library not loaded');
    }
});






// section card color controller 
  document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".inner-main-section-card");

    cards.forEach((card) => {
      const banner = card.querySelector(".inner-main-secton-card-banner");
      const description = card.querySelector(".inner-main-secton-card-description-inner");

      const imageUrl = banner.getAttribute("data-image");

      // Create an image element to load the background image
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        // Create a canvas to extract pixel data
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const pixels = imageData.data;

        // Calculate the average brightness
        let totalBrightness = 0;
        let pixelCount = 0;

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];

          // Calculate brightness using the luminance formula
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          totalBrightness += brightness;
          pixelCount++;
        }

        const averageBrightness = totalBrightness / pixelCount;

        // Set text color based on brightness
        if (averageBrightness > 128) {
          // Light background -> Set text to black
          description.style.color = "black";
        } else {
          // Dark background -> Set text to white
          description.style.color = "white";
        }
      };
    });
  });
