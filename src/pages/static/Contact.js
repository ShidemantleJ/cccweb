// pages/Contact.js
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const Contact = () => {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', padding: 4, minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: 'auto', textAlign: "center" }}>
        <Typography variant="h3" sx={{ mb: 3 }}>Contact Us</Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>To get in touch with us regarding this competition, please email <a href="mailto: crimsoncubingclub@gmail.com">crimsoncubingclub@gmail.com</a> and include "Collegiate Cubing Championship" in the subject line.</Typography>
      </Paper>
    </Box>
  );
};

export default Contact;
