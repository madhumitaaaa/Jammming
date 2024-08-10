let accessToken;
let userId; // New variable to store user ID

const getAccessToken = () => {
  if (accessToken) {
    return accessToken;
  }

  const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
  const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
  if (accessTokenMatch && expiresInMatch) {
    accessToken = accessTokenMatch[1];
    const expiresIn = Number(expiresInMatch[1]);
    window.setTimeout(() => accessToken = '', expiresIn * 1000);
    window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
    return accessToken;
  } else {
    const clientId = 'a4b7a2238353400897125a170da0468e'; // Insert client ID here.
    const redirectUri = 'http://localhost:3000/callback'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
    const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public playlist-read-private&redirect_uri=${redirectUri}`;
    window.location = accessUrl;
  }
};

const getCurrentUserId = () => {
  if (userId) {
    return Promise.resolve(userId);
  }

  const token = getAccessToken();
  return fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(jsonResponse => {
    userId = jsonResponse.id;
    return userId;
  });
};

const getUserPlaylists = () => {
  return getCurrentUserId()
    .then(userId => {
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    })
    .then(response => response.json())
    .then(jsonResponse => {
      if (!jsonResponse.items) {
        return [];
      }
      return jsonResponse.items.map(playlist => ({
        id: playlist.id,
        name: playlist.name
      }));
    });
};

const savePlaylist = (name, trackUris, playlistId = null) => {
  if (!name || !trackUris.length) {
    return;
  }

  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };

  if (playlistId) {
    // Update existing playlist
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: headers,
      method: 'PUT',
      body: JSON.stringify({ name: name })
    }).then(response => response.json())
    .then(() => {
      return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: headers,
        method: 'PUT',
        body: JSON.stringify({ uris: trackUris })
      });
    });
  } else {
    // Create a new playlist
    return fetch('https://api.spotify.com/v1/me', {headers: headers})
    .then(response => response.json())
    .then(jsonResponse => {
      const userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ name: name })
      }).then(response => response.json())
      .then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ uris: trackUris })
        });
      });
    });
  }
};

const getPlaylist = (id) => {
  const token = getAccessToken();
  return fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(response => response.json())
  .then(jsonResponse => {
    if (!jsonResponse) {
      return { name: '', tracks: [] };
    }
    return {
      name: jsonResponse.name,
      tracks: jsonResponse.tracks.items.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        uri: item.track.uri
      }))
    };
  });
};

export { getAccessToken, getCurrentUserId, getUserPlaylists, savePlaylist, getPlaylist };
