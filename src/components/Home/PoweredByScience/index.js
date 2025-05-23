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
  Zoom
} from '@mui/material';
import { keyframes } from '@emotion/react';
import VerifiedIcon from '@mui/icons-material/Verified';
import ScienceIcon from '@mui/icons-material/Science';
import SecurityIcon from '@mui/icons-material/Security';
import PublicIcon from '@mui/icons-material/Public';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LanguageIcon from '@mui/icons-material/Language';
import NatureIcon from '@mui/icons-material/Nature';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ForestIcon from '@mui/icons-material/Forest';

// Continuous scroll animation
const scrollAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

// Glow animation for hover
const glowAnimation = keyframes`
  0% { box-shadow: 0 0 20px rgba(26, 201, 159, 0.3); }
  50% { box-shadow: 0 0 30px rgba(26, 201, 159, 0.6), 0 0 40px rgba(26, 201, 159, 0.4); }
  100% { box-shadow: 0 0 20px rgba(26, 201, 159, 0.3); }
`;

// Pulse animation
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const PoweredByScience = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('internationally');
  const containerRef = useRef(null);

  // Framework data with icons, descriptions, and categories
  const frameworks = [
    {
      id: 1,
      name: 'ISO 14064',
      description: 'GHG Inventories & Verification',
      icon: <VerifiedIcon />,
      color: '#1AC99F',
      categories: ['internationally']
    },
    {
      id: 2,
      name: 'ISO 14067',
      description: 'Carbon Footprint of Products',
      icon: <NatureIcon />,
      color: '#2E8B8B',
      categories: ['internationally']
    },
    {
      id: 3,
      name: 'ISO 14068',
      description: 'Carbon Neutrality',
      icon: <SecurityIcon />,
      color: '#3498db',
      categories: ['internationally']
    },
    {
      id: 4,
      name: 'ISO 14083',
      description: 'Transport GHG Emissions',
      icon: <PublicIcon />,
      color: '#9c27b0',
      categories: ['internationally', ]
    },
    {
      id: 5,
      name: 'GHG Protocol',
      description: 'Corporate, Product & Scope 3',
      icon: <AssessmentIcon />,
      color: '#ff6b35',
      categories: ['internationally', 'scientifically', ]
    },
    {
      id: 6,
      name: 'SBTi',
      description: 'Science Based Targets',
      icon: <AccountTreeIcon />,
      color: '#4ecdc4',
      categories: [ 'scientifically']
    },
    {
      id: 7,
      name: 'GRI',
      description: 'Global Reporting Initiative',
      icon: <LanguageIcon />,
      color: '#45b7d1',
      categories: ['internationally', 'audit']
    },
    {
      id: 8,
      name: 'GLEC',
      description: 'Logistics Emissions Council',
      icon: <PublicIcon />,
      color: '#f39c12',
      categories: ['internationally']
    },
    {
      id: 9,
      name: 'IPCC',
      description: 'Climate Change Panel',
      icon: <ScienceIcon />,
      color: '#e74c3c',
      categories: [ 'scientifically']
    },
    {
      id: 10,
      name: 'DEFRA',
      description: 'UK Emission Factors',
      icon: <SecurityIcon />,
      color: '#2ecc71',
      categories: ['scientifically']
    },
    {
      id: 11,
      name: 'EPA',
      description: 'Environmental Protection',
      icon: <LocalFloristIcon />,
      color: '#1AC99F',
      categories: [ 'scientifically']
    }
  ];

  // Filter frameworks based on selected category
  const filteredFrameworks = frameworks.filter(framework => 
    framework.categories.includes(selectedCategory)
  );

  // Duplicate the filtered array for seamless scrolling
  const duplicatedFrameworks = [...filteredFrameworks, ...filteredFrameworks];

  // Benefit categories
  const benefitCategories = [
    { 
      id: 'internationally',
      label: 'Internationally Accepted', 
      icon: <PublicIcon />,
      description: 'Globally recognized standards'
    },
    { 
      id: 'scientifically',
      label: 'Scientifically Validated', 
      icon: <ScienceIcon />,
      description: 'Research-backed methodologies'
    },
    { 
      id: 'audit',
      label: 'Audit Ready', 
      icon: <VerifiedIcon />,
      description: 'Compliance-focused frameworks'
    },
  ];

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
        {/* Header Section */}
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

        {/* Category Selection Chips */}
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
            {benefitCategories.map((benefit) => (
              <Chip
                key={benefit.id}
                icon={benefit.icon}
                label={benefit.label}
                onClick={() => setSelectedCategory(benefit.id)}
                sx={{
                  py: 2.5,
                  px: 2,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: selectedCategory === benefit.id 
                    ? theme.palette.primary.main 
                    : 'rgba(26, 201, 159, 0.1)',
                  border: selectedCategory === benefit.id
                    ? `2px solid ${theme.palette.primary.main}`
                    : '1px solid rgba(26, 201, 159, 0.2)',
                  color: selectedCategory === benefit.id 
                    ? 'white' 
                    : theme.palette.primary.main,
                  '& .MuiChip-icon': {
                    color: selectedCategory === benefit.id 
                      ? 'white' 
                      : theme.palette.primary.main,
                  },
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    background: selectedCategory === benefit.id
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

        {/* Selected Category Description */}
        <Fade in key={selectedCategory} timeout={500}>
          <Box textAlign="center" mb={4}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontStyle: 'italic',
              }}
            >
              {benefitCategories.find(cat => cat.id === selectedCategory)?.description}
            </Typography>
          </Box>
        </Fade>

        {/* Scrolling Frameworks Section */}
        <Box
          ref={containerRef}
          sx={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            minHeight: { xs: 180, md: 200 },
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
          <Box
            key={selectedCategory} // Force re-render when category changes
            sx={{
              display: 'flex',
              gap: 3,
              animation: `${scrollAnimation} ${isMobile ? '30s' : '40s'} linear infinite`,
              animationPlayState: isPaused ? 'paused' : 'running',
              '&:hover': {
                animationPlayState: 'paused',
              }
            }}
          >
            {duplicatedFrameworks.map((framework, index) => (
              <Box
                key={`${framework.id}-${index}`}
                sx={{
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-10px) scale(1.05)',
                    '& .framework-card': {
                      animation: `${glowAnimation} 2s ease-in-out infinite`,
                      border: `2px solid ${framework.color}`,
                      background: `linear-gradient(135deg, ${framework.color}15, ${framework.color}25)`,
                    },
                    '& .framework-icon': {
                      animation: `${pulseAnimation} 1s ease-in-out infinite`,
                    }
                  }
                }}
              >
                <Box
                  className="framework-card"
                  sx={{
                    p: 3,
                    minWidth: { xs: 200, md: 250 },
                    height: { xs: 140, md: 160 },
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                      transition: 'left 0.5s ease',
                    },
                    '&:hover::before': {
                      left: '100%',
                    }
                  }}
                >
                  <Box
                    className="framework-icon"
                    sx={{
                      color: framework.color,
                      fontSize: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {framework.icon}
                  </Box>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: framework.color,
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      textAlign: 'center',
                    }}
                  >
                    {framework.name}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      textAlign: 'center',
                      fontWeight: 500,
                    }}
                  >
                    {framework.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        
      </Container>
    </Box>
  );
};

export default PoweredByScience;