import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { CheckCircle } from 'lucide-react';

// Enhanced animations
const floatAnimation = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
  }
  25% { 
    transform: translateY(-12px) rotate(0.5deg);
  }
  50% { 
    transform: translateY(-20px) rotate(0deg);
  }
  75% { 
    transform: translateY(-12px) rotate(-0.5deg);
  }
`;

const slideInFromLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-60px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromBottom = keyframes`
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleBreath = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const blinkCursor = keyframes`
  0%, 50% { border-color: transparent; }
  51%, 100% { border-color: #1AC99F; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
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
            animation: `${blinkCursor} 1s infinite`,
          }}
        />
      )}
    </span>
  );
};

// Animated Word Reveal Component
const AnimatedWordReveal = ({ text, delay = 0 }) => {
  const [visibleWords, setVisibleWords] = useState(0);
  const words = text.split(' ');

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleWords(prev => {
          if (prev >= words.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 150);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [words.length, delay]);

  return (
    <span>
      {words.map((word, index) => (
        <span
          key={index}
          style={{
            opacity: index < visibleWords ? 1 : 0,
            transform: index < visibleWords ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            display: 'inline-block',
            marginRight: '0.3em',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
};

// Floating Particle Component
const FloatingParticle = ({ delay = 0, size = 4, color = '#1AC99F', top, left }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: top,
        left: left,
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        borderRadius: '50%',
        opacity: 0.6,
        animation: `${floatAnimation} ${8 + Math.random() * 4}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        filter: `blur(${size > 6 ? 2 : 1}px)`,
      }}
    />
  );
};

const RegulatoryReporting = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [visibleElements, setVisibleElements] = useState({});

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleElements(prev => ({ ...prev, header: true })), 300),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, subtitle: true })), 1000),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, description: true })), 1800),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, features: true })), 2500),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, cta: true })), 3200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background: `
          radial-gradient(circle at 15% 25%, rgba(26, 201, 159, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 85% 75%, rgba(46, 139, 139, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(52, 152, 219, 0.04) 0%, transparent 70%),
          linear-gradient(135deg, #f8f9fa 0%, rgba(248, 249, 250, 0.3) 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <FloatingParticle
          key={i}
          delay={i * 0.5}
          size={Math.random() * 8 + 2}
          color={i % 3 === 0 ? '#1AC99F' : i % 3 === 1 ? '#3498db' : '#e74c3c'}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
        />
      ))}

      <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', marginBottom: '6rem' }}>
          {/* Badge */}
          <Box
            sx={{
              opacity: visibleElements.header ? 1 : 0,
              transform: visibleElements.header ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s ease-out',
              marginBottom: '2rem',
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, rgba(26, 201, 159, 0.1), rgba(46, 139, 139, 0.1))',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                border: '1px solid rgba(26, 201, 159, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <CheckCircle size={16} style={{ color: '#1AC99F' }} />
              <Typography sx={{ color: '#1AC99F', fontWeight: 600, fontSize: '0.9rem' }}>
                Regulatory Reporting
              </Typography>
            </Box>
          </Box>

          {/* Main Headline */}
          <Typography
            variant="h1"
            sx={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              color: '#1e293b',
              letterSpacing: '-0.02em',
            }}
          >
            <TypewriterText text="GLOBAL CLIMATE COMPLIANCE" delay={500} speed={80} />
            <br />
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #1AC99F, #2E8B8B)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              <TypewriterText text="Reporting Made Effortless" delay={2500} speed={80} />
            </Box>
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h5"
            sx={{
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              color: '#64748b',
              marginBottom: '3rem',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            <AnimatedWordReveal 
              text="Report with confidence every time. Our tools—designed by engineers, climate scientists, and data experts—help leading companies stay ahead of climate disclosure and evolving regulations"
              delay={3500}
            />
          </Typography>
        </Box>

        {/* Call to Action */}
        <Fade in={visibleElements.cta} timeout={1500}>
          <Box
            sx={{
              textAlign: 'center',
              mt: 10,
              p: { xs: 5, md: 7 },
              borderRadius: 4,
              background: `
                linear-gradient(135deg, 
                  rgba(26, 201, 159, 0.08) 0%, 
                  rgba(46, 139, 139, 0.06) 50%,
                  rgba(52, 152, 219, 0.08) 100%
                )
              `,
              border: '1px solid rgba(26, 201, 159, 0.15)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 20px 50px rgba(26, 201, 159, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(26, 201, 159, 0.05), transparent)',
                animation: `${floatAnimation} 4s ease-in-out infinite`,
              }
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '2.8rem' },
                letterSpacing: '-0.01em',
              }}
            >
              Streamline Your Climate Reporting
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ 
                mb: 5, 
                fontSize: { xs: '1.1rem', md: '1.25rem' }, 
                maxWidth: '700px', 
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Join leading organizations in transforming their regulatory compliance with our automated reporting platform that ensures accuracy and efficiency
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 4, 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
            }}>
              <button
                style={{
                  padding: '16px 48px',
                  fontSize: '18px',
                  fontWeight: 700,
                  borderRadius: '35px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  color: 'white',
                  cursor: 'pointer',
                  boxShadow: '0px 12px 35px rgba(26, 201, 159, 0.4)',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0px 15px 40px rgba(26, 201, 159, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = '0px 12px 35px rgba(26, 201, 159, 0.4)';
                }}
              >
                Start Reporting Today
              </button>
              <button
                style={{
                  padding: '16px 48px',
                  fontSize: '18px',
                  fontWeight: 700,
                  borderRadius: '35px',
                  border: `3px solid ${theme.palette.primary.main}`,
                  background: 'transparent',
                  color: theme.palette.primary.main,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = theme.palette.primary.main;
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = `0px 15px 40px ${theme.palette.primary.main}40`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = theme.palette.primary.main;
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                View Compliance Guide
              </button>
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default RegulatoryReporting;