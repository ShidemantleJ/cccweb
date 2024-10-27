
import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';

const MatchSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mb: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        label="Search matches"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Enter team name or match date..."
        size="medium"
      />
    </Box>
  );
};

export default MatchSearch;
