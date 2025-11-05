// src/pages/SustainabilityStoryPage.jsx - FIXED MULTIPLE SOCKET CONNECTIONS
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Button,
  Divider,
  Fade,
  Grow,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import { keyframes } from '@emotion/react';

// ✅ Backend Integration Imports
import io from 'socket.io-client';
import axios from 'axios';

// Icons for categories
import ArticleIcon from '@mui/icons-material/Article';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DownloadIcon from '@mui/icons-material/Download';
import LaunchIcon from '@mui/icons-material/Launch';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

// Components
import Hero from '../components/SustainabilityStory/Hero';
import BlogCard from '../components/SustainabilityStory/BlogCard';
import VideoCard from '../components/SustainabilityStory/VideoCard';
import ResourceCard from '../components/SustainabilityStory/ResourceCard';
import FeaturedStoryCard from '../components/SustainabilityStory/FeaturedStoryCard';

// Import dialog content components
import BlogDialogContent from '../components/SustainabilityStory/BlogDialogContent';
import VideoDialogContent from '../components/SustainabilityStory/VideoDialogContent';
import ResourceDocument from '../components/SustainabilityStory/ResourceDocument';
import { API_BASE } from '../../utils/api';

// ✅ API Configuration
const API_URL = `${API_BASE}/api/stories`;

// === Animations ===
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
  0%, 100% { box-shadow: 0 0 20px currentColor; }
  50% { box-shadow: 0 0 30px currentColor, 0 0 40px currentColor; }
