// src/components/Navbar/index.js

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Button,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import { alpha, useTheme, styled, keyframes } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assests/logo/logo.png";

// 🎯 FIXED: Page load entrance animation from center
const enterFromCenter = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
`;

// 🎯 FIXED: Smooth shrink animation
const shrinkAnimation = keyframes`
  0% {
    transform: translateX(-50%) scale(1);
  }
  100% {
    transform: translateX(-50%) scale(0.95);
  }
`;

// 🎯 FIXED: Expand back animation
const expandAnimation = keyframes`
  0% {
    transform: translateX(-50%) scale(0.95);
  }
  100% {
    transform: translateX(-50%) scale(1);
  }
`;

const tabSwitch = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const pulseGlow = keyframes`
  0% {
    box-shadow: 0 8px 32px rgba(26, 201, 159, 0.08), 0 0 0 1px rgba(26, 201, 159, 0.05);
  }
  50% {
    box-shadow: 0 12px 40px rgba(26, 201, 159, 0.15), 0 0 0 1px rgba(26, 201, 159, 0.1);
  }
  100% {
    box-shadow: 0 8px 32px rgba(26, 201, 159, 0.08), 0 0 0 1px rgba(26, 201, 159, 0.05);
  }
`;

// 🎯 FIXED: Proper centering and positioning
const StyledAppBar = styled(AppBar)(({ theme, scrolled, isInitialLoad }) => ({
  background: scrolled 
    ? `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha('#f8f9fa', 0.95)} 100%)`
    : `linear-gradient(135deg, ${alpha('#ffffff', 0.9)} 0%, ${alpha('#f8f9fa', 0.8)} 100%)`,
  backdropFilter: scrolled ? "saturate(200%) blur(25px)" : "saturate(180%) blur(20px)",
  borderRadius: scrolled ? '18px' : '24px',
  
  // 🎯 FIXED: Proper centering with fixed positioning
  position: 'fixed',
  top: scrolled ? '8px' : '16px',
  left: '50%',
  transform: scrolled 
    ? 'translateX(-50%) scale(0.95)'
    : 'translateX(-50%) scale(1)',
  
  // 🎯 FIXED: Proper width without affecting centering
  width: scrolled ? '88%' : '90%',
  maxWidth: '1400px', // Prevent navbar from being too wide on large screens
  
  border: `1px solid ${alpha(scrolled ? '#1AC99F' : '#e9ecef', scrolled ? 0.2 : 0.8)}`,
  
  // 🎯 FIXED: Smooth transitions without jumping
  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
  
  // 🎯 FIXED: Dynamic shadows
  boxShadow: scrolled 
    ? `0 6px 25px ${alpha('#1AC99F', 0.12)}, 0 0 0 1px ${alpha('#1AC99F', 0.08)}`
    : `0 12px 40px ${alpha('#1AC99F', 0.1)}, 0 0 0 1px ${alpha('#e9ecef', 0.3)}`,
  
  // 🎯 FIXED: Page load animation
  animation: isInitialLoad 
    ? `${enterFromCenter} 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)` 
    : 'none',
  
  zIndex: 1100,
  
  // Enhanced hover without affecting position
  '&:hover': {
    boxShadow: `0 16px 50px ${alpha('#1AC99F', 0.2)}, 0 0 0 1px ${alpha('#1AC99F', 0.15)}`,
  },
}));

const NavButton = styled(Button)(({ theme, active, scrolled }) => ({
  position: 'relative',
  borderRadius: scrolled ? '14px' : '20px',
  padding: scrolled ? '6px 16px' : '8px 20px',
  margin: '0 4px',
  fontWeight: active ? 700 : 500,
  fontSize: scrolled ? '0.75rem' : '0.8rem',
  textTransform: 'none',
  fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  color: active ? '#1AC99F' : '#6c757d',
  background: active 
    ? `linear-gradient(135deg, ${alpha('#1AC99F', scrolled ? 0.2 : 0.15)} 0%, ${alpha('#4EDCB9', scrolled ? 0.15 : 0.1)} 100%)`
    : 'transparent',
  border: active ? `1px solid ${alpha('#1AC99F', scrolled ? 0.4 : 0.3)}` : '1px solid transparent',
  
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: active ? `${tabSwitch} 0.4s ease-out` : 'none',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${alpha('#4EDCB9', 0.3)}, transparent)`,
    transition: 'left 0.5s ease',
  },
  
  '&:hover': {
    background: active 
      ? `linear-gradient(135deg, ${alpha('#1AC99F', 0.25)} 0%, ${alpha('#4EDCB9', 0.2)} 100%)`
      : `linear-gradient(135deg, ${alpha('#f8f9fa', 0.8)} 0%, ${alpha('#4EDCB9', 0.1)} 100%)`,
    border: `1px solid ${alpha('#1AC99F', 0.4)}`,
    transform: 'translateY(-1px) scale(1.02)',
    color: '#1AC99F',
    
    '&::before': {
      left: '100%',
    },
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: scrolled ? '3px' : '5px',
    left: '50%',
    transform: `translateX(-50%) scaleX(${active ? 1 : 0})`,
    width: '70%',
    height: scrolled ? '1.5px' : '2px',
    borderRadius: '1px',
    background: `linear-gradient(90deg, #1AC99F, #4EDCB9)`,
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
}));

