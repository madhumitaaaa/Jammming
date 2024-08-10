import React from 'react';
import styles from './PlaylistListItem.css';

const PlaylistListItem = ({ id, name, onSelect }) => {
  return (
    <li className={styles.playlistListItem} onClick={() => onSelect(id)}>
      {name}
    </li>
  );
};

export default PlaylistListItem;