`;

const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Main Component
const SustainabilityStoryPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { category: urlCategory, storyId } = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // ✅ Backend state management
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredStories, setFeaturedStories] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const socketRef = useRef(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const categories = ['All', 'Blog', 'Video', 'Resources'];
  const categoryColors = {
    'All': theme.palette.primary.main,
    'Blog': '#1AC99F',
    'Video': '#3498db',
    'Resources': '#2E8B8B'
  };

  // Get initial tab from URL or default to 'All'
  const getInitialTab = () => {
    if (urlCategory) {
      const index = categories.findIndex(cat => cat.toLowerCase() === urlCategory.toLowerCase());
      return index !== -1 ? index : 0;
    }
    return 0;
  };

  const [selectedTab, setSelectedTab] = useState(getInitialTab);
  const [visibleElements, setVisibleElements] = useState({});
  const sectionRefs = useRef({});

  // ✅ FIXED: Stable fetch functions with useCallback and proper dependencies
  const fetchStories = useCallback(async (page = 1, category = null, resetData = false) => {
    try {
      if (resetData) setLoading(true);
      
      const params = {
        status: 'published',
        page: page,
        limit: itemsPerPage,
        sort: '-createdAt'
      };

      // Add category filter if not 'All'
      if (category && category !== 'All') {
        params.category = category;
      }

      const { data } = await axios.get(API_URL, { params });
      
      if (data?.success) {
        const newStories = data.data.stories || [];
        
        if (resetData || page === 1) {
          setAllStories(newStories);
        } else {
          // Append for load more functionality
          setAllStories(prev => [...prev, ...newStories]);
        }

        // Update pagination info
        if (data.data.pagination) {
          setTotalPages(data.data.pagination.totalPages);
          setTotalItems(data.data.pagination.totalItems);
        }

        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch stories:', err);
      setError('Failed to load stories');
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  // ✅ FIXED: Stable fetch featured stories
  const fetchFeaturedStories = useCallback(async () => {
    try {
      setLoadingFeatured(true);
      const { data } = await axios.get(`${API_URL}/featured`);
      
      if (data?.success) {
        setFeaturedStories(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch featured stories:', err);
    } finally {
      setLoadingFeatured(false);
    }
  }, []);

  // ✅ FIXED: Separate useEffect for initial data fetch (runs once on mount)
  useEffect(() => {
    fetchStories(1, categories[selectedTab], true);
    fetchFeaturedStories();
  }, []); // Empty dependency array - runs once on mount

  // ✅ FIXED: Separate useEffect for category change
  useEffect(() => {
    if (selectedTab !== getInitialTab()) {
      fetchStories(1, categories[selectedTab], true);
    }
  }, [selectedTab, fetchStories]);

  // ✅ FIXED: Socket connection with singleton pattern (prevents multiple connections)
  useEffect(() => {
    // Prevent multiple socket connections
    if (socketRef.current) {
      console.log('Socket already exists, skipping connection');
      return;
    }

    console.log('🔌 Creating new socket connection...');
    const socket = io(API_BASE, {
      transports: ['websocket'],
      upgrade: true,
      rememberUpgrade: true,
      forceNew: false, // Don't force new connection
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket Connected:', socket.id);
      socket.emit('join-story-room', 'sustainabilityStories');
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket Disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket Error:', error);
    });

    // ✅ Real-time event listeners
    socket.on('story-created', (payload) => {
      if (payload?.success) {
        setAllStories(prev => [payload.data, ...prev]);
        
        // Update featured stories if the new story is featured
        if (payload.data.featured) {
          setFeaturedStories(prev => [payload.data, ...prev]);
        }
        
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
        
        // Update featured stories
        setFeaturedStories(prev => 
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
      
      setFeaturedStories(prev => 
        prev.filter(story => story._id !== payload.storyId)
      );
      
      console.log('🗑️ Story deleted:', payload.title);
    });

    socket.on('story-engagement', (payload) => {
      if (payload.storyId) {
        // Update both all stories and featured stories
        const updateStory = (story) => 
          story._id === payload.storyId
            ? {
                ...story,
                likes: payload.likes ?? story.likes,
                views: payload.views ?? story.views,
                downloadCount: payload.downloadCount ?? story.downloadCount,
              }
            : story;

        setAllStories(prev => prev.map(updateStory));
        setFeaturedStories(prev => prev.map(updateStory));
      }
    });

    // ✅ Cleanup function
    return () => {
      console.log('🧹 Cleaning up socket connection...');
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array - runs once on mount

  // Animation triggers
  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleElements(prev => ({ ...prev, hero: true })), 100),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, tabs: true })), 400),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, featured: true })), 700),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, stories: true })), 1000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Handle tab change and update URL
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setCurrentPage(1); // Reset to first page
    
    const categoryPath = categories[newValue].toLowerCase();
    if (categoryPath === 'all') {
      navigate('/sustainability-stories', { replace: true });
    } else {
      navigate(`/sustainability-stories/${categoryPath}`, { replace: true });
    }
  };

  // ✅ Handle pagination
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchStories(page, categories[selectedTab], false);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ Enhanced dialog handlers with engagement tracking
  const handleOpenDialog = async (story) => {
    try {
      // Track view engagement
      await axios.post(`${API_URL}/${story._id}/engagement`, { 
        action: 'view' 
      });
    } catch (error) {
      console.warn('Failed to track view engagement:', error);
    }

    setSelectedStory(story);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedStory(null);
  };

  // Scroll to specific story if coming from homepage
  useEffect(() => {
    if (storyId && allStories.length > 0) {
      const timer = setTimeout(() => {
        const element = sectionRefs.current[storyId];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [storyId, allStories]);

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'blog': return <ArticleIcon />;
      case 'video': return <OndemandVideoIcon />;
      case 'resources': return <LibraryBooksIcon />;
      default: return <AutoStoriesIcon />;
    }
  };

  // ✅ Enhanced render story card with engagement tracking
  const renderStoryCard = (story, index) => {
    const commonProps = {
      key: story._id, // Use _id from MongoDB
      story,
      categoryColor: categoryColors[story.category],
      ref: el => sectionRefs.current[story._id] = el,
      index,
      onClick: handleOpenDialog,
    };

    switch (story.category) {
      case 'Blog':
        return <BlogCard {...commonProps} />;
      case 'Video':
        return <VideoCard {...commonProps} />;
      case 'Resources':
        return <ResourceCard {...commonProps} />;
      default:
        return <BlogCard {...commonProps} />;
    }
  };

  // ✅ Loading state
  if (loading && allStories.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading sustainability stories...
        </Typography>
      </Box>
    );
  }

  // ✅ Error state
  if (error && allStories.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          px: 2,
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          onClick={() => fetchStories(1, categories[selectedTab], true)}
          variant="contained"
          startIcon={<RefreshIcon />}
        >
          Retry Loading
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 10% 20%, rgba(26, 201, 159, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(52, 152, 219, 0.05) 0%, transparent 50%),
          linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248, 249, 250, 0.8) 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Background Elements */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: { xs: 60, md: 100 },
            height: { xs: 60, md: 100 },
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${Object.values(categoryColors)[i % 4]}15, ${Object.values(categoryColors)[(i + 1) % 4]}15)`,
            top: `${10 + (i * 15)}%`,
            left: `${5 + (i * 20)}%`,
            animation: `${floatAnimation} ${8 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${i * 2}s`,
            opacity: 0.6,
            zIndex: 0,
          }}
        />
      ))}

      {/* Hero Section */}
      <Fade in={visibleElements.hero} timeout={1000}>
        <Box>
          <Hero />
        </Box>
      </Fade>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pb: 8 }}>
        {/* Tabs Section */}
        <Fade in={visibleElements.tabs} timeout={1200}>
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${categoryColors[categories[selectedTab]]}, ${categoryColors[categories[selectedTab]]}CC)`,
                },
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: 50,
                padding: '6px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              {categories.map((category, index) => (
                <Tab
                  key={category}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2 }}>
                      {getCategoryIcon(category)}
                      <Typography variant="body1" fontWeight={600}>
                        {category}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    textTransform: 'none',
                    minHeight: 48,
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      color: categoryColors[category],
                    },
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Tabs>
          </Box>
        </Fade>

        {/* Featured Stories Section */}
        {selectedTab === 0 && (
          <Grow in={visibleElements.featured} timeout={1400}>
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 5,
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Featured Stories
              </Typography>
              
              {loadingFeatured ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : featuredStories.length > 0 ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(3, 1fr)'
                    },
                    gap: 3,
                    justifyContent: 'center',
                    maxWidth: 1000,
                    mx: 'auto',
                    px: { xs: 2, md: 0 },
                  }}
                >
                  {featuredStories.map((story, index) => (
                    <Box key={story._id}>
                      <FeaturedStoryCard
                        story={story}
                        categoryColor={categoryColors[story.category]}
                        index={index}
                        onClick={handleOpenDialog}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No featured stories available yet.
                  </Typography>
                </Box>
              )}
              <Divider sx={{ mt: 6 }} />
            </Box>
          </Grow>
        )}

        {/* Stories Grid */}
        <Grow in={visibleElements.stories} timeout={1600}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 4,
                color: categoryColors[categories[selectedTab]],
                textAlign: 'center',
              }}
            >
              {selectedTab === 0 ? 'All Stories' : `${categories[selectedTab]} Stories`}
              <Chip
                label={`${totalItems} stories`}
                size="small"
                sx={{
                  ml: 2,
                  background: `${categoryColors[categories[selectedTab]]}20`,
                  color: categoryColors[categories[selectedTab]],
                  fontWeight: 600,
                }}
              />
            </Typography>

            {/* Loading indicator for pagination */}
            {loading && allStories.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <CircularProgress size={30} />
              </Box>
            )}

            {/* Stories List */}
            {allStories.length > 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  animation: `${slideIn} 0.6s ease-out`,
                  maxWidth: '100%',
                }}
              >
                {allStories.map((story, index) => renderStoryCard(story, index))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No {categories[selectedTab].toLowerCase()} stories available yet.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check back later for new content!
                </Typography>
              </Box>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 600,
                      borderRadius: 2,
                      '&.Mui-selected': {
                        background: `linear-gradient(135deg, ${categoryColors[categories[selectedTab]]}, ${categoryColors[categories[selectedTab]]}CC)`,
                        color: 'white',
                        '&:hover': {
                          background: `linear-gradient(135deg, ${categoryColors[categories[selectedTab]]}DD, ${categoryColors[categories[selectedTab]]}AA)`,
                        },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </Grow>
      </Container>

      {/* ✅ Enhanced Story Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="lg"
        fullScreen={fullScreen}
        scroll="paper"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: fullScreen ? 0 : 3,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h5" fontWeight={700} color="primary">
            {selectedStory?.title}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: theme.palette.grey[500],
              background: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                background: 'white',
                color: theme.palette.grey[700],
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedStory?.category === 'Blog' && (
            <BlogDialogContent story={selectedStory} />
          )}
          {selectedStory?.category === 'Video' && (
            <VideoDialogContent story={selectedStory} />
          )}
          {selectedStory?.category === 'Resources' && (
            <ResourceDocument story={selectedStory} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SustainabilityStoryPage;
