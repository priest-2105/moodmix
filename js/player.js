const player = (() => {
  let currentPlaylist = [];
  let currentSongIndex = 0;
  let isPlaying = false;
  let audio = new Audio();

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

  const initializePlayer = () => {
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
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNextSong);
  };

  const playSong = () => {
    if (currentPlaylist.length === 0) return;
    const song = currentPlaylist[currentSongIndex];
    audio.src = song.preview_url;
    audio.play();
    isPlaying = true;
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';
    localStorage.setItem('current_song_index', JSON.stringify(currentSongIndex));
    footerPlayer.style.display = 'block';
  };

  const pauseSong = () => {
    audio.pause();
    isPlaying = false;
    playButton.style.display = 'block';
    pauseButton.style.display = 'none';
  };

  const playNextSong = () => {
    currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    const song = currentPlaylist[currentSongIndex];
    updateFooterPlayer(song);
    playSong();
  };

  const playPrevSong = () => {
    currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    const song = currentPlaylist[currentSongIndex];
    updateFooterPlayer(song);
    playSong();
  };

  const updateFooterPlayer = (song) => {
    footerPlayerDetails.querySelector('img').src = song.image;
    footerPlayerDetails.querySelector('span').textContent = song.name;
    footerPlayerDetails.querySelector('p').textContent = song.artist;
    footerPlayerDetails.querySelector('.player-title-album').textContent = `Playing from: ${song.playlist}`;
    durationDisplay.textContent = formatTime(song.duration_ms);
  };

  const updateProgress = () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    progressBar.value = (currentTime / duration) * 100;
    currentTimeDisplay.textContent = formatTime(currentTime * 1000);
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
    playSpecificSong
  };
})();

export default player;

// Initialize the player
document.addEventListener('DOMContentLoaded', () => {
  player.initializePlayer();
});
