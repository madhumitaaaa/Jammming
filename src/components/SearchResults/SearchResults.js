import React from "react";

import "./SearchResults.css";

import Tracklist from "../TrackList/Tracklist";

const SearchResults = (props) => {
  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <Tracklist tracks={props.searchResults} onAdd={props.onAdd} />
    </div>
  );
};

export default SearchResults;