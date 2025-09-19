// src/components/Project/Hero.js
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Box, Typography, Container, Card, CardContent, Chip, CircularProgress } from '@mui/material';
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThreeJSBackground from '../Contact/ThreeJSBackground';
import axios from 'axios';
import { API_BASE } from '../../utils/api';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN =
  process.env.REACT_APP_MAPBOX_TOKEN ||
  'pk.eyJ1IjoiZmF6aWxkaWdpdGFsbWFya2V0ZXIiLCJhIjoiY21lbW0yMjV4MDVlNjJpcjRmaXJtcW13cyJ9.riRXNNneWgLkBBhZ02_b5Q';

const API_URL = `${API_BASE}/api/projects`;

/* ========= Image helpers (same behavior as ProjectPanel resolveImageUrl) ========= */
const resolveImageUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  const pathOnly = u.startsWith('/') ? u : `/${u}`;
  return `${API_BASE}${pathOnly}`;
};

const collectImages = (p) => {
  const list = [];
  // cover first
  if (p.mainImage) list.push(resolveImageUrl(p.mainImage));
  // gallery supports strings or {url}
  if (Array.isArray(p.images)) {
    for (const it of p.images) {
      if (!it) continue;
      if (typeof it === 'string') list.push(resolveImageUrl(it));
      else if (typeof it === 'object' && it.url) list.push(resolveImageUrl(it.url));
    }
  }
  // de-dupe
  return [...new Set(list.filter(Boolean))];
};

// normalize backend → UI
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
    // [lng, lat]
    coordinates: Array.isArray(p.coordinates) && p.coordinates.length >= 2 ? p.coordinates : [0, 0],
    about: p.about || p.description || '',
    description: p.description || '',
    mainImage: images[0] || '',
    images,
  };
};

const Hero = () => {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState({ longitude: 78.9629, latitude: 20.5937, zoom: 3.5 });
  const [popupInfo, setPopupInfo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleMarkerClick = useCallback((project) => setPopupInfo(project), []);
  const handleProjectClick = (projectId) => navigate(`/projects/${projectId}`);

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

  const projectsWithLabels = useMemo(
    () => projects.map((p, idx) => ({ ...p, markerLabel: String(idx + 1) })),
    [projects]
  );

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: `
          radial-gradient(circle at 10% 20%, rgba(26, 201, 159, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 80% 80%, rgba(52, 152, 219, 0.08) 0%, transparent 45%),
          linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)
        `,
        py: 8,
      }}
    >
      <ThreeJSBackground />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ color: '#1f2937', fontWeight: 700, mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              Our Projects Around the World
            </Typography>
            <Typography variant="h6" sx={{ color: '#475569', maxWidth: 700, mx: 'auto' }}>
              Discover our innovative projects across different locations. Click on any marker to explore.
            </Typography>
          </Box>

          <Card
            sx={{
              position: 'relative',
              zIndex: 1,
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.20)',
              height: { xs: 400, md: 600 },
              backdropFilter: 'blur(4px)',
            }}
          >
            <Map
              {...viewState}
              onMove={(evt) => setViewState(evt.viewState)}
              mapboxAccessToken={MAPBOX_TOKEN}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/light-v11"
            >
              {loading && (
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.6)', zIndex: 2 }}>
                  <CircularProgress />
                </Box>
              )}

              {projectsWithLabels.map((project) => (
                <Marker
                  key={project.id}
                  longitude={project.coordinates[0]}
                  latitude={project.coordinates[1]}
                  anchor="bottom"
                  onClick={() => handleMarkerClick(project)}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1AC99F 0%, #2196F3 100%)',
                      border: '3px solid white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                      '&:hover': { transform: 'scale(1.1)', transition: 'transform 0.2s ease' },
                    }}
                  >
                    <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>
                      {project.markerLabel}
                    </Typography>
                  </Box>
                </Marker>
              ))}

              {popupInfo && (
                <Popup
                  longitude={popupInfo.coordinates[0]}
                  latitude={popupInfo.coordinates[1]}
                  anchor="top"
                  onClose={() => setPopupInfo(null)}
                  closeButton={false}
                  closeOnClick={false}
                >
                  <Card sx={{ maxWidth: 300, cursor: 'pointer' }} onClick={() => handleProjectClick(popupInfo.id)}>
                    <Box
                      component="img"
                      sx={{ width: '100%', height: 150, objectFit: 'cover' }}
                      src={popupInfo.mainImage}
                      alt={popupInfo.title}
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x150/f0f0f0/999?text=Project'; }}
                    />
                    <CardContent sx={{ p: 2 }}>
                      <Chip
                        label={popupInfo.category}
                        size="small"
                        sx={{ mb: 1, background: 'linear-gradient(135deg, #1AC99F 0%, #2196F3 100%)', color: 'white' }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{popupInfo.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{popupInfo.location}</Typography>
                    </CardContent>
                  </Card>
                </Popup>
              )}
            </Map>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Hero;
