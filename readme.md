# MoodMix

MoodMix is a web application that integrates with Spotify to provide users with personalized playlists based on their moods. The application allows users to log in with their Spotify account, view their playlists, and explore new music.

## Features

- **User Authentication**: Log in with Spotify to access your playlists.
- **Playlist Management**: View, create, and manage your playlists.
- **Mood-Based Playlists**: Discover playlists curated based on different moods.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Music Player**: Integrated music player to listen to tracks directly within the app.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- A Spotify Developer account to obtain API credentials.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/priest2105/moodmix.git
   cd moodmix
   ```

2. Install dependencies:
   ```bash
   npm installer
   ```

3. Create a `.env` file in the root directory and add your Spotify API credentials:
   ```env
   SPOTIFY_APP_CLIENT_ID=your_spotify_client_id
   SPOTIFY_APP_REDIRECT_URI=http://localhost:5500/
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:5500`.

## Project Structure

```
moodmix/
├── css/
│   ├── styles.css
│   ├── footer-player.css
│   ├── main.css
│   ├── navbar-styles.css
│   ├── sidebar-styles.css
│   ├── section-styles.css
│   ├── login.css
│   ├── signup.css
│   ├── forgotpassword.css
├── js/
│   ├── auth.js
│   ├── forgotpassword.js
│   ├── login.js
│   ├── signup.js
│   ├── playlist-loader.js
│   ├── slider.js
│   ├── basic-responsiveness.js
│   ├── index.js
├── assets/
│   ├── images/
│   ├── icons/
├── dist/
├── index.html
├── webpack.config.js
├── .env
└── README.md
```

## Goals

- **Port Configuration**: Ensure the application consistently uses port 5500 for development.
- **Style Implementation**: Fix issues with CSS not being applied correctly.
- **Error Handling**: Improve error handling for API requests and user authentication.
- **User Experience**: Enhance the user interface and experience, especially for mobile users.

## Contributing

We welcome contributions! Please fork the repository and submit pull requests for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
