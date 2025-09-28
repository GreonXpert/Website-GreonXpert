// src/components/Home/SustainabilityStories/index.js - ULTRA COMPACT VERSION WITH 3D EFFECTS

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

// Animations (keep existing but subtle)
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-6px) rotate(0.3deg); }
  50% { transform: translateY(-8px) rotate(0deg); }
  75% { transform: translateY(-6px) rotate(-0.3deg); }
`;

const shimmerEffect = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const glowPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 12px currentColor, 0 0 24px currentColor;
  }
  50% { 
    box-shadow: 0 0 18px currentColor, 0 0 36px currentColor;
  }
`;

const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(30px);
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

// 3D Background Globe Component (more subtle)
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

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create floating particles (reduced count)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200; // Reduced from 500
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      // Random positions
      posArray[i * 3] = (Math.random() - 0.5) * 15;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 15;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 15;

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
      size: 0.01, // Much smaller
      vertexColors: true,
      transparent: true,
      opacity: 0.2, // More subtle
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    particlesRef.current = particlesMesh;
    scene.add(particlesMesh);

    camera.position.z = 6;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0002; // Slower
        particlesRef.current.rotation.x += 0.0001;
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
        opacity: 0.15, // Much more subtle
      }}
    />
  );
};

// ✅ ULTRA COMPACT 3D Story Card Component - Maintains all 3D effects but much smaller
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

    const rotateX = (mouseY / rect.height) * -20; // Keep 3D rotation
    const rotateY = (mouseX / rect.width) * 20;

    const translateZ = isActive ? 40 : 25; // Keep 3D depth

    const newTransform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateZ(${translateZ}px)
      scale(${isActive ? 1.04 : 1})
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

  // ✅ Backend data-compatible meta info - ULTRA COMPACT
  const getMetaInfo = () => {
    switch (story.category) {
      case 'Video':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <CalendarTodayIcon sx={{ fontSize: 8, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.5rem' }}>
                {new Date(story.date).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.5rem' }}>•</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <VisibilityIcon sx={{ fontSize: 8, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.5rem' }}>
                {story.views || '0'} views
              </Typography>
            </Box>
          </Box>
        );
      case 'Resources':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <CalendarTodayIcon sx={{ fontSize: 8, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.5rem' }}>
                {new Date(story.date).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.5rem' }}>•</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <GetAppIcon sx={{ fontSize: 8, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.5rem' }}>
                {story.downloadCount || '0'} downloads
              </Typography>
            </Box>
          </Box>
        );
      default: // Blog
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <PersonIcon sx={{ fontSize: 8, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.5rem' }}>
                {story.author || 'Unknown'}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.5rem' }}>•</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <AccessTimeIcon sx={{ fontSize: 8, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.5rem' }}>
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
          width: { xs: 300, md: 380 }, // MUCH SMALLER: Reduced from 300,380
          height: { xs: 420, md: 280 }, // MUCH SMALLER: Reduced from 420,480
          mx: 'auto',
          position: 'relative',
          background: isHovered 
            ? `linear-gradient(135deg at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)`
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(15px)', // Reduced
          borderRadius: 3, // Reduced from 4
          overflow: 'hidden',
          border: isActive || isHovered 
            ? `1px solid ${categoryColor}` // Thinner border
            : '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: isActive || isHovered
            ? `0 15px 30px ${categoryColor}20, inset 0 0 20px ${categoryColor}08` // Reduced shadows
            : '0 8px 20px rgba(0, 0, 0, 0.08)',
          
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isHovered
              ? `linear-gradient(${mousePosition.x + 45}deg, transparent 40%, ${categoryColor}12 50%, transparent 60%)`
              : 'none',
            animation: isHovered ? `${shimmerEffect} 3s linear infinite` : 'none',
            pointerEvents: 'none',
          },
        }}
      >
        {/* ✅ Image Container with Backend URL - MUCH SMALLER */}
        <Box
          sx={{
            position: 'relative',
            height: 150, // MUCH SMALLER: Reduced from 220
            overflow: 'hidden',
            transform: isHovered ? 'translateZ(15px)' : 'translateZ(0px)', // Keep 3D effect
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
              transform: isHovered ? 'scale(1.08)' : 'scale(1)', // Keep zoom effect
            }}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
          
          {/* Category Badge - MUCH SMALLER */}
          <Chip
            icon={getCategoryIcon()}
            label={story.category}
            size="small"
            sx={{
              position: 'absolute',
              top: 8, // Reduced from 16
              left: 8,
              background: `${categoryColor}E6`,
              color: 'white',
              fontWeight: 600,
              fontSize: '0.55rem', // MUCH SMALLER font
              height: 16, // MUCH SMALLER height
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transform: isHovered ? 'translateZ(20px) scale(1.05)' : 'translateZ(0px) scale(1)', // Keep 3D effect
              transition: 'all 0.3s ease',
              '& .MuiChip-icon': { 
                fontSize: 10 // MUCH SMALLER icon
              }
            }}
          />

          {/* Featured Badge - MUCH SMALLER */}
          {story.featured && (
            <Chip
              label="Featured"
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'rgba(255, 215, 0, 0.9)',
                color: '#000',
                fontWeight: 600,
                fontSize: '0.35rem', // MUCH SMALLER font
                height: 16, // MUCH SMALLER height
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transform: isHovered ? 'translateZ(20px) scale(1.05)' : 'translateZ(0px) scale(1)', // Keep 3D effect
                transition: 'all 0.3s ease',
              }}
            />
          )}

          {/* Duration/File Size Badge - MUCH SMALLER */}
          {(story.duration || story.fileSize) && (
            <Chip
              label={story.duration || story.fileSize}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                fontWeight: 500,
                fontSize: '0.5rem', // MUCH SMALLER font
                height: 12, // MUCH SMALLER height
              }}
            />
          )}

          {/* Play button for videos - MUCH SMALLER */}
          {story.category.toLowerCase() === 'video' && (
            <IconButton
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                width: 32, // MUCH SMALLER
                height: 32,
                '&:hover': {
                  background: 'rgba(0, 0, 0, 0.9)',
                  transform: 'translate(-50%, -50%) scale(1.05)', // Keep scale effect
                },
                transition: 'all 0.3s ease',
              }}
            >
              <PlayCircleOutlineIcon sx={{ fontSize: 20 }} /> {/* MUCH SMALLER icon */}
            </IconButton>
          )}
        </Box>

        {/* Content - MUCH SMALLER */}
        <Box sx={{ p: 1.5 }}> {/* MUCH SMALLER padding: Reduced from 3 */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1, // Reduced from 2
              color: theme.palette.text.primary,
              fontSize: { xs: '0.65rem', md: '0.7rem' }, // MUCH SMALLER: Reduced from 1.2rem,1.4rem
              lineHeight: 1.2,
              minHeight: '1.8em', // MUCH SMALLER: Reduced from 3.6em
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transform: isHovered ? 'translateZ(10px)' : 'translateZ(0px)', // Keep 3D effect
              transition: 'transform 0.3s ease',
            }}
          >
            {story.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 1, // Reduced from 2
              lineHeight: 1.3,
              fontSize: '0.75rem', // MUCH SMALLER font
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '1.6em', // MUCH SMALLER: Reduced from 3.2em
              transform: isHovered ? 'translateZ(8px)' : 'translateZ(0px)', // Keep 3D effect
              transition: 'transform 0.3s ease',
            }}
          >
            {story.description}
          </Typography>

          {/* ✅ Tags from Backend - MUCH SMALLER */}
          {story.tags && story.tags.length > 0 && (
            <Box sx={{ mb: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {story.tags.slice(0, 2).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    background: `${categoryColor}08`,
                    color: categoryColor,
                    fontSize: '0.5rem', // MUCH SMALLER font
                    height: 12, // MUCH SMALLER height
                    fontWeight: 500,
                  }}
                />
              ))}
              {story.tags.length > 2 && (
                <Chip
                  label={`+${story.tags.length - 2}`}
                  size="small"
                  sx={{
                    background: `${categoryColor}08`,
                    color: categoryColor,
                    fontSize: '0.4rem',
                    height: 12,
                    fontWeight: 500,
                  }}
                />
              )}
            </Box>
          )}

          {/* Footer - MUCH SMALLER */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 'auto',
              transform: isHovered ? 'translateZ(15px)' : 'translateZ(0px)', // Keep 3D effect
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
                background: `${categoryColor}10`,
                ml: 0.5,
                width: 16, // MUCH SMALLER
                height: 16,
                '&:hover': {
                  background: `${categoryColor}25`,
                  transform: 'translateX(2px)', // Keep movement effect
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 10 }} /> {/* MUCH SMALLER icon */}
            </IconButton>
          </Box>
        </Box>

        {/* Interactive light effect - MUCH SMALLER */}
        {isHovered && (
          <Box
            sx={{
              position: 'absolute',
              top: `${mousePosition.y}%`,
              left: `${mousePosition.x}%`,
              width: 80, // MUCH SMALLER: Reduced from 150
              height: 80,
              background: `radial-gradient(circle, ${categoryColor}15 0%, transparent 70%)`,
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

// ULTRA COMPACT Tab Component
const StyledTab = ({ label, icon, ...props }) => (
  <Tab
    label={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {React.cloneElement(icon, { sx: { fontSize: 12 } })} {/* MUCH SMALLER icon */}
        <span>{label}</span>
      </Box>
    }
    sx={{
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem', // MUCH SMALLER font: Reduced from 1rem
      color: 'text.secondary',
      minHeight: 28, // MUCH SMALLER height
      px: 1, // MUCH SMALLER padding
      '&.Mui-selected': {
        color: 'primary.main',
      },
      transition: 'all 0.3s ease',
    }}
    {...props}
  />
);

// ✅ Main Component - ULTRA COMPACT with all 3D effects preserved
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
          limit: 50,
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
  useEffect(() => {
    fetchStories();

    // Initialize socket connection
    const socket = io(API_BASE, {
      transports: ['websocket'],
      upgrade: true,
      rememberUpgrade: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-story-room', 'sustainabilityStories');
    });

    // ✅ Real-time event listeners
    socket.on('story-created', (payload) => {
      if (payload?.success) {
        setAllStories(prev => [payload.data, ...prev]);
      }
    });

    socket.on('story-updated', (payload) => {
      if (payload?.success) {
        setAllStories(prev => prev.map(story => 
          story._id === payload.data._id ? payload.data : story
        ));
      }
    });

    socket.on('story-deleted', (payload) => {
      if (payload?.success) {
        setAllStories(prev => prev.filter(story => story._id !== payload.data._id));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchStories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleElements({ header: true });
    }, 300);

    const timer2 = setTimeout(() => {
      setVisibleElements(prev => ({ ...prev, tabs: true }));
    }, 600);

    const timer3 = setTimeout(() => {
      setVisibleElements(prev => ({ ...prev, stories: true }));
    }, 900);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [filteredStories.length]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setCurrentIndex(0);
  };

  const handleViewAllClick = () => {
    const categoryPath = categories[selectedTab].toLowerCase();
    if (categoryPath === 'all') {
      navigate('/sustainability-stories');
    } else {
      navigate(`/sustainability-stories/${categoryPath}`);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          Loading sustainability stories...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom sx={{ fontSize: '0.8rem' }}>
          {error}
        </Typography>
        <Button onClick={fetchStories} variant="contained" sx={{ mt: 2, fontSize: '0.6rem' }}>
          Retry Loading
        </Button>
      </Container>
    );
  }

  if (allStories.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: '0.8rem' }}>
          No sustainability stories available yet.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
          Check back later for new content!
        </Typography>
      </Container>
    );
  }

  if (filteredStories.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: '0.8rem' }}>
          No {categories[selectedTab].toLowerCase()} stories available yet.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
          Try selecting a different category or check back later.
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        py: { xs: 3, md: 4 }, // MUCH SMALLER: Reduced from 8,12
        background: `
          radial-gradient(circle at 10% 20%, rgba(26, 201, 159, 0.04) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(52, 152, 219, 0.04) 0%, transparent 50%),
          linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248, 249, 250, 0.3) 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '50vh', md: '60vh' }, // MUCH SMALLER: Reduced from 100vh
      }}
    >
      {/* 3D Background */}
      <ThreeJSBackground />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section - ULTRA COMPACT */}
        <Fade in={visibleElements.header} timeout={1000}>
          <Box textAlign="center" mb={{ xs: 3, md: 4 }}> {/* MUCH SMALLER: Reduced from 8 */}
            <Chip
              label="SUSTAINABILITY STORIES"
              sx={{
                mb: 2, // MUCH SMALLER: Reduced from 4
                px: 2, // MUCH SMALLER: Reduced from 4
                py: 1, // MUCH SMALLER: Reduced from 3
                fontSize: '0.45rem', // MUCH SMALLER: Reduced from 1rem
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                border: `1px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                letterSpacing: 1, // MUCH SMALLER: Reduced from 2
                backdropFilter: 'blur(8px)',
                height: 20, // MUCH SMALLER height
              }}
            />

            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 900,
                mb: 1.5, // MUCH SMALLER: Reduced from 3
                fontSize: { xs: '1.2rem', md: '1.8rem' }, // MUCH SMALLER: Reduced from 2.5rem,4rem
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}
            >
              Latest Sustainability Stories
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
                              lg: '1rem' 
                            }, // Similar to TrustedByLeaders
                            opacity: 0.8,
                            lineHeight: 1.4,
                            transition: 'transform 0.3s ease',
                            px: { xs: 0.5, sm: 1 },
                          }}
                        >
              Insights, news, and resources from our sustainability experts
            </Typography>
          </Box>
        </Fade>

        {/* Tabs - ULTRA COMPACT */}
        <Fade in={visibleElements.tabs} timeout={1200}>
          <Box sx={{ mb: { xs: 3, md: 4 }, display: 'flex', justifyContent: 'center' }}> {/* MUCH SMALLER: Reduced from 6 */}
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': {
                  height: 1.5, // MUCH SMALLER: Reduced from 3
                  borderRadius: 1,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                borderRadius: 20, // MUCH SMALLER: Reduced from 50
                padding: '2px', // MUCH SMALLER: Reduced from 4px
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <StyledTab label="All" icon={<AutoStoriesIcon />} />
              <StyledTab label="Blog" icon={<ArticleIcon />} />
              <StyledTab label="Video" icon={<OndemandVideoIcon />} />
              <StyledTab label="Resources" icon={<LibraryBooksIcon />} />
            </Tabs>
          </Box>
        </Fade>

        {/* Stories Carousel - ULTRA COMPACT */}
        <Grow in={visibleElements.stories} timeout={1400}>
          <Box>
            {/* Navigation Buttons - ULTRA COMPACT */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2, // MUCH SMALLER: Reduced from 4
                mb: 3, // MUCH SMALLER: Reduced from 4
              }}
            >
              <IconButton
                onClick={handlePrev}
                disabled={filteredStories.length <= 1}
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  width: 32, // MUCH SMALLER
                  height: 32,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 1)',
                    transform: 'translateX(-2px)',
                  },
                  '&:disabled': {
                    opacity: 0.5,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <NavigateBeforeIcon sx={{ fontSize: 16 }} /> {/* MUCH SMALLER */}
              </IconButton>

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  minWidth: '60px',
                  textAlign: 'center',
                  fontSize: '0.6rem', // MUCH SMALLER
                }}
              >
                {currentIndex + 1} / {filteredStories.length}
              </Typography>

              <IconButton
                onClick={handleNext}
                disabled={filteredStories.length <= 1}
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  width: 32, // MUCH SMALLER
                  height: 32,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 1)',
                    transform: 'translateX(2px)',
                  },
                  '&:disabled': {
                    opacity: 0.5,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <NavigateNextIcon sx={{ fontSize: 16 }} /> {/* MUCH SMALLER */}
              </IconButton>
            </Box>

            {/* Stories Container with 3D Effect - ULTRA COMPACT */}
            <Box
              sx={{
                position: 'relative',
                height: { xs: 320, md: 360 }, // MUCH SMALLER: Reduced from 480,550
                perspective: '1500px', // Keep 3D perspective
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
                        translateX(${offset * (isMobile ? 0 : 80)}px)
                        translateZ(${Math.abs(offset) * -60}px)
                        rotateY(${offset * (isMobile ? 0 : -12)}deg)
                        scale(${isActive ? 1 : 0.85})
                      `, // Keep all 3D transforms but smaller values
                      opacity: isActive ? 1 : isMobile ? 0 : 0.6,
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

            {/* Pagination Dots - ULTRA COMPACT */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 0.5, // MUCH SMALLER: Reduced from 1
                mt: 3, // MUCH SMALLER: Reduced from 4
              }}
            >
              {filteredStories.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  sx={{
                    width: index === currentIndex ? 20 : 6, // MUCH SMALLER: Reduced from 30,8
                    height: 6, // MUCH SMALLER: Reduced from 8
                    borderRadius: 3,
                    background: index === currentIndex 
                      ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                      : 'rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: index === currentIndex 
                        ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                        : 'rgba(0, 0, 0, 0.4)',
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              ))}
            </Box>

            {/* View All Button - ULTRA COMPACT */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 3, // MUCH SMALLER: Reduced from 6
              }}
            >
              <Button
                onClick={handleViewAllClick}
                variant="outlined"
                sx={{
                  px: 2.5, // MUCH SMALLER: Reduced from 40px
                  py: 0.8, // MUCH SMALLER: Reduced from 14px
                  fontSize: '0.9rem', // MUCH SMALLER: Reduced from 16px
                  fontWeight: 700,
                  borderRadius: 15, // MUCH SMALLER: Reduced from 30px
                  border: `1px solid ${categoryColors[categories[selectedTab]]}`,
                  background: 'transparent',
                  color: categoryColors[categories[selectedTab]],
                  letterSpacing: '0.3px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: categoryColors[categories[selectedTab]],
                    color: 'white',
                    transform: 'translateY(-1px)',
                    boxShadow: `0px 8px 25px ${categoryColors[categories[selectedTab]]}40`,
                  }
                }}
              >
                View  {categories[selectedTab]} <ArrowForwardIcon sx={{ ml: 0.5, fontSize: 12 }} />
              </Button>
            </Box>
          </Box>
        </Grow>

        {/* Floating Background Elements - MUCH SMALLER */}
        {[...Array(4)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: { xs: 20, md: 30 }, // MUCH SMALLER
              height: { xs: 20, md: 30 },
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${Object.values(categoryColors)[i % 4]}15, ${Object.values(categoryColors)[(i + 1) % 4]}15)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `${floatAnimation} ${10 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.2,
              display: { xs: 'none', md: 'block' },
            }}
          />
        ))}
      </Container>
    </Box>
  );
};

export default SustainabilityStories;
