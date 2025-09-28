import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  Zoom,
  Divider,
  Tooltip,
  Skeleton
} from '@mui/material';
import { keyframes } from '@emotion/react';
import VerifiedIcon from '@mui/icons-material/Verified';
import BusinessIcon from '@mui/icons-material/Business';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SecurityIcon from '@mui/icons-material/Security';
import PublicIcon from '@mui/icons-material/Public';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EcoIcon from '@mui/icons-material/Nature';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { API_BASE } from '../../../utils/api';

// Glittering animation
const glitterAnimation = keyframes`
  0% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 rgba(255,255,255,0.4); }
  25% { transform: scale(1.05) rotate(2deg); box-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(26, 201, 159, 0.4); }
  50% { transform: scale(1.1) rotate(-1deg); box-shadow: 0 0 30px rgba(255,255,255,1), 0 0 40px rgba(26, 201, 159, 0.6); }
  75% { transform: scale(1.05) rotate(1deg); box-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(26, 201, 159, 0.4); }
  100% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 rgba(255,255,255,0.4); }
`;

// Sparkle animation
const sparkleAnimation = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

// Divider animation
const dividerGlow = keyframes`
  0% { opacity: 0.6; transform: scaleX(0.8); }
  50% { opacity: 1; transform: scaleX(1.1); }
  100% { opacity: 0.6; transform: scaleX(0.8); }
`;

// Product image animations - UPDATED FOR RECTANGULAR IMAGES
const productImageFloat = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-6px) scale(1.05); }
`;

const productImageGlow = keyframes`
  0% { box-shadow: 0 4px 15px rgba(26, 201, 159, 0.2); }
  50% { box-shadow: 0 8px 30px rgba(26, 201, 159, 0.4), 0 0 20px rgba(26, 201, 159, 0.3); }
  100% { box-shadow: 0 4px 15px rgba(26, 201, 159, 0.2); }
`;

const descriptionSlideIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(10px) scale(0.95); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0px) scale(1); 
  }
`;

// Border animation for rectangular images
const borderPulse = keyframes`
  0% { border-color: rgba(26, 201, 159, 0.3); }
  50% { border-color: rgba(26, 201, 159, 0.8); }
  100% { border-color: rgba(26, 201, 159, 0.3); }
`;

const API_URL = `${API_BASE}`;

