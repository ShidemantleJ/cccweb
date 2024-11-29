import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  const pathname = useLocation().pathname.toLowerCase();
  if (
    (pathname.includes('/team') && !pathname.includes('/teamstatistics')) ||
    pathname.includes('/judge') ||
    pathname.includes('/streamstats')
  )
    return null;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Brackets', path: '/brackets' },
    { label: 'Statistics', path: '/statistics' },
  ];

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navLinks.map((link) => (
          <ListItem button component={Link} to={link.path} key={link.label}>
            <ListItemText primary={link.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#1a1a1a' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'white',
            }}
          >
            Collegiate Cubing Championship
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            {navLinks.map((link) => (
              <Typography
                key={link.label}
                component={Link}
                to={link.path}
                sx={{
                  textDecoration: 'none',
                  color: 'white',
                  '&:hover': {
                    color: '#cccccc',
                  },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ display: { sm: 'none' } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
