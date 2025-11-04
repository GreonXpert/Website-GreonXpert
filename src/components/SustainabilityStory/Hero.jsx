// src/components/SustainabilityStory/Hero.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Chip,
  alpha,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

// Animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-15px) rotate(1deg); }
  50% { transform: translateY(-25px) rotate(0deg); }
  75% { transform: translateY(-15px) rotate(-1deg); }
`;

const shimmerEffect = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Hero = () => {
  const theme = useTheme();
  const [visibleElements, setVisibleElements] = useState({});

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleElements(prev => ({ ...prev, badge: true })), 200),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, title: true })), 600),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, subtitle: true })), 1000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 8, md: 12 },
        background: `
          radial-gradient(circle at 20% 30%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%),
          linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)
        `,
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          animation: `${floatAnimation} 8s ease-in-out infinite`,
          opacity: 0.6,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})`,
          animation: `${floatAnimation} 10s ease-in-out infinite reverse`,
          opacity: 0.4,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box textAlign="center">
          {/* Badge */}
          <Box
            sx={{
              opacity: visibleElements.badge ? 1 : 0,
              transform: visibleElements.badge ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s ease-out',
              mb: 4,
            }}
          >
            <Chip
              icon={<AutoStoriesIcon />}
              label="SUSTAINABILITY STORIES"
              sx={{
                px: 4,
                py: 3,
                fontSize: '1rem',
                fontWeight: 800,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.secondary.main, 0.15)})`,
                border: `2px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                letterSpacing: 2,
                backdropFilter: 'blur(20px)',
                animation: `${floatAnimation} 6s ease-in-out infinite`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '200%',
                  height: '100%',
                  background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.3)}, transparent)`,
                  animation: `${shimmerEffect} 3s linear infinite`,
                },
              }}
            />
          </Box>

          {/* Main Title */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              lineHeight: 1.1,
              mb: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              opacity: visibleElements.title ? 1 : 0,
              transform: visibleElements.title ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1s ease-out',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: visibleElements.title ? '60%' : '0%',
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: 2,
                transition: 'width 1.5s ease-out 0.5s',
              },
            }}
          >
            Insights & Resources
            <br />
            <Box
              component="span"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              for Sustainable Future
            </Box>
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              fontWeight: 400,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              opacity: visibleElements.subtitle ? 1 : 0,
              transform: visibleElements.subtitle ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s ease-out',
            }}
          >
            Discover expert insights, industry trends, and practical resources to accelerate your sustainability journey. 
            From decarbonization strategies to ESG reporting, we've got you covered.
          </Typography>

          {/* Stats */}
          {/* <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 4, md: 8 },
              mt: 6,
              flexWrap: 'wrap',
            }}
          >
            {[
              { number: '150+', label: 'Expert Articles' },
              { number: '50+', label: 'Video Resources' },
              { number: '25+', label: 'Tools & Templates' },
            ].map((stat, index) => (
              <Box
                key={stat.label}
                sx={{
                  textAlign: 'center',
                  opacity: visibleElements.subtitle ? 1 : 0,
                  transform: visibleElements.subtitle ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.6s ease-out ${0.2 + index * 0.1}s`,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: theme.palette.primary.main,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box> */}
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
