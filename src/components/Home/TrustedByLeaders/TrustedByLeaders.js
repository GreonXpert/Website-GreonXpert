import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { API_BASE } from '../../../utils/api';

// Glittering animation
const glitterAnimation = keyframes`
  0% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 rgba(255,255,255,0.4); }
  25% { transform: scale(1.05) rotate(2deg); box-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(26, 201, 159, 0.4); }
  50% { transform: scale(1.1) rotate(-1deg); box-shadow: 0 0 30px rgba(255,255,255,1), 0 0 40px rgba(26, 201, 159, 0.6); }
  75% { transform: scale(1.05) rotate(1deg); box-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(26, 201, 159, 0.4); }
  100% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 rgba(255,255,255,0.4); }
`;

// Sparkle animation
const sparkleAnimation = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

// Shine animation
const shineAnimation = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`;

const API_URL = `${API_BASE}`; // Use the imported API_BASE

const TrustedByLeaders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [visibleItems, setVisibleItems] = useState({});
  const [partnerships, setPartnerships] = useState([]);
  const [recognitions, setRecognitions] = useState([]);
  
  // Option to show/hide text when image is available
  const showTextWithImage = false; // Set to true to show text even when image is present

  useEffect(() => {
    // 1. Fetch initial data from the backend
    const fetchData = async () => {
      try {
        const [partnershipsRes, recognitionsRes] = await Promise.all([
          fetch(`${API_URL}/api/trusted/partnerships`),
          fetch(`${API_URL}/api/trusted/recognitions`)
        ]);
        const partnershipsData = await partnershipsRes.json();
        const recognitionsData = await recognitionsRes.json();

        if (partnershipsData.success) {
          setPartnerships(partnershipsData.data);
        }
        if (recognitionsData.success) {
          setRecognitions(recognitionsData.data);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchData();

    // 2. Set up socket for real-time updates
    const socket = io(API_URL);

    socket.on('partnerships-updated', (data) => {
      if (data.success) {
        console.log("Partnerships updated in real-time:", data.data);
        setPartnerships(data.data);
      }
    });

    socket.on('recognitions-updated', (data) => {
      if (data.success) {
        console.log("Recognitions updated in real-time:", data.data);
        setRecognitions(data.data);
      }
    });
    
    // 3. Trigger animations
    const timer = setTimeout(() => {
      setVisibleItems({ partnerships: true });
    }, 300);

    const timer2 = setTimeout(() => {
      setVisibleItems(prev => ({ ...prev, recognitions: true }));
    }, 600);
    
    // 4. Cleanup on component unmount
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      socket.disconnect();
    };
  }, []);

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 }, // Increased for better spacing
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Main Title */}
        <Fade in timeout={800}>
          <Box textAlign="center" mb={8}> {/* Increased margin */}
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
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                textAlign: 'center',
                lineHeight: 1.2, // Better line spacing
              }}
            >
              PREFERRED CHOICE OF LEADING EXPERTS
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '0.9rem', md: '1.1rem' },
                opacity: 0.8,
                lineHeight: 1.5,
              }}
            >
              Building sustainable solutions with trusted partners and government recognition
            </Typography>
          </Box>
        </Fade>

        {/* Partnership Section */}
        <Grow in={visibleItems.partnerships} timeout={1000}>
          <Box mb={8}> {/* Increased margin */}
            <Typography
              variant="h4"
              component="h3"
              sx={{
                textAlign: 'center',
                mb: 4,
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: { xs: '1.5rem', md: '2rem' },
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
                <Grid item xs={12} md={6} key={partner._id}>
                  <Zoom in timeout={1200 + index * 200}>
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        transition: 'all 0.4s ease',
                        cursor: 'pointer',
                        p: 3,
                        borderRadius: 3,
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          '& .partner-image': {
                            animation: `${glitterAnimation} 1.5s ease-in-out`,
                          }
                        }
                      }}
                    >
                      {partner.imageUrl ? (
                        <>
                          <Box
                            className="partner-image"
                            sx={{
                              mb: showTextWithImage ? 2 : 0,
                              borderRadius: 3,
                              overflow: 'hidden',
                              transition: 'all 0.4s ease',
                              position: 'relative',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                                transition: 'all 0.6s ease',
                                zIndex: 1,
                              },
                              '&:hover::before': {
                                left: '100%',
                              }
                            }}
                          >
                            <img
                              src={`${API_URL}${partner.imageUrl}`}
                              alt={partner.name}
                              style={{
                                width: '100%',
                                maxWidth: '200px',
                                height: 'auto',
                                display: 'block',
                                borderRadius: '12px',
                                transition: 'all 0.4s ease',
                                position: 'relative',
                                zIndex: 0,
                              }}
                            />
                          </Box>
                          
                          {showTextWithImage && (
                            <>
                              <Typography
                                variant="h6"
                                component="h4"
                                sx={{
                                  fontWeight: 700,
                                  mb: 1,
                                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.main}AA)`,
                                  backgroundClip: 'text',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                {partner.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontWeight: 500 }}
                              >
                                {partner.description}
                              </Typography>
                            </>
                          )}
                        </>
                      ) : (
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{partner.name}</Typography>
                            </CardContent>
                        </Card>
                      )}
                    </Box>
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
                mb: 5,
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: { xs: '1.5rem', md: '2rem' },
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
            
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              {recognitions.map((recognition, index) => (
                <Grid item xs={12} sm={6} md={3} key={recognition._id}>
                  <Zoom in timeout={1600 + index * 150}>
                    <Box
                      sx={{
                        height: '100%',
                        minHeight: '160px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.4s ease',
                        p: 2,
                        borderRadius: 3,
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          '& .recognition-image': {
                            animation: `${glitterAnimation} 1.5s ease-in-out`,
                          },
                          '& .sparkle': {
                            animation: `${sparkleAnimation} 1s ease-in-out infinite`,
                          }
                        }
                      }}
                    >
                      <Box
                        className="sparkle"
                        sx={{
                          position: 'absolute', top: '10%', left: '10%', width: '4px', height: '4px', borderRadius: '50%', background: '#FFD700', opacity: 0,
                        }}
                      />
                      <Box
                        className="sparkle"
                        sx={{
                          position: 'absolute', top: '20%', right: '15%', width: '3px', height: '3px', borderRadius: '50%', background: '#FF6B35', opacity: 0, animationDelay: '0.3s',
                        }}
                      />
                      <Box
                        className="sparkle"
                        sx={{
                          position: 'absolute', bottom: '20%', left: '20%', width: '2px', height: '2px', borderRadius: '50%', background: '#4ECDC4', opacity: 0, animationDelay: '0.6s',
                        }}
                      />

                      {recognition.imageUrl ? (
                        <>
                          <Box
                            className="recognition-image"
                            sx={{
                              mb: showTextWithImage ? 1.5 : 0,
                              borderRadius: 2,
                              transition: 'all 0.4s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '120px',
                              width: '100%',
                              maxWidth: '180px',
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
                                transition: 'all 0.6s ease',
                                zIndex: 1,
                              },
                              '&:hover::before': {
                                left: '100%',
                              }
                            }}
                          >
                            <img
                              src={`${API_URL}${recognition.imageUrl}`}
                              alt={recognition.name}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                width: 'auto',
                                height: 'auto',
                                display: 'block',
                                borderRadius: '8px',
                                transition: 'all 0.4s ease',
                                objectFit: 'contain',
                                position: 'relative',
                                zIndex: 0,
                              }}
                            />
                          </Box>
                          
                          {showTextWithImage && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                mt: 1, fontSize: '0.8rem', fontWeight: 500, opacity: 0.7, textAlign: 'center',
                              }}
                            >
                              {recognition.name}
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Chip
                          label={recognition.name}
                          variant="outlined"
                          icon={<BusinessIcon />}
                          sx={{
                            p: 2, height: 'auto', minHeight: '60px', borderRadius: 4, fontSize: '0.95rem', fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grow>
      </Container>
    </Box>
  );
};

export default TrustedByLeaders;
