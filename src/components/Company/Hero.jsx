// website/src/components/Company/Hero.jsx - ULTRA COMPACT WITH TRUSTEDBYEEADERS SIZING
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Chip,
  Button
} from '@mui/material';
import { keyframes } from '@emotion/react';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ThreeJSBackground from '../Contact/ThreeJSBackground';

// Animations for consistent styling across the site - REDUCED INTENSITY
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(0.5deg); }
  50% { transform: translateY(-12px) rotate(0deg); }
  75% { transform: translateY(-8px) rotate(-0.5deg); }
`;

const slideInFromLeft = keyframes`
  0% { opacity: 0; transform: translateX(-30px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const Hero = () => {
  const theme = useTheme();
  const [visibleElements, setVisibleElements] = useState({});
  const [scrollScale, setScrollScale] = useState(1);
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleElements(prev => ({ ...prev, header: true })), 300),
    ];

    // Scroll scale effect (like TrustedByLeaders)
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 300;
      const scale = Math.max(0.8, 1 - (scrollY / maxScroll) * 0.2);
      setScrollScale(scale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: '80vh', // REDUCED: From 100vh
        background: `
          radial-gradient(circle at 15% 25%, rgba(26,201,159,0.06) 0%, transparent 50%),
          radial-gradient(circle at 85% 75%, rgba(52,152,219,0.06) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(46,139,139,0.04) 0%, transparent 70%),
          linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248,249,250,0.4) 100%)
        `, // REDUCED: opacity values
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 4, md: 6 }, // REDUCED: From { xs: 8, md: 12 }
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ThreeJSBackground />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}> {/* REDUCED: From xl */}
        <Box
          textAlign="center"
          sx={{
            opacity: visibleElements.header ? 1 : 0,
            transform: visibleElements.header ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          <Chip
            icon={<BusinessCenterIcon />}
            label="OUR MISSION"
            sx={{
              mb: 2.5, // REDUCED: From 4
              px: 2, // REDUCED: From 4
              py: 1.5, // REDUCED: From 3
              fontSize: '0.6rem', // MUCH REDUCED: From 1rem
              fontWeight: 800,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
              border: `1px solid ${theme.palette.primary.main}`, // REDUCED: From 2px
              color: theme.palette.primary.main,
              letterSpacing: 1, // REDUCED: From 2
              backdropFilter: 'blur(8px)', // REDUCED: From blur(10px)
              boxShadow: `0 0 20px ${theme.palette.primary.main}20`, // REDUCED: From 30px and 30
              height: 28, // REDUCED height
              transform: `scale(${scrollScale})`,
              transition: 'transform 0.3s ease',
              '& .MuiChip-icon': {
                fontSize: 14, // REDUCED icon size
              },
            }}
          />
          <Typography
            variant="h2" // CHANGED: From h1 to h2
            component="h1"
            sx={{
              fontWeight: 900,
              mb: 2, // REDUCED: From 3
              fontSize: { 
                xs: '1.4rem', 
                sm: '1.7rem', 
                md: '2.1rem', 
                lg: '2.4rem' 
              }, // MUCH REDUCED: From { xs: '2.5rem', md: '4.5rem' }
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, #3498db)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              animation: `${slideInFromLeft} 1s ease-out`,
              transform: `scale(${scrollScale})`,
              transition: 'transform 0.3s ease',
            }}
          >
            Pioneering a Sustainable
            <br />
            Digital Future
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: { xs: '95%', sm: '85%', md: '600px' }, // Similar to TrustedByLeaders
              mx: 'auto',
              fontSize: { 
                xs: '0.75rem', 
                sm: '0.85rem', 
                md: '0.95rem', 
                lg: '1.2rem' 
              }, // Similar to TrustedByLeaders
              opacity: 0.8,
              lineHeight: 1.4,
              fontWeight: 400,
              animation: `${fadeInUp} 1s ease-out 0.3s both`,
              transform: `scale(${scrollScale})`,
              transition: 'transform 0.3s ease',
              px: { xs: 0.5, sm: 1 }, // Responsive padding like TrustedByLeaders
            }}
          >
            Designing the future of sustainability-where action is as innovative as our ideas.
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />} 
            sx={{
              mt: 3, // REDUCED: From 5
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              px: { xs: 2.5, md: 4 }, // REDUCED: From { xs: 4, md: 8 }
              py: { xs: 1, md: 1.2 }, // REDUCED: From { xs: 1.5, md: 2 }
              borderRadius: 30, // REDUCED: From 50
              fontWeight: 700,
              fontSize: { xs: '0.6rem', md: '0.7rem' }, // MUCH REDUCED: From { xs: '1rem', md: '1.1rem' }
              textTransform: 'uppercase',
              boxShadow: `0 6px 18px ${theme.palette.primary.main}30`, // REDUCED: From 0 8px 24px and 40
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `scale(${scrollScale})`,
              height: 32, // REDUCED height
              '&:hover': {
                transform: `translateY(-2px) scale(${scrollScale})`, // REDUCED: From -3px
                boxShadow: `0 8px 20px ${theme.palette.primary.main}50`, // REDUCED: From 0 12px 30px and 60
              }
            }}
          >
            Explore Our Story
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
