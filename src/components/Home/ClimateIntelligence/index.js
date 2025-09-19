// src/components/Home/ClimateIntelligence/index.js
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
  Chip,
  Card,
  CardContent,
  Collapse,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircleOutline as CheckIcon,
  AutoAwesome as SparkleIcon,
  Insights as InsightsIcon,
  ExpandMore as ExpandMoreIcon,
  AdsClick as ClickAwayIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  Science as ScienceIcon,
  Public as PublicIcon,
  Verified as VerifiedIcon,
  Language as LanguageIcon,
  Nature as NatureIcon,
} from '@mui/icons-material';
import axios from 'axios';
import io from 'socket.io-client';

import dashboard1 from '../../../assests/Solutions/ZeroCarbon.png';
import dashboard2 from '../../../assests/Solutions/ESGLink.jpg';
import dashboard3 from '../../../assests/Solutions/ZeroCarbon/4.png';

import { API_BASE } from '../../../utils/api';

// === API ===
const API_URL = `${API_BASE}/api`;

// Animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(5deg); }
`;
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 12px rgba(26, 201, 159, 0.2); transform: scale(1); }
  50% { box-shadow: 0 0 24px rgba(26, 201, 159, 0.4); transform: scale(1.01); }
`;
const shimmerEffect = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
`;
const slideInLeft = keyframes`
  0% { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
`;
const slideInRight = keyframes`
  0% { opacity: 0; transform: translateX(20px); }
  100% { opacity: 1; transform: translateX(0); }
`;
const slideDown = keyframes`
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// Map backend icon string -> MUI component
const ICON_COMPONENTS = {
  Dashboard: DashboardIcon,
  Settings: SettingsIcon,
  TrendingUp: TrendingUpIcon,
  AutoAwesome: SparkleIcon,
  Insights: InsightsIcon,
  Assessment: AssessmentIcon,
  Security: SecurityIcon,
  Science: ScienceIcon,
  Public: PublicIcon,
  Verified: VerifiedIcon,
  Language: LanguageIcon,
  Nature: NatureIcon,
};

// Default color per icon (used if backend doesn't send colorHex)
const ICON_COLORS = {
  Dashboard: '#1AC99F',
  Settings: '#2E8B8B',
  TrendingUp: '#3498db',
  AutoAwesome: '#8e44ad',
  Insights: '#16a085',
  Assessment: '#e67e22',
  Security: '#c0392b',
  Science: '#27ae60',
  Public: '#2980b9',
  Verified: '#2ecc71',
  Language: '#9b59b6',
  Nature: '#1abc9c',
};
const DEFAULT_COLOR = '#1AC99F';

// Fallback images for the details panel tint/ratio
const fallbackImageForIcon = (iconName) => {
  // keep your aspect/feel with familiar images
  const map = {
    Dashboard: dashboard1,
    Settings: dashboard3,
    TrendingUp: dashboard2,
  };
  return map[iconName] || dashboard1;
};

// Chunk features into repeating rows of [2 half] + [1 full]
const chunkTwoPlusOne = (items) => {
  const groups = [];
  for (let i = 0; i < items.length; i += 3) {
    const a = items[i];
    const b = items[i + 1];
    const c = items[i + 2];
    groups.push([a, b, c].filter(Boolean));
  }
  return groups;
};

// Compact Card (kept visually identical; now uses backend icon/color directly)
const CompactFeatureCard = ({ feature, isActive, onActivate, index, isMobile }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const IconComp = ICON_COMPONENTS[feature.iconName] || DashboardIcon;

  // third in each chunk is "full width"; caller passes index within chunk (0,1,2)
  const isFullWidthCard = index === 2;

  return (
    <Box
      sx={{
        position: 'relative',
        cursor: 'pointer',
        transform: isActive ? 'scale(1.02)' : isHovered ? 'scale(1.01)' : 'scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        width: '100%',
        animation: `${slideInLeft} ${0.5 + index * 0.15}s ease-out`,
      }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={onActivate}
    >
      <Card
        sx={{
          width: '100%',
          height: isMobile ? 'auto' : 220,
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-start' : 'center',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2.5,
          background: isActive
            ? `linear-gradient(135deg, ${feature.colorHex}08 0%, ${feature.colorHex}03 100%)`
            : 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(25px)',
          border: isActive
            ? `2px solid ${feature.colorHex}40`
            : isHovered
              ? `2px solid ${feature.colorHex}30`
              : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: isActive
            ? `0 8px 30px ${feature.colorHex}20, 0 0 0 1px ${feature.colorHex}08`
            : isHovered
              ? `0 6px 20px ${feature.colorHex}12`
              : '0 4px 15px rgba(0, 0, 0, 0.05)',
          animation: isActive ? `${pulseGlow} 2s ease-in-out infinite` : 'none',
          p: isMobile ? 2.5 : 1.5,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100px',
            width: '100px',
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${feature.colorHex}10, transparent)`,
            animation: (isHovered || isActive) ? `${shimmerEffect} 1.5s ease-in-out infinite` : 'none',
            zIndex: 1,
          }
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: isMobile ? 'space-between' : 'center',
            height: '100%',
            width: '100%',
            p: isMobile ? 0 : 1.5,
            position: 'relative',
            zIndex: 2,
            '&:last-child': { pb: isMobile ? 0 : 1.5 }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              alignItems: 'center',
              gap: isMobile ? 2.5 : 1.5,
              flex: 1,
              width: '100%',
            }}
          >
            <Box
              sx={{
                color: feature.colorHex,
                filter: isActive
                  ? `drop-shadow(0 0 8px ${feature.colorHex}) drop-shadow(0 0 15px ${feature.colorHex}40)`
                  : `drop-shadow(0 0 4px ${feature.colorHex}30)`,
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}
            >
              <IconComp sx={{ fontSize: { xs: 28, sm: 32, md: 36 } }} />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? 0.5 : 0.8,
                flex: isMobile ? 1 : 'none',
                width: isMobile ? 'auto' : '100%',
                textAlign: isMobile ? 'left' : 'center',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: isActive ? feature.colorHex : theme.palette.text.primary,
                  fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' },
                  letterSpacing: '0.2px',
                  transition: 'all 0.3s ease',
                  lineHeight: 1.2,
                  mb: 0.3,
                }}
              >
                {feature.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
                  fontSize: { xs: '0.8rem', sm: '0.85rem', md: isFullWidthCard ? '0.95rem' : '0.87rem' },
                  fontWeight: 500,
                  lineHeight: 1.5,
                  maxWidth: isMobile ? '100%' : isFullWidthCard ? 500 : 250,
                  opacity: 1,
                  transition: 'all 0.3s ease',
                  display: '-webkit-box',
                  WebkitLineClamp: isMobile ? 3 : isFullWidthCard ? 3 : 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textShadow: isActive ? `0 1px 3px ${feature.colorHex}25` : '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          </Box>

          {isMobile && (
            <Box
              sx={{
                color: feature.colorHex,
                transition: 'transform 0.3s ease',
                transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                flexShrink: 0,
              }}
            >
              <ExpandMoreIcon sx={{ fontSize: 24 }} />
            </Box>
          )}
        </CardContent>

        {isActive && !isMobile && (
          <>
            {[...Array(3)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: 2,
                  height: 2,
                  borderRadius: '50%',
                  background: feature.colorHex,
                  top: `${30 + Math.random() * 40}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animation: `${floatAnimation} ${2 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: 0.6,
                  zIndex: 0,
                }}
              />
            ))}
          </>
        )}
      </Card>

      {isActive && !isMobile && (
        <Chip
          label={(feature.title || 'FEATURE').toUpperCase()}
          size="small"
          sx={{
            position: 'absolute',
            top: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            background: `linear-gradient(45deg, ${feature.colorHex}, ${feature.colorHex}CC)`,
            color: 'white',
            fontWeight: 600,
            fontSize: '0.65rem',
            letterSpacing: 0.4,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 2px 10px ${feature.colorHex}40`,
            zIndex: 3,
            height: 22,
            animation: `${slideDown} 0.3s ease-out`,
          }}
        />
      )}
    </Box>
  );
};

