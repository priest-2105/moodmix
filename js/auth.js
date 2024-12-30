const auth = (() => {
  const CLIENT_ID = "2b7acb2ab7554292938c8643bae198f6";
  const REDIRECT_URI = "http://localhost:5500/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const SCOPES = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-modify-private",
  ];

  const getLoginURL = () => {
    return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES.join(" "))}&response_type=${RESPONSE_TYPE}`;
  };

  const getToken = () => {
    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce((initial, item) => {
        if (item) {
          const parts = item.split("=");
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});
    return hash.access_token;
  };

  const setToken = (token, expiry) => {
    localStorage.setItem("spotify_token", token);
    localStorage.setItem("spotify_token_expiry", expiry);
  };

  const getStoredToken = () => {
    const token = localStorage.getItem("spotify_token");
    const expiry = localStorage.getItem("spotify_token_expiry");
    if (new Date().getTime() > expiry) {
      removeToken();
      return null;
    }
    return token;
  };

  const removeToken = () => {
    localStorage.removeItem("spotify_token");
    localStorage.removeItem("spotify_token_expiry");
  };

  const isAuthenticated = () => {
    return !!getStoredToken();
  };

  return {
    getLoginURL,
    getToken,
    setToken,
    getStoredToken,
    removeToken,
    isAuthenticated,
  };
})();

export default auth;