// src/components/Home/TrustedByLeaders/index.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  Zoom
} from '@mui/material';
import { keyframes } from '@emotion/react';
import VerifiedIcon from '@mui/icons-material/Verified';
import BusinessIcon from '@mui/icons-material/Business';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SecurityIcon from '@mui/icons-material/Security';
import PublicIcon from '@mui/icons-material/Public';

// Floating animation
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(-5px) rotate(-1deg); }
`;

// Pulse animation
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Glow animation
const glowAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(26, 201, 159, 0.3); }
  50% { box-shadow: 0 0 30px rgba(26, 201, 159, 0.6), 0 0 40px rgba(26, 201, 159, 0.4); }
`;

// Shimmer animation
const shimmerAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const TrustedByLeaders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [visibleItems, setVisibleItems] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleItems({ partnerships: true });
    }, 300);

    const timer2 = setTimeout(() => {
      setVisibleItems(prev => ({ ...prev, recognitions: true }));
    }, 600);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  const partnerships = [
    {
      id: 1,
      name: "Eco Defenders 360",
      description: "Environmental Solutions Consultancy",
      icon: <SecurityIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main,
    },
    {
      id: 2,
      name: "Klimate Shield",
      description: "Climate Risk Management Experts",
      icon: <PublicIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      color: theme.palette.secondary.main,
    }
  ];

  const recognitions = [
    {
      id: 1,
      name: "DPIIT",
      fullName: "Department for Promotion of Industry and Internal Trade",
      icon: <BusinessIcon sx={{ fontSize: 32 }} />,
      color: '#FF6B35',
    },
    {
      id: 2,
      name: "Startup Mission",
      fullName: "Government Startup Initiative",
      icon: <EmojiEventsIcon sx={{ fontSize: 32 }} />,
      color: '#4ECDC4',
    },
    {
      id: 3,
      name: "Udhyam",
      fullName: "Entrepreneurship Development Program",
      icon: <VerifiedIcon sx={{ fontSize: 32 }} />,
      color: '#45B7D1',
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, 
          ${theme.palette.background.default} 0%, 
          rgba(26, 201, 159, 0.02) 25%,
          rgba(46, 139, 139, 0.02) 75%,
          ${theme.palette.background.default} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(26, 201, 159, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(46, 139, 139, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Main Title */}
        <Fade in timeout={800}>
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
                textAlign: 'center',
              }}
            >
              Trusted by Leaders
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              Building tomorrow's sustainable solutions with industry pioneers and government recognition
            </Typography>
          </Box>
        </Fade>

        {/* Partnership Section */}
        <Grow in={visibleItems.partnerships} timeout={1000}>
          <Box mb={8}>
            <Typography
              variant="h4"
              component="h3"
              sx={{
                textAlign: 'center',
                mb: 4,
                fontWeight: 600,
                color: theme.palette.text.primary,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: 2,
                }
              }}
            >
              In Partnership with Top Consultancies
            </Typography>
            
            <Grid container spacing={4} justifyContent="center">
              {partnerships.map((partner, index) => (
                <Grid item xs={12} md={6} key={partner.id}>
                  <Zoom in timeout={1200 + index * 200}>
                    <Card
                      sx={{
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 4,
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        animation: `${floatAnimation} 6s ease-in-out infinite`,
                        animationDelay: `${index * 0.5}s`,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-200px',
                          width: '200px',
                          height: '100%',
                          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                          animation: `${shimmerAnimation} 3s infinite`,
                          animationDelay: `${index * 1}s`,
                        },
                        '&:hover': {
                          transform: 'translateY(-10px) scale(1.02)',
                          animation: `${glowAnimation} 2s ease-in-out infinite`,
                          '& .partner-icon': {
                            animation: `${pulseAnimation} 1s ease-in-out infinite`,
                          }
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box
                          className="partner-icon"
                          sx={{
                            mb: 2,
                            p: 2,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${partner.color}15, ${partner.color}25)`,
                            display: 'inline-block',
                            border: `2px solid ${partner.color}30`,
                          }}
                        >
                          {partner.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          component="h4"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            background: `linear-gradient(45deg, ${partner.color}, ${partner.color}AA)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {partner.name}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          {partner.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grow>

        {/* Recognition Section */}
        <Grow in={visibleItems.recognitions} timeout={1400}>
          <Box>
            <Typography
              variant="h4"
              component="h3"
              sx={{
                textAlign: 'center',
                mb: 4,
                fontWeight: 600,
                color: theme.palette.text.primary,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 3,
                  background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                  borderRadius: 2,
                }
              }}
            >
              Recognized by
            </Typography>
            
            <Grid container spacing={3} justifyContent="center">
              {recognitions.map((recognition, index) => (
                <Grid item xs={12} sm={6} md={4} key={recognition.id}>
                  <Zoom in timeout={1600 + index * 150}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        position: 'relative',
                      }}
                    >
                      <Chip
                        icon={recognition.icon}
                        label={recognition.name}
                        variant="outlined"
                        sx={{
                          p: 3,
                          height: 'auto',
                          borderRadius: 4,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          background: `linear-gradient(135deg, ${recognition.color}15, ${recognition.color}25)`,
                          border: `2px solid ${recognition.color}40`,
                          color: recognition.color,
                          transition: 'all 0.3s ease',
                          animation: `${floatAnimation} 4s ease-in-out infinite`,
                          animationDelay: `${index * 0.3}s`,
                          '& .MuiChip-icon': {
                            color: recognition.color,
                            marginLeft: 1,
                          },
                          '& .MuiChip-label': {
                            px: 2,
                            py: 1,
                          },
                          '&:hover': {
                            transform: 'translateY(-5px) scale(1.05)',
                            background: `linear-gradient(135deg, ${recognition.color}25, ${recognition.color}35)`,
                            border: `2px solid ${recognition.color}60`,
                            boxShadow: `0 10px 25px ${recognition.color}30`,
                          }
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 2,
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          opacity: 0.8,
                        }}
                      >
                        {recognition.fullName}
                      </Typography>
                    </Box>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grow>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
            animation: `${floatAnimation} 8s ease-in-out infinite`,
            opacity: 0.3,
            display: { xs: 'none', md: 'block' }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${theme.palette.secondary.main}20, ${theme.palette.primary.main}20)`,
            animation: `${floatAnimation} 6s ease-in-out infinite reverse`,
            opacity: 0.3,
            display: { xs: 'none', md: 'block' }
          }}
        />
      </Container>
    </Box>
  );
};

export default TrustedByLeaders;