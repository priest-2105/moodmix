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
      const response = await fetch('http://localhost:5501/api/spotify-playlists', { // Update the endpoint URL
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
    const sidebarNav = document.querySelector('.playlist-sections-nav');
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
          title: playlist.name.length > 20 ? playlist.name.substring(0, 17) + '...' : playlist.name,
          description: `${playlist.tracks.total} tracks`
        };
        slidesHtml += `
          <div class="inner-main-section-card glide__slide" data-playlist-id="${playlist.id}">
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

      const sectionId = sectionTitle.replace(/\s+/g, '-').toLowerCase();
      const sectionHtml = template.replace('{{title}}', sectionTitle).replace('{{slides}}', slidesHtml).replace('{{id}}', sectionId);
      container.insertAdjacentHTML('beforeend', sectionHtml);

      const sidebarLink = document.createElement('li');
      sidebarLink.textContent = sectionTitle;
      sidebarLink.addEventListener('click', () => {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth' });
          localStorage.setItem('current_scroll_section', sectionId);
        }
      });
      sidebarNav.appendChild(sidebarLink);
    }

    initializeGlide();
    scrollToStoredSection();
    addPlaylistClickHandlers();
  };

  const addPlaylistClickHandlers = () => {
    document.querySelectorAll('.inner-main-section-card').forEach(card => {
      card.addEventListener('click', async (event) => {
        const playlistId = card.getAttribute('data-playlist-id');
        if (playlistId) {
          await displayPlaylistDetails(playlistId);
        }
      });
    });
  };

  const displayPlaylistDetails = async (playlistId) => {
    const token = auth.getStoredToken();
    if (!token) {
      console.error('No token found');
      displayErrorState('No authentication token found. Please log in.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5501/api/your-endpoint/${playlistId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const playlist = await response.json();
      const mainContent = document.querySelector('.inner-main-content');
      const playlistDetails = document.querySelector('.playlist-details-container');
      mainContent.style.display = 'none';
      playlistDetails.style.display = 'block';
      playlistDetails.innerHTML = `
        <div class="playlist-details">
          <div class="playlist-header">
            <img src="${playlist.images && playlist.images[0] ? playlist.images[0].url : './assets/images/default-playlist.png'}" alt="${playlist.name}">
            <div class="playlist-info">
              <h2>${playlist.name}</h2>
              <p>${playlist.tracks.total} songs</p>
              <p>Created on ${new Date(playlist.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div class="playlist-tracks">
            ${playlist.tracks.items.map((item, index) => `
              <div class="track">
                <span>${index + 1}</span>
                <img src="${item.track.album.images && item.track.album.images[0] ? item.track.album.images[0].url : './assets/images/default-track.png'}" alt="${item.track.name}">
                <div class="track-info">
                  <h3>${item.track.name}</h3>
                  <p>${item.track.artists.map(artist => artist.name).join(', ')}</p>
                  <p>${new Date(item.added_at).toLocaleDateString()}</p>
                  <p>${item.track.album.name}</p>
                  <p>${Math.floor(item.track.duration_ms / 60000)}:${((item.track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}</p>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="back-to-main">Back to Main</button>
        </div>
      `;

      document.querySelector('.back-to-main').addEventListener('click', () => {
        playlistDetails.style.display = 'none';
        mainContent.style.display = 'block';
      });
    } catch (error) {
      console.error('Error loading playlist details:', error);
      displayErrorState('Failed to load playlist details. Please try again later.');
    }
  };

  const initializeGlide = () => {
    if (typeof Glide !== 'undefined') {
      // Destroy existing Glide instance if it exists
      if (window.glideInstance) {
        window.glideInstance.destroy();
      }
      // Initialize new Glide instance for each section
      document.querySelectorAll('.glide').forEach((glideElement, index) => {
        new Glide(glideElement, {
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
        }).mount();
      });
    } else {
      console.error('Glide.js is not loaded');
    }
  };

  const scrollToStoredSection = () => {
    const storedSectionId = localStorage.getItem('current_scroll_section');
    if (storedSectionId) {
      const sectionElement = document.getElementById(storedSectionId);
      if (sectionElement) {
        setTimeout(() => {
          sectionElement.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
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
document.addEventListener('DOMContentLoaded', () => {
  const token = auth.getStoredToken();
  if (token) {
    playlistLoader.loadPlaylists();
  }
});