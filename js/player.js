import auth from './auth.js';

const player = (() => {
  let currentPlaylist = [];
  let currentSongIndex = 0;
  let isPlaying = false;
  let deviceId = null;
  let spotifyPlayer = null;

  const footerPlayer = document.querySelector('.bottom-music-player');
  const footerPlayerDetails = footerPlayer.querySelector('.bottom-music-player-music-details');
  const footerPlayerControls = footerPlayer.querySelector('.bottom-music-player-music-player-controls');
  const playButton = footerPlayerControls.querySelector('.play-button');
  const pauseButton = footerPlayerControls.querySelector('.pause-button');
  const nextButton = footerPlayerControls.querySelector('.next-skip-button');
  const prevButton = footerPlayerControls.querySelector('.prev-skip-button');
  const progressBar = footerPlayerControls.querySelector('input[type="range"]');
  const currentTimeDisplay = footerPlayerControls.querySelector('.bottom-music-player-music-player-controls-inner-bottom p:first-child');
  const durationDisplay = footerPlayerControls.querySelector('.bottom-music-player-music-player-controls-inner-bottom p:last-child');

  const initializePlayer = async () => {
    const storedPlaylist = JSON.parse(localStorage.getItem('current_playlist'));
    const storedSongIndex = JSON.parse(localStorage.getItem('current_song_index'));
    if (storedPlaylist && storedSongIndex !== null) {
      currentPlaylist = storedPlaylist;
      currentSongIndex = storedSongIndex;
      const song = currentPlaylist[currentSongIndex];
      updateFooterPlayer(song);
    } else {
      footerPlayer.style.display = 'none';
    }

    playButton.addEventListener('click', togglePlay);
    pauseButton.addEventListener('click', togglePlay);
    nextButton.addEventListener('click', playNextSong);
    prevButton.addEventListener('click', playPrevSong);
    progressBar.addEventListener('input', seekSong);

    await initializeSpotifySDK();
  };

  const initializeSpotifySDK = async () => {
    const token = auth.getStoredToken();
    if (!token) {
      console.error('No token found');
      return;
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      spotifyPlayer = new Spotify.Player({
        name: 'MoodMix Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      // Ready
      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        deviceId = device_id;
        transferPlayback(device_id);
      });

      // Not Ready
      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Player state changed
      spotifyPlayer.addListener('player_state_changed', state => {
        if (!state) {
          isPlaying = false;
          updatePlayPauseButton();
          return;
        }

        isPlaying = !state.paused;
        updatePlayPauseButton();
        
        const current_track = state.track_window.current_track;
        updateFooterPlayer({
          name: current_track.name,
          artist: current_track.artists[0].name,
          image: current_track.album.images[0].url,
          duration_ms: current_track.duration_ms,
          playlist: currentPlaylist[currentSongIndex]?.playlist || 'Unknown Playlist'
        });

        // Update progress bar
        progressBar.max = state.duration;
        progressBar.value = state.position;
        currentTimeDisplay.textContent = formatTime(state.position);
      });

      spotifyPlayer.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      });
    };
  };

  const transferPlayback = async (deviceId) => {
    const token = auth.getStoredToken();
    try {
      await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: false
        })
      });
    } catch (error) {
      console.error('Error transferring playback:', error);
    }
  };

  const togglePlay = async () => {
    if (!spotifyPlayer) return;

    try {
      await spotifyPlayer.togglePlay();
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const playNextSong = async () => {
    if (!spotifyPlayer) return;

    try {
      await spotifyPlayer.nextTrack();
      currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
      localStorage.setItem('current_song_index', JSON.stringify(currentSongIndex));
    } catch (error) {
      console.error('Error playing next song:', error);
    }
  };

  const playPrevSong = async () => {
    if (!spotifyPlayer) return;

    try {
      await spotifyPlayer.previousTrack();
      currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
      localStorage.setItem('current_song_index', JSON.stringify(currentSongIndex));
    } catch (error) {
      console.error('Error playing previous song:', error);
    }
  };

  const seekSong = async (event) => {
    if (!spotifyPlayer) return;

    const position = parseInt(event.target.value);
    try {
      await spotifyPlayer.seek(position);
    } catch (error) {
      console.error('Error seeking song:', error);
    }
  };

  const updatePlayPauseButton = () => {
    playButton.style.display = isPlaying ? 'none' : 'block';
    pauseButton.style.display = isPlaying ? 'block' : 'none';
  };

  const updateFooterPlayer = (song) => {
    footerPlayerDetails.querySelector('img').src = song.image;
    footerPlayerDetails.querySelector('span').textContent = song.name;
    footerPlayerDetails.querySelector('p').textContent = song.artist;
    footerPlayerDetails.querySelector('.player-title-album').textContent = `Playing from: ${song.playlist}`;
    durationDisplay.textContent = formatTime(song.duration_ms);
    footerPlayer.style.display = 'block';
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const playSpecificSong = async (playlist, songIndex) => {
    if (!spotifyPlayer || !deviceId) {
      console.error('Player not ready');
      return;
    }

    currentPlaylist = playlist;
    currentSongIndex = songIndex;
    const song = currentPlaylist[currentSongIndex];

    const token = auth.getStoredToken();
    try {
      await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [song.uri],
          device_id: deviceId
        })
      });

      localStorage.setItem('current_playlist', JSON.stringify(currentPlaylist));
      localStorage.setItem('current_song_index', JSON.stringify(currentSongIndex));
    } catch (error) {
      console.error('Error playing specific song:', error);
    }
  };

  return {
    initializePlayer,
    playSpecificSong,
    togglePlay
  };
})();

export default player;

// Initialize the player
document.addEventListener('DOMContentLoaded', () => {
  player.initializePlayer();
});