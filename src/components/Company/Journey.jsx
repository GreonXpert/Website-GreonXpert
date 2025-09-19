// website/src/components/Company/Journey.jsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Card,
  CardContent,
  useMediaQuery,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Chip,
  Avatar,
  Grid,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Handshake,
  VerifiedUser,
  DeveloperMode,
  Public,
  Timeline as TimelineIcon,
  Close,
  CheckCircle,
  Lightbulb,
  CloudQueue,
  DeviceHub,
  Business,
  TrendingUp,
  Launch,
  Star,
  ArrowForward,
  AutoAwesome,
  Assessment,
  Security,
  Science,
  Nature,
} from '@mui/icons-material';
import axios from 'axios';
import io from 'socket.io-client';
import { ImageIcon } from 'lucide-react';
import { API_BASE } from '../../utils/api';

// ===== API Configuration =====
const API_URL = `${API_BASE}/api/journey`;

// ===== Icon Mapping =====
const ICON_MAP = {
  Rocket,
  Handshake,
  VerifiedUser,
  DeveloperMode,
  Public,
  Lightbulb,
  CloudQueue,
  DeviceHub,
  Business,
  TrendingUp,
  Launch,
  CheckCircle,
  AutoAwesome,
  Assessment,
  Security,
  Science,
  Nature,
};

// Helper function to get icon component
const getIconComponent = (iconName) => {
  const IconComponent = ICON_MAP[iconName] || Rocket;
  return <IconComponent />;
};

// Helper function to get image src
const toImageSrc = (imageUrl) => {
  if (!imageUrl) return '';
  return /^https?:\/\//i.test(imageUrl) ? imageUrl : `${API_BASE}${imageUrl}`;
};

// Helper function to safe color
const safeColor = (hex) => (hex && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex) ? hex : '#1AC99F');

// Helper function to clean array data
const cleanArrayData = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(Boolean);
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [data];
    } catch {
      return [data];
    }
  }
  return [String(data)];
};

/* ===================== Enhanced Animations ===================== */
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

// Enhanced pulse glow with shimmer
const pulseGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(26, 201, 159, 0.4);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 0 20px rgba(26, 201, 159, 0);
    transform: scale(1.05);
  }
`;

// Glow animation
const glowAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(26, 201, 159, 0.3); }
  50% { box-shadow: 0 0 30px rgba(26, 201, 159, 0.6), 0 0 40px rgba(26, 201, 159, 0.4); }
`;

// Shimmer animation
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Rotate animation
const rotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Wave animation
const waveAnimation = keyframes`
  0%, 100% { transform: translateX(-50%) translateY(0px); }
  50% { transform: translateX(-50%) translateY(-20px); }
`;

// Text glow animation
const textGlowAnimation = keyframes`
  0%, 100% { text-shadow: 0 0 10px rgba(26, 201, 159, 0.3); }
  50% { text-shadow: 0 0 20px rgba(26, 201, 159, 0.6), 0 0 30px rgba(26, 201, 159, 0.4); }
`;

/* ===================== Animated Background Elements ===================== */
function AnimatedBackground({ theme }) {
  return (
    <>
      {/* Main floating orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '5%',
          width: { xs: 200, md: 300 },
          height: { xs: 200, md: 300 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}15, transparent 70%)`,
          animation: `${floatAnimation} 8s ease-in-out infinite`,
          filter: 'blur(1px)',
          zIndex: 0,
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '8%',
          width: { xs: 150, md: 220 },
          height: { xs: 150, md: 220 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.secondary.main}12, transparent 60%)`,
          animation: `${floatAnimation} 12s ease-in-out infinite reverse`,
          filter: 'blur(2px)',
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: { xs: 100, md: 160 },
          height: { xs: 100, md: 160 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}10, transparent 65%)`,
          animation: `${floatAnimation} 15s ease-in-out infinite`,
          filter: 'blur(1.5px)',
          zIndex: 0,
        }}
      />

      {/* Geometric floating dots */}
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          left: '20%',
          width: 6,
          height: 6,
          bgcolor: theme.palette.primary.main,
          borderRadius: '50%',
          animation: `${pulseAnimation} 3s ease-in-out infinite`,
          opacity: 0.6,
          zIndex: 0,
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: '75%',
          right: '25%',
          width: 4,
          height: 4,
          bgcolor: theme.palette.secondary.main,
          borderRadius: '50%',
          animation: `${pulseAnimation} 4s ease-in-out infinite`,
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: '45%',
          left: '10%',
          width: 8,
          height: 8,
          bgcolor: theme.palette.primary.main,
          borderRadius: '50%',
          animation: `${pulseAnimation} 5s ease-in-out infinite`,
          opacity: 0.4,
          zIndex: 0,
        }}
      />

      {/* Rotating rings */}
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          right: '30%',
          width: { xs: 80, md: 120 },
          height: { xs: 80, md: 120 },
          border: `1px solid ${theme.palette.primary.main}20`,
          borderRadius: '50%',
          animation: `${rotateAnimation} 25s linear infinite`,
          zIndex: 0,
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '35%',
          left: '25%',
          width: { xs: 60, md: 90 },
          height: { xs: 60, md: 90 },
          border: `1px solid ${theme.palette.secondary.main}25`,
          borderRadius: '50%',
          animation: `${rotateAnimation} 20s linear infinite reverse`,
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: '70%',
          left: '70%',
          width: { xs: 40, md: 70 },
          height: { xs: 40, md: 70 },
          border: `1px solid ${theme.palette.primary.main}30`,
          borderRadius: '50%',
          animation: `${rotateAnimation} 18s linear infinite`,
          zIndex: 0,
        }}
      />

      {/* Shimmer overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}04, transparent)`,
          animation: `${shimmer} 6s ease-in-out infinite`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Additional decorative gradient waves */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '120%', md: '100%' },
          height: { xs: '120%', md: '100%' },
          background: `radial-gradient(ellipse at center, transparent 40%, ${theme.palette.primary.main}02 60%, transparent 80%)`,
          animation: `${waveAnimation} 10s ease-in-out infinite`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
    </>
  );
}

