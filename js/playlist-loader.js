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
    const playlistContainer = document.querySelector('.glide__slides');
    if (!playlistContainer) {
      console.error('Playlist container not found');
      return;
    }

    // Clear existing content
    playlistContainer.innerHTML = '';

    playlists.forEach(playlist => {
      if (playlist && typeof playlist === 'object') {
        const playlistElement = document.createElement('div');
        playlistElement.className = 'inner-main-section-card glide__slide';
        playlistElement.innerHTML = `
          <div class="inner-main-secton-card-banner" style="background-image: url('${getPlaylistImage(playlist)}');"></div>
          <div class="inner-main-secton-card-description">
            <div class="inner-main-secton-card-description-filler"></div>
            <div class="inner-main-secton-card-description-inner">
              <button> <i class="bi bi-play-fill"></i> </button>
              <span>${playlist.type || 'Playlist'}</span>
              <h3>${playlist.name || 'Untitled Playlist'}</h3>
              <p>${playlist.description || 'No description'}</p>
            </div>
          </div>
        `;
        playlistContainer.appendChild(playlistElement);
      } else {
        console.error('Invalid playlist object:', playlist);
      }
    });

    // Reinitialize Glide.js
    initializeGlide();
  };

  const getPlaylistImage = (playlist) => {
    if (playlist && playlist.images && Array.isArray(playlist.images) && playlist.images.length > 0 && playlist.images[0].url) {
      return playlist.images[0].url;
    }
    return './assets/images/placeholder.png';
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
        perView: 3,
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

