// src/components/Solutions/AppleSolutionsShowcase.jsx
// Enhanced Apple-style solutions page with animated background effects
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  Avatar,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ZoomIn from "@mui/icons-material/ZoomIn";
import ZoomOut from "@mui/icons-material/ZoomOut";
import Close from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";
import { motion } from "framer-motion";
import { keyframes } from '@emotion/react';
import axios from 'axios';
import { API_BASE } from "../../utils/api";

const API_URL = `${API_BASE}/api`;

/* -------------------------------- ANIMATIONS ------------------------------- */
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

// Glow animation
const glowAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(26, 201, 159, 0.3); }
  50% { box-shadow: 0 0 30px rgba(26, 201, 159, 0.6), 0 0 40px rgba(26, 201, 159, 0.4); }
`;

// Shimmer animation
const shimmerAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Gradient wave animation
const waveAnimation = keyframes`
  0%, 100% { transform: translateX(-50%) translateY(0px); }
  50% { transform: translateX(-50%) translateY(-20px); }
`;

// Rotate animation
const rotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Default fallback images
const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80&auto=format&fit=crop";

/* ---------------------- ANIMATED BACKGROUND ELEMENTS --------------------- */
function AnimatedBackground({ solution }) {
  const theme = useTheme();
  
  return (
    <>
      {/* Animated gradient orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: { xs: 120, md: 200 },
          height: { xs: 120, md: 200 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${solution.primaryColor}20, transparent 70%)`,
          animation: `${floatAnimation} 6s ease-in-out infinite`,
          filter: 'blur(1px)',
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: { xs: 80, md: 140 },
          height: { xs: 80, md: 140 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${solution.primaryColor}15, transparent 60%)`,
          animation: `${floatAnimation} 8s ease-in-out infinite reverse`,
          filter: 'blur(2px)',
        }}
      />

      {/* Floating geometric shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '20%',
          width: 4,
          height: 4,
          bgcolor: solution.primaryColor,
          borderRadius: '50%',
          animation: `${pulseAnimation} 3s ease-in-out infinite`,
          opacity: 0.6,
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          left: '15%',
          width: 6,
          height: 6,
          bgcolor: solution.primaryColor,
          borderRadius: '50%',
          animation: `${pulseAnimation} 4s ease-in-out infinite`,
          opacity: 0.4,
        }}
      />

      {/* Rotating rings */}
      <Box
        sx={{
          position: 'absolute',
          top: '70%',
          right: '30%',
          width: { xs: 60, md: 100 },
          height: { xs: 60, md: 100 },
          border: `1px solid ${solution.primaryColor}30`,
          borderRadius: '50%',
          animation: `${rotateAnimation} 20s linear infinite`,
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: { xs: 40, md: 70 },
          height: { xs: 40, md: 70 },
          border: `1px solid ${solution.primaryColor}20`,
          borderRadius: '50%',
          animation: `${rotateAnimation} 15s linear infinite reverse`,
        }}
      />

      {/* Shimmer overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent, ${solution.primaryColor}08, transparent)`,
          animation: `${shimmerAnimation} 3s ease-in-out infinite`,
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

