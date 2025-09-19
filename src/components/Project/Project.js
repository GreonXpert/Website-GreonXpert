// src/components/Project/Project.js
import React, { useRef, useEffect, useState } from 'react';
import {
  Box, Typography, Container, Grid, Button, Paper, Chip, IconButton,
  useMediaQuery, useTheme, CircularProgress,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards, Navigation } from 'swiper/modules';
import axios from 'axios';
import { API_BASE } from '../../utils/api';

import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';

import SpaIcon from '@mui/icons-material/Spa';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const API_URL = `${API_BASE}/api/projects`;

const categoryIcons = {
  'Wellness & Spa': <SpaIcon />,
  'Restaurants & Bars': <RestaurantIcon />,
  'Luxury Place': <LocationCityIcon />,
};

const categoryColors = {
  'Wellness & Spa': { bg: '#f0f9f0', color: '#2E7D32', accent: '#4CAF50' },
  'Restaurants & Bars': { bg: '#fff8e1', color: '#F57C00', accent: '#FF9800' },
  'Luxury Place': { bg: '#e3f2fd', color: '#1976D2', accent: '#2196F3' },
};

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(0.5deg); }
  50% { transform: translateY(-12px) rotate(0deg); }
  75% { transform: translateY(-8px) rotate(-0.5deg); }
