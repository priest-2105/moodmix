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
        if (!container) {
            console.error('Container not found');
            return;
        }
        container.innerHTML = ''; 

        playlists.forEach((playlist, index) => {
            const playlistCard = createPlaylistCard(playlist, index);
            container.appendChild(playlistCard);
        });

        addPlaylistClickHandlers();
    };

    const createPlaylistCard = (playlist, index) => {
        const card = document.createElement('div');
        card.className = 'playlist-card';
        card.className = 'oneslide';
        card.setAttribute('data-playlist-id', playlist.id);
        card.innerHTML = `
            <img src="${playlist.images[0]?.url || './assets/images/default-playlist.png'}" alt="${playlist.name}">
            <h3>${playlist.name}</h3>
            <p>${playlist.tracks.total} tracks</p>
        `;
        return card;
    };

    const addPlaylistClickHandlers = () => {
        document.querySelectorAll('.playlist-card').forEach(card => {
            card.addEventListener('click', async (event) => {
                console.log('Playlist card clicked');
                const playlistId = card.getAttribute('data-playlist-id');
                if (playlistId) {
                    await displayPlaylistDetails(playlistId);
                }
            });
        });
    };

    const displayPlaylistDetails = async (playlistId) => {
        console.log('Displaying playlist details for ID:', playlistId);
        const token = auth.getStoredToken();
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const playlist = await response.json();
            const detailsContainer = document.querySelector('.playlist-details-container');
            
            if (!detailsContainer) {
                console.error('Playlist details container not found');
                return;
            }

            detailsContainer.innerHTML = `
                <button class="back-to-main"><i class="bi bi-arrow-left"></i> Back to Playlists</button>
                <div class="playlist-details-container-top">
                    <div class="playlist-details-container-top-inner">
                        <div class="playlist-details-container-top-img" style="background-image: url('${playlist.images[0]?.url || './assets/images/default-playlist.png'}');"></div>
                        <div class="playlist-details-container-top-inner-right">
                            <p>Playlist</p>
                            <h2 class="roboto-black">${playlist.name}</h2>
                            <div class="playlist-details-container-top-inner-right-info">
                                <p>${playlist.owner.display_name}, </p>
                                <p>${playlist.tracks.total} songs, </p>
                                <p>${formatDuration(playlist.tracks.items.reduce((acc, item) => acc + item.track.duration_ms, 0))}</p>
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
                            <h3>Album</h3>
                            <h3><i class="bi bi-clock"></i></h3>
                        </div>
                        ${playlist.tracks.items.map((item, index) => `
                            <div class="playlist-details-container-bottom-inner-text">
                                <p>${index + 1}</p>
                                <p><b>${item.track.name}</b><br/>${item.track.artists.map(artist => artist.name).join(', ')}</p>
                                <p>${item.track.album.name}</p>
                                <p>${formatDuration(item.track.duration_ms)}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            const mainContent = document.querySelector('.inner-main-content');
            if (mainContent) {
                mainContent.style.display = 'none';
            }
            detailsContainer.style.display = 'block';

            document.querySelector('.back-to-main').addEventListener('click', () => {
                detailsContainer.style.display = 'none';
                if (mainContent) {
                    mainContent.style.display = 'block';
                }
            });

            localStorage.setItem('last_viewed_playlist', playlistId);
        } catch (error) {
            console.error('Error loading playlist details:', error);
            displayErrorState('Failed to load playlist details. Please try again later.');
        }
    };

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    const displayEmptyState = () => {
        const container = document.querySelector('.inner-main-content');
        if (container) {
            container.innerHTML = '<p>No playlists found. Start creating playlists on Spotify to see them here!</p>';
        }
    };

    const displayErrorState = (message) => {
        const container = document.querySelector('.inner-main-content');
        if (container) {
            container.innerHTML = `<p class="error-message">${message}</p>`;
        }
    };

    return {
        loadPlaylists,
        displayPlaylistDetails
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    playlistLoader.loadPlaylists();

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const lastViewedPlaylist = localStorage.getItem('last_viewed_playlist');
        if (lastViewedPlaylist) {
            playlistLoader.displayPlaylistDetails(lastViewedPlaylist);
        } else {
            const detailsContainer = document.querySelector('.playlist-details-container');
            const mainContent = document.querySelector('.inner-main-content');
            if (detailsContainer) {
                detailsContainer.style.display = 'none';
            }
            if (mainContent) {
                mainContent.style.display = 'block';
            }
        }
    });
});

export default playlistLoader;