const CTAButton = styled(Button)(({ theme, scrolled }) => ({
  background: `linear-gradient(135deg, #1AC99F 0%, #0E9A78 100%)`,
  borderRadius: scrolled ? '14px' : '20px',
  padding: scrolled ? '7px 18px' : '10px 24px',
  fontWeight: 600,
  fontSize: scrolled ? '0.7rem' : '0.75rem',
  textTransform: 'none',
  fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  color: '#ffffff',
  border: 'none',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${alpha('#ffffff', 0.3)}, transparent)`,
    transition: 'left 0.6s ease',
  },
  
  '&:hover': {
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: `0 ${scrolled ? '6px' : '8px'} ${scrolled ? '16px' : '20px'} ${alpha('#1AC99F', 0.3)}`,
    background: `linear-gradient(135deg, #4EDCB9 0%, #1AC99F 100%)`,
    
    '&::before': {
      left: '100%',
    },
  },
  
  '&:active': {
    transform: 'translateY(0) scale(0.98)',
  },
}));

const LogoContainer = styled(Box)(({ theme, scrolled }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    transform: 'scale(1.05)',
  },
  
  '& img': {
    height: scrolled ? '30px' : '36px',
    width: 'auto',
    filter: scrolled 
      ? 'drop-shadow(0 1px 4px rgba(26, 201, 159, 0.3))'
      : 'drop-shadow(0 2px 8px rgba(26, 201, 159, 0.2))',
    transition: 'all 0.3s ease',
  },
}));

const MobileMenuButton = styled(IconButton)(({ theme, scrolled }) => ({
  color: '#1AC99F',
  border: `1px solid ${alpha('#1AC99F', 0.3)}`,
  borderRadius: scrolled ? '8px' : '12px',
  padding: scrolled ? '5px' : '8px',
  transition: 'all 0.3s ease',
  
  '&:hover': {
    background: alpha('#1AC99F', 0.1),
    transform: 'rotate(90deg)',
    borderColor: '#1AC99F',
  },
}));

// Define navigation pages
const PAGES = ["Home", "Company", "Solutions","sustainability-stories","projects", "Contact Us"];

const routeFor = (page) =>
  page.toLowerCase() === "home" ? "/" : `/${page.toLowerCase().replace(/\s+/g, "-")}`;