`;

/* ========= Image helpers (same behavior as ProjectPanel resolveImageUrl) ========= */
const resolveImageUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  const pathOnly = u.startsWith('/') ? u : `/${u}`;
  return `${API_BASE}${pathOnly}`;
};

const collectImages = (p) => {
  const list = [];
  if (p.mainImage) list.push(resolveImageUrl(p.mainImage));
  if (Array.isArray(p.images)) {
    for (const it of p.images) {
      if (!it) continue;
      if (typeof it === 'string') list.push(resolveImageUrl(it));
      else if (typeof it === 'object' && it.url) list.push(resolveImageUrl(it.url));
    }
  }
  return [...new Set(list.filter(Boolean))];
};

const normalizeProject = (p) => {
  const images = collectImages(p);
  return {
    id: p._id || p.id,
    title: p.title || 'Untitled Project',
    category: p.category || 'Luxury Place',
    status: p.status || 'Ongoing',
    location: p.location || '',
    completedYear: p.completedYear || '',
    area: p.area || '',
    client: p.client || '',
    architect: p.architect || '',
    description: p.description || '',
    mainImage: images[0] || '',
    images,
  };
};

const ProjectCard = ({ project, isReversed }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const isCompactLaptop = useMediaQuery('(max-width:1368px)');
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const cardWidth = !mdUp ? 300 : isCompactLaptop ? 320 : 360;
  const imageAspect = 4 / 3;
  const imageHeight = Math.round(cardWidth / imageAspect);

  // ⛏️ Key fix: slide height == image height (no extra bottom space)
  const cardHeight = imageHeight;

  const categoryStyle = categoryColors[project.category] || categoryColors['Luxury Place'];

  return (
    <Container maxWidth="lg" sx={{ mb: { xs: 8, sm: 10, md: 12 }, position: 'relative', zIndex: 1 }}>
      <Grid
        container
        spacing={{ xs: 4, md: 6 }}
        alignItems="center"
        direction={{ xs: 'column', md: isReversed ? 'row-reverse' : 'row' }}
      >
        {/* Image column */}
        <Grid
          item xs={12} md={6}
          order={{ xs: 2, md: isReversed ? 2 : 1 }}
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', md: isReversed ? 'flex-start' : 'flex-end' },
            alignItems: 'center',
          }}
        >
          <Box sx={{ position: 'relative', width: cardWidth, overflow: 'visible' }}>
            {/* Per-instance nav buttons */}
            <IconButton
              ref={prevRef}
              size="small"
              sx={{
                position: 'absolute',
                left: { xs: 6, md: -10 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: 36,
                height: 36,
                bgcolor: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                '&:hover': { bgcolor: 'white', transform: 'translateY(-50%) scale(1.06)' },
                transition: 'all .2s ease',
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              ref={nextRef}
              size="small"
              sx={{
                position: 'absolute',
                right: { xs: 6, md: -10 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: 36,
                height: 36,
                bgcolor: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                '&:hover': { bgcolor: 'white', transform: 'translateY(-50%) scale(1.06)' },
                transition: 'all .2s ease',
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <Swiper
              modules={[Autoplay, EffectCards, Navigation]}
              effect="cards"
              cardsEffect={{
                slideShadows: true,
                rotate: true,
                perSlideRotate: 4,
                perSlideOffset: 6,
              }}
              loop
              speed={550}
              allowTouchMove
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              style={{ width: cardWidth, height: cardHeight }} // <-- exact image height
            >
              {(project.images && project.images.length ? project.images : [project.mainImage]).map((image, idx) => (
                <SwiperSlide key={`${project.id}-${idx}`}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 2,
                      overflow: 'hidden',
                      bgcolor: 'rgba(255,255,255,0.98)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      boxShadow: '0 16px 36px rgba(0,0,0,0.12)',
                      cursor: 'default',
                    }}
                  >
                    <Box sx={{ height: imageHeight, position: 'relative' }}>
                      <Box
                        component="img"
                        src={image}
                        alt={`${project.title} - ${idx + 1}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform .4s ease',
                          '&:hover': { transform: 'scale(1.06)' },
                        }}
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://via.placeholder.com/360x240/f0f0f0/888888?text=Project+Image';
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28) 100%)',
                        }}
                      />
                    </Box>
                    {/* No bottom content -> no extra height -> no white space */}
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Grid>

        {/* Content column */}
        <Grid
          item xs={12} md={6}
          order={{ xs: 1, md: isReversed ? 1 : 2 }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Box sx={{ px: { xs: 1, md: 3 } }}>
            {/* Icon + Chip */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Paper elevation={0}
                sx={{
                  width: 52, height: 52, borderRadius: 2,
                  bgcolor: `${categoryStyle.bg}CC`, color: categoryStyle.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {categoryIcons[project.category] || categoryIcons['Luxury Place']}
              </Paper>
              <Chip
                label={project.category}
                sx={{ bgcolor: categoryStyle.bg, color: categoryStyle.color, fontWeight: 600 }}
              />
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 400, color: '#2d3748',
                fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem', lg: '2.4rem' },
                lineHeight: 1.15, mb: 1.5,
              }}
            >
              {project.title}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#64748b', lineHeight: 1.7, fontSize: { xs: '0.95rem', md: '1rem' },
                mb: 3, maxWidth: 560,
              }}
            >
              {project.description}
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Year
                </Typography>
                <Typography variant="h6" fontWeight={700} color={categoryStyle.color}>
                  {project.completedYear}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Area
                </Typography>
                <Typography variant="h6" fontWeight={700} color={categoryStyle.color}>
                  {project.area}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Status
                </Typography>
                <Typography variant="h6" fontWeight={700} color={categoryStyle.color}>
                  {project.status}
                </Typography>
              </Grid>
            </Grid>

            <Box
              sx={{
                mb: 3, p: 2, borderRadius: 2,
                bgcolor: 'rgba(248,250,252,0.9)', border: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                <strong>Client:</strong> {project.client}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                <strong>Architect:</strong> {project.architect}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate(`/projects/${project.id}`)}
              sx={{
                borderRadius: 2, px: 3.5, py: 1.2, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                color: categoryStyle.color, borderColor: categoryStyle.color,
                '&:hover': {
                  bgcolor: categoryStyle.bg, borderColor: categoryStyle.color,
                  boxShadow: `0 8px 22px ${categoryStyle.color}33`,
                },
              }}
            >
              Explore
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

const Project = () => {
  const theme = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);
        const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        const normalized = list.map(normalizeProject);
        if (mounted) setProjects(normalized);
      } catch (e) {
        console.error('Failed to load projects', e);
        if (mounted) setProjects([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const accents = Object.values(categoryColors).map(c => c.accent);

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: `
          radial-gradient(circle at 10% 20%, rgba(26, 201, 159, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(52, 152, 219, 0.06) 0%, transparent 50%),
          linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248, 249, 250, 0.85) 100%)
        `,
      }}
    >
      {/* floating blobs (unchanged) */}
      {[...Array(6)].map((_, i) => {
        const c1 = accents[i % accents.length];
        const c2 = accents[(i + 1) % accents.length];
        return (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: { xs: 60, md: 100 },
              height: { xs: 60, md: 100 },
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${c1}22, ${c2}15)`,
              top: `${12 + (i * 14)}%`,
              left: `${6 + (i * 18)}%`,
              animation: `${floatAnimation} ${8 + (i % 3) * 3}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
              opacity: 0.6,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        );
      })}

      <Box sx={{ py: { xs: 6, md: 8 }, position: 'relative', zIndex: 1 }}>
        {/* header (unchanged) */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 300, mb: 2, color: '#2d3748',
                  fontSize: { xs: '2.2rem', sm: '2.6rem', md: '3.2rem' },
                  lineHeight: 1.1, letterSpacing: '-0.01em',
                }}
              >
                Our Projects
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  maxWidth: 760, mx: 'auto', fontWeight: 400,
                  fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.6,
                  px: { xs: 2, sm: 0 },
                }}
              >
                Discover our complete portfolio of exceptional spaces designed to inspire and delight
              </Typography>
            </Box>
          </Container>
        </motion.div>

        {/* list */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          projects.map((p, idx) => (
            <ProjectCard key={p.id} project={p} isReversed={idx % 2 === 1} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default Project;
