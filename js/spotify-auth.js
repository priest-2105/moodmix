// Spotify API credentials
const clientId = ''; // Replace with your Spotify Client ID
const redirectUri = 'http://localhost:3000/callback'; // Replace with your redirect URI

// Function to initiate Spotify OAuth flow
function loginWithSpotify() {
    const scopes = 'user-read-private user-read-email playlist-read-private';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
    window.location.href = authUrl;
}

// Function to handle the OAuth callback
function handleCallback() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
        // Save the access token to local storage
        localStorage.setItem('spotify_access_token', accessToken);
        // Fetch user profile and save to local storage
        fetchUserProfile(accessToken);
    }
}

// Function to fetch user profile from Spotify
async function fetchUserProfile(accessToken) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        // Save user profile to local storage
        localStorage.setItem('user_profile', JSON.stringify(data));
        updateUIWithUserInfo(data);
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

// Function to update UI with user info
function updateUIWithUserInfo(userProfile) {
    const profileSection = document.querySelector('.profile-section');
    if (profileSection) {
        profileSection.innerHTML = `
            <img src="${userProfile.images[0]?.url || './assets/images/profile-img.png'}" alt="${userProfile.display_name}">
            <span>${userProfile.display_name}</span>
        `;
    }
}

// Function to fetch and store user's playlists
async function fetchAndStoreUserPlaylists(accessToken) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        // Store playlists in local storage
        localStorage.setItem('user_playlists', JSON.stringify(data.items));
        // Update UI with playlists
        updateUIWithPlaylists(data.items);
    } catch (error) {
        console.error('Error fetching user playlists:', error);
    }
}

// Function to update UI with playlists
function updateUIWithPlaylists(playlists) {
    const playlistsContainer = document.querySelector('.inner-main-section-tile .glide__slides');
    if (playlistsContainer) {
        playlistsContainer.innerHTML = playlists.map(playlist => `
            <div class="inner-main-section-card glide__slide">
                <div class="inner-main-secton-card-banner" style="background-image: url('${playlist.images[0]?.url || './assets/images/placeholder.png'}');"></div>
                <div class="inner-main-secton-card-description">
                    <div class="inner-main-secton-card-description-filler"></div>
                    <div class="inner-main-secton-card-description-inner">
                        <button><i class="bi bi-play-fill"></i></button>
                        <span>${playlist.type}</span>
                        <h3>${playlist.name}</h3>
                        <p>${playlist.description || 'No description available'}</p>
                    </div>
                </div>
            </div>
        `).join('');

        // Reinitialize Glide.js
        new Glide('.glide').mount();
    }
}

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (accessToken) {
        const userProfile = JSON.parse(localStorage.getItem('user_profile'));
        if (userProfile) {
            updateUIWithUserInfo(userProfile);
        } else {
            fetchUserProfile(accessToken);
        }
        fetchAndStoreUserPlaylists(accessToken);
    }

    // Add login button event listener
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', loginWithSpotify);
    }

    // Handle OAuth callback
    if (window.location.hash) {
        handleCallback();
    }
});