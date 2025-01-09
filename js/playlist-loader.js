import auth from './auth.js';
import player from './player.js';

const playlistLoader = (() => {
  let allPlaylists = [];

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
        allPlaylists = data.items;
        displayPlaylists(allPlaylists);
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

    // Clear existing content
    container.innerHTML = '';
    sidebarNav.innerHTML = '';

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
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
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

      const totalDuration = playlist.tracks.items.reduce((acc, item) => acc + item.track.duration_ms, 0);
      const totalDurationMinutes = Math.floor(totalDuration / 60000);
      const totalDurationSeconds = ((totalDuration % 60000) / 1000).toFixed(0).padStart(2, '0');

      const playlistImage = new Image();
      playlistImage.src = playlist.images && playlist.images[0] ? playlist.images[0].url : './assets/images/default-playlist.png';
      playlistImage.crossOrigin = 'Anonymous';
      playlistImage.onload = () => {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(playlistImage);
        const gradientColor = `linear-gradient(to bottom, rgba(${dominantColor.join(',')}, 0.8) 14%, rgba(0, 0, 0, 0.8) 100%)`;
        playlistDetails.style.backgroundImage = gradientColor;
      };

      playlistDetails.innerHTML = `
        <div class="playlist-details-container-top">
          <div class="playlist-details-container-top-inner">
            <div class="playlist-details-container-top-img" style="background-image: url('${playlist.images && playlist.images[0] ? playlist.images[0].url : './assets/images/default-playlist.png'}');"></div>
            <div class="playlist-details-container-top-inner-right">
              <p>PlayList</p>
              <h2 class="roboto-black">${playlist.name}</h2>
              <div class="playlist-details-container-top-inner-right-info">
                <p>${new Date(playlist.created_at).getFullYear()}, </p>
                <p> ${playlist.tracks.total} Songs,</p>
                <p> ${totalDurationMinutes} min ${totalDurationSeconds} sec</p>
              </div> 
            </div>
          </div>
          <div class="playlist-details-container-top-controls">
            <div class="playlist-details-playpausebtn">
              <button class="play-btn"><i class="bi bi-play-fill"></i></button>
            </div>
            <button class="shuffle-button"><i class="bi bi-shuffle"></i></button>
          </div>
        </div>
        <div class="playlist-details-container-bottom">
          <div class="playlist-details-container-bottom-inner">
            <div class="playlist-details-container-bottom-inner-title">
              <h3>No</h3>
              <h3>Title</h3>
              <h3>Plays</h3>
              <h3><i class="bi bi-clock"></i></h3> 
            </div>
            ${playlist.tracks.items.map((item, index) => `
              <div class="playlist-details-container-bottom-inner-text" data-song-index="${index}">
                <p>${index + 1}</p>
                <p><b>${item.track.name}</b><br/> ${item.track.artists.map(artist => artist.name).join(', ')}</p>
                <p>${item.track.popularity}</p>
                <p>${Math.floor(item.track.duration_ms / 60000)}:${((item.track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}</p>
              </div>
            `).join('')}
          </div>
        </div>
        <button class="back-to-main">Back to Main</button>
        <div class="inner-main-content-bottom-filler"></div>
      `;

      // Store the current playlist ID in local storage
      localStorage.setItem('current_playlist_id', playlistId);

      document.querySelector('.back-to-main').addEventListener('click', () => {
        playlistDetails.style.display = 'none';
        mainContent.style.display = 'block';
      });

      // Add event listeners for navigation arrows
      document.querySelector('.back-arrow').addEventListener('click', () => {
        const storedSection = localStorage.getItem('current_scroll_section');
        if (storedSection) {
          playlistDetails.style.display = 'none';
          mainContent.style.display = 'block';
          document.getElementById(storedSection).scrollIntoView({ behavior: 'smooth' });
        }
      });

      document.querySelector('.forward-arrow').addEventListener('click', () => {
        const storedSearchQuery = localStorage.getItem('current_search_query');
        if (storedSearchQuery) {
          filterPlaylists(storedSearchQuery);
        }
      });

      addSongClickHandlers(playlist);
    } catch (error) {
      console.error('Error loading playlist details:', error);
      displayErrorState('Failed to load playlist details. Please try again later.');
    }
  };

  const addSongClickHandlers = (playlist) => {
    document.querySelectorAll('.playlist-details-container-bottom-inner-text').forEach(songElement => {
      songElement.addEventListener('click', () => {
        const songIndex = parseInt(songElement.getAttribute('data-song-index'), 10);
        const playlistTracks = playlist.tracks.items.map(item => ({
          name: item.track.name,
          artist: item.track.artists.map(artist => artist.name).join(', '),
          duration_ms: item.track.duration_ms,
          preview_url: item.track.preview_url,
          image: (playlist.images && playlist.images[0]) ? playlist.images[0].url : './assets/images/default-playlist.png',
          playlist: playlist.name
        }));
        player.playSpecificSong(playlistTracks, songIndex);
      });
    });
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

  const filterPlaylists = (query) => {
    const playlists = JSON.parse(localStorage.getItem('user_playlists')) || [];
    const resultsContainer = document.querySelector('.search-results-container');
    const mainContent = document.querySelector('.inner-main-content');
    const playlistDetails = document.querySelector('.playlist-details-container');

    if (query.trim() === '') {
        resultsContainer.style.display = 'none';
        mainContent.style.display = 'block';
        playlistDetails.style.display = 'none';
        return;
    }

    const filteredPlaylists = playlists.filter(playlist => 
        playlist.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredPlaylists.length > 0) {
        resultsContainer.innerHTML = filteredPlaylists.map(playlist => `
            <div class="search-results-card" data-playlist-id="${playlist.id}">
                <img src="${playlist.images && playlist.images[0] ? playlist.images[0].url : './assets/images/default-playlist.png'}" alt="${playlist.name}">
                <div class="card-content">
                    <h3>${playlist.name}</h3>
                    <p>${playlist.tracks.total} tracks</p>
                </div>
            </div>
        `).join('');
    } else {
        resultsContainer.innerHTML = '<div class="no-results-message">No playlist matches the search result</div>';
    }

    resultsContainer.style.display = 'flex';
    mainContent.style.display = 'none';
    playlistDetails.style.display = 'none';

    localStorage.setItem('current_search_query', query);
    localStorage.setItem('search_active', 'true');
    addSearchResultClickHandlers();
  };

  const addSearchResultClickHandlers = () => {
    document.querySelectorAll('.search-results-card').forEach(card => {
        card.addEventListener('click', async (event) => {
            const playlistId = card.getAttribute('data-playlist-id');
            if (playlistId) {
                await displayPlaylistDetails(playlistId);
            }
        });
    });
  };

  return {
    loadPlaylists,
    filterPlaylists
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