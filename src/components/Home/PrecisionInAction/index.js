// src/components/Home/PrecisionInAction/index.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
  Chip,
  Button,
  Grow,
  Zoom
} from '@mui/material';
import { keyframes } from '@emotion/react';
import VerifiedIcon from '@mui/icons-material/Verified';
import SettingsIcon from '@mui/icons-material/Settings';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldIcon from '@mui/icons-material/Shield';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import SpeedIcon from '@mui/icons-material/Speed';

// Advanced animations
const glowPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 15px currentColor, 0 0 30px currentColor;
    filter: brightness(1);
  }
  50% { 
    box-shadow: 0 0 25px currentColor, 0 0 50px currentColor;
    filter: brightness(1.2);
  }
`;

const floatAnimation = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
  }
  25% { 
    transform: translateY(-10px) rotate(1deg);
  }
  50% { 
    transform: translateY(-15px) rotate(0deg);
  }
  75% { 
    transform: translateY(-10px) rotate(-1deg);
  }
`;

const slideInFromLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const shimmerEffect = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const rotateGlow = keyframes`
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
`;

const iconPulse = keyframes`
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.1) rotate(0deg);
  }
`;

const iconFloat = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

// Enhanced Compact Icon Component
const CompactIcon = ({ feature, isActive, isHovered }) => {
  const getIcon = () => {
    switch (feature.id) {
      case 'data-confidence':
        return <ShieldIcon sx={{ fontSize: { xs: 50, md: 60 } }} />;
      case 'compliance-automation':
        return <PrecisionManufacturingIcon sx={{ fontSize: { xs: 50, md: 60 } }} />;
      case 'impact-acceleration':
        return <SpeedIcon sx={{ fontSize: { xs: 50, md: 60 } }} />;
      default:
        return <VerifiedIcon sx={{ fontSize: { xs: 50, md: 60 } }} />;
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: { xs: 80, md: 90 },
        height: { xs: 80, md: 90 },
        borderRadius: '50%',
        background: isActive || isHovered 
          ? `radial-gradient(circle, ${feature.colorHex}25 0%, ${feature.colorHex}15 50%, transparent 100%)`
          : `radial-gradient(circle, ${feature.colorHex}15 0%, transparent 70%)`,
        border: isActive || isHovered 
          ? `3px solid ${feature.colorHex}`
          : `2px solid ${feature.colorHex}60`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -4,
          left: -4,
          right: -4,
          bottom: -4,
          borderRadius: '50%',
          background: isActive || isHovered 
            ? `conic-gradient(from 0deg, ${feature.colorHex}, transparent, ${feature.colorHex})`
            : 'none',
          animation: (isActive || isHovered) ? `${rotateGlow} 3s linear infinite` : 'none',
          zIndex: -1,
          opacity: 0.7,
        },
      }}
    >
      <Box
        sx={{
          color: feature.colorHex,
          filter: isActive || isHovered 
            ? `drop-shadow(0 0 15px ${feature.colorHex}) drop-shadow(0 0 25px ${feature.colorHex}60)`
            : `drop-shadow(0 0 8px ${feature.colorHex}60)`,
          animation: isActive 
            ? `${iconPulse} 2s ease-in-out infinite, ${iconFloat} 3s ease-in-out infinite`
            : isHovered 
              ? `${iconFloat} 2s ease-in-out infinite`
              : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {getIcon()}
      </Box>

      {/* Compact orbiting particles */}
      {(isActive || isHovered) && (
        <>
          {[...Array(4)].map((_, i) => {
            const angle = (i * 360) / 4;
            const radius = 50;
            return (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: feature.colorHex,
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px)`,
                  animation: `${rotateGlow} ${2 + i * 0.3}s linear infinite`,
                  boxShadow: `0 0 8px ${feature.colorHex}`,
                  opacity: 0.8,
                }}
              />
            );
          })}
        </>
      )}
    </Box>
  );
};

// Compact Feature Card Component
const CompactFeatureCard = ({ feature, isActive, onActivate, index }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [transform, setTransform] = useState('');

  // Mouse movement handler for subtle 3D tilt effect
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || isMobile) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (mouseY / rect.height) * -8;
    const rotateY = (mouseX / rect.width) * 8;
    
    const newTransform = `
      perspective(800px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateZ(10px)
      scale(${isActive ? 1.03 : 1.01})
    `;
    
    setTransform(newTransform);
    setMousePosition({ 
      x: (mouseX / rect.width) * 100 + 50, 
      y: (mouseY / rect.height) * 100 + 50 
    });
  }, [isMobile, isActive]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)');
    setMousePosition({ x: 50, y: 50 });
  }, []);

  const throttledMouseMove = useCallback(
    throttle(handleMouseMove, 16),
    [handleMouseMove]
  );

  return (
    <Zoom in timeout={600 + index * 200}>
      <Box
        ref={cardRef}
        onClick={onActivate}
        onMouseMove={throttledMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: transform || 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Compact Card */}
        <Box
          sx={{
            width: { xs: 280, sm: 320, md: 340 },
            height: { xs: 380, sm: 420, md: 440 },
            background: isHovered 
              ? `linear-gradient(135deg at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)`
              : 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: isActive 
              ? `2px solid ${feature.colorHex}` 
              : isHovered 
                ? `2px solid ${feature.colorHex}60`
                : '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: isActive 
              ? `0 20px 40px ${feature.colorHex}25, 0 0 0 1px ${feature.colorHex}15`
              : isHovered
                ? `0 15px 30px rgba(0, 0, 0, 0.12), 0 0 20px ${feature.colorHex}15`
                : '0 10px 25px rgba(0, 0, 0, 0.08)',
            p: { xs: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1,
            
            // Subtle shimmer effect
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isHovered || isActive
                ? `linear-gradient(45deg, transparent 30%, ${feature.colorHex}08 50%, transparent 70%)`
                : 'none',
              animation: (isActive || isHovered) ? `${shimmerEffect} 3s linear infinite` : 'none',
              pointerEvents: 'none',
              opacity: 0.6,
            },
          }}
        >
          {/* Interactive light spot */}
          {isHovered && (
            <Box
              sx={{
                position: 'absolute',
                top: `${mousePosition.y}%`,
                left: `${mousePosition.x}%`,
                width: 80,
                height: 80,
                background: `radial-gradient(circle, ${feature.colorHex}15 0%, transparent 70%)`,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.1s ease',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}

          {/* Compact Icon */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
              transform: isHovered ? 'translateZ(15px) scale(1.05)' : 'translateZ(0px) scale(1)',
              transition: 'all 0.3s ease',
            }}
          >
            <CompactIcon feature={feature} isActive={isActive} isHovered={isHovered} />
          </Box>

          {/* Compact Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 2,
              color: isActive ? feature.colorHex : theme.palette.text.primary,
              fontSize: { xs: '1.4rem', md: '1.6rem' },
              textShadow: isActive || isHovered 
                ? `0 0 15px ${feature.colorHex}50` 
                : 'none',
              transform: isHovered ? 'translateZ(10px)' : 'translateZ(0px)',
              transition: 'all 0.3s ease',
            }}
          >
            {feature.title}
          </Typography>

          {/* Compact Description */}
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.9rem', md: '1rem' },
              lineHeight: 1.6,
              mb: 4,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              transform: isHovered ? 'translateZ(8px)' : 'translateZ(0px)',
              transition: 'all 0.3s ease',
            }}
          >
            {feature.description}
          </Typography>

          {/* Compact CTA Button */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 'auto',
              transform: isHovered ? 'translateZ(12px)' : 'translateZ(0px)',
              transition: 'all 0.3s ease',
            }}
          >
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                background: `linear-gradient(135deg, ${feature.colorHex}, ${feature.colorHex}CC)`,
                color: 'white',
                px: { xs: 2.5, md: 3 },
                py: { xs: 1, md: 1.2 },
                borderRadius: 20,
                fontWeight: 600,
                fontSize: { xs: '0.8rem', md: '0.85rem' },
                textTransform: 'none',
                boxShadow: `0 4px 15px ${feature.colorHex}40`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: `linear-gradient(135deg, ${feature.colorHex}EE, ${feature.colorHex})`,
                  transform: 'translateY(-2px) scale(1.02)',
                  boxShadow: `0 6px 20px ${feature.colorHex}50`,
                }
              }}
            >
              {feature.linkText}
            </Button>
          </Box>

          {/* Compact Status Indicator */}
          <Box
            sx={{
              position: 'absolute',
              top: 15,
              right: 15,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: isActive 
                ? `radial-gradient(circle, ${feature.colorHex}, ${feature.colorHex}CC)`
                : isHovered
                  ? `radial-gradient(circle, ${feature.colorHex}80, ${feature.colorHex}60)`
                  : 'rgba(0, 0, 0, 0.15)',
              animation: (isActive || isHovered) ? `${glowPulse} 2s infinite` : 'none',
              transform: isHovered ? 'translateZ(20px) scale(1.2)' : 'translateZ(0px) scale(1)',
              transition: 'all 0.3s ease',
              boxShadow: isHovered ? `0 0 12px ${feature.colorHex}60` : 'none',
            }}
          />
        </Box>

        {/* Compact Floating Elements */}
        {(isActive || isHovered) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              opacity: 0.7,
            }}
          >
            {[...Array(8)].map((_, i) => {
              const angle = (i * 360) / 8;
              const radius = 70;
              const offsetX = Math.cos(angle * Math.PI / 180) * radius;
              const offsetY = Math.sin(angle * Math.PI / 180) * radius;
              
              return (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: feature.colorHex,
                    top: '50%',
                    left: '50%',
                    animation: `${floatAnimation} ${2 + i * 0.2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                    transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`,
                    opacity: 0.6,
                    boxShadow: `0 0 10px ${feature.colorHex}`,
                  }}
                />
              );
            })}
          </Box>
        )}
      </Box>
    </Zoom>
  );
};

// Add throttle utility function
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Compact Metrics Bar
const CompactMetricsBar = ({ isVisible }) => {
  const [metrics, setMetrics] = useState({
    accuracy: 0,
    speed: 0,
    compliance: 0
  });

  useEffect(() => {
    if (!isVisible) return;

    const targets = { accuracy: 99.9, speed: 98.7, compliance: 100 };
    const duration = 2500;
    const steps = 60;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);

      setMetrics({
        accuracy: targets.accuracy * easeOut,
        speed: targets.speed * easeOut,
        compliance: targets.compliance * easeOut
      });

      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <Fade in={isVisible} timeout={1200}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: 3, md: 6 },
          mt: 8,
          flexWrap: 'wrap',
        }}
      >
        {[
          { key: 'accuracy', label: 'Data Accuracy', value: metrics.accuracy.toFixed(1), suffix: '%', color: '#1AC99F', icon: <VerifiedIcon /> },
          { key: 'speed', label: 'Processing Speed', value: metrics.speed.toFixed(1), suffix: '%', color: '#2E8B8B', icon: <AutoGraphIcon /> },
          { key: 'compliance', label: 'Compliance Rate', value: metrics.compliance.toFixed(0), suffix: '%', color: '#3498db', icon: <SecurityIcon /> },
        ].map((metric, index) => (
          <Grow key={metric.key} in timeout={1000 + index * 300}>
            <Box
              sx={{
                textAlign: 'center',
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                background: `linear-gradient(135deg, ${metric.color}15, ${metric.color}20)`,
                border: `2px solid ${metric.color}40`,
                backdropFilter: 'blur(10px)',
                minWidth: { xs: 120, md: 150 },
                transition: 'all 0.3s ease',
                animation: `${floatAnimation} ${3 + index}s ease-in-out infinite`,
                
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.05)',
                  boxShadow: `0 15px 30px ${metric.color}25`,
                  border: `2px solid ${metric.color}60`,
                }
              }}
            >
              <Box sx={{ color: metric.color, mb: 1.5, fontSize: 24 }}>
                {metric.icon}
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: metric.color,
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                  textShadow: `0 0 10px ${metric.color}50`,
                  mb: 0.5,
                }}
              >
                {metric.value}{metric.suffix}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', md: '0.8rem' },
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {metric.label}
              </Typography>
            </Box>
          </Grow>
        ))}
      </Box>
    </Fade>
  );
};

const PrecisionInAction = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeFeature, setActiveFeature] = useState(0);
  const [showMetrics, setShowMetrics] = useState(false);
  const [visibleElements, setVisibleElements] = useState({});

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleElements(prev => ({ ...prev, header: true })), 300),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, features: true })), 600),
      setTimeout(() => setShowMetrics(true), 1200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const features = [
    {
      id: 'data-confidence',
      icon: <VerifiedIcon />,
      title: 'Data Confidence',
      description: 'Powered by ISO 14064, GHG Protocol & SBTi with end-to-end validation—every emission captured with precision and reliability.',
      linkText: 'View Standards',
      colorHex: '#1AC99F',
    },
    {
      id: 'compliance-automation',
      icon: <SettingsIcon />,
      title: 'Compliance Automation',
      description: 'Auto-generate ESG & carbon disclosures—BRSR, GRI, CSRD and more—in seconds with intelligent automation systems.',
      linkText: 'Explore Reports',
      colorHex: '#2E8B8B',
    },
    {
      id: 'impact-acceleration',
      icon: <RocketLaunchIcon />,
      title: 'Impact Acceleration',
      description: 'Live KPIs, AI-driven decarbonization roadmaps and integrated carbon-credit trading for maximum environmental impact.',
      linkText: 'Launch Program',
      colorHex: '#3498db',
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: `
          radial-gradient(circle at 20% 30%, rgba(26, 201, 159, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(52, 152, 219, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(46, 139, 139, 0.06) 0%, transparent 50%),
          linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248, 249, 250, 0.6) 50%, rgba(240, 242, 245, 0.4) 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      {/* Background elements */}
      {[...Array(12)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: { xs: 2, md: 3 },
            height: { xs: 2, md: 3 },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${['#1AC99F', '#2E8B8B', '#3498db'][i % 3]}, ${['#1AC99F', '#2E8B8B', '#3498db'][i % 3]}80)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `${floatAnimation} ${5 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.5,
          }}
        />
      ))}

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Compact Header */}
        <Fade in={visibleElements.header} timeout={800}>
          <Box textAlign="center" mb={10}>
            <Chip
              label="PRECISION IN ACTION"
              sx={{
                mb: 4,
                px: 4,
                py: 2.5,
                fontSize: '0.9rem',
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                border: `2px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                letterSpacing: 2,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 0 30px ${theme.palette.primary.main}25`,
                borderRadius: 25,
              }}
            />

            <Typography
              variant="h1"
              component="h2"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2.8rem', md: '4.5rem' },
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, #3498db)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                animation: `${slideInFromLeft} 0.8s ease-out`,
              }}
            >
              Where Innovation
              <br />
              Meets Precision
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '700px',
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                lineHeight: 1.5,
                fontWeight: 400,
                animation: `${slideInFromRight} 0.8s ease-out 0.2s both`,
              }}
            >
              Transform sustainability data into actionable insights with unmatched precision
            </Typography>
          </Box>
        </Fade>

        {/* Compact Feature Cards */}
        <Fade in={visibleElements.features} timeout={1000}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 4, md: 6 },
              flexWrap: 'wrap',
              mb: 6,
              perspective: '1000px',
            }}
          >
            {features.map((feature, index) => (
              <CompactFeatureCard
                key={feature.id}
                feature={feature}
                isActive={activeFeature === index}
                onActivate={() => setActiveFeature(index)}
                index={index}
              />
            ))}
          </Box>
        </Fade>

        {/* Compact Metrics */}
        <CompactMetricsBar isVisible={showMetrics} />
      </Container>
    </Box>
  );
};

export default PrecisionInAction;
