import auth from './auth.js';

const playlistLoader = (() => {
  const fetchUserPlaylists = async () => {
    try {
      return await auth.getUserPlaylists();
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return null;
    }
  };

  const createPlaylistCard = (playlist) => `
    <div class="inner-main-section-card glide__slide">
      <div class="inner-main-secton-card-banner" style="background-image: url('${playlist.images[0]?.url || './assets/images/placeholder.png'}');"></div>
      <div class="inner-main-secton-card-description">
        <div class="inner-main-secton-card-description-filler"></div>
        <div class="inner-main-secton-card-description-inner">
          <button> <i class="bi bi-play-fill"></i> </button>
          <span>${playlist.type}</span>
          <h3>${playlist.name}</h3>
          <p>${playlist.description || 'No description'}</p>
        </div>
      </div>
    </div>
  `;

  const updatePlaylistsUI = async () => {
    const playlistsContainer = document.querySelector('.glide__slides');
    if (!playlistsContainer) {
      console.error('Playlists container not found');
      return;
    }

    const playlists = await fetchUserPlaylists();
    if (!playlists) {
      console.error('Failed to fetch playlists');
      return;
    }

    playlistsContainer.innerHTML = playlists.items.map(createPlaylistCard).join('');

    // Reinitialize Glide.js
    new Glide('.glide').mount();
  };

  return {
    updatePlaylistsUI
  };
})();

export default playlistLoader;