import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  return (
    <section className="App-search">
      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="검색어를 입력하세요" 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearchClick}>검색</button>
      </div>
    </section>
  );
};

export default SearchBar;
