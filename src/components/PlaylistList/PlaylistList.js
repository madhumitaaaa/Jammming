import React, { useState, useEffect } from 'react';
import { getUserPlaylists } from '../../util/Spotify'; // Import named export
import PlaylistListItem from '../PlaylistListItem/PlaylistListItem';
import styles from './PlaylistList.css';

const PlaylistList = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    getUserPlaylists().then(setPlaylists);
  }, []);

  return (
    <div className={styles.playlistList}>
      {playlists.map(playlist => (
        <PlaylistListItem key={playlist.id} playlist={playlist} onSelect={() => {/* Handle selection */}} />
      ))}
    </div>
  );
};

export default PlaylistList;
