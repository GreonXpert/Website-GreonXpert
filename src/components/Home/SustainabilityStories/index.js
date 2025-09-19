// src/components/Home/SustainabilityStories/index.js - FIXED REACT HOOKS ERROR

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
  Grow,
  Button,
  CircularProgress
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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import { useNavigate } from 'react-router-dom';

// ✅ Backend Integration Imports
import io from 'socket.io-client';
import axios from 'axios';
import { API_BASE } from '../../../utils/api';

// ✅ API Configuration
const API_URL = `${API_BASE}/api/stories`;

// Animations (keep existing)
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

// 3D Background Globe Component (keep existing)
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

// ✅ Enhanced 3D Story Card Component with Backend Data
const StoryCard = ({ story, isActive, categoryColor }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transform, setTransform] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

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

  // ✅ Backend-compatible card click with engagement tracking
  const handleCardClick = async () => {
    try {
      // Track click engagement
      await axios.post(`${API_URL}/${story._id}/engagement`, { 
        action: 'click' 
      });
    } catch (error) {
      console.warn('Failed to track click engagement:', error);
    }

    // Navigate to story detail page
    const categoryPath = story.category.toLowerCase();
    navigate(`/sustainability-stories/${categoryPath}/${story._id}`);
  };

  const getCategoryIcon = () => {
    switch (story.category.toLowerCase()) {
      case 'blog': return <ArticleIcon />;
      case 'video': return <OndemandVideoIcon />;
      case 'resources': return <LibraryBooksIcon />;
      default: return <AutoStoriesIcon />;
    }
  };

  // ✅ Backend data-compatible meta info
  const getMetaInfo = () => {
    switch (story.category) {
      case 'Video':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {new Date(story.date).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">•</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {story.views || '0'} views
              </Typography>
            </Box>
          </Box>
        );
      case 'Resources':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {new Date(story.date).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">•</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <GetAppIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {story.downloadCount || '0'} downloads
              </Typography>
            </Box>
          </Box>
        );
      default: // Blog
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {story.author || 'Unknown'}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">•</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {story.readTime || 'Quick read'}
              </Typography>
            </Box>
          </Box>
        );
    }
  };

  return (
    <Box
      ref={cardRef}
      onClick={handleCardClick} 
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
        {/* ✅ Image Container with Backend URL */}
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
            src={story.image ? `${API_BASE}${story.image}` : '/placeholder-image.jpg'}
            alt={story.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
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

          {/* Featured Badge */}
          {story.featured && (
            <Chip
              label="Featured"
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(255, 215, 0, 0.9)',
                color: '#000',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transform: isHovered ? 'translateZ(30px) scale(1.1)' : 'translateZ(0px) scale(1)',
                transition: 'all 0.3s ease',
              }}
            />
          )}

          {/* Duration/File Size Badge for Videos/Resources */}
          {(story.duration || story.fileSize) && (
            <Chip
              label={story.duration || story.fileSize}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                fontWeight: 500,
                fontSize: '0.7rem',
                height: 20,
              }}
            />
          )}

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
              mb: 2,
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '3.2em',
              transform: isHovered ? 'translateZ(10px)' : 'translateZ(0px)',
              transition: 'transform 0.3s ease',
            }}
          >
            {story.description}
          </Typography>

          {/* ✅ Tags from Backend */}
          {story.tags && story.tags.length > 0 && (
            <Box sx={{ mb: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {story.tags.slice(0, 2).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    background: `${categoryColor}10`,
                    color: categoryColor,
                    fontSize: '0.65rem',
                    height: 20,
                    fontWeight: 500,
                  }}
                />
              ))}
              {story.tags.length > 2 && (
                <Chip
                  label={`+${story.tags.length - 2}`}
                  size="small"
                  sx={{
                    background: `${categoryColor}10`,
                    color: categoryColor,
                    fontSize: '0.65rem',
                    height: 20,
                    fontWeight: 500,
                  }}
                />
              )}
            </Box>
          )}

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
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {getMetaInfo()}
            </Box>

            <IconButton
              size="small"
              sx={{
                color: categoryColor,
                background: `${categoryColor}15`,
                ml: 1,
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

// ✅ Main Component with Complete Backend Integration - HOOKS FIXED
const SustainabilityStories = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedTab, setSelectedTab] = useState(0);
  const [visibleElements, setVisibleElements] = useState({});

  // ✅ Backend state management
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerRef = useRef(null);
  const navigate = useNavigate();

  const categories = ['All', 'Blog', 'Video', 'Resources'];
  
  const categoryColors = {
    'All': theme.palette.primary.main,
    'Blog': '#1AC99F',
    'Video': '#3498db',
    'Resources': '#2E8B8B'
  };

  // ✅ Filtered stories logic
  const filteredStories = selectedTab === 0
    ? allStories
    : allStories.filter(story => story.category === categories[selectedTab]);

  // ✅ Fetch stories from backend
  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_URL, {
        params: {
          status: 'published',
          limit: 50, // Get more stories for carousel
          sort: '-createdAt'
        }
      });
      
      if (data?.success) {
        setAllStories(data.data.stories || []);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch stories:', err);
      setError('Failed to load stories');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev =>
      (prev + 1) % Math.max(filteredStories.length, 1)
    );
  }, [filteredStories.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev =>
      (prev - 1 + Math.max(filteredStories.length, 1)) % Math.max(filteredStories.length, 1)
    );
  }, [filteredStories.length]);

  // ✅ FIXED: All useEffect hooks BEFORE any early returns
  // Socket.IO real-time connection
  useEffect(() => {
    fetchStories();

    // Initialize socket connection
    console.log('🔌 Connecting to Stories Socket...');
    const socket = io(API_BASE, {
      transports: ['websocket'],
      upgrade: true,
      rememberUpgrade: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket Connected:', socket.id);
      socket.emit('join-story-room', 'sustainabilityStories');
    });

    // ✅ Real-time event listeners
    socket.on('story-created', (payload) => {
      if (payload?.success) {
        setAllStories(prev => [payload.data, ...prev]);
        console.log('📝 New story added:', payload.data.title);
      }
    });

    socket.on('story-updated', (payload) => {
      if (payload?.success) {
        setAllStories(prev => 
          prev.map(story => 
            story._id === payload.data._id ? payload.data : story
          )
        );
        console.log('✏️ Story updated:', payload.data.title);
      }
    });

    socket.on('story-deleted', (payload) => {
      setAllStories(prev => 
        prev.filter(story => story._id !== payload.storyId)
      );
      console.log('🗑️ Story deleted:', payload.title);
    });

    socket.on('story-engagement', (payload) => {
      if (payload.storyId) {
        setAllStories(prev =>
          prev.map(story =>
            story._id === payload.storyId
              ? {
                  ...story,
                  likes: payload.likes ?? story.likes,
                  views: payload.views ?? story.views,
                  downloadCount: payload.downloadCount ?? story.downloadCount,
                }
              : story
          )
        );
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [fetchStories]);

  // Animation timers
  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleElements(prev => ({ ...prev, header: true })), 300),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, tabs: true })), 800),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, stories: true })), 1200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // ✅ FIXED: Auto-scroll useEffect moved before early returns
  useEffect(() => {
    if (isMobile || filteredStories.length === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isMobile, filteredStories.length, handleNext]);

  // ✅ NOW early returns are AFTER all hooks
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setCurrentIndex(0); // Reset to first item when changing tabs
  };

  const handleViewAllClick = () => {
    const categoryPath = categories[selectedTab].toLowerCase();
    if (categoryPath === 'all') {
      navigate('/sustainability-stories');
    } else {
      navigate(`/sustainability-stories/${categoryPath}`);
    }
  };

  // ✅ Loading and error states
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Loading sustainability stories...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button onClick={fetchStories} variant="contained" sx={{ mt: 2 }}>
          Retry Loading
        </Button>
      </Container>
    );
  }

  // ✅ Empty state handling
  if (allStories.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No sustainability stories available yet.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Check back later for new content!
        </Typography>
      </Container>
    );
  }

  // If filtered stories is empty, show message
  if (filteredStories.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No {categories[selectedTab].toLowerCase()} stories available yet.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try selecting a different category or check back later.
        </Typography>
      </Container>
    );
  }

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
                disabled={filteredStories.length <= 1}
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 1)',
                    transform: 'translateX(-4px)',
                  },
                  '&:disabled': {
                    opacity: 0.5,
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
                disabled={filteredStories.length <= 1}
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 1)',
                    transform: 'translateX(4px)',
                  },
                  '&:disabled': {
                    opacity: 0.5,
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
                    key={story._id}
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
                onClick={handleViewAllClick}
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
