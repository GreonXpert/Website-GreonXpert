// src/components/Home/SustainabilityStories/index.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
  Chip,
  Tab,
  Tabs,
  IconButton,
  Zoom,
  Grow
} from '@mui/material';
import { keyframes } from '@emotion/react';
import * as THREE from 'three';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ArticleIcon from '@mui/icons-material/Article';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(0.5deg); }
  50% { transform: translateY(-15px) rotate(0deg); }
  75% { transform: translateY(-10px) rotate(-0.5deg); }
`;

const shimmerEffect = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const glowPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
  }
  50% { 
    box-shadow: 0 0 30px currentColor, 0 0 60px currentColor;
  }
`;

const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Throttle utility for performance
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

// 3D Background Globe Component
const ThreeJSBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef();
  const particlesRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      // Random positions
      posArray[i * 3] = (Math.random() - 0.5) * 20;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 20;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Theme colors
      const colors = [
        { r: 0.102, g: 0.788, b: 0.624 }, // #1AC99F
        { r: 0.18, g: 0.545, b: 0.545 },  // #2E8B8B
        { r: 0.204, g: 0.596, b: 0.859 }  // #3498db
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    particlesRef.current = particlesMesh;
    scene.add(particlesMesh);

    camera.position.z = 8;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0003;
        particlesRef.current.rotation.x += 0.0002;
      }

      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <Box
      ref={mountRef}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.3,
      }}
    />
  );
};

