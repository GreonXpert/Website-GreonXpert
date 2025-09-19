// website/src/components/Company/Hero.jsx
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

// Animations for consistent styling across the site
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-15px) rotate(1deg); }
  50% { transform: translateY(-25px) rotate(0deg); }
  75% { transform: translateY(-15px) rotate(-1deg); }
`;

const slideInFromLeft = keyframes`
  0% { opacity: 0; transform: translateX(-50px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const Hero = () => {
  const theme = useTheme();
  const [visibleElements, setVisibleElements] = useState({});
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleElements(prev => ({ ...prev, header: true })), 300),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 15% 25%, rgba(26,201,159,0.08) 0%, transparent 50%),
          radial-gradient(circle at 85% 75%, rgba(52,152,219,0.08) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(46,139,139,0.05) 0%, transparent 70%),
          linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248,249,250,0.5) 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 8, md: 12 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ThreeJSBackground />
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          textAlign="center"
          sx={{
            opacity: visibleElements.header ? 1 : 0,
            transform: visibleElements.header ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          <Chip
            icon={<BusinessCenterIcon />}
            label="OUR MISSION"
            sx={{
              mb: 4,
              px: 4,
              py: 3,
              fontSize: '1rem',
              fontWeight: 800,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
              border: `2px solid ${theme.palette.primary.main}`,
              color: theme.palette.primary.main,
              letterSpacing: 2,
              backdropFilter: 'blur(10px)',
              boxShadow: `0 0 30px ${theme.palette.primary.main}30`,
            }}
          />
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 900,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, #3498db)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              animation: `${slideInFromLeft} 1s ease-out`,
            }}
          >
            Pioneering a Sustainable
            <br />
            Digital Future
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              lineHeight: 1.6,
              fontWeight: 400,
              animation: `${fadeInUp} 1s ease-out 0.3s both`,
            }}
          >
            At GreonXpert, we are committed to empowering businesses with cutting-edge software solutions
            that drive environmental responsibility and operational excellence.
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: 5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              px: { xs: 4, md: 8 },
              py: { xs: 1.5, md: 2 },
              borderRadius: 50,
              fontWeight: 700,
              fontSize: { xs: '1rem', md: '1.1rem' },
              textTransform: 'uppercase',
              boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: `0 12px 30px ${theme.palette.primary.main}60`,
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