// ✅ Helper function to get correct image URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's already a complete URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it starts with /uploads, construct with base URL
  if (imageUrl.startsWith('/uploads')) {
    return `${API_BASE}${imageUrl}`;
  }
  
  // If it starts with uploads (without slash), add slash and construct
  if (imageUrl.startsWith('uploads')) {
    return `${API_BASE}/${imageUrl}`;
  }
  
  // Default construction
  return `${API_BASE}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
};

// ✅ Updated Product Image Component with backend data
const ProductIcon = ({ product, index, scrollScale }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // ✅ Default colors for products without specific colors
  const defaultColor = "#1AC99F";
  const defaultSecondaryColor = "#0E9A78";
  
  const productColor = product.color || defaultColor;
  const productSecondaryColor = product.secondaryColor || defaultSecondaryColor;

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(true);
    setImageError(true);
  };

  // ✅ Handle click tracking
  const handleClick = async () => {
    try {
      await fetch(`${API_URL}/api/trusted/product-icons/${product._id}/click`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  return (
    <Box
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: `scale(${scrollScale})`,
        '&:hover': {
          '& .product-image': {
            animation: `${productImageFloat} 1.5s ease-in-out infinite, ${productImageGlow} 2s ease-in-out infinite`,
          }
        }
      }}
    >
      {/* Image Container - UPDATED FOR RECTANGULAR SHAPE */}
      <Box
        className="product-image"
        sx={{
          width: { xs: 100, sm: 120, md: 140 }, // Rectangular width
          height: { xs: 60, sm: 70, md: 80 }, // Rectangular height (aspect ratio ~1.75:1)
          borderRadius: { xs: 2, sm: 2.5, md: 3 }, // Rounded corners instead of circle
          background: `linear-gradient(135deg, ${productColor}10, ${productSecondaryColor}10)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'all 0.4s ease',
          border: `2px solid ${productColor}40`,
          overflow: 'hidden',
          boxShadow: `0 4px 15px ${productColor}20`,
          
          // Animated border on hover
          animation: isHovered ? `${borderPulse} 2s ease-in-out infinite` : 'none',
          
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: `conic-gradient(from 0deg, transparent, ${productColor}20, transparent)`,
            animation: isHovered ? `spin 3s linear infinite` : 'none',
          },
          
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: -4,
            borderRadius: 'inherit',
            background: `radial-gradient(ellipse, ${productColor}08, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
            zIndex: -1,
          }
        }}
      >
        {/* Product Image */}
        {!imageError ? (
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              width: '90%',
              height: '90%',
              objectFit: 'cover',
              borderRadius: '8px',
              transition: 'all 0.4s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              filter: isHovered ? 'brightness(1.1) contrast(1.1)' : 'brightness(1) contrast(1)',
              zIndex: 1,
              position: 'relative',
              display: imageLoaded ? 'block' : 'none',
            }}
          />
        ) : (
          // Error fallback
          <Box
            sx={{
              width: '90%',
              height: '90%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${productColor}20`,
              borderRadius: '8px',
              color: productColor,
              fontSize: { xs: '0.6rem', sm: '0.7rem' },
              textAlign: 'center'
            }}
          >
            {product.name.charAt(0)}
          </Box>
        )}
        
        {/* Loading overlay */}
        {!imageLoaded && !imageError && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${productColor}20, ${productSecondaryColor}20)`,
              zIndex: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: productColor,
                fontWeight: 600,
                fontSize: { xs: '0.6rem', sm: '0.7rem' },
              }}
            >
              Loading...
            </Typography>
          </Box>
        )}
        
        {/* Shimmer effect */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transform: 'translateX(-100%)',
            transition: 'transform 0.6s ease',
            ...(isHovered && {
              transform: 'translateX(100%)',
            }),
            zIndex: 1,
          }}
        />
      </Box>

      {/* Description Tooltip - UPDATED POSITIONING FOR RECTANGULAR SHAPE */}
      <Box
        sx={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          mt: 1.5,
          opacity: isHovered ? 1 : 0,
          visibility: isHovered ? 'visible' : 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: isHovered ? `${descriptionSlideIn} 0.3s ease-out` : 'none',
          zIndex: 100,
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${productColor}95, ${productSecondaryColor}95)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${productColor}30`,
            borderRadius: 2,
            px: 2.5,
            py: 1.5,
            boxShadow: `0 8px 32px ${productColor}40`,
            position: 'relative',
            maxWidth: { xs: 220, sm: 260 },
            minWidth: { xs: 200, sm: 240 },
            
            // Arrow pointing up
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -7,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderBottom: `7px solid ${productColor}95`,
            }
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              mb: 0.5,
              textAlign: 'center',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {product.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: { xs: '0.6rem', sm: '0.65rem' },
              lineHeight: 1.3,
              textAlign: 'center',
              whiteSpace: 'pre-line',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            {product.description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Add spin keyframe for the rotating border
const spinKeyframe = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const TrustedByLeaders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [visibleItems, setVisibleItems] = useState({});
  const [partnerships, setPartnerships] = useState([]);
  const [recognitions, setRecognitions] = useState([]);
  
  // ✅ NEW: Product Icons State
  const [productIcons, setProductIcons] = useState([]);
  const [productIconsLoading, setProductIconsLoading] = useState(true);
  
  const [scrollScale, setScrollScale] = useState(1);
  const showTextWithImage = false;

  useEffect(() => {
    // Add spin animation to stylesheet
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Updated to fetch product icons too
        const [partnershipsRes, recognitionsRes, productIconsRes] = await Promise.all([
          fetch(`${API_URL}/api/trusted/partnerships`),
          fetch(`${API_URL}/api/trusted/recognitions`),
          fetch(`${API_URL}/api/trusted/product-icons`) // ✅ NEW: Fetch product icons
        ]);
        
        const partnershipsData = await partnershipsRes.json();
        const recognitionsData = await recognitionsRes.json();
        const productIconsData = await productIconsRes.json(); // ✅ NEW
        
        if (partnershipsData.success) {
          setPartnerships(partnershipsData.data);
        }
        if (recognitionsData.success) {
          setRecognitions(recognitionsData.data);
        }
        // ✅ NEW: Set product icons data
        if (productIconsData.success) {
          setProductIcons(productIconsData.data);
          console.log("✅ Product Icons loaded:", productIconsData.data);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setProductIconsLoading(false); // ✅ NEW: Set loading to false
      }
    };

    fetchData();

    const socket = io(API_URL);
    socket.on('partnerships-updated', (data) => {
      if (data.success) {
        console.log("Partnerships updated in real-time:", data.data);
        setPartnerships(data.data);
      }
    });

    socket.on('recognitions-updated', (data) => {
      if (data.success) {
        console.log("Recognitions updated in real-time:", data.data);
        setRecognitions(data.data);
      }
    });
    
    // ✅ NEW: Product Icons Socket Listener
    socket.on('product-icons-updated', (data) => {
      if (data.success) {
        console.log("Product Icons updated in real-time:", data.data);
        setProductIcons(data.data);
      }
    });
    
    const timer = setTimeout(() => {
      setVisibleItems({ partnerships: true });
    }, 300);
    const timer2 = setTimeout(() => {
      setVisibleItems(prev => ({ ...prev, recognitions: true }));
    }, 600);
    // Timer for product icons
    const timer3 = setTimeout(() => {
      setVisibleItems(prev => ({ ...prev, products: true }));
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
      socket.disconnect();
    };
  }, []);

  return (
    <Box
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container 
        maxWidth="xl" 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          width: '100%',
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        {/* Main Title */}
        <Fade in timeout={800}>
          <Box textAlign="center" mb={{ xs: 2, sm: 3, md: 4 }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1.5,
                fontSize: { 
                  xs: '1.4rem', 
                  sm: '2.1rem', 
                  md: '2.1rem', 
                  lg: '2.6rem' 
                },
                textAlign: 'center',
                lineHeight: 1.6,
                transform: `scale(${scrollScale})`,
                transition: 'transform 0.3s ease',
                px: { xs: 0.5, sm: 1 },
              }}
            >
              Designing the future of Sustainability
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
                },
                opacity: 0.8,
                lineHeight: 1.4,
                transform: `scale(${scrollScale})`,
                transition: 'transform 0.3s ease',
                px: { xs: 0.5, sm: 1 },
                mb: 3,
              }}
            >
              Powerful SaaS solutions to acccelerate your climate & compliance journery
            </Typography>

            {/* ✅ UPDATED: Product Images Section with backend data */}
            <Fade in={visibleItems.products} timeout={1200}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: { xs: 5, sm: 7, md: 10 },
                  mt: { xs: 2, sm: 3, md: 4 },
                  mb: { xs: 1, sm: 2, md: 3 },
                  position: 'relative',
                }}
              >
                {/* ✅ Show loading skeleton while fetching */}
                {productIconsLoading && (
                  <>
                    <Skeleton 
                      variant="rectangular" 
                      width={140} 
                      height={80} 
                      sx={{ borderRadius: 2 }}
                    />
                    <Skeleton 
                      variant="rectangular" 
                      width={140} 
                      height={80} 
                      sx={{ borderRadius: 2 }}
                    />
                  </>
                )}
                
                {/* ✅ Show product icons from backend */}
                {!productIconsLoading && productIcons.map((product, index) => (
                  <Zoom key={product._id} in timeout={1500 + index * 300}>
                    <Box>
                      <ProductIcon 
                        product={product} 
                        index={index} 
                        scrollScale={scrollScale}
                      />
                    </Box>
                  </Zoom>
                ))}
                
                {/* ✅ Show message if no product icons */}
                {!productIconsLoading && productIcons.length === 0 && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontStyle: 'italic',
                      opacity: 0.6
                    }}
                  >
                    No product icons available
                  </Typography>
                )}
                
                {/* Decorative connection line between images */}
                {productIcons.length > 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: { xs: 80, sm: 100, md: 120 },
                      height: 2,
                      background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}30, transparent)`,
                      zIndex: -1,
                    }}
                  />
                )}
                
                {/* Decorative dots */}
                {productIcons.length > 1 && (
                  <>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '25%',
                        transform: 'translateY(-50%)',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: theme.palette.primary.main,
                        opacity: 0.6,
                        zIndex: -1,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        right: '25%',
                        transform: 'translateY(-50%)',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: theme.palette.secondary.main,
                        opacity: 0.6,
                        zIndex: -1,
                      }}
                    />
                  </>
                )}
              </Box>
            </Fade>
          </Box>
        </Fade>

        {/* Main Content Grid - Responsive Layout */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 2, sm: 3, lg: 4 },
            alignItems: 'stretch',
            justifyContent: 'center',
            maxWidth: '1400px',
            mx: 'auto',
          }}
        >
          
          {/* Left Side - Partnership Section */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Grow in={visibleItems.partnerships} timeout={1000}>
              <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: '500px', lg: '600px' } }}>
                <Typography
                  variant="h4"
                  component="h3"
                  sx={{
                    textAlign: 'center',
                    mb: { xs: 2, sm: 3, md: 3.5 },
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: { 
                      xs: '1rem', 
                      sm: '1.2rem', 
                      md: '1.5rem', 
                      lg: '1.7rem' 
                    },
                    position: 'relative',
                    transform: `scale(${scrollScale})`,
                    transition: 'transform 0.3s ease',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: { xs: -4, md: -6 },
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: { xs: 35, sm: 45, md: 55 },
                      height: { xs: 2, md: 3 },
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      borderRadius: 2,
                    }
                  }}
                >
                  Strategic Partners
                </Typography>
                
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { 
                      xs: '1fr', 
                      sm: partnerships.length === 1 ? '1fr' : 'repeat(2, 1fr)' 
                    },
                    gap: { xs: 1.5, sm: 2 },
                    justifyItems: 'center',
                    alignItems: 'center',
                  }}
                >
                  {partnerships.map((partner, index) => (
                    <Zoom in timeout={1200 + index * 200} key={partner._id}>
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: { xs: '180px', sm: '200px', md: '220px' },
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          transition: 'all 0.4s ease',
                          cursor: 'pointer',
                          p: { xs: 1.5, sm: 2 },
                          borderRadius: 3,
                          transform: `scale(${scrollScale})`,
                          '&:hover': {
                            transform: `scale(${scrollScale * 1.05}) translateY(-8px)`,
                            '& .partner-image': {
                              animation: `${glitterAnimation} 1.5s ease-in-out`,
                            }
                          }
                        }}
                      >
                        {partner.imageUrl ? (
                          <>
                            <Box
                              className="partner-image"
                              sx={{
                                mb: showTextWithImage ? 1.5 : 0,
                                borderRadius: 3,
                                overflow: 'hidden',
                                transition: 'all 0.4s ease',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: { xs: '70px', sm: '90px', md: '110px' },
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: '-100%',
                                  width: '100%',
                                  height: '100%',
                                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                                  transition: 'all 0.6s ease',
                                  zIndex: 1,
                                },
                                '&:hover::before': {
                                  left: '100%',
                                }
                              }}
                            >
                              <img
                                src={getImageUrl(partner.imageUrl)}
                                alt={partner.name}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  width: 'auto',
                                  height: 'auto',
                                  objectFit: 'contain',
                                  borderRadius: '12px',
                                  transition: 'all 0.4s ease',
                                  position: 'relative',
                                  zIndex: 0,
                                }}
                              />
                            </Box>
                            
                            {showTextWithImage && (
                              <>
                                <Typography
                                  variant="h6"
                                  component="h4"
                                  sx={{
                                    fontWeight: 700,
                                    mb: 0.5,
                                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.main}AA)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                  }}
                                >
                                  {partner.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ 
                                    fontWeight: 500,
                                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                  }}
                                >
                                  {partner.description}
                                </Typography>
                              </>
                            )}
                          </>
                        ) : (
                          <Card 
                            sx={{ 
                              width: '100%',
                              height: { xs: '70px', sm: '90px', md: '110px' },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transform: 'inherit',
                              transition: 'all 0.4s ease',
                            }}
                          >
                            <CardContent sx={{ p: { xs: 0.5, sm: 1 } }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem' },
                                  textAlign: 'center',
                                }}
                              >
                                {partner.name}
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Box>
                    </Zoom>
                  ))}
                </Box>
              </Box>
            </Grow>
          </Box>

          {/* Attractive Divider */}
          <Box 
            sx={{ 
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              mx: 2,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: '2px',
                height: '200px',
                background: `linear-gradient(180deg, transparent, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, transparent)`,
                borderRadius: '1px',
                position: 'relative',
                animation: `${dividerGlow} 3s ease-in-out infinite`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: `0 0 20px ${theme.palette.primary.main}`,
                }
              }}
            />
          </Box>

          {/* Mobile/Tablet Horizontal Divider */}
          <Box 
            sx={{ 
              display: { xs: 'block', lg: 'none' },
              my: 2,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, transparent)`,
                borderRadius: '1px',
                position: 'relative',
                animation: `${dividerGlow} 3s ease-in-out infinite`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: `0 0 20px ${theme.palette.primary.main}`,
                }
              }}
            />
          </Box>

          {/* Right Side - Recognition Section */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Grow in={visibleItems.recognitions} timeout={1400}>
              <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: '500px', lg: '600px' } }}>
                <Typography
                  variant="h4"
                  component="h3"
                  sx={{
                    textAlign: 'center',
                    mb: { xs: 2, sm: 3, md: 3.5 },
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: { 
                      xs: '1rem', 
                      sm: '1.2rem', 
                      md: '1.5rem', 
                      lg: '1.7rem' 
                    },
                    position: 'relative',
                    transform: `scale(${scrollScale})`,
                    transition: 'transform 0.3s ease',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: { xs: -4, md: -6 },
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: { xs: 35, sm: 45, md: 55 },
                      height: { xs: 2, md: 3 },
                      background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                      borderRadius: 2,
                    }
                  }}
                >
                  Recognized by
                </Typography>
                
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { 
                      xs: '1fr', 
                      sm: recognitions.length === 1 ? '1fr' : 'repeat(2, 1fr)' 
                    },
                    gap: { xs: 1.5, sm: 2 },
                    justifyItems: 'center',
                    alignItems: 'center',
                    maxWidth: '100%',
                  }}
                >
                  {recognitions.map((recognition, index) => (
                    <Zoom in timeout={1600 + index * 150} key={recognition._id}>
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: { xs: '180px', sm: '200px', md: '220px' },
                          minHeight: { xs: '70px', sm: '90px', md: '110px' },
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.4s ease',
                          p: { xs: 1.5, sm: 2 },
                          borderRadius: { xs: 2, md: 3 },
                          position: 'relative',
                          transform: `scale(${scrollScale})`,
                          '&:hover': {
                            transform: `scale(${scrollScale * 1.05}) translateY(-8px)`,
                            '& .recognition-image': {
                              animation: `${glitterAnimation} 1.5s ease-in-out`,
                            },
                            '& .sparkle': {
                              animation: `${sparkleAnimation} 1s ease-in-out infinite`,
                            }
                          }
                        }}
                      >
                        <Box
                          className="sparkle"
                          sx={{
                            position: 'absolute', 
                            top: '5%', 
                            left: '5%', 
                            width: { xs: '2px', md: '3px' }, 
                            height: { xs: '2px', md: '3px' }, 
                            borderRadius: '50%', 
                            background: '#FFD700', 
                            opacity: 0,
                          }}
                        />
                        <Box
                          className="sparkle"
                          sx={{
                            position: 'absolute', 
                            top: '15%', 
                            right: '10%', 
                            width: { xs: '2px', md: '3px' }, 
                            height: { xs: '2px', md: '3px' }, 
                            borderRadius: '50%', 
                            background: '#FF6B35', 
                            opacity: 0, 
                            animationDelay: '0.3s',
                          }}
                        />
                        <Box
                          className="sparkle"
                          sx={{
                            position: 'absolute', 
                            bottom: '15%', 
                            left: '15%', 
                            width: { xs: '2px', md: '3px' }, 
                            height: { xs: '2px', md: '3px' }, 
                            borderRadius: '50%', 
                            background: '#4ECDC4', 
                            opacity: 0, 
                            animationDelay: '0.6s',
                          }}
                        />
                        {recognition.imageUrl ? (
                          <>
                            <Box
                              className="recognition-image"
                              sx={{
                                mb: showTextWithImage ? 1 : 0,
                                borderRadius: 3,
                                transition: 'all 0.4s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: { xs: '70px', sm: '90px', md: '110px' },
                                width: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: '-100%',
                                  width: '100%',
                                  height: '100%',
                                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                                  transition: 'all 0.6s ease',
                                  zIndex: 1,
                                },
                                '&:hover::before': {
                                  left: '100%',
                                }
                              }}
                            >
                              <img
                                src={getImageUrl(recognition.imageUrl)}
                                alt={recognition.name}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  width: 'auto',
                                  height: 'auto',
                                  display: 'block',
                                  borderRadius: '12px',
                                  transition: 'all 0.4s ease',
                                  objectFit: 'contain',
                                  position: 'relative',
                                  zIndex: 0,
                                }}
                              />
                            </Box>
                            
                            {showTextWithImage && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  mt: 0.5,
                                  fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem' },
                                  fontWeight: 500, 
                                  opacity: 0.7, 
                                  textAlign: 'center',
                                  lineHeight: 1.2,
                                }}
                              >
                                {recognition.name}
                              </Typography>
                            )}
                          </>
                        ) : (
                          <Card 
                            sx={{ 
                              width: '100%',
                              height: { xs: '70px', sm: '90px', md: '110px' },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transform: 'inherit',
                              transition: 'all 0.4s ease',
                            }}
                          >
                            <CardContent sx={{ p: { xs: 0.5, sm: 1 } }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem' },
                                  textAlign: 'center',
                                }}
                              >
                                {recognition.name}
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Box>
                    </Zoom>
                  ))}
                </Box>
              </Box>
            </Grow>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TrustedByLeaders;
