// src/components/Project/ProjectDetail.js
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, IconButton, Paper, Chip, useTheme,
  useMediaQuery, Card, CardContent, CircularProgress,
} from '@mui/material';
import {
  ArrowBack, LocationOn, CalendarToday, Business, Person, Architecture,
  ArrowBackIos, ArrowForwardIos,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import axios from 'axios';
import { API_BASE } from '../../utils/api';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const API_URL = `${API_BASE}/api/projects`;

const categoryColors = {
  'Wellness & Spa': { bg: '#f0f9f0', color: '#2E7D32', accent: '#4CAF50' },
  'Restaurants & Bars': { bg: '#fff8e1', color: '#F57C00', accent: '#FF9800' },
  'Luxury Place': { bg: '#e3f2fd', color: '#1976D2', accent: '#2196F3' },
};

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
    about: p.about || p.description || '',
    description: p.description || '',
    mainImage: images[0] || '',
    images,
  };
};

// Custom Arrow Components (unchanged)
const NextArrow = ({ className, style, onClick }) => (
  <IconButton
    className={className}
    onClick={onClick}
    sx={{
      ...style,
      position: 'absolute',
      right: 15,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      width: 50,
      height: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translateY(-50%) scale(1.1)', boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)' },
      '&:before': { display: 'none' },
      transition: 'all 0.3s ease',
    }}
  >
    <ArrowForwardIos sx={{ fontSize: 20, color: '#1976d2' }} />
  </IconButton>
);

