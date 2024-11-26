import React, {useState} from 'react';
import './TeamSearch.css';

function TeamSearch({data}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
  
    const handleInputChange = (event) => {
      const value = event.target.value;
      setSearchTerm(value);
  
      if (value === '') {
        setSuggestions(data);
      } else {
        const filteredSuggestions = data.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
      }
    };
  
    const handleSuggestionClick = (suggestion) => {
      setSearchTerm(suggestion);
      window.location.href = `/teamstatistics/${suggestion}`;
      setSuggestions([]);
    };

    const handleInputFocus = () => {
      setSuggestions(data);
    };

    const handleInputBlur = () => {
      setTimeout(() => {
        setSuggestions([]);
      }, 100);
    };
  
    return (
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Team Search..."
          className="search-input"
        /> 
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion) => (
              <li 
                key={suggestion} 
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    );

}export default TeamSearch;