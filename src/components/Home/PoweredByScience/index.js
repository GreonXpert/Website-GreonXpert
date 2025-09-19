// src/components/Home/PoweredByScience/index.js
import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
  Chip
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

    // sockets
    const socket = io(API_BASE);
    // server should place sockets into 'poweredByScience' room on connect
    socket.on('pbs-categories-updated', (payload) => {
      if (payload?.success && Array.isArray(payload.data)) {
        setCategories(payload.data);
        // keep a valid selection if the current one was removed
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
    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Selected category’s description (from DB)
  const selectedDescription = categories.find(c => c._id === selectedCategoryId)?.description || '';

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background: `linear-gradient(180deg, 
          ${theme.palette.background.default} 0%, 
          rgba(26, 201, 159, 0.03) 50%,
          ${theme.palette.background.default} 100%)`,
        position: 'relative',
        overflow: 'hidden',
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
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Fade in timeout={800}>
          <Box textAlign="center" mb={6}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
                p: 1,
                px: 2,
                borderRadius: 20,
                background: 'rgba(26, 201, 159, 0.1)',
                border: '1px solid rgba(26, 201, 159, 0.2)',
              }}
            >
              <ScienceIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
              <Typography
                variant="overline"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  letterSpacing: 1.5,
                }}
              >
                Powered by Science
              </Typography>
            </Box>

            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 2,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
              }}
            >
              Aligned with Globally Recognized
              <br />
              <span style={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Scientific Frameworks
              </span>
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: '700px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.125rem' },
                fontWeight: 400,
              }}
            >
              Our platform is built on internationally accepted standards and methodologies,
              ensuring accuracy, credibility, and compliance in every measurement
            </Typography>
          </Box>
        </Fade>

        {/* Category chips (from DB) */}
        <Fade in timeout={1000}>
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            {chips.map((chip) => (
              <Chip
                key={chip.id}
                icon={chip.icon}
                label={chip.label}
                onClick={() => setSelectedCategoryId(chip.id)}
                sx={{
                  py: 2.5,
                  px: 2,
                  fontSize: '0.9rem',
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
                  },
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    background: selectedCategoryId === chip.id
                      ? theme.palette.primary.main
                      : 'rgba(26, 201, 159, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 10px 20px ${theme.palette.primary.main}30`,
                  }
                }}
              />
            ))}
          </Box>
        </Fade>

        {/* Category description (from DB) */}
        <Fade in key={selectedCategoryId || 'none'} timeout={500}>
          <Box textAlign="center" mb={4}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontStyle: 'italic',
              }}
            >
              {selectedDescription}
            </Typography>
          </Box>
        </Fade>

        {/* Scrolling framework logos (image only) */}
        <Box
          ref={containerRef}
          sx={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            minHeight: { xs: 160, md: 180 },
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
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              No frameworks in this category yet.
            </Box>
          ) : (
            <Box
              key={selectedCategoryId || 'all'}
              sx={{
                display: 'flex',
                gap: 3,
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
                    minWidth: { xs: 180, md: 220 },
                    height: { xs: 120, md: 140 },
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
                        width: 64,
                        height: 64,
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
      </Container>
    </Box>
  );
};

export default PoweredByScience;
