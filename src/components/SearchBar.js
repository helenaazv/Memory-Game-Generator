import React from 'react';

const SearchBar = ({ query, setQuery, fetchImages, loading }) => (
  <div className="search-bar">
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Type a topic"
    />
    <button onClick={fetchImages} disabled={loading || !query} className="btn btn-pink">
      {loading ? 'Loading...' : 'Generate Game'}
    </button>
  </div>
);

export default SearchBar;
