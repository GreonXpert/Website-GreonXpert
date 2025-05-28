// src/components/Navbar/index.js
import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import logo from '../../assests/logo/logo.png';

// Define navigation pages
const pages = ['Home','Contact Us',];

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (page) => {
    handleCloseNavMenu();
    setDrawerOpen(false);
    // Convert page name to route (lowercase and replace spaces with hyphens)
    const route = page.toLowerCase() === 'home' ? '/' : `/${page.toLowerCase().replace(/\s+/g, '-')}`;
    navigate(route);
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {pages.map((page) => (
          <ListItem key={page} disablePadding>
            <ListItemButton onClick={() => handleNavigation(page)}>
              <ListItemText primary={page} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Spacing to prevent content from being hidden behind fixed navbar */}
      <Box sx={{ height: { xs: '70px', md: '80px' } }} />

      <AppBar 
        position="fixed" 
        elevation={scrolled ? 4 : 0}
        sx={{ 
          bgcolor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
          transition: 'all 0.3s ease-in-out',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo for desktop */}
            <Box
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <img 
                src={logo} 
                alt="GeronXpert Logo" 
                style={{ 
                  height: '40px', 
                  width: 'auto',
                  transition: 'all 0.3s ease-in-out'
                }} 
              />
            </Box>

            {/* Mobile menu icon */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerToggle}
                sx={{ 
                  color: scrolled ? 'text.primary' : 'white',
                  transition: 'color 0.3s ease-in-out'
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo for mobile - smaller size */}
            <Box
              component="a"
              href="/"
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <img 
                src={logo} 
                alt="GeronXpert Logo" 
                style={{ 
                  height: '28px', 
                  width: 'auto',
                  transition: 'all 0.3s ease-in-out'
                }} 
              />
            </Box>

            {/* Desktop navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleNavigation(page)}
                  sx={{ 
                    my: 2, 
                    mx: 1, 
                    color: scrolled ? 'text.primary' : '', 
                    display: 'block',
                    transition: 'color 0.3s ease-in-out',
                    '&:hover': {
                      bgcolor: scrolled ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;