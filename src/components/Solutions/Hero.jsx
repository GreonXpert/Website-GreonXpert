// src/components/Solutions/SolutionsGalleryHero.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  IconButton,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE } from "../../utils/api";

const API_URL = `${API_BASE}/api`;

const bgVariants = {
  enter: { opacity: 0, scale: 1.02 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.45, ease: "easeIn" } },
};

const contentVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  out: { opacity: 0, y: -8, transition: { duration: 0.25 } },
};

// Default fallback image
const DEFAULT_BG = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1920&q=80&auto=format&fit=crop";
const DEFAULT_PRODUCT = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1500&q=80&auto=format&fit=crop";

export default function SolutionsGalleryHero() {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  
  // State management
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idx, setIdx] = useState(0);

  // Fetch solutions data from API
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from getAllSolutions endpoint
        const response = await axios.get(`${API_URL}/solutions?status=published`);
        
        if (response.data?.success && Array.isArray(response.data.data)) {
          const solutionsData = response.data.data;
          
          // Transform API data to slides format
          const transformedSlides = solutionsData
            .sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order
            .map((solution, index) => ({
              id: solution._id || index + 1,
              key: solution.key,
              tag: solution.tag?.replace(/\s*\([^)]*\)/g, '').toUpperCase() || 'SOLUTION', // Remove parentheses and make uppercase
              title: Array.isArray(solution.title) ? solution.title.join(' ') : solution.title || solution.tag,
              subtitle: solution.short || solution.description?.substring(0, 100) + '...' || '',
              kicker: solution.kicker || '',
              description: solution.description || '',
              
              // Use background and product images
              bg: solution.bg || (solution.images && solution.images[0] ? `${API_BASE}${solution.images[0].url}` : DEFAULT_BG),
              product: solution.product || (solution.images && solution.images[0] ? `${API_BASE}${solution.images[0].url}` : DEFAULT_PRODUCT),
              
              // Transform specs or create default ones based on features
              specs: solution.specs?.length > 0 ? solution.specs : [
                { k: solution.features?.length > 0 ? `${solution.features.length}+` : "5+", v: "Features" },
                { k: solution.kind === 'Software' ? "99%" : solution.kind === 'Service' ? "95%" : "99.5%", v: solution.kind === 'Software' ? "Uptime" : solution.kind === 'Service' ? "Success" : "Accuracy" },
                { k: solution.status === 'published' ? "Live" : "Soon", v: "Status" },
              ],
              
              // Additional data for potential use
              features: solution.features || [],
              primaryColor: solution.primaryColor || '#1AC99F',
              secondaryColor: solution.secondaryColor || '#E8F8F4',
              bgWord: solution.bgWord || solution.key,
              kind: solution.kind,
              featured: solution.featured,
              images: solution.images || []
            }));
          
          setSlides(transformedSlides);
          
          // If no published solutions, try to get draft solutions
          if (transformedSlides.length === 0) {
            const draftResponse = await axios.get(`${API_URL}/solutions?status=all`);
            if (draftResponse.data?.success && Array.isArray(draftResponse.data.data)) {
              const draftSlides = draftResponse.data.data
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((solution, index) => ({
                  id: solution._id || index + 1,
                  key: solution.key,
                  tag: solution.tag?.replace(/\s*\([^)]*\)/g, '').toUpperCase() || 'SOLUTION',
                  title: Array.isArray(solution.title) ? solution.title.join(' ') : solution.title || solution.tag,
                  subtitle: solution.short || solution.description?.substring(0, 100) + '...' || '',
                  bg: solution.bg || (solution.images && solution.images[0] ? `${API_BASE}${solution.images[0].url}` : DEFAULT_BG),
                  product: solution.product || (solution.images && solution.images[0] ? `${API_BASE}${solution.images[0].url}` : DEFAULT_PRODUCT),
                  specs: solution.specs?.length > 0 ? solution.specs : [
                    { k: solution.features?.length > 0 ? `${solution.features.length}+` : "5+", v: "Features" },
                    { k: solution.kind === 'Software' ? "99%" : solution.kind === 'Service' ? "95%" : "99.5%", v: solution.kind === 'Software' ? "Uptime" : solution.kind === 'Service' ? "Success" : "Accuracy" },
                    { k: "Draft", v: "Status" },
                  ],
                  features: solution.features || [],
                  primaryColor: solution.primaryColor || '#1AC99F',
                  secondaryColor: solution.secondaryColor || '#E8F8F4',
                  bgWord: solution.bgWord || solution.key,
                  kind: solution.kind,
                  featured: solution.featured,
                  images: solution.images || []
                }));
              setSlides(draftSlides);
            }
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching solutions:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch solutions');
        
        // Fallback to default slides if API fails
        setSlides([
          {
            id: 1,
            tag: "SOLUTIONS",
            title: "Coming Soon",
            subtitle: "Our solutions are being prepared. Please check back soon.",
            bg: DEFAULT_BG,
            product: DEFAULT_PRODUCT,
            specs: [
              { k: "Soon", v: "Available" },
              { k: "Multiple", v: "Options" },
              { k: "24/7", v: "Support" },
            ],
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  const next = React.useCallback(
    () => setIdx((i) => (i + 1) % slides.length),
    [slides.length]
  );
  
  const prev = React.useCallback(
    () => setIdx((i) => (i - 1 + slides.length) % slides.length),
    [slides.length]
  );

  // Auto-slide functionality (optional)
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(next, 5000); // Auto-advance every 5 seconds
      return () => clearInterval(interval);
    }
  }, [next, slides.length]);

  const active = slides[idx] || {};

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          position: "relative",
          bgcolor: theme.palette.grey[100],
          py: { xs: 4, md: 6 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: { xs: 520, md: 560 },
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={40} sx={{ color: '#1AC99F' }} />
          <Typography variant="body1" color="text.secondary">
            Loading solutions...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // Error state
  if (error && slides.length === 0) {
    return (
      <Box
        sx={{
          position: "relative",
          bgcolor: theme.palette.grey[100],
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Alert 
            severity="error" 
            sx={{ borderRadius: 3, mb: 2 }}
          >
            Error loading solutions: {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  // No slides available
  if (!slides.length) {
    return (
      <Box
        sx={{
          position: "relative",
          bgcolor: theme.palette.grey[100],
          py: { xs: 4, md: 6 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: { xs: 520, md: 560 },
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No solutions available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: theme.palette.grey[100],
        py: { xs: 4, md: 6 },
      }}
    >
      {error && (
        <Container maxWidth="lg" sx={{ mb: 2 }}>
          <Alert severity="warning" sx={{ borderRadius: 3 }}>
            Using fallback data due to API error: {error}
          </Alert>
        </Container>
      )}
      
      <Container
        maxWidth="lg"
        sx={{
          p: { xs: 0, md: 2 },
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 16px 48px rgba(0,0,0,.08)",
            minHeight: { xs: 520, md: 560 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Background plate */}
          <AnimatePresence mode="wait">
            <Box
              key={active.id}
              component={motion.div}
              variants={bgVariants}
              initial="enter"
              animate="center"
              exit="exit"
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${active.bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "saturate(.9)",
              }}
            />
          </AnimatePresence>

          {/* Pale mask + diagonal wedge on the right */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,.92))`,
              mixBlendMode: "luminosity",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              clipPath: "polygon(65% 0, 100% 0, 100% 100%, 35% 100%)",
              backgroundImage: `url(${active.bg})`,
              backgroundSize: "cover",
              backgroundPosition: "right center",
              filter: "contrast(1.1) saturate(1.05)",
            }}
          />

          {/* Left rail thumbnails */}
          <Stack
            spacing={1.2}
            sx={{
              position: "absolute",
              top: { xs: 16, md: 24 },
              left: { xs: 10, md: 18 },
              zIndex: 2,
            }}
          >
            {slides.map((s, i) => {
              const on = i === idx;
              return (
                <Box
                  key={s.id}
                  onClick={() => setIdx(i)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    opacity: on ? 1 : 0.65,
                    transition: "all .25s ease",
                    "&:hover": { opacity: 1, transform: "translateX(2px)" },
                  }}
                >
                  <Avatar
                    variant="rounded"
                    src={s.product}
                    sx={{
                      width: 42,
                      height: 28,
                      borderRadius: 1,
                      border: `1px solid ${
                        on ? theme.palette.primary.main : "rgba(0,0,0,.15)"
                      }`,
                      boxShadow: on
                        ? `0 0 0 2px ${theme.palette.primary.light}`
                        : "none",
                    }}
                  />
                  {!isMdDown && (
                    <Typography
                      variant="overline"
                      sx={{
                        fontWeight: 800,
                        letterSpacing: 1,
                        color: theme.palette.grey[700],
                        fontSize: '0.7rem',
                      }}
                    >
                      {s.tag}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Stack>

          {/* Main content area - now properly centered */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
              // Account for bottom rail space (approx 80px)
              paddingBottom: { xs: "100px", md: "80px" },
              paddingTop: { xs: "60px", md: "40px" }, // Account for top thumbnails
            }}
          >
            <Container
              maxWidth="lg"
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
                alignItems: "center",
                gap: { xs: 2, md: 0 },
                width: "100%",
              }}
            >
              {/* Title & copy */}
              <Stack
                spacing={1.2}
                sx={{ pl: { xs: 3.5, md: 8 }, pr: { xs: 3.5, md: 0 } }}
                component={motion.div}
                variants={contentVariants}
                initial="hidden"
                animate="show"
                key={`copy-${active.id}`}
              >
                <Chip
                  label={active.tag}
                  sx={{
                    width: "fit-content",
                    color: theme.palette.primary.contrastText,
                    bgcolor: active.primaryColor || theme.palette.primary.main,
                    borderRadius: 999,
                    fontWeight: 800,
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: { md: "-.5px" },
                    color: theme.palette.grey[900],
                    fontSize: { xs: "2.4rem", md: "3.2rem" },
                    lineHeight: 1.05,
                  }}
                >
                  {active.title}
                </Typography>
                {active.kicker && (
                  <Typography
                    variant="subtitle2"
                    sx={{ 
                      color: active.primaryColor || theme.palette.primary.main, 
                      fontWeight: 600,
                      fontSize: '1rem' 
                    }}
                  >
                    {active.kicker}
                  </Typography>
                )}
                <Typography
                  variant="subtitle1"
                  sx={{ color: theme.palette.text.secondary, maxWidth: 560 }}
                >
                  {active.subtitle}
                </Typography>

                <Stack direction="row" spacing={1.2} sx={{ pt: 1 }}>
                  <Button
                    variant="contained"
                    sx={{ 
                      borderRadius: 999, 
                      fontWeight: 800,
                      backgroundColor: active.primaryColor || theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: active.primaryColor || theme.palette.primary.dark,
                        opacity: 0.9
                      }
                    }}
                  >
                    Book a Demo
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    sx={{
                      borderRadius: 999,
                      color: theme.palette.grey[800],
                      borderColor: theme.palette.grey[300],
                      "&:hover": { borderColor: theme.palette.grey[500] },
                    }}
                  >
                    Learn more
                  </Button>
                </Stack>
              </Stack>

              {/* Product image on stage */}
              <Box
                component={motion.div}
                key={`prod-${active.id}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pr: { md: 6 },
                  pl: { md: 2 },
                  pt: { xs: 4, md: 0 },
                }}
              >
                {/* subtle shadow under object */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: { xs: 32, md: 40 },
                    width: { xs: "72%", md: "75%" },
                    height: 18,
                    borderRadius: "50%",
                    filter: "blur(8px)",
                    background:
                      "radial-gradient(ellipse at center, rgba(0,0,0,.25), rgba(0,0,0,0) 60%)",
                  }}
                />
                <Box
                  component="img"
                  src={active.product}
                  alt={active.title}
                  onError={(e) => {
                    e.target.src = DEFAULT_PRODUCT;
                  }}
                  style={{
                    width: "100%",
                    maxWidth: 720,
                    objectFit: "contain",
                    borderRadius: '8px',
                  }}
                />
              </Box>
            </Container>
          </Box>

          {/* Bottom spec rail */}
          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{
              position: "absolute",
              bottom: 14,
              left: { xs: 16, md: 32 },
              right: { xs: 16, md: 32 },
              zIndex: 2,
              px: 2,
              py: 1.2,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,.65)",
              backdropFilter: "blur(6px)",
              border: `1px solid ${theme.palette.grey[300]}`,
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              {active.specs?.map((s, idx) => (
                <Stack key={idx} spacing={0.1} sx={{ minWidth: 70 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ 
                      fontWeight: 800, 
                      color: active.primaryColor || theme.palette.primary.main,
                      fontSize: '1rem' 
                    }}
                  >
                    {s.k}
                  </Typography>
                  <Typography
                    variant="overline"
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontSize: '0.7rem' 
                    }}
                  >
                    {s.v}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* Pager dots */}
            <Stack direction="row" spacing={1.2} alignItems="center">
              {slides.map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: i === idx ? 28 : 10,
                    height: 10,
                    borderRadius: 999,
                    transition: "all .25s ease",
                    bgcolor:
                      i === idx
                        ? active.primaryColor || theme.palette.primary.main
                        : theme.palette.grey[300],
                    cursor: "pointer",
                  }}
                  onClick={() => setIdx(i)}
                />
              ))}
            </Stack>
          </Stack>

          {/* Arrows */}
          {!isMdDown && slides.length > 1 && (
            <>
              <IconButton
                aria-label="Previous"
                onClick={prev}
                sx={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 3,
                  color: theme.palette.grey[900],
                  bgcolor: "rgba(255,255,255,.9)",
                  border: `1px solid ${theme.palette.grey[300]}`,
                  "&:hover": { bgcolor: "#fff" },
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="Next"
                onClick={next}
                sx={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 3,
                  color: theme.palette.grey[900],
                  bgcolor: "rgba(255,255,255,.9)",
                  border: `1px solid ${theme.palette.grey[300]}`,
                  "&:hover": { bgcolor: "#fff" },
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}
