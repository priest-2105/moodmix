import auth from './auth.js';

const playlistLoader = (() => {
  const loadPlaylists = async () => {
    const token = auth.getStoredToken();
    if (!token) {
      console.error('No token found');
      displayErrorState('No authentication token found. Please log in.');
      return;
    }

    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        displayPlaylists(data.items);
        localStorage.setItem('user_playlists', JSON.stringify(data.items));
      } else {
        console.log('No playlists found');
        displayEmptyState();
      }
    } catch (error) {
      console.error('Error loading playlists:', error);
      displayErrorState('Failed to load playlists. Please try again later.');
    }
  };

  const displayPlaylists = (playlists) => {
    const container = document.querySelector('.inner-main-content');
    const template = document.getElementById('playlist-section-template').innerHTML;

    const sections = {
      'Recent Playlists': playlists.slice(0, 5),
      'All Playlists': playlists,
      'Favorite Playlists': playlists.slice().sort((a, b) => b.tracks.total - a.tracks.total).slice(0, 5),
      'Back in Time': playlists.slice().sort((a, b) => new Date(a.added_at) - new Date(b.added_at)).slice(0, 5),
    };

    for (const [sectionTitle, sectionPlaylists] of Object.entries(sections)) {
      let slidesHtml = '';
      sectionPlaylists.forEach(playlist => {
        const slide = {
          image: (playlist.images && playlist.images[0]) ? playlist.images[0].url : './assets/images/default-playlist.png',
          subtitle: playlist.owner.display_name,
          title: playlist.name,
          description: `${playlist.tracks.total} tracks`
        };
        slidesHtml += `
          <div class="inner-main-section-card glide__slide">
            <div class="inner-main-secton-card-banner" style="background-image: url('${slide.image}');"></div>
            <div class="inner-main-secton-card-description">
              <div class="inner-main-secton-card-description-filler"></div>
              <div class="inner-main-secton-card-description-inner">
                <button> <i class="bi bi-play-fill"></i> </button>
                <span>${slide.subtitle}</span>
                <h3>${slide.title}</h3>
                <p>${slide.description}</p>
              </div>
            </div>
          </div>`;
      });

      const sectionHtml = template.replace('{{title}}', sectionTitle).replace('{{slides}}', slidesHtml);
      container.insertAdjacentHTML('beforeend', sectionHtml);
    }

    initializeGlide();
  };

  const initializeGlide = () => {
    if (typeof Glide !== 'undefined') {
      // Destroy existing Glide instance if it exists
      if (window.glideInstance) {
        window.glideInstance.destroy();
      }
      // Initialize new Glide instance
      window.glideInstance = new Glide('.glide', {
        type: 'carousel',
        startAt: 0,
        perView: 4,
        gap: 20,
        breakpoints: {
          768: {
            perView: 2
          },
          576: {
            perView: 1
          }
        }
      });
      window.glideInstance.mount();
    } else {
      console.error('Glide.js is not loaded');
    }
  };

  const displayEmptyState = () => {
    const playlistContainer = document.querySelector('.glide__slides');
    if (playlistContainer) {
      playlistContainer.innerHTML = `
        <div class="inner-main-section-card glide__slide">
          <div class="inner-main-secton-card-description">
            <div class="inner-main-secton-card-description-inner">
              <h3>No Playlists Found</h3>
              <p>Start creating playlists on Spotify to see them here!</p>
            </div>
          </div>
        </div>
      `;
    }
  };

  const displayErrorState = (message) => {
    const playlistContainer = document.querySelector('.glide__slides');
    if (playlistContainer) {
      playlistContainer.innerHTML = `
        <div class="inner-main-section-card glide__slide">
          <div class="inner-main-secton-card-description">
            <div class="inner-main-secton-card-description-inner">
              <h3>Error Loading Playlists</h3>
              <p>${message}</p>
            </div>
          </div>
        </div>
      `;
    }
  };

  return {
    loadPlaylists
  };
})();

export default playlistLoader;

// Call loadPlaylists to initialize everything
playlistLoader.loadPlaylists();