const auth = (() => {
  const CLIENT_ID = "2b7acb2ab7554292938c8643bae198f6";
  const CLIENT_SECRET = "e1017af42cd94f0ba4e963811d079313";
  const REDIRECT_URI = "moodmix.com";
  const AUTH_URL = "https://accounts.spotify.com/authorize";
  const TOKEN_URL = "https://accounts.spotify.com/api/token";

  const SCOPES = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-modify-private",
  ];

  const getAuthURL = () => {
    const scopes = SCOPES.join(" ");
    return `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(scopes)}`;
  };

  const saveToken = (token) => {
    localStorage.setItem("spotifyAuthToken", token);
  };

  const getToken = () => {
    return localStorage.getItem("spotifyAuthToken");
  };

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
          client_secret: CLIENT_SECRET,
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

  const logout = () => {
    localStorage.removeItem("spotifyAuthToken");
  };

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