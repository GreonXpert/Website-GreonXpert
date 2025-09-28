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
  Grow,
  Zoom
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
  50% { transform: translateY(-6px) rotate(3deg); }
`;
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 8px rgba(26, 201, 159, 0.2); transform: scale(1); }
  50% { box-shadow: 0 0 16px rgba(26, 201, 159, 0.4); transform: scale(1.005); }
`;
const shimmerEffect = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
`;
const slideInLeft = keyframes`
  0% { opacity: 0; transform: translateX(-15px); }
  100% { opacity: 1; transform: translateX(0); }
`;
const slideInRight = keyframes`
  0% { opacity: 0; transform: translateX(15px); }
  100% { opacity: 1; transform: translateX(0); }
`;
const slideDown = keyframes`
  0% { opacity: 0; transform: translateY(-15px); }
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

// Compact Card (consistent with TrustedByLeaders sizing)
const CompactFeatureCard = ({ feature, isActive, onActivate, index, isMobile, scrollScale }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const IconComp = ICON_COMPONENTS[feature.iconName] || DashboardIcon;

  // third in each chunk is "full width"; caller passes index within chunk (0,1,2)
  const isFullWidthCard = index === 2;

  return (
    <Zoom in timeout={1200 + index * 200}>
      <Box
        sx={{
          position: 'relative',
          cursor: 'pointer',
          transform: isActive ? `scale(${scrollScale * 1.02})` : isHovered ? `scale(${scrollScale * 1.01})` : `scale(${scrollScale})`,
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
            height: isMobile ? 'auto' : { xs: 140, sm: 160, md: 170 },
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: isMobile ? 'flex-start' : 'center',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
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
              ? `0 4px 16px ${feature.colorHex}20, 0 0 0 1px ${feature.colorHex}08`
              : isHovered
                ? `0 3px 12px ${feature.colorHex}12`
                : '0 2px 8px rgba(0, 0, 0, 0.05)',
            animation: isActive ? `${pulseGlow} 2s ease-in-out infinite` : 'none',
            p: isMobile ? 1.5 : 1,
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
              p: isMobile ? 0 : 0.8,
              position: 'relative',
              zIndex: 2,
              '&:last-child': { pb: isMobile ? 0 : 0.8 }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                alignItems: 'center',
                gap: isMobile ? 1.5 : 0.8,
                flex: 1,
                width: '100%',
              }}
            >
              <Box
                sx={{
                  color: feature.colorHex,
                  filter: isActive
                    ? `drop-shadow(0 0 6px ${feature.colorHex}) drop-shadow(0 0 12px ${feature.colorHex}40)`
                    : `drop-shadow(0 0 3px ${feature.colorHex}30)`,
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                }}
              >
                <IconComp sx={{ fontSize: { xs: 20, sm: 24, md: 26 } }} />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: isMobile ? 0.2 : 0.3,
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
                    fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' },
                    letterSpacing: '0.1px',
                    transition: 'all 0.3s ease',
                    lineHeight: 1.2,
                    mb: 0.1,
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
                    fontSize: { xs: '0.85rem', sm: '0.86rem', md: isFullWidthCard ? '0.85rem' : '0.86rem' },
                    fontWeight: 500,
                    lineHeight: 1.3,
                    maxWidth: isMobile ? '100%' : isFullWidthCard ? 320 : 180,
                    opacity: 1,
                    transition: 'all 0.3s ease',
                    display: '-webkit-box',
                    WebkitLineClamp: isMobile ? 2 : isFullWidthCard ? 2 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textShadow: isActive ? `0 1px 2px ${feature.colorHex}25` : '0 0.5px 1px rgba(0,0,0,0.1)',
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
                <ExpandMoreIcon sx={{ fontSize: 18 }} />
              </Box>
            )}
          </CardContent>

          {isActive && !isMobile && (
            <>
              {[...Array(2)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: 1.5,
                    height: 1.5,
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
              top: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              background: `linear-gradient(45deg, ${feature.colorHex}, ${feature.colorHex}CC)`,
              color: 'white',
              fontWeight: 600,
              fontSize: '0.45rem',
              letterSpacing: 0.2,
              backdropFilter: 'blur(10px)',
              boxShadow: `0 2px 8px ${feature.colorHex}40`,
              zIndex: 3,
              height: 16,
              animation: `${slideDown} 0.3s ease-out`,
            }}
          />
        )}
      </Box>
    </Zoom>
  );
};