// 3D Story Card Component with Tilt Effect
const StoryCard = ({ story, isActive, categoryColor }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transform, setTransform] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || isMobile) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / rect.height) * -25;
    const rotateY = (mouseX / rect.width) * 25;

    const translateZ = isActive ? 50 : 30;

    const newTransform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateZ(${translateZ}px)
      scale(${isActive ? 1.05 : 1})
    `;

    setTransform(newTransform);
    setMousePosition({ 
      x: (mouseX / rect.width + 0.5) * 100, 
      y: (mouseY / rect.height + 0.5) * 100 
    });
  }, [isMobile, isActive]);

  const handleMouseEnter = () => setIsHovered(true);
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)');
    setMousePosition({ x: 50, y: 50 });
  };

  const throttledMouseMove = useCallback(
    throttle(handleMouseMove, 16),
    [handleMouseMove]
  );

  const getCategoryIcon = () => {
    switch (story.category.toLowerCase()) {
      case 'blog': return <ArticleIcon />;
      case 'video': return <OndemandVideoIcon />;
      case 'resources': return <LibraryBooksIcon />;
      default: return <AutoStoriesIcon />;
    }
  };

  return (
    <Box
      ref={cardRef}
      onMouseMove={throttledMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: transform || 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      <Box
        sx={{
          width: { xs: 300, md: 380 },
          height: { xs: 420, md: 480 },
          mx: 'auto',
          position: 'relative',
          background: isHovered 
            ? `linear-gradient(135deg at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)`
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          overflow: 'hidden',
          border: isActive || isHovered 
            ? `2px solid ${categoryColor}` 
            : '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: isActive || isHovered
            ? `0 25px 50px ${categoryColor}30, inset 0 0 30px ${categoryColor}10`
            : '0 15px 35px rgba(0, 0, 0, 0.1)',
          
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isHovered
              ? `linear-gradient(${mousePosition.x + 45}deg, transparent 40%, ${categoryColor}15 50%, transparent 60%)`
              : 'none',
            animation: isHovered ? `${shimmerEffect} 3s linear infinite` : 'none',
            pointerEvents: 'none',
          },
        }}
      >
        {/* Image Container with 3D depth */}
        <Box
          sx={{
            position: 'relative',
            height: 220,
            overflow: 'hidden',
            transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)',
            transition: 'transform 0.3s ease',
            transformStyle: 'preserve-3d',
          }}
        >
          <Box
            component="img"
            src={story.image}
            alt={story.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          />
          
          {/* Category Badge */}
          <Chip
            icon={getCategoryIcon()}
            label={story.category}
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              background: `${categoryColor}E6`,
              color: 'white',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transform: isHovered ? 'translateZ(30px) scale(1.1)' : 'translateZ(0px) scale(1)',
              transition: 'all 0.3s ease',
            }}
          />

          {/* Play button for videos */}
          {story.category.toLowerCase() === 'video' && (
            <IconButton
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(0, 0, 0, 0.9)',
                  transform: 'translate(-50%, -50%) scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <PlayCircleOutlineIcon sx={{ fontSize: 48 }} />
            </IconButton>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.text.primary,
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              lineHeight: 1.3,
              minHeight: '3.6em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transform: isHovered ? 'translateZ(15px)' : 'translateZ(0px)',
              transition: 'transform 0.3s ease',
            }}
          >
            {story.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 3,
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '4.8em',
              transform: isHovered ? 'translateZ(10px)' : 'translateZ(0px)',
              transition: 'transform 0.3s ease',
            }}
          >
            {story.description}
          </Typography>

          {/* Footer */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 'auto',
              transform: isHovered ? 'translateZ(25px)' : 'translateZ(0px)',
              transition: 'transform 0.3s ease',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {story.date}
              </Typography>
            </Box>

            <IconButton
              size="small"
              sx={{
                color: categoryColor,
                background: `${categoryColor}15`,
                '&:hover': {
                  background: `${categoryColor}30`,
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Interactive light effect */}
        {isHovered && (
          <Box
            sx={{
              position: 'absolute',
              top: `${mousePosition.y}%`,
              left: `${mousePosition.x}%`,
              width: 150,
              height: 150,
              background: `radial-gradient(circle, ${categoryColor}20 0%, transparent 70%)`,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              transition: 'all 0.1s ease',
            }}
          />
        )}
      </Box>
    </Box>
  );
};

// Custom Tab Component
const StyledTab = ({ label, icon, ...props }) => (
  <Tab
    label={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon}
        <span>{label}</span>
      </Box>
    }
    sx={{
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      color: 'text.secondary',
      '&.Mui-selected': {
        color: 'primary.main',
      },
      transition: 'all 0.3s ease',
    }}
    {...props}
  />
);

// Main Component
const SustainabilityStories = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedTab, setSelectedTab] = useState(0);
  
 const [visibleElements, setVisibleElements] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleElements(prev => ({ ...prev, header: true })), 300),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, tabs: true })), 800),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, stories: true })), 1200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Stories data
  const allStories = [
    {
      id: 1,
      title: "Building Climate Resilience in Supply Chains",
      description: "Strategies for creating robust supply chains in the face of growing climate challenges.",
      category: "Blog",
      image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=300&fit=crop",
      date: "May 10, 2025",
      link: "/blog/climate-resilience-supply-chains"
    },
    {
      id: 2,
      title: "Future of Carbon Markets",
      description: "Expert analysis on the evolution of global carbon markets and what it means for businesses.",
      category: "Video",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
      date: "April 28, 2025",
      link: "/videos/carbon-markets-future"
    },
    {
      id: 3,
      title: "ESG Reporting: CSRD Implementation Guide",
      description: "Step-by-step guide to implementing CSRD requirements for European operations.",
      category: "Resources",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      date: "April 15, 2025",
      link: "/resources/csrd-implementation-guide"
    },
    {
      id: 4,
      title: "AI in Decarbonization Strategy",
      description: "How AI is transforming corporate decarbonization roadmaps and implementation.",
      category: "Blog",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
      date: "April 5, 2025",
      link: "/blog/ai-decarbonization-strategy"
    },
    {
      id: 5,
      title: "Net Zero Pathways for Manufacturing",
      description: "Comprehensive strategies for achieving net zero emissions in manufacturing sectors.",
      category: "Video",
      image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=300&fit=crop",
      date: "March 22, 2025",
      link: "/videos/net-zero-manufacturing"
    },
    {
      id: 6,
      title: "Sustainability Metrics Dashboard Template",
      description: "Free template for tracking and visualizing key sustainability performance indicators.",
      category: "Resources",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      date: "March 18, 2025",
      link: "/resources/sustainability-dashboard"
    }
  ];
const [currentIndex, setCurrentIndex] = useState(() => 
   Math.ceil(allStories.length / 2) - 1
   );  
  const categories = ['All', 'Blog', 'Video', 'Resources'];
  
  const categoryColors = {
    'All': theme.palette.primary.main,
    'Blog': '#1AC99F',
    'Video': '#3498db',
    'Resources': '#2E8B8B'
  };

  const filteredStories = selectedTab === 0 
    ? allStories 
    : allStories.filter(story => story.category === categories[selectedTab]);

 const handleTabChange = (event, newValue) => {
  setSelectedTab(newValue);
  const filtered = newValue === 0
    ? allStories
    : allStories.filter(story => story.category === categories[newValue]);
  // reset to the middle of the new filtered list
  setCurrentIndex(Math.ceil(filtered.length / 2) - 1);
};

  const handleNext = () => {
  // wrap around with modulo so it always loops
  setCurrentIndex(prev =>
    (prev + 1) % filteredStories.length
  );
};

 const handlePrev = () => {
  setCurrentIndex(prev =>
    (prev - 1 + filteredStories.length) % filteredStories.length
  );
};

  // Auto-scroll for desktop
  useEffect(() => {
    if (isMobile) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, filteredStories.length, isMobile]);

  return (
    <Box
      ref={containerRef}
      sx={{
        py: { xs: 8, md: 12 },
        background: `
          radial-gradient(circle at 10% 20%, rgba(26, 201, 159, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(52, 152, 219, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248, 249, 250, 0.5) 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      {/* 3D Background */}
      <ThreeJSBackground />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Fade in={visibleElements.header} timeout={1000}>
          <Box textAlign="center" mb={8}>
            <Chip
              icon={<AutoStoriesIcon />}
              label="SUSTAINABILITY STORIES"
              sx={{
                mb: 4,
                px: 4,
                py: 3,
                fontSize: '1rem',
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                border: `2px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                letterSpacing: 2,
                backdropFilter: 'blur(10px)',
              }}
            />

            <Typography
              variant="h1"
              component="h2"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Latest Sustainability Stories
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                maxWidth: '700px',
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Insights, news, and resources from our sustainability experts
            </Typography>
          </Box>
        </Fade>

        {/* Tabs */}
        <Fade in={visibleElements.tabs} timeout={1200}>
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 50,
                padding: '4px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <StyledTab label="All" icon={<AutoStoriesIcon />} />
              <StyledTab label="Blog" icon={<ArticleIcon />} />
              <StyledTab label="Video" icon={<OndemandVideoIcon />} />
              <StyledTab label="Resources" icon={<LibraryBooksIcon />} />
            </Tabs>
          </Box>
        </Fade>

        {/* Stories Carousel */}
        <Grow in={visibleElements.stories} timeout={1400}>
          <Box>
            {/* Navigation Buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                mb: 4,
              }}
            >
              <IconButton
                onClick={handlePrev}
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 1)',
                    transform: 'translateX(-4px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  minWidth: 100,
                  textAlign: 'center',
                }}
              >
                {currentIndex + 1} / {filteredStories.length}
              </Typography>

              <IconButton
                onClick={handleNext}
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 1)',
                    transform: 'translateX(4px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <NavigateNextIcon />
              </IconButton>
            </Box>

            {/* Stories Container with Swiper Effect */}
            <Box
              sx={{
                position: 'relative',
                height: { xs: 480, md: 550 },
                perspective: '2000px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {filteredStories.map((story, index) => {
                const offset = index - currentIndex;
                const isActive = index === currentIndex;
                const isVisible = Math.abs(offset) <= 2;

                if (!isVisible && !isMobile) return null;

                return (
                  <Box
                    key={story.id}
                    sx={{
                      position: 'absolute',
                      transform: isMobile && !isActive ? 'scale(0)' : `
                        translateX(${offset * (isMobile ? 0 : 120)}px)
                        translateZ(${Math.abs(offset) * -100}px)
                        rotateY(${offset * (isMobile ? 0 : -15)}deg)
                        scale(${isActive ? 1 : 0.8})
                      `,
                      opacity: isActive ? 1 : isMobile ? 0 : 0.5,
                      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: 10 - Math.abs(offset),
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                  >
                    <StoryCard
                      story={story}
                      isActive={isActive}
                      categoryColor={categoryColors[story.category] || categoryColors['All']}
                    />
                  </Box>
                );
              })}
            </Box>

            {/* Pagination Dots */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mt: 4,
              }}
            >
              {filteredStories.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  sx={{
                    width: index === currentIndex ? 30 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: index === currentIndex 
                      ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                      : 'rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: index === currentIndex 
                        ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                        : 'rgba(0, 0, 0, 0.4)',
                      transform: 'scale(1.2)',
                    },
                  }}
                />
              ))}
            </Box>

            {/* View All Button */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 6,
              }}
            >
              <button
                style={{
                  padding: '14px 40px',
                  fontSize: '16px',
                  fontWeight: 700,
                  borderRadius: '30px',
                  border: `2px solid ${categoryColors[categories[selectedTab]]}`,
                  background: 'transparent',
                  color: categoryColors[categories[selectedTab]],
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = categoryColors[categories[selectedTab]];
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = `0px 15px 40px ${categoryColors[categories[selectedTab]]}40`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = categoryColors[categories[selectedTab]];
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                View All {categories[selectedTab]} <ArrowForwardIcon />
              </button>
            </Box>
          </Box>
        </Grow>

        {/* Floating Background Elements */}
        {[...Array(8)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: { xs: 40, md: 60 },
              height: { xs: 40, md: 60 },
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${Object.values(categoryColors)[i % 4]}20, ${Object.values(categoryColors)[(i + 1) % 4]}20)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `${floatAnimation} ${10 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3,
              display: { xs: 'none', md: 'block' },
            }}
          />
        ))}
      </Container>
    </Box>
  );
};

export default SustainabilityStories;