/* ===================== Enhanced Image Carousel Component ===================== */
const ImageCarousel = ({ images, height = 300 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height, borderRadius: 2, overflow: 'hidden' }}>
      {/* Main Image Display */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${toImageSrc(images[currentIndex]?.url || images[currentIndex])})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'all 0.5s ease-in-out',
        }}
      />

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <IconButton
            onClick={prevImage}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.9)',
                transform: 'translateY(-50%) scale(1.1)',
              }
            }}
          >
            <ArrowForward sx={{ transform: 'rotate(180deg)', fontSize: 16 }} />
          </IconButton>

          <IconButton
            onClick={nextImage}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.9)',
                transform: 'translateY(-50%) scale(1.1)',
              }
            }}
          >
            <ArrowForward sx={{ fontSize: 16 }} />
          </IconButton>
        </>
      )}

      {/* Indicators */}
      {images.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {images.map((_, index) => (
            <IconButton
              key={index}
              onClick={() => goToImage(index)}
              sx={{
                p: 0,
                minWidth: 'auto',
                width: 12,
                height: 12,
                color: index === currentIndex ? '#1AC99F' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#1AC99F',
                  transform: 'scale(1.2)'
                }
              }}
            >
              <CheckCircle sx={{ fontSize: 12 }} />
            </IconButton>
          ))}
        </Stack>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            px: 2,
            py: 0.5,
            borderRadius: 2,
            bgcolor: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {currentIndex + 1} / {images.length}
        </Box>
      )}
    </Box>
  );
};