// Compact Mobile Details (consistent sizing)
const CompactMobileDetails = ({ feature, isOpen, scrollScale }) => {
  const theme = useTheme();

  return (
    <Collapse in={isOpen} timeout={350}>
      <Box
        sx={{
          mt: 1.5,
          mb: 2,
          p: 2,
          background: `linear-gradient(135deg, ${feature.colorHex}05, ${feature.colorHex}08)`,
          backdropFilter: 'blur(25px)',
          border: `2px solid ${feature.colorHex}15`,
          borderRadius: 2,
          boxShadow: `0 4px 16px ${feature.colorHex}10`,
          animation: `${slideDown} 0.35s ease-out`,
          transform: `scale(${scrollScale})`,
          transition: 'transform 0.3s ease',
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontSize: '0.75rem',
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
            }}
          >
            <InsightsIcon sx={{ color: feature.colorHex, fontSize: 14 }} />
            Key Capabilities
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              maxHeight: 200,
              overflowY: 'auto',
              pr: 0.5,
              '&::-webkit-scrollbar': { width: 2 },
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
                  gap: 1,
                  p: 1.5,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${feature.colorHex}03, ${feature.colorHex}05)`,
                  border: `1px solid ${feature.colorHex}10`,
                }}
              >
                <CheckIcon sx={{ color: feature.colorHex, fontSize: 12, mt: 0.1, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontSize: '0.6rem', lineHeight: 1.3, fontWeight: 500, color: theme.palette.text.primary }}>
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

// Desktop Details Panel - FIXED ANIMATIONS AND CONSISTENT SIZE
// Desktop Details Panel - REDUCED SIZE TO MATCH VISUAL BALANCE
const CompactDesktopDetails = ({ feature, isVisible, scrollScale }) => {
  const theme = useTheme();
  const [imageEnlarged, setImageEnlarged] = useState(false);

  if (!isVisible || !feature) {
    return (
      <Card
        sx={{
          // CORRECTED HEIGHT: Should match ~2 cards + gap = (170px * 2) + 2px = 342px
          // Adding small buffer for visual balance = 360px
          height: { xs: 340, sm: 350, md: 360 }, // Significantly reduced from 520,540,550
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(25px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 2,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
        }}
      >
        <Box textAlign="center" sx={{ p: 2.5 }}> {/* Reduced padding */}
          <Box sx={{ animation: `${floatAnimation} 3s ease-in-out infinite`, mb: 2 }}> {/* Reduced margin */}
            <ClickAwayIcon sx={{ fontSize: 40, color: theme.palette.primary.main, filter: `drop-shadow(0 0 6px ${theme.palette.primary.main}20)` }} /> {/* Reduced icon size */}
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '1.2rem', mb: 1.2 }}> {/* Reduced font size */}
            Discover Features
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}> {/* Reduced font size */}
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
      <Card
        sx={{
          // MAIN FIX: REDUCED HEIGHT TO MATCH ~2 LEFT CARDS
          // Target: 2 cards (170px each) + 1 gap (2px) = 342px + small buffer = 360px
          height: { xs: 340, sm: 350, md: 360 }, // Significantly reduced from 520,540,550
          background: `linear-gradient(135deg, ${feature.colorHex}05, rgba(255, 255, 255, 0.25))`,
          backdropFilter: 'blur(25px)',
          border: `2px solid ${feature.colorHex}20`,
          borderRadius: 2,
          boxShadow: `0 8px 24px ${feature.colorHex}10, 0 0 0 1px ${feature.colorHex}03`,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <CardContent
          sx={{
            p: 2.5, // Reduced padding from 4 to 2.5
            height: '100%',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Feature Image - REDUCED SIZE FOR SMALLER CARD */}
          <Box
            sx={{
              position: 'relative',
              height: { xs: 100, sm: 110, md: 120 }, // Reduced from 160,180,200 to 100,110,120
              borderRadius: 2,
              overflow: 'hidden',
              mb: 2.5, // Reduced margin from 4 to 2.5
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: `2px solid ${feature.colorHex}20`,
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: `0 4px 16px ${feature.colorHex}25`,
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
              <IconComp sx={{ fontSize: 36, color: feature.colorHex }} /> {/* Reduced icon size from 60 to 36 */}
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
                top: 8, // Reduced position from 12 to 8
                right: 8,
                width: 28, // Reduced size from 40 to 28
                height: 28,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.8,
                transition: 'all 0.2s ease',
                border: `1px solid rgba(255, 255, 255, 0.4)`,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.05)',
                  background: 'rgba(255, 255, 255, 1)',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
                }
              }}
            >
              <Box component="svg" sx={{ width: 12, height: 12, color: theme.palette.text.primary }} fill="currentColor" viewBox="0 0 24 24"> {/* Reduced icon size from 18 to 12 */}
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
              </Box>
            </Box>
          </Box>


          {/* Header - REDUCED SIZING FOR SMALLER CARD */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexShrink: 0 }}> {/* Reduced gaps and margins */}
            <Box sx={{ p: 1, borderRadius: 2, background: `${feature.colorHex}10`, color: feature.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center' }}> {/* Reduced padding from 1.5 to 1 */}
              <InsightsIcon sx={{ fontSize: 18 }} /> {/* Reduced icon size from 24 to 18 */}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '1rem', lineHeight: 1.2 }}> {/* Reduced font size from 1.3rem to 1rem */}
              Key Capabilities
            </Typography>
          </Box>


          {/* Scrollable content - REDUCED SIZING FOR SMALLER CARD */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5, // Reduced gap from 2.5 to 1.5
              pr: 1, // Reduced padding from 1.5 to 1
              mr: -1,
              maxHeight: 'calc(100% - 180px)', // Adjusted for smaller image and header
              '&::-webkit-scrollbar': { width: 4 }, // Reduced scrollbar width from 8 to 4
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
                  gap: 1.2, // Reduced gap from 2.2 to 1.2
                  p: 2, // Significantly reduced padding from 3.5 to 2
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${feature.colorHex}06, ${feature.colorHex}10)`,
                  border: `1px solid ${feature.colorHex}20`,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  minHeight: 'auto',
                  '&:hover': {
                    transform: 'translateX(3px)', // Reduced transform from 6px to 3px
                    background: `linear-gradient(135deg, ${feature.colorHex}10, ${feature.colorHex}15)`,
                    border: `1px solid ${feature.colorHex}30`,
                    boxShadow: `0 3px 12px ${feature.colorHex}20`, // Reduced shadow
                  }
                }}
              >
                <Box sx={{ p: 0.5, borderRadius: 1, background: feature.colorHex, color: 'white', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, mt: 0.1 }}> {/* Reduced size from 28 to 20 */}
                  <CheckIcon sx={{ fontSize: 12 }} /> {/* Reduced icon size from 18 to 12 */}
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', lineHeight: 1.4, fontWeight: 500, color: theme.palette.text.primary, flex: 1, wordBreak: 'break-word' }}> {/* Reduced font size from 0.95rem to 0.75rem */}
                  {benefit}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>

        {/* Background decoration - REDUCED SIZE FOR SMALLER CARD */}
        <Box
          sx={{
            position: 'absolute',
            top: -60, // Reduced position from -100 to -60
            right: -60,
            width: 120, // Reduced size from 200 to 120
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${feature.colorHex}08, transparent 70%)`,
            zIndex: 0,
          }}
        />
      </Card>

      {/* Enlarged Image modal - KEPT SAME SIZE */}
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
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 12px 36px ${feature.colorHex}40`,
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
            <IconComp sx={{ fontSize: 64, color: feature.colorHex }} />
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
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s ease',
              '&:hover': { background: 'white', transform: 'scale(1.05)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)' }
            }}
          >
            ✕
          </Box>
        </Box>
      </Box>
    </>
  );
};