const PrevArrow = ({ className, style, onClick }) => (
  <IconButton
    className={className}
    onClick={onClick}
    sx={{
      ...style,
      position: 'absolute',
      left: 15,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      width: 50,
      height: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)', transform: 'translateY(-50%) scale(1.1)', boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)' },
      '&:before': { display: 'none' },
      transition: 'all 0.3s ease',
    }}
  >
    <ArrowBackIos sx={{ fontSize: 20, color: '#1976d2', ml: 0.5 }} />
  </IconButton>
);

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [project, setProject] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // fetch the project
  useEffect(() => {
    let mounted = true;
    const fetchProject = async () => {
      try {
        setLoading(true);
        // Try /:id endpoint first
        try {
          const resById = await axios.get(`${API_URL}/${id}`);
          const p = resById.data?.data || resById.data;
          if (p && mounted) {
            setProject(normalizeProject(p));
            return;
          }
        } catch {
          // fall through to list fetch
        }

        const res = await axios.get(API_URL);
        const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        const found = list.find((x) => (x._id || x.id) === id);
        if (mounted) setProject(found ? normalizeProject(found) : null);
      } catch (e) {
        console.error('Failed to fetch project detail', e);
        if (mounted) setProject(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProject();
    window.scrollTo(0, 0);
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" color="text.secondary">Project not found</Typography>
      </Container>
    );
  }

  const style = categoryColors[project.category] || categoryColors['Luxury Place'];
  const images = project.images?.length ? project.images : [project.mainImage];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (_, next) => setCurrentSlide(next),
    customPaging: (i) => (
      <Box
        sx={{
          width: { xs: 50, sm: 60, md: 70 },
          height: { xs: 32, sm: 38, md: 45 },
          borderRadius: 2,
          overflow: 'hidden',
          cursor: 'pointer',
          border: currentSlide === i ? `3px solid ${style.color}` : '3px solid transparent',
          transition: 'all 0.3s ease',
          '&:hover': { border: `3px solid ${style.accent}`, transform: 'scale(1.05)' }
        }}
      >
        <img
          src={images[i]}
          alt={`Slide ${i + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/120x70/f0f0f0/999?text=Image'; }}
        />
      </Box>
    ),
    dotsClass: 'slick-dots custom-project-dots',
  };

  const projectDetails = [
    { icon: LocationOn, label: 'Location', value: project.location, color: '#e91e63' },
    { icon: CalendarToday, label: 'Completed Year', value: project.completedYear, color: '#9c27b0' },
    { icon: Business, label: 'Area', value: project.area, color: '#2196f3' },
    { icon: Person, label: 'Client', value: project.client, color: '#ff9800' },
    { icon: Architecture, label: 'Architect', value: project.architect, color: '#4caf50' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${style.bg}20 0%, #ffffff 30%, #f8fafc 100%)`, pb: 8 }}>
      {/* Header */}
      <Box sx={{ background: `linear-gradient(135deg, ${style.color} 0%, ${style.accent} 100%)`, color: 'white', py: { xs: 3, sm: 4, md: 5 }, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton
                onClick={() => navigate('/projects')}
                sx={{ color: 'white', mr: 2, '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)', transform: 'scale(1.1)' }, transition: 'all 0.3s ease' }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }, lineHeight: 1.2 }}>
                {project.title}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip label={project.category} sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.95rem' } }} />
              <Chip
                label={project.status}
                sx={{ bgcolor: project.status === 'Completed' ? 'rgba(76,175,80,0.9)' : 'rgba(255,152,0,0.9)', color: 'white', fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
              />
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        {/* Image Carousel */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <Paper
            elevation={8}
            sx={{
              borderRadius: { xs: 3, sm: 4 },
              overflow: 'hidden',
              mb: { xs: 6, sm: 8 },
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
              position: 'relative',
              '& .custom-project-dots': {
                bottom: { xs: -50, sm: -60 },
                '& li': { margin: { xs: '0 4px', sm: '0 6px' } },
                '& li button:before': { display: 'none' },
              },
            }}
          >
            <Slider {...sliderSettings}>
              {images.map((image, index) => (
                <Box key={index}>
                  <Box
                    component="img"
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    sx={{ width: '100%', height: { xs: 300, sm: 450, md: 500, lg: 550 }, objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1200x550/f0f0f0/999?text=Project'; }}
                  />
                </Box>
              ))}
            </Slider>
          </Paper>
        </motion.div>

        {/* Project Details - Horizontal */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 5, color: style.color, fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }, textAlign: 'center' }}>
            Project Details
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: { xs: 2, sm: 3, md: 4 },
              mb: 8,
              overflowX: 'auto',
              pb: 2,
              justifyContent: { xs: 'flex-start', md: 'center' },
              '&::-webkit-scrollbar': { height: 6, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 3 },
              '&::-webkit-scrollbar-thumb': { bgcolor: style.color, borderRadius: 3 },
            }}
          >
            {[
              { icon: LocationOn, label: 'Location', value: project.location, color: '#e91e63' },
              { icon: CalendarToday, label: 'Completed Year', value: project.completedYear, color: '#9c27b0' },
              { icon: Business, label: 'Area', value: project.area, color: '#2196f3' },
              { icon: Person, label: 'Client', value: project.client, color: '#ff9800' },
              { icon: Architecture, label: 'Architect', value: project.architect, color: '#4caf50' },
            ].map((detail) => {
              const IconComponent = detail.icon;
              return (
                <Card
                  key={detail.label}
                  elevation={4}
                  sx={{
                    minWidth: { xs: 140, sm: 160, md: 180 },
                    width: { xs: 140, sm: 160, md: 180 },
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-12px) scale(1.05)', boxShadow: `0 25px 50px ${detail.color}25`, border: `2px solid ${detail.color}60` },
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 2, sm: 2.5, md: 3 },
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                      height: { xs: 120, sm: 140, md: 160 },
                    }}
                  >
                    <Box sx={{ width: { xs: 50, sm: 55, md: 60 }, height: { xs: 50, sm: 55, md: 60 }, borderRadius: '50%', background: `${detail.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComponent sx={{ fontSize: { xs: 24, sm: 26, md: 28 }, color: detail.color }} />
                    </Box>
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5, display: 'block' }}>
                        {detail.label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' }, lineHeight: 1.2, wordBreak: 'break-word' }}>
                        {detail.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </motion.div>

        {/* About */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
          <Paper elevation={6} sx={{ p: { xs: 3, sm: 4, md: 5 }, borderRadius: { xs: 3, sm: 4 }, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: `1px solid ${style.bg}`, maxWidth: 900, mx: 'auto' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: style.color, fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }, borderBottom: `3px solid ${style.accent}`, pb: 2, display: 'inline-block' }}>
              About This Project
            </Typography>
            <Box>
              {(project.about || project.description || 'No description available.')
                .split('\n\n')
                .filter(Boolean)
                .map((paragraph, i) => (
                  <Typography
                    key={i}
                    variant="body1"
                    sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.8, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem' }, textAlign: 'justify', '&:last-child': { mb: 0 } }}
                  >
                    {paragraph}
                  </Typography>
                ))}
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ProjectDetail;
