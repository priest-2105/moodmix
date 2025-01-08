import playlistLoader from './playlist-loader.js';

document.getElementById('searchInput').addEventListener('input', (event) => {
    const query = event.target.value;
    playlistLoader.filterPlaylists(query);
});
