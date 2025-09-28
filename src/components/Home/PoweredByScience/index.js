// src/components/Home/PoweredByScience/index.js
import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
  Chip,
  Grow,
  Zoom
} from '@mui/material';
import { keyframes } from '@emotion/react';
import io from 'socket.io-client';
import axios from 'axios';

// Optional icons (only used on chips; images replace card content)
import VerifiedIcon from '@mui/icons-material/Verified';
import ScienceIcon from '@mui/icons-material/Science';
import PublicIcon from '@mui/icons-material/Public';
import { API_BASE } from '../../../utils/api';

const API_URL = `${API_BASE}/api`;

// Continuous scroll animation
const scrollAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

// Glow animation for hover
const glowAnimation = keyframes`
  0% { box-shadow: 0 0 0 rgba(26, 201, 159, 0); }
  50% { box-shadow: 0 8px 32px rgba(26, 201, 159, 0.35); }
  100% { box-shadow: 0 0 0 rgba(26, 201, 159, 0); }
`;

// Pulse animation (subtle)
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

// Icon for a category name (visual consistency with your current chips)
const iconForCategory = (name = '') => {
  const s = name.toLowerCase();
  if (s.includes('audit')) return <VerifiedIcon />;
  if (s.includes('scient')) return <ScienceIcon />;
  return <PublicIcon />; // default "Internationally Accepted"
};

// Accent color for a category (used for hover ring)
const colorForCategory = (name = '') => {
  const s = name.toLowerCase();
  if (s.includes('audit')) return '#45b7d1';
  if (s.includes('scient')) return '#2E8B8B';
  return '#1AC99F';
};

