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

    playButton.addEventListener('click', playSong);
    pauseButton.addEventListener('click', pauseSong);
    nextButton.addEventListener('click', playNextSong);
    prevButton.addEventListener('click', playPrevSong);
    progressBar.addEventListener('input', seekSong);

    await getActiveDevice();
  };

  const getActiveDevice = async () => {
    const token = auth.getStoredToken();
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.devices && data.devices.length > 0) {
        deviceId = data.devices[0].id;
        console.log('Active device ID:', deviceId);
      } else {
        console.error('No active devices found');
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  window.onSpotifyWebPlaybackSDKReady = () => {
    const token = auth.getStoredToken();
    spotifyPlayer = new Spotify.Player({
      name: 'MoodMix Player',
      getOAuthToken: cb => { cb(token); },
      volume: 0.5
    });

    // Ready
    spotifyPlayer.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      deviceId = device_id;
    });

    // Not Ready
    spotifyPlayer.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Player state changed
    spotifyPlayer.addListener('player_state_changed', state => {
      if (!state) {
        console.error('User is not playing music through the Web Playback SDK');
        return;
      }

      const current_track = state.track_window.current_track;
      console.log('Currently Playing', current_track);
      updateFooterPlayer(current_track);
    });

    // Connect to the player!
    spotifyPlayer.connect().then(success => {
      if (success) {
        console.log('The Web Playback SDK successfully connected to Spotify!');
      }
    });
  };

  const playSong = async () => {
    if (!spotifyPlayer || currentPlaylist.length === 0) return;

    const song = currentPlaylist[currentSongIndex];
    const token = auth.getStoredToken();
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [song.preview_url],
          device_id: deviceId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      isPlaying = true;
      playButton.style.display = 'none';
      pauseButton.style.display = 'block';
      localStorage.setItem('current_song_index', JSON.stringify(currentSongIndex));
      footerPlayer.style.display = 'block';
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  const pauseSong = async () => {
    if (!spotifyPlayer) return;

    try {
      await spotifyPlayer.pause();
      isPlaying = false;
      playButton.style.display = 'block';
      pauseButton.style.display = 'none';
    } catch (error) {
      console.error('Error pausing song:', error);
    }
  };

  const playNextSong = async () => {
    if (!spotifyPlayer) return;

    try {
      await spotifyPlayer.nextTrack();
    } catch (error) {
      console.error('Error playing next song:', error);
    }
  };

  const playPrevSong = async () => {
    if (!spotifyPlayer) return;

    try {
      await spotifyPlayer.previousTrack();
    } catch (error) {
      console.error('Error playing previous song:', error);
    }
  };

  const seekSong = async (event) => {
    if (!spotifyPlayer) return;

    const position = event.target.value;
    try {
      await spotifyPlayer.seek(position);
    } catch (error) {
      console.error('Error seeking song:', error);
    }
  };

  const updateFooterPlayer = (song) => {
    footerPlayerDetails.querySelector('img').src = song.image;
    footerPlayerDetails.querySelector('span').textContent = song.name;
    footerPlayerDetails.querySelector('p').textContent = song.artist;
    footerPlayerDetails.querySelector('.player-title-album').textContent = `Playing from: ${song.playlist}`;
    durationDisplay.textContent = formatTime(song.duration_ms);
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const playSpecificSong = (playlist, songIndex) => {
    currentPlaylist = playlist;
    currentSongIndex = songIndex;
    const song = currentPlaylist[currentSongIndex];
    updateFooterPlayer(song);
    playSong();
    localStorage.setItem('current_playlist', JSON.stringify(currentPlaylist));
    localStorage.setItem('current_song_index', JSON.stringify(currentSongIndex));
  };

  return {
    initializePlayer,
    playSpecificSong,
    playSong,
    pauseSong
  };
})();

export default player;

// Initialize the player
document.addEventListener('DOMContentLoaded', () => {
  player.initializePlayer();
});