// Main Component (unchanged)
const ClimateIntelligence = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeFeature, setActiveFeature] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [visibleItems, setVisibleItems] = useState({});
  const [scrollScale, setScrollScale] = useState(1);

  const [serverFeatures, setServerFeatures] = useState([]);

  useEffect(() => {
    setMounted(true);

    const timer = setTimeout(() => {
      setVisibleItems({ header: true });
    }, 300);

    const timer2 = setTimeout(() => {
      setVisibleItems(prev => ({ ...prev, cards: true }));
    }, 600);

    const timer3 = setTimeout(() => {
      setVisibleItems(prev => ({ ...prev, details: true }));
    }, 900);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 300;
      const scale = Math.max(0.8, 1 - (scrollY / maxScroll) * 0.2);
      setScrollScale(scale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  const groups = useMemo(() => chunkTwoPlusOne(uiFeatures), [uiFeatures]);

  if (!mounted) return null;

  return (
    <Box
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1.5, sm: 2, md: 3 },
        background: `
          radial-gradient(circle at 20% 30%, rgba(26, 201, 159, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(52, 152, 219, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(46, 139, 139, 0.04) 0%, transparent 70%),
          linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248, 249, 250, 0.4) 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '90vh' },
      }}
    >
      {!isMobile && [...Array(4)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: { sm: 24, md: 30 + Math.random() * 15 },
            height: { sm: 24, md: 30 + Math.random() * 15 },
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

      <Container 
        maxWidth="xl" 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Fade in={visibleItems.header} timeout={800}>
          <Box textAlign="center" mb={{ xs: 2, sm: 3, md: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mb: 1.5,
                p: 1,
                px: 2,
                borderRadius: 20,
                background: 'rgba(26, 201, 159, 0.1)',
                border: '2px solid rgba(26, 201, 159, 0.25)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 2px 10px rgba(26, 201, 159, 0.15)',
                transform: `scale(${scrollScale})`,
                transition: 'transform 0.3s ease',
              }}
            >
              <SparkleIcon sx={{ color: theme.palette.primary.main, fontSize: 14 }} />
              <Typography
                variant="overline"
                sx={{ 
                  color: theme.palette.primary.main, 
                  fontWeight: 700, 
                  letterSpacing: 1.2, 
                  fontSize: { xs: '0.45rem', sm: '0.5rem', md: '0.55rem' }
                }}
              >
                Interactive Experience
              </Typography>
            </Box>

            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 900,
                mb: 1.5,
                fontSize: { 
                  xs: '1.4rem', 
                  sm: '1.7rem', 
                  md: '2.1rem', 
                  lg: '2.4rem' 
                },
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, #3498db)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                animation: `${slideInLeft} 0.8s ease-out`,
                transform: `scale(${scrollScale})`,
                transition: 'transform 0.3s ease',
                px: { xs: 0.5, sm: 1 },
              }}
            >
              Climate Intelligence
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
              Your comprehensive platform for emission monitoring, strategic decarbonization, and transparent reporting.
            </Typography>
          </Box>
        </Fade>

        <Box
          sx={{
            display: isMobile ? 'block' : 'grid',
            gridTemplateColumns: { md: '1.2fr 1fr', lg: '1.3fr 1fr' },
            gap: { md: 3, lg: 4 },
            alignItems: 'start',
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          <Grow in={visibleItems.cards} timeout={1000}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { md: '1fr 1fr' },
                gap: { xs: 1.5, md: 2 },
                mb: isMobile ? 2 : 0,
              }}
            >
              {groups.map((group, gIdx) => (
                <React.Fragment key={`g-${gIdx}`}>
                  {group.slice(0, 2).map((feature, i) => (
                    <Box key={feature.id}>
                      <CompactFeatureCard
                        feature={feature}
                        isActive={activeFeature === (gIdx * 3 + i)}
                        onActivate={() =>
                          setActiveFeature(activeFeature === (gIdx * 3 + i) ? null : (gIdx * 3 + i))
                        }
                        index={i}
                        isMobile={isMobile}
                        scrollScale={scrollScale}
                      />
                      {isMobile && (
                        <CompactMobileDetails
                          feature={feature}
                          isOpen={activeFeature === (gIdx * 3 + i)}
                          scrollScale={scrollScale}
                        />
                      )}
                    </Box>
                  ))}

                  {group[2] && (
                    <Box sx={{ gridColumn: { md: '1 / -1' } }}>
                      <CompactFeatureCard
                        feature={group[2]}
                        isActive={activeFeature === (gIdx * 3 + 2)}
                        onActivate={() =>
                          setActiveFeature(activeFeature === (gIdx * 3 + 2) ? null : (gIdx * 3 + 2))
                        }
                        index={2}
                        isMobile={isMobile}
                        scrollScale={scrollScale}
                      />
                      {isMobile && (
                        <CompactMobileDetails
                          feature={group[2]}
                          isOpen={activeFeature === (gIdx * 3 + 2)}
                          scrollScale={scrollScale}
                        />
                      )}
                    </Box>
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Grow>

          {!isMobile && visibleItems.details && (
            <Box sx={{ animation: `${slideInRight} 0.8s ease-out 0.6s both`, position: { lg: 'sticky' }, top: { lg: 20 } }}>
              <CompactDesktopDetails
                feature={activeFeature !== null ? uiFeatures[activeFeature] : null}
                isVisible={true}
                scrollScale={scrollScale}
              />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ClimateIntelligence;
