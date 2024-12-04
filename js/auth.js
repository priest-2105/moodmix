const auth = (() => {
  const CLIENT_ID = " "; 
  const REDIRECT_URI = "http://127.0.0.1:5500/index.html"; 
  const AUTH_URL = "https://accounts.spotify.com/authorize";
  const TOKEN_URL = "https://accounts.spotify.com/api/token";

  const SCOPES = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-modify-private",
  ];

  // Build Spotify Authorization URL
  const getAuthURL = () => {
    const scopes = SCOPES.join(" ");
    return `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(scopes)}`;
  };

  // Save token to localStorage
  const saveToken = (token) => {
    localStorage.setItem("spotifyAuthToken", token);
  };

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("spotifyAuthToken");
  };

  // Exchange authorization code for access token
  const fetchToken = async (code) => {
    try {
      const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          client_secret: "your_spotify_client_secret", // Replace with your Spotify Client Secret
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }

      const data = await response.json();
      saveToken(data.access_token);
      return data;
    } catch (error) {
      console.error(error.message);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("spotifyAuthToken");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!getToken();
  };

  return {
    getAuthURL,
    fetchToken,
    logout,
    isAuthenticated,
  };
})();

export default auth;