// Compact Mobile Details
const CompactMobileDetails = ({ feature, isOpen }) => {
  const theme = useTheme();

  return (
    <Collapse in={isOpen} timeout={350}>
      <Box
        sx={{
          mt: 2.5,
          mb: 3,
          p: 3,
          background: `linear-gradient(135deg, ${feature.colorHex}05, ${feature.colorHex}08)`,
          backdropFilter: 'blur(25px)',
          border: `2px solid ${feature.colorHex}15`,
          borderRadius: 3,
          boxShadow: `0 8px 25px ${feature.colorHex}10`,
          animation: `${slideDown} 0.35s ease-out`,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontSize: '1rem',
              mb: 2.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <InsightsIcon sx={{ color: feature.colorHex, fontSize: 18 }} />
            Key Capabilities
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              maxHeight: 300,
              overflowY: 'auto',
              pr: 0.5,
              '&::-webkit-scrollbar': { width: 4 },
              '&::-webkit-scrollbar-track': { background: `${feature.colorHex}05`, borderRadius: 2 },
              '&::-webkit-scrollbar-thumb': { background: feature.colorHex, borderRadius: 2 }
            }}
          >
            {feature.benefits.map((benefit, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  p: 3,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${feature.colorHex}03, ${feature.colorHex}05)`,
                  border: `1px solid ${feature.colorHex}10`,
                }}
              >
                <CheckIcon sx={{ color: feature.colorHex, fontSize: 16, mt: 0.1, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.5, fontWeight: 500, color: theme.palette.text.primary }}>
                  {benefit}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Collapse>
  );
};

// Desktop Details Panel (uses backend image if present)
const CompactDesktopDetails = ({ feature, isVisible }) => {
  const theme = useTheme();
  const [imageEnlarged, setImageEnlarged] = useState(false);

  if (!isVisible || !feature) {
    return (
      <Card
        sx={{
          height: 460,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(25px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box textAlign="center" sx={{ p: 3 }}>
          <Box sx={{ animation: `${floatAnimation} 3s ease-in-out infinite`, mb: 2.5 }}>
            <ClickAwayIcon sx={{ fontSize: 50, color: theme.palette.primary.main, filter: `drop-shadow(0 0 8px ${theme.palette.primary.main}20)` }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '1.5rem', mb: 1.5 }}>
            Discover Features
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem', lineHeight: 1.5 }}>
            Click on any feature card to explore capabilities
          </Typography>
        </Box>
      </Card>
    );
  }

  const imageSrc = feature.imageUrl ? `${API_BASE}${feature.imageUrl}` : fallbackImageForIcon(feature.iconName);
  const IconComp = ICON_COMPONENTS[feature.iconName] || DashboardIcon;

  return (
    <>
      <Fade in key={feature.id} timeout={500}>
        <Card
          sx={{
            height: 460,
            background: `linear-gradient(135deg, ${feature.colorHex}05, rgba(255, 255, 255, 0.25))`,
            backdropFilter: 'blur(25px)',
            border: `2px solid ${feature.colorHex}20`,
            borderRadius: 3,
            boxShadow: `0 15px 40px ${feature.colorHex}10, 0 0 0 1px ${feature.colorHex}03`,
            position: 'relative',
            overflow: 'hidden',
            animation: `${slideInRight} 0.5s ease-out`,
          }}
        >
          <CardContent
            sx={{
              p: 3,
              height: '100%',
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Feature Image */}
            <Box
              sx={{
                position: 'relative',
                height: 120,
                borderRadius: 2.5,
                overflow: 'hidden',
                mb: 3,
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: `2px solid ${feature.colorHex}20`,
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0 8px 25px ${feature.colorHex}25`,
                  border: `2px solid ${feature.colorHex}30`,
                }
              }}
              onClick={() => setImageEnlarged(true)}
            >
              <Box
                component="img"
                src={imageSrc}
                alt={`${feature.title} feature illustration`}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'all 0.3s ease' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />

              {/* Fallback gradient + icon if image fails */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: `
                    linear-gradient(45deg, ${feature.colorHex}15, transparent 40%),
                    linear-gradient(-45deg, transparent 60%, ${feature.colorHex}10),
                    radial-gradient(circle at 30% 70%, ${feature.colorHex}20, transparent 50%),
                    linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))
                  `,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: -1,
                }}
              >
                <IconComp sx={{ fontSize: 40, color: feature.colorHex }} />
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(45deg, ${feature.colorHex}08, transparent 60%)`,
                  mixBlendMode: 'overlay',
                  pointerEvents: 'none',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8,
                  transition: 'all 0.2s ease',
                  border: `1px solid rgba(255, 255, 255, 0.4)`,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    opacity: 1,
                    transform: 'scale(1.1)',
                    background: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  }
                }}
              >
                <Box component="svg" sx={{ width: 16, height: 16, color: theme.palette.text.primary }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
                </Box>
              </Box>
            </Box>

            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, flexShrink: 0 }}>
              <Box sx={{ p: 1, borderRadius: 2, background: `${feature.colorHex}10`, color: feature.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <InsightsIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '1.15rem', lineHeight: 1.2 }}>
                Key Capabilities
              </Typography>
            </Box>

            {/* Scrollable content */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.8,
                pr: 1,
                mr: -1,
                maxHeight: 'calc(100% - 180px)',
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-track': { background: `${feature.colorHex}08`, borderRadius: 3 },
                '&::-webkit-scrollbar-thumb': {
                  background: `linear-gradient(180deg, ${feature.colorHex}, ${feature.colorHex}CC)`,
                  borderRadius: 3,
                  '&:hover': { background: feature.colorHex }
                }
              }}
            >
              {feature.benefits.map((benefit, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    p: 2.5,
                    borderRadius: 2.5,
                    background: `linear-gradient(135deg, ${feature.colorHex}06, ${feature.colorHex}10)`,
                    border: `1px solid ${feature.colorHex}20`,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    minHeight: 'auto',
                    '&:hover': {
                      transform: 'translateX(6px)',
                      background: `linear-gradient(135deg, ${feature.colorHex}10, ${feature.colorHex}15)`,
                      border: `1px solid ${feature.colorHex}30`,
                      boxShadow: `0 4px 16px ${feature.colorHex}20`,
                    }
                  }}
                >
                  <Box sx={{ p: 0.5, borderRadius: 1.2, background: feature.colorHex, color: 'white', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, mt: 0.1 }}>
                    <CheckIcon sx={{ fontSize: 14 }} />
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '0.92rem', lineHeight: 1.6, fontWeight: 500, color: theme.palette.text.primary, flex: 1, wordBreak: 'break-word' }}>
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>

          <Box
            sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${feature.colorHex}08, transparent 70%)`,
              zIndex: 0,
            }}
          />
        </Card>
      </Fade>

      {/* Enlarged Image modal */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: imageEnlarged ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          cursor: 'pointer',
        }}
        onClick={() => setImageEnlarged(false)}
      >
        <Box
          sx={{
            width: '85%',
            maxWidth: 700,
            height: '70%',
            maxHeight: 500,
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 20px 60px ${feature.colorHex}40`,
            border: `2px solid ${feature.colorHex}30`,
          }}
        >
          <Box
            component="img"
            src={imageSrc}
            alt={`${feature.title} feature - enlarged view`}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />

          {/* Fallback gradient/icon if image fails */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `
                linear-gradient(45deg, ${feature.colorHex}15, transparent 30%),
                linear-gradient(-45deg, transparent 70%, ${feature.colorHex}10),
                radial-gradient(circle at 30% 70%, ${feature.colorHex}20, transparent 50%),
                linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))
              `,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: -1,
            }}
          >
            <IconComp sx={{ fontSize: 60, color: feature.colorHex }} />
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(45deg, ${feature.colorHex}10, transparent 70%)`,
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              top: 15,
              right: 15,
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s ease',
              '&:hover': { background: 'white', transform: 'scale(1.1)', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.4)' }
            }}
          >
            ✕
          </Box>
        </Box>
      </Box>
    </>
  );
};