/* ----------------------------- GALLERY DIALOG ----------------------------- */
function GalleryDialog({ open, onClose, solution, startIndex = 0 }) {
  const theme = useTheme();
  const [i, setI] = React.useState(startIndex);
  
  React.useEffect(() => {
    if (open) {
      setI(startIndex);
    }
  }, [open, startIndex]);

  if (!solution) return null;

  const imgs = solution.images || [DEFAULT_FALLBACK_IMAGE];
  const next = () => {
    setI((v) => (v + 1) % imgs.length);
  };
  const prev = () => {
    setI((v) => (v - 1 + imgs.length) % imgs.length);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: 4, 
          overflow: "hidden",
          animation: `${glowAnimation} 2s ease-in-out infinite`,
        } 
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.3fr 0.7fr" },
          bgcolor: "background.default",
        }}
      >
        {/* Left: image viewer */}
        <Box sx={{ position: "relative", bgcolor: "#000", minHeight: { xs: 320, md: 560 } }}>
          <Box
            component="img"
            src={imgs[i]}
            alt={`${solution.title?.join(" ") || solution.tag} ${i + 1}`}
            onClick={next}
            onError={(e) => {
              e.target.src = DEFAULT_FALLBACK_IMAGE;
            }}
            sx={{
              position: "absolute",
              inset: 0,
              m: "auto",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              cursor: "pointer",
              transition: "all 0.3s ease",
              '&:hover': {
                filter: 'brightness(1.1)',
              }
            }}
          />
          
          {/* Previous button - FIXED */}
          {imgs.length > 1 && (
            <IconButton
              onClick={prev}
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,.15)",
                color: "#fff",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                "&:hover": { 
                  bgcolor: "rgba(255,255,255,.3)",
                  transform: "translateY(-50%) scale(1.1)",
                },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}
          
          {/* Next button - FIXED */}
          {imgs.length > 1 && (
            <IconButton
              onClick={next}
              sx={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,.15)",
                color: "#fff",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                "&:hover": { 
                  bgcolor: "rgba(255,255,255,.3)",
                  transform: "translateY(-50%) scale(1.1)",
                },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
          
          {/* Image counter */}
          <Box
            sx={{
              position: "absolute",
              left: 12,
              bottom: 12,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "#fff",
              px: 2,
              py: 1,
              borderRadius: 2,
              backdropFilter: "blur(10px)",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            {i + 1} / {imgs.length}
          </Box>
          
          {/* Thumbnail navigation */}
          {imgs.length > 1 && (
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                position: "absolute", 
                right: 12, 
                bottom: 12,
                maxWidth: "60%",
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                  height: 4,
                },
                "&::-webkit-scrollbar-track": {
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 2,
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(255,255,255,0.3)",
                  borderRadius: 2,
                }
              }}
            >
              {imgs.map((src, idx) => (
                <Avatar
                  key={idx}
                  src={src}
                  variant="rounded"
                  onClick={() => setI(idx)}
                  sx={{
                    width: 50,
                    height: 32,
                    borderRadius: 1,
                    cursor: "pointer",
                    border: `2px solid ${idx === i ? solution.primaryColor : "rgba(255,255,255,.4)"}`,
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      border: `2px solid ${solution.primaryColor}`,
                    },
                  }}
                />
              ))}
            </Stack>
          )}
          
          {/* Close button - FIXED */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              bgcolor: "rgba(255,255,255,.15)",
              color: "#fff",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              "&:hover": { 
                bgcolor: "rgba(255,255,255,.3)",
                transform: "scale(1.1)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
        
        {/* Right: details */}
        <Box sx={{ p: { xs: 2.5, md: 4 } }}>
          <Chip 
            label={`${solution.kind} • ${solution.tag}`} 
            sx={{ 
              mb: 1.5, 
              fontWeight: 800,
              background: `linear-gradient(45deg, ${solution.primaryColor}15, ${solution.secondaryColor})`,
              animation: `${shimmerAnimation} 3s ease-in-out infinite`,
            }} 
          />
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
            {Array.isArray(solution.title) ? solution.title.join(" ") : solution.title || solution.tag}
          </Typography>
          
          {solution.kicker && (
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: solution.primaryColor, 
                fontWeight: 600, 
                mb: 1.5,
                fontSize: '1.1rem'
              }}
            >
              {solution.kicker}
            </Typography>
          )}
          
          <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 2 }}>
            {solution.description}
          </Typography>
          
          {solution.features && solution.features.length > 0 && (
            <>
              <Typography variant="overline" sx={{ letterSpacing: 1, fontWeight: 800, color: solution.primaryColor }}>
                Key Features
              </Typography>
              <Stack spacing={1.25} sx={{ my: 1.5 }}>
                {solution.features.map((f, idx) => (
                  <Stack direction="row" spacing={1.2} key={idx}>
                    <CircleIcon sx={{ fontSize: 8, mt: "9px", color: solution.primaryColor }} />
                    <Typography variant="body2">{f}</Typography>
                  </Stack>
                ))}
              </Stack>
            </>
          )}
          
          <Stack direction="row" spacing={1.25} sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ 
                borderRadius: 999, 
                fontWeight: 800,
                background: `linear-gradient(45deg, ${solution.primaryColor}, ${solution.primaryColor}CC)`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${solution.primaryColor}DD, ${solution.primaryColor})`,
                  transform: 'scale(1.02)',
                }
              }}
            >
              Book a Demo
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              sx={{ 
                borderRadius: 999,
                borderColor: solution.primaryColor,
                color: solution.primaryColor,
                '&:hover': {
                  borderColor: solution.primaryColor,
                  bgcolor: `${solution.primaryColor}10`,
                  transform: 'scale(1.02)',
                }
              }}
            >
              Contact Sales
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------- APPLE-STYLE SECTION -------------------------- */
function AppleSection({ solution, flip = false, onLearnMore }) {
  const theme = useTheme();
  const mainImage = solution.images && solution.images.length > 0 
    ? solution.images[0] 
    : DEFAULT_FALLBACK_IMAGE;

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        background: `linear-gradient(135deg, ${solution.secondaryColor} 0%, ${theme.palette.background.paper} 50%, ${solution.secondaryColor} 100%)`,
        boxShadow: `0 10px 40px ${solution.primaryColor}15, 0 2px 20px rgba(0,0,0,.08)`,
        border: `1px solid ${solution.primaryColor}10`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 20px 60px ${solution.primaryColor}20, 0 5px 30px rgba(0,0,0,.12)`,
        }
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Elements */}
      <AnimatedBackground solution={solution} />

      {/* Enhanced background word with shimmer */}
      <Typography
        aria-hidden
        variant="h1"
        sx={{
          position: "absolute",
          top: { xs: 8, md: 12 },
          left: { xs: 12, md: 24 },
          right: 0,
          fontWeight: 900,
          fontSize: { xs: "3.5rem", sm: "6rem", md: "9rem" },
          lineHeight: 0.9,
          background: `linear-gradient(45deg, ${solution.primaryColor}08, ${solution.primaryColor}15, ${solution.primaryColor}08)`,
          backgroundSize: '200% 100%',
          animation: `${shimmerAnimation} 4s ease-in-out infinite`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          pointerEvents: "none",
          textTransform: "uppercase",
        }}
      >
        {solution.bgWord}
      </Typography>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            columnGap: { xs: 0, md: 6 },
            rowGap: { xs: 4, md: 0 },
            alignItems: "center",
            minHeight: { md: 520 },
          }}
        >
          {/* Enhanced Image column */}
          <Box
            sx={{
              gridColumn: { xs: "1", md: flip ? "2" : "1" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated glow behind image */}
            <Box
              sx={{
                position: "absolute",
                width: { xs: 360, md: 520, lg: 620 },
                height: { xs: 360, md: 520, lg: 620 },
                borderRadius: "50%",
                background: `radial-gradient(circle at 50% 50%, ${solution.primaryColor}20, ${solution.primaryColor}10 60%, transparent 70%)`,
                filter: "blur(20px)",
                animation: `${glowAnimation} 4s ease-in-out infinite`,
              }}
            />
            
            {/* Floating ring around image */}
            <Box
              sx={{
                position: "absolute",
                width: { xs: 380, md: 540, lg: 640 },
                height: { xs: 380, md: 540, lg: 640 },
                border: `2px solid ${solution.primaryColor}20`,
                borderRadius: "50%",
                animation: `${floatAnimation} 8s ease-in-out infinite`,
                zIndex: 0,
              }}
            />
            
            <Box
              component="img"
              src={mainImage}
              alt={Array.isArray(solution.title) ? solution.title.join(" ") : solution.title || solution.tag}
              onError={(e) => {
                e.target.src = DEFAULT_FALLBACK_IMAGE;
              }}
              sx={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                borderRadius: 10,
                maxWidth: { xs: 520, md: 680 },
                objectFit: "contain",
                filter: "drop-shadow(0 12px 40px rgba(0,0,0,.2))",
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
            />
          </Box>

          {/* Enhanced Copy column */}
          <Box sx={{ gridColumn: { xs: "1", md: flip ? "1" : "2" }, px: { xs: 1, md: 2 } }}>
            <Stack spacing={2}>
              <Chip
                label={`${solution.kind} • ${solution.tag}`}
                sx={{
                  width: "fit-content",
                  borderRadius: 999,
                  background: `linear-gradient(45deg, ${solution.primaryColor}15, ${solution.secondaryColor})`,
                  border: `1px solid ${solution.primaryColor}30`,
                  backdropFilter: "blur(8px)",
                  fontWeight: 800,
                  animation: `${shimmerAnimation} 3s ease-in-out infinite`,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2.2rem", md: "3.2rem" },
                  lineHeight: 1.05,
                  background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${solution.primaryColor})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {Array.isArray(solution.title) ? (
                  <>
                    {solution.title[0]}
                    <br />
                    {solution.title[1]}
                  </>
                ) : (
                  solution.title || solution.tag
                )}
              </Typography>
              
              {solution.kicker && (
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: solution.primaryColor,
                    fontWeight: 600,
                    fontSize: '1.1rem'
                  }}
                >
                  {solution.kicker}
                </Typography>
              )}
              
              <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                {solution.short}
              </Typography>
              
              <Stack direction="row" spacing={1.25} sx={{ pt: 1 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => onLearnMore(solution, 0)}
                  sx={{ 
                    borderRadius: 999, 
                    fontWeight: 800,
                    background: `linear-gradient(45deg, ${solution.primaryColor}, ${solution.primaryColor}CC)`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${solution.primaryColor}DD, ${solution.primaryColor})`,
                      animation: `${pulseAnimation} 0.3s ease`,
                    }
                  }}
                >
                  Learn More
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  sx={{ 
                    borderRadius: 999,
                    borderColor: solution.primaryColor,
                    color: solution.primaryColor,
                    '&:hover': {
                      borderColor: solution.primaryColor,
                      bgcolor: `${solution.primaryColor}10`,
                      animation: `${pulseAnimation} 0.3s ease`,
                    }
                  }}
                >
                  Book a Demo
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* Enhanced decorative separator */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -48,
          height: 96,
          background: `radial-gradient(50% 96px at 50% 0%, ${solution.primaryColor}15, transparent 70%)`,
          pointerEvents: "none",
          animation: `${waveAnimation} 6s ease-in-out infinite`,
        }}
      />
    </Box>
  );
}

/* --------------------------------- PAGE ---------------------------------- */
export default function AppleSolutionsShowcase() {
  // State management
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(null);
  const [startIndex, setStartIndex] = React.useState(0);

  const theme = useTheme();

  // Fetch solutions data from API
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch published solutions first
        let response = await axios.get(`${API_URL}/solutions?status=published`);
        
        if (!response.data?.success || !Array.isArray(response.data.data) || response.data.data.length === 0) {
          // If no published solutions, try to get all solutions
          response = await axios.get(`${API_URL}/solutions?status=all`);
        }
        
        if (response.data?.success && Array.isArray(response.data.data)) {
          const solutionsData = response.data.data;
          
          // Transform API data to component format
          const transformedSolutions = solutionsData
            .sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order
            .map((solution) => ({
              key: solution.key || solution._id,
              kind: solution.kind || 'Software',
              tag: solution.tag || 'Solution',
              title: Array.isArray(solution.title) ? solution.title : [solution.title || solution.tag],
              kicker: solution.kicker || '',
              short: solution.short || solution.description?.substring(0, 200) + '...' || '',
              description: solution.description || solution.short || 'No description available',
              features: Array.isArray(solution.features) ? solution.features : [],
              
              // Process images - convert relative URLs to absolute
              images: solution.images && solution.images.length > 0 
                ? solution.images.map(img => 
                    img.url.startsWith('http') ? img.url : `${API_BASE}${img.url}`
                  )
                : [DEFAULT_FALLBACK_IMAGE],
              
              bgWord: solution.bgWord || solution.key || solution.tag,
              primaryColor: solution.primaryColor || '#1AC99F',
              secondaryColor: solution.secondaryColor || '#E8F8F4',
              
              // Additional fields
              status: solution.status,
              order: solution.order || 0,
              featured: solution.featured || false,
              _id: solution._id
            }));
          
          setSolutions(transformedSolutions);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching solutions:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch solutions');
        
        // Set fallback solution if API fails
        setSolutions([{
          key: "fallback",
          kind: "Service",
          tag: "Solutions",
          title: ["Coming", "Soon"],
          kicker: "We're preparing something amazing",
          short: "Our solutions are being prepared and will be available soon. Please check back later.",
          description: "We're working hard to bring you innovative solutions. Stay tuned for updates.",
          features: ["Coming Soon", "Innovative Technology", "Expert Support"],
          images: [DEFAULT_FALLBACK_IMAGE],
          bgWord: "Solutions",
          primaryColor: "#1AC99F",
          secondaryColor: "#E8F8F4",
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  const handleLearnMore = (solution, index = 0) => {
    setCurrent(solution);
    setStartIndex(index);
    setOpen(true);
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 3
      }}>
        <CircularProgress size={60} sx={{ color: '#1AC99F' }} />
        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Loading Solutions...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Page-level animated background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}05, transparent 50%), 
                       radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}05, transparent 50%)`,
          zIndex: -1,
        }}
      />

      {/* Error Alert */}
      {error && (
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Alert 
            severity="warning" 
            sx={{ 
              borderRadius: 3, 
              mb: 2,
              background: 'linear-gradient(45deg, rgba(255,193,7,0.1), rgba(255,193,7,0.05))',
            }}
          >
            API Error: {error}. Showing fallback content.
          </Alert>
        </Container>
      )}

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography 
            variant="overline" 
            sx={{ 
              letterSpacing: 2, 
              fontWeight: 800, 
              color: "text.secondary",
              background: `linear-gradient(45deg, ${theme.palette.text.secondary}, ${theme.palette.primary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
            }}
          >
            SOLUTIONS ({solutions.length})
          </Typography>
          <Stack direction="row" spacing={2} sx={{ color: "text.secondary" }}>
            {solutions.map((solution) => (
              <Typography 
                key={solution.key}
                variant="caption" 
                onClick={() => handleLearnMore(solution, 0)}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: solution.primaryColor,
                    animation: `${pulseAnimation} 0.3s ease`,
                  }
                }}
              >
                {solution.kind}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Container>

      <Stack spacing={{ xs: 6, md: 10 }} sx={{ pb: { xs: 8, md: 12 } }}>
        {solutions.map((solution, index) => (
          <AppleSection 
            key={solution.key || solution._id || index}
            solution={solution} 
            onLearnMore={handleLearnMore} 
            flip={index % 2 !== 0} 
          />
        ))}
      </Stack>

      <GalleryDialog 
        open={open} 
        onClose={() => setOpen(false)} 
        solution={current} 
        startIndex={startIndex} 
      />
    </Box>
  );
}
