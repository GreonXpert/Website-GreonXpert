// src/components/Contact/index.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
  Chip,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ContactInformation from './ContactInformation';
import ContactForm from './ContactForm';
// import ThreeJSBackground from './ThreeJSBackground'; // Commented out to prevent errors

// Enhanced animations
const floatAnimation = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
  }
  25% { 
    transform: translateY(-15px) rotate(1deg);
  }
  50% { 
    transform: translateY(-25px) rotate(0deg);
  }
  75% { 
    transform: translateY(-15px) rotate(-1deg);
  }
`;

const slideInFromLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Typewriter Text Component
const TypewriterText = ({ text, delay = 0, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, isTyping]);

  return (
    <span>
      {displayText}
      {isTyping && currentIndex < text.length && (
        <span
          style={{
            borderRight: '2px solid #1AC99F',
            animation: 'blinkCursor 1s infinite',
          }}
        />
      )}
    </span>
  );
};

// Main Contact Component
const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [visibleElements, setVisibleElements] = useState({});
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Ensure component is mounted before starting animations
    setMounted(true);
    
    const timers = [
      setTimeout(() => setVisibleElements(prev => ({ ...prev, header: true })), 500),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, info: true })), 1000),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, form: true })), 1300),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Don't render animations until component is fully mounted
  if (!mounted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248, 249, 250, 0.5) 100%)`,
          py: { xs: 8, md: 12 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      <style>{`
        @keyframes blinkCursor {
          0%, 50% { border-color: transparent; }
          51%, 100% { border-color: #1AC99F; }
        }
      `}</style>

      <Box
        sx={{
          minHeight: '100vh',
          background: `
            radial-gradient(circle at 15% 25%, rgba(26, 201, 159, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 85% 75%, rgba(52, 152, 219, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(46, 139, 139, 0.05) 0%, transparent 70%),
            linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248, 249, 250, 0.5) 100%)
          `,
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 8, md: 12 },
        }}
      >
        {/* Simple animated background instead of Three.js */}
        {[...Array(8)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: { xs: 30, md: 50 },
              height: { xs: 30, md: 50 },
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${['#1AC99F', '#2E8B8B', '#3498db'][i % 3]}15, ${['#1AC99F', '#2E8B8B', '#3498db'][i % 3]}25)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `${floatAnimation} ${8 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3,
              display: { xs: 'none', md: 'block' }
            }}
          />
        ))}

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header Section */}
          <Box 
            textAlign="center" 
            mb={10}
            sx={{
              opacity: visibleElements.header ? 1 : 0,
              transform: visibleElements.header ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out',
            }}
          >
              <Chip
                icon={<ContactMailIcon />}
                label="GET IN TOUCH"
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
                <TypewriterText text="Let's Start Your" delay={500} speed={80} />
                <br />
                <TypewriterText text="Sustainability Journey" delay={2000} speed={80} />
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
                Ready to transform your business with AI-powered sustainability solutions? 
                Our experts are here to guide you every step of the way.
              </Typography>
            </Box>

          {/* Main Content Grid */}
          <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} alignItems="flex-start">
            {/* Contact Information Section - LEFT SIDE */}
            <Grid item xs={12} lg={7}>
              <Box
                sx={{
                  opacity: visibleElements.info ? 1 : 0,
                  transform: visibleElements.info ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s ease-out 0.2s',
                }}
              >
                <ContactInformation visibleElements={visibleElements} />
              </Box>
            </Grid>

            {/* Contact Form Section - RIGHT SIDE */}
            <Grid item xs={12} lg={5}>
              <Box
                sx={{
                  opacity: visibleElements.form ? 1 : 0,
                  transform: visibleElements.form ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s ease-out 0.4s',
                }}
              >
                <ContactForm visibleElements={visibleElements} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Contact;