import React, { useState, useCallback } from "react";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import PlaylistList from '../PlaylistList/PlaylistList';
import { getAccessToken, getCurrentUserId } from "../../util/Spotify";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import './App.css';

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);  // State for loading spinner

  const search = useCallback((term) => {
    getAccessToken();  // Ensure the access token is set
    fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    })
    .then(response => response.json())
    .then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    })
    .then(setSearchResults);
  }, []);

  const addTrack = useCallback(
    (track) => {
      if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
        return;

      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
    },
    [playlistTracks]
  );

  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((currentTrack) => currentTrack.id !== track.id)
    );
  }, []);

  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
  }, []);

  const savePlaylist = useCallback(async () => {
    setIsSaving(true);  // Show loading spinner
    const trackUris = playlistTracks.map((track) => track.uri);
    await savePlaylist(playlistName, trackUris, selectedPlaylistId);
    setPlaylistName("New Playlist");
    setPlaylistTracks([]);
    setSelectedPlaylistId(null);
    setIsSaving(false);  
  }, [playlistName, playlistTracks, selectedPlaylistId]);

  // eslint-disable-next-line 
  const selectPlaylist = useCallback((id) => {
    getCurrentUserId().then(userId => {
      return fetch(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` }
      });
    })
    .then(response => response.json())
    .then(playlist => {
      setPlaylistName(playlist.name);
      setPlaylistTracks(playlist.tracks.items.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        uri: item.track.uri
      })));
      setSelectedPlaylistId(id);
    });
  }, []);

  

  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} playlistTracks={playlistTracks} onAdd={addTrack} />
          {isSaving ? (
            <LoadingSpinner />
          ) : (
            <Playlist
              playlistName={playlistName}
              playlistTracks={playlistTracks}
              onNameChange={updatePlaylistName}
              onRemove={removeTrack}
              onSave={savePlaylist}
            />
          )}
        </div>
        <PlaylistList /> {/* Render PlaylistList component */}
      </div>
    </div>
  );
};

export default App;
