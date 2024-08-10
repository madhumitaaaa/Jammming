import React, { useCallback } from "react";
import styles from './Track.css';

const Track = (props) => {
  const addTrack = useCallback(
    (event) => {
      props.onAdd(props.track);
    },// eslint-disable-next-line
    [props.onAdd, props.track]
  );

  const removeTrack = useCallback(
    (event) => {
      props.onRemove(props.track);
    },// eslint-disable-next-line
    [props.onRemove, props.track]
  );

  const renderAction = () => {
    if (props.isRemoval) {
      return (
        <button className={styles.trackAction} onClick={removeTrack}>
          -
        </button>
      );
    }
    return (
      <button className={styles.trackAction} onClick={addTrack}>
        +
      </button>
    );
  };

  return (
    <div className={styles.track}>
      <div className={styles.trackInformation}>
        <h3>{props.track.name}</h3>
        <p>
          {props.track.artist} | {props.track.album}
        </p>
        {props.track.preview_url && (
          <audio controls>
            <source src={props.track.preview_url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
      {renderAction()}
    </div>
  );
};

export default Track;
