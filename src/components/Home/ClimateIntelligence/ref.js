// src/components/Home/ClimateIntelligence/index.js
import React, { useState, useEffect } from 'react';
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
} from '@mui/icons-material';

import dashboard1 from '../../../assests/Solutions/ZeroCarbon.png';
import dashboard2 from '../../../assests/Solutions/ESGLink.jpg';
import dashboard3 from '../../../assests/Solutions/ZeroCarbon/4.png'

// Refined animations (keeping original effects)
const floatAnimation = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-8px) rotate(5deg); 
  }
`;

const pulseGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 12px rgba(26, 201, 159, 0.2);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 24px rgba(26, 201, 159, 0.4);
    transform: scale(1.01);
  }
`;

const shimmerEffect = keyframes`
  0% { 
    background-position: -100% 0; 
  }
  100% { 
    background-position: 100% 0; 
  }
`;

const slideInLeft = keyframes`
  0% { 
    opacity: 0; 
    transform: translateX(-20px); 
  }
  100% { 
    opacity: 1; 
    transform: translateX(0); 
  }
`;

const slideInRight = keyframes`
  0% { 
    opacity: 0; 
    transform: translateX(20px); 
  }
  100% { 
    opacity: 1; 
    transform: translateX(0); 
  }
`;

const slideDown = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(-20px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

// Compact Feature Card Component
// Compact Feature Card Component - FULLY FIXED
const CompactFeatureCard = ({ feature, isActive, onActivate, index, isMobile }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    switch (feature.shape) {
      case 'Automate':
        return <DashboardIcon sx={{ fontSize: { xs: 28, sm: 32, md: 36 } }} />;
      case 'Decarbonize':
        return <SettingsIcon sx={{ fontSize: { xs: 28, sm: 32, md: 36 } }} />;
      case 'Disclose':
        return <TrendingUpIcon sx={{ fontSize: { xs: 28, sm: 32, md: 36 } }} />;
      default:
        return <DashboardIcon sx={{ fontSize: { xs: 28, sm: 32, md: 36 } }} />;
    }
  };

  // Determine if this is the full-width card (third card)
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
      {/* Main Card */}
      <Card
        sx={{
          width: '100%',
          height: isMobile ? 'auto' : 220, // Increased height from 200 to 220 for more text space
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
          
          // Shimmer effect
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
            p: isMobile ? 0 : 1.5, // Slightly increased padding
            position: 'relative',
            zIndex: 2,
            '&:last-child': { pb: isMobile ? 0 : 1.5 }
          }}
        >
          {/* Icon and Content Container */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              alignItems: 'center',
              gap: isMobile ? 2.5 : 1.5, // Restored gap for better spacing
              flex: 1,
              width: '100%',
            }}
          >
            {/* Icon */}
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
              {getIcon()}
            </Box>

            {/* Text Content Container */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? 0.5 : 0.8, // Increased gap for better spacing
                flex: isMobile ? 1 : 'none',
                width: isMobile ? 'auto' : '100%',
                textAlign: isMobile ? 'left' : 'center',
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: isActive ? feature.colorHex : theme.palette.text.primary,
                  fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' },
                  letterSpacing: '0.2px',
                  transition: 'all 0.3s ease',
                  lineHeight: 1.2,
                  mb: 0.3, // Slightly increased margin bottom
                }}
              >
                {feature.title}
              </Typography>
              
              {/* Description - FULLY FIXED VERSION */}
              <Typography
                variant="body2"
                sx={{
                  color: isActive 
                    ? theme.palette.text.primary
                    : theme.palette.text.secondary,
                  fontSize: { 
                    xs: '0.8rem', 
                    sm: '0.85rem', 
                    md: isFullWidthCard ? '0.95rem' : '0.87rem' // Consistent sizing
                  },
                  fontWeight: 500,
                  lineHeight: 1.5, // Increased line height for better readability
                  maxWidth: isMobile 
                    ? '100%' 
                    : isFullWidthCard 
                      ? 500 // Increased for full-width card
                      : 250, // Significantly increased from 180 to 250 for half-width cards
                  opacity: 1,
                  transition: 'all 0.3s ease',
                  display: '-webkit-box',
                  WebkitLineClamp: isMobile 
                    ? 3 // Increased from 2 to 3 for mobile
                    : isFullWidthCard 
                      ? 3 // Increased from 2 to 3 for full-width card
                      : 4, // Increased from 3 to 4 for smaller cards
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  // Enhanced text shadow for better readability
                  textShadow: isActive ? `0 1px 3px ${feature.colorHex}25` : '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          </Box>

          {/* Mobile expand/collapse indicator */}
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

        {/* Floating particles for active state */}
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

      {/* Active Label - Desktop only */}
      {isActive && !isMobile && (
        <Chip
          label={feature.shape.toUpperCase()}
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
        {/* Compact Key Capabilities */}
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
              '&::-webkit-scrollbar': {
                width: 4,
              },
              '&::-webkit-scrollbar-track': {
                background: `${feature.colorHex}05`,
                borderRadius: 2,
              },
              '&::-webkit-scrollbar-thumb': {
                background: feature.colorHex,
                borderRadius: 2,
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
                  p: 3,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${feature.colorHex}03, ${feature.colorHex}05)`,
                  border: `1px solid ${feature.colorHex}10`,
                }}
              >
                <CheckIcon 
                  sx={{ 
                    color: feature.colorHex, 
                    fontSize: 16,
                    mt: 0.1,
                    flexShrink: 0,
                  }} 
                />
                <Typography
                  variant="body2"
                  sx={{ 
                    fontSize: '0.85rem', 
                    lineHeight: 1.5,
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  }}
                >
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

// Compact Desktop Details Panel - WITH IMAGE SECTION
const CompactDesktopDetails = ({ feature, isVisible }) => {
  const theme = useTheme();
  const [imageEnlarged, setImageEnlarged] = useState(false);

  // Image mapping for each feature
  const getFeatureImage = (shape) => {
    const imageMap = {
      'Automate':dashboard1, // Replace with your actual image paths
      'Decarbonize': dashboard3,
      'Disclose': dashboard2,
    };
    return imageMap[shape] || '/images/default-feature.jpg';
  };

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
          <Box
            sx={{
              animation: `${floatAnimation} 3s ease-in-out infinite`,
              mb: 2.5,
            }}
          >
            <ClickAwayIcon 
              sx={{ 
                fontSize: 50,
                color: theme.palette.primary.main,
                filter: `drop-shadow(0 0 8px ${theme.palette.primary.main}20)`,
              }} 
            />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontSize: '1.5rem',
              mb: 1.5,
            }}
          >
            Discover Features
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: '1rem',
              lineHeight: 1.5,
            }}
          >
            Click on any feature card to explore capabilities
          </Typography>
        </Box>
      </Card>
    );
  }

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
            {/* Feature Image Section - WITH ACTUAL IMAGES */}
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
              {/* Main Feature Image */}
              <Box
                component="img"
                src={getFeatureImage(feature.shape)}
                alt={`${feature.title} feature illustration`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transition: 'all 0.3s ease',
                }}
                onError={(e) => {
                  // Fallback if image doesn't load - show gradient with icon
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Fallback Background (shown if image fails to load) */}
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
                {/* Fallback Icon */}
                <Box
                  sx={{
                    color: feature.colorHex,
                    filter: `drop-shadow(0 4px 12px ${feature.colorHex}30)`,
                    opacity: 0.7,
                  }}
                >
                  {feature.shape === 'Automate' && <DashboardIcon sx={{ fontSize: 40 }} />}
                  {feature.shape === 'Decarbonize' && <SettingsIcon sx={{ fontSize: 40 }} />}
                  {feature.shape === 'Disclose' && <TrendingUpIcon sx={{ fontSize: 40 }} />}
                </Box>
              </Box>

              {/* Color Overlay for Image Tinting */}
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

              {/* Enlarge Icon Overlay */}
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
                <Box
                  component="svg"
                  sx={{ 
                    width: 16, 
                    height: 16, 
                    color: theme.palette.text.primary 
                  }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
                </Box>
              </Box>
            </Box>

            {/* Header Section */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 2.5,
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  background: `${feature.colorHex}10`,
                  color: feature.colorHex,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <InsightsIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontSize: '1.15rem',
                  lineHeight: 1.2,
                }}
              >
                Key Capabilities
              </Typography>
            </Box>
            
            {/* Scrollable Content */}
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
                
                '&::-webkit-scrollbar': {
                  width: 6,
                },
                '&::-webkit-scrollbar-track': {
                  background: `${feature.colorHex}08`,
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-thumb': {
                  background: `linear-gradient(180deg, ${feature.colorHex}, ${feature.colorHex}CC)`,
                  borderRadius: 3,
                  '&:hover': {
                    background: feature.colorHex,
                  }
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
                  <Box
                    sx={{
                      p: 0.5,
                      borderRadius: 1.2,
                      background: feature.colorHex,
                      color: 'white',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24,
                      height: 24,
                      mt: 0.1,
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 14 }} />
                  </Box>
                  
                  <Typography
                    variant="body2"
                    sx={{ 
                      fontSize: '0.92rem', 
                      lineHeight: 1.6,
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      flex: 1,
                      wordBreak: 'break-word',
                    }}
                  >
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>

          {/* Background Accent */}
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

      {/* Image Enlarged Modal - WITH ACTUAL IMAGES */}
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
          {/* Enlarged Image */}
          <Box
            component="img"
            src={getFeatureImage(feature.shape)}
            alt={`${feature.title} feature - enlarged view`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            onError={(e) => {
              // Fallback for enlarged view
              e.target.style.display = 'none';
            }}
          />

          {/* Fallback for Enlarged Modal */}
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
            <Box
              sx={{
                color: feature.colorHex,
                filter: `drop-shadow(0 8px 24px ${feature.colorHex}40)`,
                transform: 'scale(2.5)',
              }}
            >
              {feature.shape === 'Automate' && <DashboardIcon sx={{ fontSize: 60 }} />}
              {feature.shape === 'Decarbonize' && <SettingsIcon sx={{ fontSize: 60 }} />}
              {feature.shape === 'Disclose' && <TrendingUpIcon sx={{ fontSize: 60 }} />}
            </Box>
          </Box>

          {/* Color Overlay for Enlarged Image */}
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

          {/* Close button */}
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
              '&:hover': {
                background: 'white',
                transform: 'scale(1.1)',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.4)',
              }
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      id: 'automate',
      icon: <DashboardIcon />,
      title: 'Automate',
      description: 'Bring all emission sources together for real-time centralized control and comprehensive monitoring.',
      colorHex: '#1AC99F',
      shape: 'Automate',
      benefits: [
        'Live emission tracking across all scopes',
        'Real-time data visualization dashboards',
        'Instant alerts for emission anomalies',
        'Source-level carbon footprint mapping',
        'Automated data collection systems',
        'Integration with existing business systems',
        'Custom reporting workflows',
        'Multi-location monitoring capabilities'
      ]
    },
    {
      id: 'decarbonize',
      icon: <SettingsIcon />,
      title: 'Decarbonize',
      description: 'Enable targeted climate action through precise carbon measurement and strategic planning.',
      colorHex: '#2E8B8B',
      shape: 'Decarbonize',
      benefits: [
        'Automated ESG report generation',
        'Regulatory compliance management',
        'Workflow optimization tools',
        'Multi-framework reporting support',
        'Carbon reduction strategy planning',
        'Science-based target alignment',
        'Supply chain emissions tracking',
        'Investment impact assessment'
      ]
    },
    {
      id: 'disclose',
      icon: <TrendingUpIcon />,
      title: 'Disclose',
      description: 'Share your sustainability data with clarity, confidence, and transparency to stakeholders.',
      colorHex: '#3498db',
      shape: 'Disclose',
      benefits: [
        'AI-powered reduction strategies',
        'Science-based target setting',
        'Carbon offset recommendations',
        'ROI-focused action plans',
        'Stakeholder reporting templates',
        'Third-party verification support',
        'Public disclosure frameworks',
        'Investor-ready sustainability reports'
      ]
    }
  ];

  if (!mounted) {
    return null;
  }

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
      {/* Background Elements */}
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
        {/* Compact Header */}
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
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  fontSize: '0.75rem',
                }}
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
          {/* Feature Cards Section - 2+1 Layout */}
          <Box
            sx={{
              display: isMobile ? 'flex' : 'grid',
              flexDirection: isMobile ? 'column' : undefined,
              gridTemplateColumns: isMobile ? undefined : { md: '1fr 1fr' },
              gridTemplateRows: isMobile ? undefined : { md: 'auto auto' },
              gap: { xs: 2.5, md: 3 },
              mb: isMobile ? 3 : 0,
            }}
          >
            {/* First Row - 2 Cards */}
            {features.slice(0, 2).map((feature, index) => (
              <Box key={feature.id}>
                <CompactFeatureCard
                  feature={feature}
                  isActive={activeFeature === index}
                  onActivate={() => setActiveFeature(activeFeature === index ? null : index)}
                  index={index}
                  isMobile={isMobile}
                />
                
                {/* Mobile Details */}
                {isMobile && (
                  <CompactMobileDetails
                    feature={feature}
                    isOpen={activeFeature === index}
                  />
                )}
              </Box>
            ))}
            
            {/* Second Row - 1 Card (Full Width) */}
            <Box sx={{ gridColumn: { md: '1 / -1' } }}>
              <CompactFeatureCard
                feature={features[2]}
                isActive={activeFeature === 2}
                onActivate={() => setActiveFeature(activeFeature === 2 ? null : 2)}
                index={2}
                isMobile={isMobile}
              />
              
              {/* Mobile Details */}
              {isMobile && (
                <CompactMobileDetails
                  feature={features[2]}
                  isOpen={activeFeature === 2}
                />
              )}
            </Box>
          </Box>

          {/* Desktop Details Panel */}
          {!isMobile && (
            <Box
              sx={{
                animation: `${slideInRight} 0.8s ease-out 0.6s both`,
                position: { lg: 'sticky' },
                top: { lg: 20 },
              }}
            >
              <CompactDesktopDetails 
                feature={activeFeature !== null ? features[activeFeature] : null}
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



