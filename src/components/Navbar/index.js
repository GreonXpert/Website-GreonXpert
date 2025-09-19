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

// Animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

// Custom styled components using your theme colors
const StyledAppBar = styled(AppBar)(({ theme, scrolled }) => ({
  background: scrolled 
    ? `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha('#f8f9fa', 0.9)} 100%)`
    : `linear-gradient(135deg, ${alpha('#ffffff', 0.9)} 0%, ${alpha('#f8f9fa', 0.8)} 100%)`,
  backdropFilter: "saturate(180%) blur(20px)",
  borderRadius: '24px',
  margin: '16px auto',
  maxWidth: '90%',
  left: '50%',
  transform: 'translateX(-50%)',
  border: `1px solid ${alpha('#e9ecef', 0.8)}`,
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: scrolled 
    ? `0 8px 32px ${alpha('#1AC99F', 0.08)}, 0 0 0 1px ${alpha('#1AC99F', 0.05)}`
    : `0 12px 40px ${alpha('#1AC99F', 0.1)}, 0 0 0 1px ${alpha('#e9ecef', 0.3)}`,
  animation: `${slideIn} 0.6s ease-out`,
  position: 'fixed',
  width: '90%',
  zIndex: 1100,
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  position: 'relative',
  borderRadius: '20px',
  padding: '8px 20px',
  margin: '0 6px',
  fontWeight: active ? 700 : 500,
  fontSize: '0.8rem',
  textTransform: 'none',
  fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  color: active ? '#1AC99F' : '#6c757d',
  background: active 
    ? `linear-gradient(135deg, ${alpha('#1AC99F', 0.15)} 0%, ${alpha('#4EDCB9', 0.1)} 100%)`
    : 'transparent',
  border: active ? `1px solid ${alpha('#1AC99F', 0.3)}` : '1px solid transparent',
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
      ? `linear-gradient(135deg, ${alpha('#1AC99F', 0.2)} 0%, ${alpha('#4EDCB9', 0.15)} 100%)`
      : `linear-gradient(135deg, ${alpha('#f8f9fa', 0.8)} 0%, ${alpha('#4EDCB9', 0.1)} 100%)`,
    border: `1px solid ${alpha('#1AC99F', 0.4)}`,
    transform: 'translateY(-1px)',
    color: '#1AC99F',
    
    '&::before': {
      left: '100%',
    },
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '6px',
    left: '50%',
    transform: `translateX(-50%) scaleX(${active ? 1 : 0})`,
    width: '70%',
    height: '2px',
    borderRadius: '1px',
    background: `linear-gradient(90deg, #1AC99F, #4EDCB9)`,
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
}));

const CTAButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, #1AC99F 0%, #0E9A78 100%)`,
  borderRadius: '20px',
  padding: '10px 24px',
  fontWeight: 600,
  fontSize: '0.75rem',
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
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: `0 12px 28px ${alpha('#1AC99F', 0.3)}`,
    background: `linear-gradient(135deg, #4EDCB9 0%, #1AC99F 100%)`,
    
    '&::before': {
      left: '100%',
    },
  },
  
  '&:active': {
    transform: 'translateY(0) scale(0.98)',
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    transform: 'scale(1.05)',
  },
  
  '& img': {
    height: '36px',
    width: 'auto',
    filter: 'drop-shadow(0 2px 8px rgba(26, 201, 159, 0.2))',
    transition: 'filter 0.3s ease',
  },
}));

const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  color: '#1AC99F',
  border: `1px solid ${alpha('#1AC99F', 0.3)}`,
  borderRadius: '12px',
  padding: '8px',
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

  // Scroll effects - just for visual feedback, no size changes
  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY > 50;
      setScrolled(s);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
        <LogoContainer onClick={() => handleNav("Home")}>
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
                      animation: `${slideIn} 0.3s ease-out`,
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
        >
          Book a Demo
        </CTAButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Content offset */}
      <Box sx={{ height: '100px' }} />

      <StyledAppBar 
        scrolled={scrolled}
        elevation={0}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
          <Toolbar 
            sx={{ 
              minHeight: '64px !important',
              justifyContent: 'space-between',
              py: 1,
            }}
          >
            {/* Logo - Always visible */}
            <LogoContainer onClick={() => handleNav("Home")}>
              <img src={logo} alt="Logo" />
            </LogoContainer>

            {/* Desktop Navigation - Centered */}
            <Box sx={{ 
              display: { xs: "none", md: "flex" }, 
              alignItems: 'center',
              gap: 0.5,
            }}>
              {PAGES.map((page) => (
                <NavButton
                  key={page}
                  active={isActive(page)}
                  onClick={() => handleNav(page)}
                  disableRipple
                >
                  {page}
                </NavButton>
              ))}
            </Box>

            {/* Right side - CTA + Mobile Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Desktop CTA */}
              <CTAButton 
                onClick={() => handleNav("Contact Us")}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                Book a Demo
              </CTAButton>

              {/* Mobile Menu Button */}
              <MobileMenuButton
                onClick={() => setDrawerOpen(true)}
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                <MenuIcon />
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
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