const PoweredByScience = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isPaused, setIsPaused] = useState(false);
  const [visibleItems, setVisibleItems] = useState({});
  const [scrollScale, setScrollScale] = useState(1);

  // DB-driven categories
  const [categories, setCategories] = useState([]); // [{_id, name, description}]
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Frameworks (with populated category)
  const [frameworks, setFrameworks] = useState([]);

  const containerRef = useRef(null);

  // ---- Load categories + frameworks; wire sockets for live updates
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, fwRes] = await Promise.all([
          axios.get(`${API_URL}/pbs/categories`),   // DB categories
          axios.get(`${API_URL}/pbs/frameworks`)    // DB frameworks (populate category)
        ]);
        if (catRes.data?.success) {
          const cats = catRes.data.data || [];
          setCategories(cats);
          // default select: try Internationally, else first
          const preferred = cats.find(c => (c.name || '').toLowerCase().includes('international')) || cats[0];
          setSelectedCategoryId(prev => prev || preferred?._id || null);
        }
        if (fwRes.data?.success) {
          setFrameworks(fwRes.data.data || []);
        }
      } catch (e) {
        console.error('Failed to load PBS data', e);
      }
    };
    loadData();

    // Fade effect timers similar to TrustedByLeaders
    const timer = setTimeout(() => {
      setVisibleItems({ header: true });
    }, 300);

    const timer2 = setTimeout(() => {
      setVisibleItems(prev => ({ ...prev, chips: true }));
    }, 600);

    const timer3 = setTimeout(() => {
      setVisibleItems(prev => ({ ...prev, frameworks: true }));
    }, 900);

    // Scroll scale effect similar to TrustedByLeaders
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 300;
      const scale = Math.max(0.8, 1 - (scrollY / maxScroll) * 0.2);
      setScrollScale(scale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // sockets
    const socket = io(API_BASE);
    socket.on('pbs-categories-updated', (payload) => {
      if (payload?.success && Array.isArray(payload.data)) {
        setCategories(payload.data);
        if (payload.data.length > 0) {
          const stillExists = payload.data.some(c => c._id === selectedCategoryId);
          if (!stillExists) setSelectedCategoryId(payload.data[0]._id);
        } else {
          setSelectedCategoryId(null);
        }
      }
    });
    socket.on('pbs-frameworks-updated', (payload) => {
      if (payload?.success && Array.isArray(payload.data)) {
        setFrameworks(payload.data);
      }
    });

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('scroll', handleScroll);
      socket.disconnect();
    };
  }, []);

  // Build chip models from DB categories
  const chips = categories.map((c) => ({
    id: c._id,
    label: c.name,
    description: c.description,
    icon: iconForCategory(c.name),
    color: colorForCategory(c.name),
  }));

  // Filter frameworks by selected category id
  const filtered = frameworks.filter(fw => fw?.category?._id === selectedCategoryId);

  // Normalize to UI models (logos only)
  const uiFrameworks = filtered.map(fw => ({
    id: fw._id,
    imageUrl: fw?.imageUrl ? `${API_BASE}${fw.imageUrl}` : null,
    // category color for hover ring
    color: colorForCategory(fw?.category?.name || ''),
  }));

  // Duplicate for seamless marquee
  const duplicatedFrameworks = [...uiFrameworks, ...uiFrameworks];

  // Selected category's description (from DB)
  const selectedDescription = categories.find(c => c._id === selectedCategoryId)?.description || '';

  return (
    <Box
      sx={{
        py: { xs: 2, sm: 3, md: 4 }, // Reduced spacing similar to TrustedByLeaders
        background: `linear-gradient(180deg, 
          ${theme.palette.background.default} 0%, 
          rgba(26, 201, 159, 0.03) 50%,
          ${theme.palette.background.default} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '90vh' }, // Reduced height
        display: 'flex',
        alignItems: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '150%',
          height: '150%',
          background: 'radial-gradient(circle, rgba(26, 201, 159, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container 
        maxWidth="xl" 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          width: '100%',
          px: { xs: 1.5, sm: 2, md: 3 }, // Reduced horizontal padding
        }}
      >
        {/* Header */}
        <Fade in={visibleItems.header} timeout={800}>
          <Box textAlign="center" mb={{ xs: 2, sm: 3, md: 4 }}> {/* Reduced margin */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mb: 1.5, // Reduced margin
                p: 0.8, // Reduced padding
                px: 1.5,
                borderRadius: 20,
                background: 'rgba(26, 201, 159, 0.1)',
                border: '1px solid rgba(26, 201, 159, 0.2)',
                transform: `scale(${scrollScale})`,
                transition: 'transform 0.3s ease',
              }}
            >
              <ScienceIcon sx={{ color: theme.palette.primary.main, fontSize: 16 }} /> {/* Reduced icon size */}
              <Typography
                variant="overline"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  fontSize: { xs: '0.4rem', sm: '0.45rem', md: '0.5rem' }, // Using typography config
                }}
              >
                Powered by Science
              </Typography>
            </Box>

            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 1.5, // Reduced margin
                fontSize: { 
                  xs: '1.4rem', 
                  sm: '1.7rem', 
                  md: '2.1rem', 
                  lg: '2.4rem' 
                }, // Similar to TrustedByLeaders
                textAlign: 'center',
                lineHeight: 1.2,
                transform: `scale(${scrollScale})`,
                transition: 'transform 0.3s ease',
                px: { xs: 0.5, sm: 1 },
                color: theme.palette.secondary.light,
              }}
            >
              Grounded In Research
              <br />
              {/* <span style={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Scientific Frameworks
              </span> */}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                maxWidth: { xs: '95%', sm: '85%', md: '600px' },
                mx: 'auto',
                fontSize: { 
                  xs: '0.75rem', 
                  sm: '0.85rem', 
                  md: '0.95rem', 
                  lg: '1.2rem' 
                }, // Similar to TrustedByLeaders
                opacity: 0.8,
                lineHeight: 1.4,
                transform: `scale(${scrollScale})`,
                transition: 'transform 0.3s ease',
                px: { xs: 0.5, sm: 1 },
              }}
            >
              Our platform is built in alignment with globally recognized standards and scientific frameworks, enabling audit-ready compliance.
            </Typography>
          </Box>
        </Fade>

        {/* Category chips (from DB) */}
        <Grow in={visibleItems.chips} timeout={1000}>
          <Box
            sx={{
              mb: 3, // Reduced margin
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 1.5, // Reduced gap
            }}
          >
            {chips.map((chip, index) => (
              <Zoom in timeout={1200 + index * 200} key={chip.id}>
                <Chip
                  icon={chip.icon}
                  label={chip.label}
                  onClick={() => setSelectedCategoryId(chip.id)}
                  sx={{
                    py: 2, // Reduced padding
                    px: 1.5,
                    fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' }, // Using typography-like sizing
                    fontWeight: 600,
                    background: selectedCategoryId === chip.id
                      ? theme.palette.primary.main
                      : 'rgba(26, 201, 159, 0.1)',
                    border: selectedCategoryId === chip.id
                      ? `2px solid ${theme.palette.primary.main}`
                      : '1px solid rgba(26, 201, 159, 0.2)',
                    color: selectedCategoryId === chip.id ? 'white' : theme.palette.primary.main,
                    '& .MuiChip-icon': {
                      color: selectedCategoryId === chip.id ? 'white' : theme.palette.primary.main,
                      fontSize: { xs: '14px', md: '16px' }, // Reduced icon size
                    },
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    transform: `scale(${scrollScale})`,
                    '&:hover': {
                      background: selectedCategoryId === chip.id
                        ? theme.palette.primary.main
                        : 'rgba(26, 201, 159, 0.2)',
                      transform: `scale(${scrollScale * 1.05}) translateY(-2px)`,
                      boxShadow: `0 10px 20px ${theme.palette.primary.main}30`,
                    }
                  }}
                />
              </Zoom>
            ))}
          </Box>
        </Grow>

        {/* Category description (from DB) */}
        <Fade in={visibleItems.chips && selectedCategoryId} key={selectedCategoryId || 'none'} timeout={500}>
          <Box textAlign="center" mb={3}> {/* Reduced margin */}
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.65rem', sm: '0.7rem', md: '1.05rem' }, // Using typography config
                fontStyle: 'bold',
                transform: `scale(${scrollScale})`,
                transition: 'transform 0.3s ease',
              }}
            >
              {selectedDescription}
            </Typography>
          </Box>
        </Fade>

        {/* Scrolling framework logos (image only) */}
        <Grow in={visibleItems.frameworks} timeout={1400}>
          <Box
            ref={containerRef}
            sx={{
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
              minHeight: { xs: 140, md: 160 }, // Reduced height
              transform: `scale(${scrollScale})`,
              transition: 'transform 0.3s ease',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '100px',
                background: `linear-gradient(to right, ${theme.palette.background.default}, transparent)`,
                zIndex: 2,
                pointerEvents: 'none',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '100px',
                background: `linear-gradient(to left, ${theme.palette.background.default}, transparent)`,
                zIndex: 2,
                pointerEvents: 'none',
              }
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedFrameworks.length === 0 ? (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 3, 
                  color: 'text.secondary',
                  fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' }
                }}
              >
                No frameworks in this category yet.
              </Box>
            ) : (
              <Box
                key={selectedCategoryId || 'all'}
                sx={{
                  display: 'flex',
                  gap: 2.5, // Reduced gap
                  alignItems: 'center',
                  animation: `${scrollAnimation} ${isMobile ? '30s' : '40s'} linear infinite`,
                  animationPlayState: isPaused ? 'paused' : 'running',
                  '&:hover': { animationPlayState: 'paused' }
                }}
              >
                {duplicatedFrameworks.map((fw, idx) => (
                  <Box
                    key={`${fw.id}-${idx}`}
                    sx={{
                      flexShrink: 0,
                      minWidth: { xs: 160, md: 200 }, // Reduced width
                      height: { xs: 100, md: 120 }, // Reduced height
                      p: 0,
                      m: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2,
                      transition: 'transform 0.25s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        '& img': {
                          animation: `${pulseAnimation} 1s ease-in-out`,
                          boxShadow: `0 8px 24px ${fw.color}55`,
                        }
                      }
                    }}
                  >
                    {fw.imageUrl ? (
                      <img
                        src={fw.imageUrl}
                        alt="framework"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: 12,
                          display: 'block',
                          boxShadow: 'none',
                          transition: 'box-shadow 0.25s ease',
                        }}
                        loading="lazy"
                      />
                    ) : (
                      // if a framework lacks an image, show a soft dot (very rare)
                      <Box
                        sx={{
                          width: 48, // Reduced size
                          height: 48,
                          borderRadius: '50%',
                          background: `${fw.color}22`,
                          boxShadow: `${fw.color}55 0px 4px 16px`,
                          animation: `${glowAnimation} 2s ease-in-out infinite`
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Grow>
      </Container>
    </Box>
  );
};

export default PoweredByScience;