// Main Component
const ClimateIntelligence = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeFeature, setActiveFeature] = useState(null);
  const [mounted, setMounted] = useState(false);

  const [serverFeatures, setServerFeatures] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch + realtime updates from backend (no duplicates, no fallbacks)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/climate-intelligence/features`);
        if (res.data?.success) setServerFeatures(res.data.data || []);
      } catch (e) {
        console.error('Failed to load Climate Intelligence features', e);
      }
    };
    load();

    const socket = io(API_BASE);
    socket.emit('join', 'climateIntelligence');
    socket.on('ci-features-updated', (payload) => {
      if (payload?.success && Array.isArray(payload.data)) {
        setServerFeatures(payload.data);
      }
    });
    return () => socket.disconnect();
  }, []);

  // Adapt backend -> UI without fabricating extra cards
  const uiFeatures = useMemo(() => {
    return (serverFeatures || []).map((f) => {
      const iconName = (f.icon || 'Dashboard');
      const colorHex = f.colorHex || ICON_COLORS[iconName] || DEFAULT_COLOR;
      return {
        id: f._id || f.id || `${f.title}-${iconName}`,
        title: f.title || '',
        description: f.description || '',
        benefits: Array.isArray(f.benefits) ? f.benefits : [],
        iconName,
        colorHex,
        imageUrl: f.imageUrl || null,
      };
    });
  }, [serverFeatures]);

  // Build groups for repeating 2+1 pattern
  const groups = useMemo(() => chunkTwoPlusOne(uiFeatures), [uiFeatures]);

  if (!mounted) return null;

  return (
    <Box
      sx={{
        py: { xs: 5, sm: 6, md: 7, lg: 8 },
        px: { xs: 2, sm: 3 },
        background: `
          radial-gradient(circle at 20% 30%, rgba(26, 201, 159, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(52, 152, 219, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(46, 139, 139, 0.04) 0%, transparent 70%),
          linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248, 249, 250, 0.4) 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '90vh',
      }}
    >
      {!isMobile && [...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: { sm: 35, md: 45 + Math.random() * 25 },
            height: { sm: 35, md: 45 + Math.random() * 25 },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${['rgba(26, 201, 159, 0.08)', 'rgba(46, 139, 139, 0.06)', 'rgba(52, 152, 219, 0.08)'][i % 3]}, transparent)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `${floatAnimation} ${10 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            display: { xs: 'none', sm: 'block' }
          }}
        />
      ))}

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={800}>
          <Box textAlign="center" mb={{ xs: 5, sm: 6, md: 7 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 3,
                p: 1.5,
                px: 3,
                borderRadius: 20,
                background: 'rgba(26, 201, 159, 0.1)',
                border: '2px solid rgba(26, 201, 159, 0.25)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 4px 15px rgba(26, 201, 159, 0.15)',
              }}
            >
              <SparkleIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
              <Typography
                variant="overline"
                sx={{ color: theme.palette.primary.main, fontWeight: 700, letterSpacing: 1.5, fontSize: '0.75rem' }}
              >
                Interactive Experience
              </Typography>
            </Box>

            <Typography
              variant="h1"
              component="h2"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem', lg: '4rem' },
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, #3498db)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                animation: `${slideInLeft} 0.8s ease-out`,
              }}
            >
              Climate Intelligence
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                mx: 'auto',
                fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.2rem' },
                fontWeight: 400,
                lineHeight: 1.6,
                animation: `${slideInRight} 0.8s ease-out 0.2s both`,
                px: { xs: 1, sm: 0 },
              }}
            >
              Your comprehensive platform for emission monitoring, strategic decarbonization, and transparent reporting.
            </Typography>
          </Box>
        </Fade>

        {/* Main Interactive Section */}
        <Box
          sx={{
            display: isMobile ? 'block' : 'grid',
            gridTemplateColumns: { md: '1.2fr 1fr', lg: '1.3fr 1fr' },
            gap: { md: 6, lg: 7 },
            alignItems: 'start',
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          {/* Feature Cards Section - repeating 2+1 rows */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { md: '1fr 1fr' },
              gap: { xs: 2.5, md: 3 },
              mb: isMobile ? 3 : 0,
            }}
          >
            {groups.map((group, gIdx) => (
              <React.Fragment key={`g-${gIdx}`}>
                {/* first two as half-width (on desktop) */}
                {group.slice(0, 2).map((feature, i) => (
                  <Box key={feature.id}>
                    <CompactFeatureCard
                      feature={feature}
                      isActive={activeFeature === (gIdx * 3 + i)}
                      onActivate={() =>
                        setActiveFeature(activeFeature === (gIdx * 3 + i) ? null : (gIdx * 3 + i))
                      }
                      index={i} // 0 or 1 in chunk
                      isMobile={isMobile}
                    />
                    {isMobile && (
                      <CompactMobileDetails
                        feature={feature}
                        isOpen={activeFeature === (gIdx * 3 + i)}
                      />
                    )}
                  </Box>
                ))}

                {/* third (if exists) as full width across 2 columns */}
                {group[2] && (
                  <Box sx={{ gridColumn: { md: '1 / -1' } }}>
                    <CompactFeatureCard
                      feature={group[2]}
                      isActive={activeFeature === (gIdx * 3 + 2)}
                      onActivate={() =>
                        setActiveFeature(activeFeature === (gIdx * 3 + 2) ? null : (gIdx * 3 + 2))
                      }
                      index={2} // full-width style
                      isMobile={isMobile}
                    />
                    {isMobile && (
                      <CompactMobileDetails
                        feature={group[2]}
                        isOpen={activeFeature === (gIdx * 3 + 2)}
                      />
                    )}
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Box>

          {/* Desktop Details Panel */}
          {!isMobile && (
            <Box sx={{ animation: `${slideInRight} 0.8s ease-out 0.6s both`, position: { lg: 'sticky' }, top: { lg: 20 } }}>
              <CompactDesktopDetails
                feature={activeFeature !== null ? uiFeatures[activeFeature] : null}
                isVisible={true}
              />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ClimateIntelligence;