export default function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 🎯 FIXED: Smooth scroll detection
  useEffect(() => {
    // Handle initial page load animation
    const initialTimer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 80; // Increased threshold for better UX
      setScrolled(isScrolled);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    
    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (page) => location.pathname === routeFor(page);

  const handleNav = (page) => {
    setDrawerOpen(false);
    navigate(routeFor(page));
  };

  // Enhanced mobile drawer
  const drawer = (
    <Box sx={{ 
      width: 320, 
      height: '100%',
      background: `linear-gradient(180deg, #f8f9fa 0%, ${alpha('#4EDCB9', 0.1)} 100%)`,
    }}>
      {/* Drawer Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${alpha('#e9ecef', 0.8)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <LogoContainer onClick={() => handleNav("Home")} scrolled={false}>
          <img src={logo} alt="Logo" />
        </LogoContainer>
        <IconButton 
          onClick={() => setDrawerOpen(false)}
          sx={{
            color: '#1AC99F',
            border: `1px solid ${alpha('#1AC99F', 0.3)}`,
            borderRadius: '12px',
            '&:hover': {
              background: alpha('#1AC99F', 0.1),
              transform: 'rotate(90deg)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ px: 2, pt: 2 }}>
        {PAGES.map((page, index) => {
          const active = isActive(page);
          return (
            <ListItem key={page} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNav(page)}
                sx={{
                  borderRadius: '16px',
                  py: 1.5,
                  px: 2,
                  background: active 
                    ? `linear-gradient(135deg, ${alpha('#1AC99F', 0.15)} 0%, ${alpha('#4EDCB9', 0.1)} 100%)`
                    : 'transparent',
                  border: active ? `1px solid ${alpha('#1AC99F', 0.3)}` : '1px solid transparent',
                  animation: active ? `${tabSwitch} 0.4s ease-out` : 'none',
                  animationDelay: `${index * 0.1}s`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${alpha('#f8f9fa', 0.8)} 0%, ${alpha('#4EDCB9', 0.1)} 100%)`,
                    transform: 'translateX(8px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemText 
                  primary={page}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: active ? 700 : 500,
                      color: active ? '#1AC99F' : '#6c757d',
                      fontSize: '1rem',
                      fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    },
                  }}
                />
                {active && (
                  <ChevronRightRounded 
                    sx={{ 
                      color: '#1AC99F',
                      animation: `${enterFromCenter} 0.3s ease-out`,
                    }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 2, my: 3, borderColor: alpha('#e9ecef', 0.8) }} />
      
      {/* CTA in drawer */}
      <Box sx={{ px: 2 }}>
        <CTAButton
          fullWidth
          onClick={() => handleNav("Contact Us")}
          scrolled={false}
        >
          Book a Demo
        </CTAButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* 🎯 FIXED: Dynamic spacer that adjusts with navbar */}
      <Box sx={{ 
        height: scrolled ? '70px' : '90px', 
        transition: 'height 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)' 
      }} />

      <StyledAppBar 
        scrolled={scrolled}
        isInitialLoad={isInitialLoad}
        elevation={0}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            px: { xs: 2, sm: 3 },
            height: '100%',
          }}
        >
          <Toolbar 
            sx={{ 
              minHeight: scrolled ? '50px !important' : '60px !important',
              justifyContent: 'space-between',
              py: 0,
              transition: 'min-height 0.4s ease',
              height: '100%',
            }}
          >
            {/* 🎯 FIXED: Logo container with flex properties */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flexShrink: 0,
            }}>
              <LogoContainer onClick={() => handleNav("Home")} scrolled={scrolled}>
                <img src={logo} alt="Logo" />
              </LogoContainer>
            </Box>

            {/* 🎯 FIXED: Centered navigation with proper flex */}
            <Box sx={{ 
              display: { xs: "none", md: "flex" }, 
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              gap: scrolled ? 0.2 : 0.5,
              px: 2,
            }}>
              {PAGES.map((page) => (
                <NavButton
                  key={page}
                  active={isActive(page)}
                  scrolled={scrolled}
                  onClick={() => handleNav(page)}
                  disableRipple
                >
                  {page}
                </NavButton>
              ))}
            </Box>

            {/* 🎯 FIXED: Right side with consistent spacing */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: scrolled ? 1 : 1.5,
              flexShrink: 0,
            }}>
              {/* Desktop CTA */}
              <CTAButton 
                onClick={() => handleNav("Contact Us")}
                scrolled={scrolled}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                Book a Demo
              </CTAButton>

              {/* Mobile Menu Button */}
              <MobileMenuButton
                onClick={() => setDrawerOpen(true)}
                scrolled={scrolled}
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                <MenuIcon sx={{ fontSize: scrolled ? '1.1rem' : '1.4rem' }} />
              </MobileMenuButton>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            background: 'transparent',
            backdropFilter: 'blur(25px)',
          },
          '& .MuiBackdrop-root': {
            backgroundColor: alpha('#000000', 0.3),
            backdropFilter: 'blur(5px)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