/* ===================== Enhanced Timeline Milestone Component ===================== */
const TimelineMilestone = ({ milestone, index, isActive, onClick }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.1 }}
      onClick={() => onClick(milestone)}
    >
      <Box
        sx={{
          position: 'relative',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${milestone.color}, ${milestone.color}dd)`,
          border: `3px solid ${isActive ? milestone.color : 'rgba(255,255,255,0.9)'}`,
          boxShadow: isActive 
            ? `0 0 30px ${milestone.color}50, 0 8px 25px rgba(0,0,0,0.15)`
            : '0 4px 15px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: isActive ? `${pulseGlow} 2s infinite` : 'none',
          zIndex: 10,
          
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: -8,
            borderRadius: '50%',
            background: `conic-gradient(from 0deg, ${milestone.color}20, transparent, ${milestone.color}20)`,
            opacity: isActive ? 1 : 0,
            transition: 'opacity 0.4s ease',
            animation: isActive ? `${rotateAnimation} 3s linear infinite` : 'none',
          },
          
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${milestone.color}08, transparent 70%)`,
            animation: `${floatAnimation} 4s ease-in-out infinite`,
            zIndex: -1,
          },
          
          '&:hover': {
            transform: 'scale(1.15)',
            boxShadow: `0 0 35px ${milestone.color}60, 0 12px 30px rgba(0,0,0,0.2)`,
            animation: `${pulseAnimation} 0.3s ease, ${glowAnimation} 2s ease-in-out infinite`,
          }
        }}
      >
        {React.cloneElement(getIconComponent(milestone.icon), {
          sx: { fontSize: 24, color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }
        })}
        
        {/* Enhanced Year Badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            background: `linear-gradient(45deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))`,
            border: `1px solid ${milestone.color}30`,
            backdropFilter: 'blur(10px)',
            animation: `${shimmer} 3s ease-in-out infinite`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.5rem',
              fontWeight: 800,
              background: `linear-gradient(45deg, ${milestone.color}, ${milestone.color}CC)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1,
            }}
          >
            {milestone.year}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

/* ===================== Enhanced Timeline Content Card ===================== */
const TimelineContentCard = ({ milestone, isLeft, index, onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get preview achievements and other data
  const previewAchievements = cleanArrayData(milestone.achievements).slice(0, 2);
  const previewTags = [
    ...cleanArrayData(milestone.badges),
    ...cleanArrayData(milestone.partners),
    ...cleanArrayData(milestone.platforms),
    ...cleanArrayData(milestone.products),
    ...cleanArrayData(milestone.sectors)
  ].slice(0, 3);
  
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        x: isMobile ? 0 : (isLeft ? -100 : 100),
        y: 30 
      }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        delay: index * 0.3, 
        duration: 0.8, 
        ease: "easeOut" 
      }}
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.3 } 
      }}
    >
      <Card
        onClick={() => onClick(milestone)}
        sx={{
          maxWidth: { xs: '100%', md: 480 },
          minHeight: 320,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          border: `2px solid ${milestone.color}20`,
          background: `linear-gradient(145deg, ${milestone.secondaryColor}, rgba(255,255,255,0.9))`,
          backdropFilter: 'blur(20px)',
          boxShadow: `0 15px 40px ${milestone.color}15, 0 8px 25px rgba(0,0,0,0.08)`,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          
          '&:hover': {
            borderColor: `${milestone.color}40`,
            boxShadow: `0 25px 60px ${milestone.color}25, 0 15px 40px rgba(0,0,0,0.12)`,
            transform: 'translateY(-12px)',
            
            '& .milestone-image': {
              transform: 'scale(1.08)',
            },
            
            '& .shimmer-effect': {
              animation: `${shimmer} 2s infinite`,
            },
            
            '& .learn-more-btn': {
              opacity: 1,
              transform: 'translateY(0)',
            }
          },
          
          // Enhanced arrow pointers
          ...((!isMobile && !isLeft) && {
            '&::before': {
              content: '""',
              position: 'absolute',
              left: -12,
              top: 80,
              width: 0,
              height: 0,
              borderTop: '12px solid transparent',
              borderBottom: '12px solid transparent',
              borderRight: `12px solid ${milestone.color}30`,
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))',
            }
          }),
          
          ...((!isMobile && isLeft) && {
            '&::before': {
              content: '""',
              position: 'absolute',
              right: -12,
              top: 80,
              width: 0,
              height: 0,
              borderTop: '12px solid transparent',
              borderBottom: '12px solid transparent',
              borderLeft: `12px solid ${milestone.color}30`,
              filter: 'drop-shadow(-2px 2px 4px rgba(0,0,0,0.1))',
            }
          }),
        }}
      >
        {/* Card background animation elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${milestone.color}10, transparent 70%)`,
            animation: `${floatAnimation} 6s ease-in-out infinite`,
            zIndex: 0,
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: '30%',
            left: '5%',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${milestone.color}08, transparent 60%)`,
            animation: `${floatAnimation} 8s ease-in-out infinite reverse`,
            zIndex: 0,
          }}
        />

        {/* Enhanced Header Image */}
        <Box
          sx={{
            position: 'relative',
            height: 120,
            overflow: 'hidden',
            borderRadius: '16px 16px 0 0',
          }}
        >
          <Box
            className="milestone-image"
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${toImageSrc(milestone.imageUrl || milestone.images?.[0]?.url)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: 'brightness(0.9)',
            }}
          />
          
          {/* Enhanced Gradient Overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${milestone.color}20 0%, transparent 50%, ${milestone.color}10 100%)`,
              zIndex: 1,
            }}
          />
          
          {/* Enhanced Shimmer Effect */}
          <Box
            className="shimmer-effect"
            sx={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
              backgroundSize: '200% 100%',
              zIndex: 2,
            }}
          />
          
          {/* Enhanced Year Badge */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              px: 2,
              py: 1,
              borderRadius: 2,
              background: `linear-gradient(45deg, ${milestone.color}, ${milestone.color}dd)`,
              color: 'white',
              fontWeight: 800,
              fontSize: '0.75rem',
              boxShadow: `0 4px 12px ${milestone.color}40`,
              zIndex: 3,
            }}
          >
            {milestone.year}
          </Box>
        </Box>

        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          {/* Enhanced Title & Subtitle */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: milestone.color,
              fontSize: '1.1rem',
              lineHeight: 1.2,
              mb: 0.5,
              background: `linear-gradient(45deg, ${milestone.color}, ${milestone.color}dd)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {milestone.title}
          </Typography>
          
          <Typography
            variant="subtitle2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.85rem',
              fontWeight: 600,
              mb: 2,
              opacity: 0.8,
            }}
          >
            {milestone.subtitle}
          </Typography>

          {/* Enhanced Bio */}
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.85rem',
              lineHeight: 1.6,
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {milestone.bio}
          </Typography>

          {/* Enhanced Key Highlights Preview */}
          {previewAchievements.length > 0 && (
            <Stack spacing={1} sx={{ mb: 2 }}>
              {previewAchievements.map((achievement, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.5,
                  }}
                >
                  <CheckCircle
                    sx={{
                      fontSize: 14,
                      color: milestone.color,
                      opacity: 0.8,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.75rem',
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                    }}
                  >
                    {achievement}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}

          {/* Enhanced Badges/Tags Preview */}
          {previewTags.length > 0 && (
            <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
              {previewTags.map((item, idx) => (
                <Chip
                  key={idx}
                  label={item}
                  size="small"
                  sx={{
                    fontSize: '0.65rem',
                    height: 24,
                    background: `linear-gradient(45deg, ${milestone.color}10, ${milestone.color}05)`,
                    color: milestone.color,
                    border: `1px solid ${milestone.color}20`,
                    fontWeight: 600,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${milestone.color}20, ${milestone.color}10)`,
                    }
                  }}
                />
              ))}
            </Stack>
          )}

          {/* Enhanced Learn More Button */}
          <Button
            className="learn-more-btn"
            endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
            sx={{
              opacity: 0.7,
              transform: 'translateY(5px)',
              transition: 'all 0.3s ease',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: `linear-gradient(45deg, ${milestone.color}10, ${milestone.color}05)`,
              color: milestone.color,
              border: `1px solid ${milestone.color}30`,
              borderRadius: 3,
              px: 3,
              py: 1,
              textTransform: 'none',
              '&:hover': {
                background: `linear-gradient(45deg, ${milestone.color}20, ${milestone.color}10)`,
                borderColor: `${milestone.color}50`,
                animation: `${pulseAnimation} 0.3s ease`,
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 12px ${milestone.color}20`,
              }
            }}
          >
            Learn More
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/* ===================== Enhanced Detail Dialog ===================== */
/* ===================== Enhanced Detail Dialog ===================== */
const DetailDialog = ({ milestone, open, onClose }) => {
  const theme = useTheme();

  if (!milestone) return null;

  const achievements = cleanArrayData(milestone.achievements);
  const highlights = cleanArrayData(milestone.highlights);
  const badges = cleanArrayData(milestone.badges);
  const partners = cleanArrayData(milestone.partners);
  const platforms = cleanArrayData(milestone.platforms);
  const products = cleanArrayData(milestone.products);
  const sectors = cleanArrayData(milestone.sectors);
  const logos = cleanArrayData(milestone.logos);

  // Combine all tags
  const allTags = [...badges, ...partners, ...platforms, ...products, ...sectors];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      {/* Enhanced Header with Close Button */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: `linear-gradient(135deg, ${milestone.color}15, ${milestone.color}08)`,
          backdropFilter: 'blur(20px)',
          borderBottom: `2px solid ${milestone.color}20`,
          px: { xs: 3, md: 4 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: `linear-gradient(135deg, ${milestone.color}, ${milestone.color}dd)`,
              boxShadow: `0 4px 12px ${milestone.color}30`,
            }}
          >
            {React.cloneElement(getIconComponent(milestone.icon), {
              sx: { fontSize: 20, color: '#fff' }
            })}
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(45deg, ${milestone.color}, ${milestone.color}dd)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.1rem',
              }}
            >
              {milestone.title}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.8rem',
                fontWeight: 600,
                opacity: 0.8,
              }}
            >
              {milestone.year} • {milestone.subtitle}
            </Typography>
          </Box>
        </Box>
        
        <IconButton
          onClick={onClose}
          sx={{
            width: 40,
            height: 40,
            background: 'rgba(255,255,255,0.9)',
            border: `1px solid ${milestone.color}20`,
            '&:hover': {
              background: 'rgba(255,255,255,1)',
              transform: 'scale(1.1)',
              boxShadow: `0 4px 12px ${milestone.color}20`,
            },
            transition: 'all 0.3s ease',
          }}
        >
          <Close sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, overflow: 'hidden', flex: 1 }}>
        {/* Enhanced Scrollable Content Area */}
        <Box
          sx={{
            height: 'calc(90vh - 120px)',
            overflowY: 'auto',
            px: { xs: 3, md: 4 },
            py: 3,
            // Custom scrollbar styling
            '&::-webkit-scrollbar': {
              width: 10,
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.05)',
              borderRadius: 5,
              margin: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: `linear-gradient(45deg, ${milestone.color}70, ${milestone.color}50)`,
              borderRadius: 5,
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                background: `linear-gradient(45deg, ${milestone.color}90, ${milestone.color}70)`,
              }
            },
            // Firefox scrollbar
            scrollbarWidth: 'thin',
            scrollbarColor: `${milestone.color}70 rgba(0,0,0,0.05)`,
          }}
        >
          {/* Enhanced Image Gallery */}
          {milestone.images && milestone.images.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: milestone.color,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    background: `linear-gradient(90deg, ${milestone.color}, transparent)`,
                    borderRadius: 2,
                  }
                }}
              >
                <ImageIcon sx={{ fontSize: 22 }} />
                Image Gallery
              </Typography>
              <ImageCarousel images={milestone.images} height={400} />
            </Box>
          )}

          {/* Enhanced Description Section */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: milestone.color,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 40,
                  height: 3,
                  background: `linear-gradient(90deg, ${milestone.color}, transparent)`,
                  borderRadius: 2,
                }
              }}
            >
              <Star sx={{ fontSize: 22 }} />
              Our Story
            </Typography>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(145deg, rgba(255,255,255,0.9), rgba(248,249,250,0.8))`,
                border: `1px solid ${milestone.color}15`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${milestone.color}08, transparent 70%)`,
                  filter: 'blur(20px)',
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.8,
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {milestone.description}
              </Typography>
            </Box>
          </Box>

          {/* Enhanced Key Highlights Section */}
          {highlights.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: milestone.color,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    background: `linear-gradient(90deg, ${milestone.color}, transparent)`,
                    borderRadius: 2,
                  }
                }}
              >
                <TrendingUp sx={{ fontSize: 22 }} />
                Key Highlights
              </Typography>
              <Grid container spacing={3}>
                {highlights.map((highlight, idx) => (
                  <Grid item xs={12} md={6} key={idx}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                    >
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 4,
                          background: `linear-gradient(135deg, ${milestone.color}08, ${milestone.color}04)`,
                          border: `1.5px solid ${milestone.color}25`,
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: 'default',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-6px) scale(1.02)',
                            boxShadow: `0 12px 40px ${milestone.color}20`,
                            borderColor: `${milestone.color}50`,
                          }
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -15,
                            right: -15,
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${milestone.color}20, transparent 70%)`,
                            animation: `${floatAnimation} 6s ease-in-out infinite`,
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: -10,
                            left: -10,
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${milestone.color}15, transparent 70%)`,
                            animation: `${floatAnimation} 8s ease-in-out infinite reverse`,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            position: 'relative',
                            zIndex: 1,
                            lineHeight: 1.6,
                          }}
                        >
                          {highlight}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Enhanced Achievements Section */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: milestone.color,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 40,
                  height: 3,
                  background: `linear-gradient(90deg, ${milestone.color}, transparent)`,
                  borderRadius: 2,
                }
              }}
            >
              <CheckCircle sx={{ fontSize: 22 }} />
              Key Achievements
            </Typography>
            <Stack spacing={2}>
              {achievements.map((achievement, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2.5,
                      p: 2.5,
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.7)',
                      border: `1px solid ${milestone.color}15`,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'default',
                      '&:hover': {
                        background: `${milestone.color}08`,
                        transform: 'translateX(8px)',
                        boxShadow: `0 8px 30px ${milestone.color}15`,
                        borderColor: `${milestone.color}30`,
                      }
                    }}
                  >
                    <CheckCircle
                      sx={{
                        fontSize: 20,
                        color: milestone.color,
                        flexShrink: 0,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 600,
                        lineHeight: 1.6,
                        fontSize: '0.95rem',
                      }}
                    >
                      {achievement}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Stack>
          </Box>

          {/* Enhanced Logo Images Section */}
          {milestone.logoImages && milestone.logoImages.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: milestone.color,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    background: `linear-gradient(90deg, ${milestone.color}, transparent)`,
                    borderRadius: 2,
                  }
                }}
              >
                <Business sx={{ fontSize: 22 }} />
                Partner Logos ({milestone.logoImages.length})
              </Typography>
              <Grid container spacing={3}>
                {milestone.logoImages.map((logo, idx) => (
                  <Grid item xs={6} sm={4} md={3} key={idx}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                    >
                      <Box
                        sx={{
                          aspectRatio: '1/1',
                          borderRadius: 4,
                          overflow: 'hidden',
                          background: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,249,250,0.8))`,
                          border: `2px solid ${milestone.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-8px) scale(1.05)',
                            boxShadow: `0 20px 50px ${milestone.color}25`,
                            borderColor: `${milestone.color}40`,
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            background: `linear-gradient(135deg, ${milestone.color}05, transparent, ${milestone.color}05)`,
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                          },
                          '&:hover::before': {
                            opacity: 1,
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: '80%',
                            height: '80%',
                            backgroundImage: `url(${toImageSrc(logo.url)})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
                            transition: 'filter 0.3s ease',
                            '&:hover': {
                              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
                            }
                          }}
                        />
                      </Box>
                      {logo.caption && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            textAlign: 'center',
                            mt: 1.5,
                            color: theme.palette.text.secondary,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        >
                          {logo.caption}
                        </Typography>
                      )}
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Enhanced Other Tags/Badges */}
          {(logos.length > 0 || allTags.length > 0) && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: milestone.color,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    background: `linear-gradient(90deg, ${milestone.color}, transparent)`,
                    borderRadius: 2,
                  }
                }}
              >
                <Business sx={{ fontSize: 22 }} />
                {badges.length > 0 ? 'Recognition & Certifications' :
                 partners.length > 0 ? 'Strategic Partners' :
                 platforms.length > 0 ? 'Technology Platforms' :
                 products.length > 0 ? 'Product Suite' :
                 sectors.length > 0 ? 'Industry Sectors' :
                 logos.length > 0 ? 'Partners & Recognition' : 'Details'}
              </Typography>

              {/* Enhanced Logos Display */}
              {logos.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {logos.map((logo, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                      >
                        <Box
                          sx={{
                            p: 4,
                            borderRadius: 4,
                            background: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,249,250,0.8))`,
                            border: `2px solid ${milestone.color}20`,
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'default',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              transform: 'translateY(-6px)',
                              boxShadow: `0 16px 50px ${milestone.color}20`,
                              borderColor: `${milestone.color}40`,
                            }
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              inset: 0,
                              background: `conic-gradient(from 0deg, ${milestone.color}08, transparent, ${milestone.color}08)`,
                              animation: `${rotateAnimation} 15s linear infinite`,
                              opacity: 0.7,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: milestone.color,
                              position: 'relative',
                              zIndex: 1,
                              fontSize: '0.9rem',
                            }}
                          >
                            {logo}
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Enhanced Other Tags/Badges */}
              {allTags.length > 0 && (
                <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                  {allTags.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                    >
                      <Chip
                        label={item}
                        sx={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          height: 36,
                          background: `linear-gradient(135deg, ${milestone.color}15, ${milestone.color}08)`,
                          color: milestone.color,
                          border: `1.5px solid ${milestone.color}30`,
                          cursor: 'default',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            background: `linear-gradient(135deg, ${milestone.color}25, ${milestone.color}15)`,
                            transform: 'translateY(-4px) scale(1.05)',
                            boxShadow: `0 8px 25px ${milestone.color}25`,
                            borderColor: `${milestone.color}50`,
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </Stack>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};


/* ===================== Enhanced Main Journey Component ===================== */
const Journey = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const containerRef = useRef(null);
  const socketRef = useRef(null);
  
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [journeyData, setJourneyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isRefReady, setIsRefReady] = useState(false);

    // ✅ FIX: Only initialize useScroll when ref is ready
  const scrollOptions = isRefReady && containerRef.current ? {
    target: containerRef,
    offset: ["start end", "end start"],
    layoutEffect: false // This prevents hydration issues
  } : {};

  const { scrollYProgress } = useScroll(scrollOptions);
  const timelineProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // ✅ FIX: Ensure ref is properly hydrated
  useEffect(() => {
    const checkRef = () => {
      if (containerRef.current) {
        setIsRefReady(true);
      } else {
        // Retry after a short delay
        setTimeout(checkRef, 100);
      }
    };
    
    checkRef();
  }, []);

  // ✅ FIX: Only use scroll progress when everything is ready
  useEffect(() => {
    if (!isRefReady || !containerRef.current || journeyData.length === 0) return;

    const unsubscribe = scrollYProgress.on('change', (progress) => {
      const milestoneIndex = Math.floor(progress * journeyData.length);
      setActiveMilestone(Math.min(milestoneIndex, journeyData.length - 1));
    });

    return unsubscribe;
  }, [scrollYProgress, journeyData.length, isRefReady]);

  // ✅ FIX: Always call useTransform at top level  

  // ✅ FIX: Proper mounting detection
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // ===== Data Fetching with Socket.IO =====
  useEffect(() => {
    const loadJourneyData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching journey milestones...');
        const res = await axios.get(API_URL);
        
        if (res.data?.success && Array.isArray(res.data.data)) {
          const normalized = res.data.data.map((milestone) => ({
            id: milestone._id || milestone.id,
            year: milestone.year || '',
            title: milestone.title || '',
            subtitle: milestone.subtitle || '',
            bio: milestone.bio || '',
            summary: milestone.summary || '',
            description: milestone.description || '',
            achievements: cleanArrayData(milestone.achievements),
            highlights: cleanArrayData(milestone.highlights),
            badges: cleanArrayData(milestone.badges),
            partners: cleanArrayData(milestone.partners),
            platforms: cleanArrayData(milestone.platforms),
            products: cleanArrayData(milestone.products),
            sectors: cleanArrayData(milestone.sectors),
            logos: cleanArrayData(milestone.logos),
            imageUrl: toImageSrc(milestone.imageUrl),
            images: milestone.images || [],
            logoImages: milestone.logoImages || [],
            color: safeColor(milestone.color),
            secondaryColor: milestone.secondaryColor || '#E8F8F4',
            icon: milestone.icon || 'Rocket',
            side: milestone.side || 'right',
            status: milestone.status || 'published',
            displayOrder: milestone.displayOrder || 0,
          }));

          // Sort by display order and year
          normalized.sort((a, b) => {
            if (a.displayOrder !== b.displayOrder) {
              return a.displayOrder - b.displayOrder;
            }
            return parseInt(a.year) - parseInt(b.year);
          });

          setJourneyData(normalized);
          console.log(`✅ Loaded ${normalized.length} journey milestones`);
        } else {
          setJourneyData([]);
          console.log('⚠️ No journey milestones found');
        }
      } catch (error) {
        console.error('❌ Failed to fetch journey milestones:', error);
        setJourneyData([]);
      } finally {
        setLoading(false);
      }
    };

    loadJourneyData();

    // Initialize Socket.IO for real-time updates
    console.log('🔌 Connecting to Journey Socket.IO...');
    const socket = io(API_BASE);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Journey Socket Connected:', socket.id);
      socket.emit('join-journey-room', 'journey-public');
    });

    // Listen for real-time updates
    socket.on('journey-updated', (payload) => {
      console.log('🔄 Real-time journey update received:', payload.action);
      if (payload?.success && Array.isArray(payload.data)) {
        const normalized = payload.data.map((milestone) => ({
          id: milestone._id || milestone.id,
          year: milestone.year || '',
          title: milestone.title || '',
          subtitle: milestone.subtitle || '',
          bio: milestone.bio || '',
          summary: milestone.summary || '',
          description: milestone.description || '',
          achievements: cleanArrayData(milestone.achievements),
          highlights: cleanArrayData(milestone.highlights),
          badges: cleanArrayData(milestone.badges),
          partners: cleanArrayData(milestone.partners),
          platforms: cleanArrayData(milestone.platforms),
          products: cleanArrayData(milestone.products),
          sectors: cleanArrayData(milestone.sectors),
          logos: cleanArrayData(milestone.logos),
          imageUrl: toImageSrc(milestone.imageUrl),
          images: milestone.images || [],
          logoImages: milestone.logoImages || [],
          color: safeColor(milestone.color),
          secondaryColor: milestone.secondaryColor || '#E8F8F4',
          icon: milestone.icon || 'Rocket',
          side: milestone.side || 'right',
          status: milestone.status || 'published',
          displayOrder: milestone.displayOrder || 0,
        }));

        // Sort by display order and year
        normalized.sort((a, b) => {
          if (a.displayOrder !== b.displayOrder) {
            return a.displayOrder - b.displayOrder;
          }
          return parseInt(a.year) - parseInt(b.year);
        });

        setJourneyData(normalized);
      }
    });

    socket.on('journey-error', (error) => {
      console.error('❌ Journey Socket Error:', error);
    });

    socket.on('disconnect', () => {
      console.log('❌ Journey Socket Disconnected');
    });

    // Request initial data via socket
    socket.emit('request-journey-data');

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);
  
  // Handle milestone/card selection
  const handleMilestoneClick = useCallback((milestone) => {
    setSelectedMilestone(milestone);
  }, []);
  
  // ✅ FIX: Only use scroll progress when component is mounted and data is ready
  useEffect(() => {
    if (!isMounted || journeyData.length === 0) return;
    
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      const milestoneIndex = Math.floor(progress * journeyData.length);
      setActiveMilestone(Math.min(milestoneIndex, journeyData.length - 1));
    });
    
    return unsubscribe;
  }, [scrollYProgress, journeyData.length, isMounted]);
  
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248,249,250,0.95) 50%, #f0fdfb 100%)`,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 8px 25px ${theme.palette.primary.main}30`,
            }}
          >
            <TimelineIcon sx={{ fontSize: 28 }} />
          </Avatar>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        minHeight: '100vh',
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248,249,250,0.95) 50%, #f0fdfb 100%)`,
      }}
    >
      {/* Enhanced Animated Background Elements */}
      <AnimatedBackground theme={theme} />

      <Container maxWidth="lg">
        {/* Enhanced Header Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: `0 8px 25px ${theme.palette.primary.main}30`,
                  animation: `${glowAnimation} 2s ease-in-out infinite`,
                }}
              >
                <TimelineIcon sx={{ fontSize: 24 }} />
              </Avatar>
              <Chip
                label="OUR JOURNEY"
                sx={{
                  px: 3,
                  py: 2,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  fontSize: '0.75rem',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                  border: `1px solid ${theme.palette.primary.main}30`,
                  color: theme.palette.primary.main,
                  animation: `${shimmer} 4s ease-in-out infinite`,
                }}
              />
            </Stack>
            
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                animation: `${textGlowAnimation} 3s ease-in-out infinite`,
              }}
            >
              From Vision to Reality
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: 600,
                mx: 'auto',
                opacity: 0.9,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              }}
            >
              Discover our transformation from a sustainability consultancy to an AI-powered platform
              leading the climate action revolution across industries worldwide.
            </Typography>
          </motion.div>
        </Box>

        {/* Enhanced Timeline Section */}
        {isMounted && journeyData.length > 0 && (
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Enhanced Central Timeline Line */}
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 4,
                height: '100%',
                background: `linear-gradient(to bottom, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20, ${theme.palette.primary.main}20)`,
                borderRadius: 2,
                display: { xs: 'none', md: 'block' },
                zIndex: 0,
              }}
            />
            
            {/* ✅ FIX: Animated Progress Line - only render when ready */}
            <motion.div
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 4,
                background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: 2,
                display: 'none',
                zIndex: 1,
                boxShadow: `0 0 20px ${theme.palette.primary.main}50`,
                height: timelineProgress,
              }}
              initial={{ height: 0 }}
              animate={{ height: timelineProgress }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />

            {/* Enhanced Mobile Timeline Line */}
            <Box
              sx={{
                position: 'absolute',
                left: 30,
                top: 0,
                width: 4,
                height: '100%',
                background: `linear-gradient(to bottom, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20, ${theme.palette.primary.main}20)`,
                borderRadius: 2,
                display: { xs: 'block', md: 'none' },
                zIndex: 0,
              }}
            />

            {/* Enhanced Timeline Items */}
            {journeyData.map((milestone, index) => (
              <Box
                key={milestone.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: { xs: 6, md: 12 },
                  position: 'relative',
                  flexDirection: { xs: 'row', md: milestone.side === 'left' ? 'row-reverse' : 'row' },
                }}
              >
                {/* Enhanced Content Card */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: { 
                      xs: 'flex-start', 
                      md: milestone.side === 'left' ? 'flex-start' : 'flex-end' 
                    },
                    pl: { xs: 10, md: milestone.side === 'left' ? 0 : 4 },
                    pr: { xs: 0, md: milestone.side === 'left' ? 4 : 0 },
                  }}
                >
                  <TimelineContentCard
                    milestone={milestone}
                    isLeft={milestone.side === 'left'}
                    index={index}
                    onClick={handleMilestoneClick}
                  />
                </Box>

                {/* Enhanced Milestone Bubble */}
                <Box
                  sx={{
                    position: { xs: 'absolute', md: 'static' },
                    left: { xs: 8, md: 'auto' },
                    top: { xs: 20, md: 'auto' },
                    zIndex: 10,
                  }}
                >
                  <TimelineMilestone
                    milestone={milestone}
                    index={index}
                    isActive={activeMilestone === index}
                    onClick={handleMilestoneClick}
                  />
                </Box>

                {/* Spacer for desktop layout */}
                <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
              </Box>
            ))}
          </Box>
        )}

        {/* No Data State */}
        {!loading && journeyData.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              color: theme.palette.text.secondary,
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                color: theme.palette.primary.main,
              }}
            >
              <TimelineIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              No Journey Milestones Found
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              Our journey timeline is currently being updated. Please check back soon!
            </Typography>
          </Box>
        )}
      </Container>

      {/* Enhanced Detail Dialog */}
      <DetailDialog
        milestone={selectedMilestone}
        open={Boolean(selectedMilestone)}
        onClose={() => setSelectedMilestone(null)}
      />
    </Box>
  );
};

export default Journey;
