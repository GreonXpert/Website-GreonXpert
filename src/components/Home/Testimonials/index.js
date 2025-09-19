// src/components/Home/Testimonials/index.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Rating,
  IconButton,
  Chip,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import {
  FormatQuote as QuoteIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Verified as VerifiedIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { API_BASE } from '../../../utils/api';

/* ===================== API Configuration ===================== */
const API_URL = API_BASE; // Use the imported API_BASE

/* ===================== Config / Theme constants ===================== */
const STAR_COLOR = '#F5B301';
const CARD_BG = 'rgba(255,255,255,0.96)';             // near-opaque for readability
const CARD_BORDER = 'rgba(15, 23, 42, 0.10)';          // subtle slate border
const BRAND_GLOW = 'rgba(26, 201, 159, 0.16)';         // soft brand glow
const TURN_MS = 360;                                    // page-turn duration
const AUTOPLAY_MS = 4200;                               // autoplay interval

/* ===================== Image Helper Function ===================== */
const getImageSrc = (testimonial) => {
  // Priority: photoUrl > avatar > null (for fallback to initials)
  if (testimonial.photoUrl && testimonial.photoUrl.trim() !== '') {
    // If photoUrl starts with http/https, use it directly
    if (testimonial.photoUrl.startsWith('http')) {
      return testimonial.photoUrl;
    }
    // Remove leading slash if present and prepend API_URL
    const cleanPath = testimonial.photoUrl.startsWith('/') 
      ? testimonial.photoUrl.substring(1) 
      : testimonial.photoUrl;
    return `${API_URL}/${cleanPath}`;
  }
  
  if (testimonial.avatar && testimonial.avatar.trim() !== '') {
    // If avatar starts with http/https, use it directly
    if (testimonial.avatar.startsWith('http')) {
      return testimonial.avatar;
    }
    // Remove leading slash if present and prepend API_URL
    const cleanPath = testimonial.avatar.startsWith('/') 
      ? testimonial.avatar.substring(1) 
      : testimonial.avatar;
    return `${API_URL}/${cleanPath}`;
  }
  
  // Return null to show initials
  return null;
};

/* ===================== Animations ===================== */
const floatSoft = keyframes`
  0%,100% { transform: translateY(0) }
  50% { transform: translateY(-3px) }
`;
const dotPulse = keyframes`
  0%,100% { transform: scale(1); opacity: .7 }
  50% { transform: scale(1.25); opacity: 1 }
`;
const textReveal = keyframes`
  0% { opacity: 0; transform: translateY(10px) }
  100% { opacity: 1; transform: translateY(0) }
`;

/* Desktop/Large: notebook page turn (horizontal flip) */
const pageTurnNext = keyframes`
  0%   { transform: rotateY(0deg);     clip-path: inset(0 0 0 0); }
  49%  { transform: rotateY(-89deg);   clip-path: inset(0 48% 0 0); }
  50%  { transform: rotateY(-91deg);   clip-path: inset(0 60% 0 0); }
  100% { transform: rotateY(-180deg);  clip-path: inset(0 0 0 60%); }
`;
const pageTurnPrev = keyframes`
  0%   { transform: rotateY(-180deg);  clip-path: inset(0 0 0 60%); }
  49%  { transform: rotateY(-91deg);   clip-path: inset(0 60% 0 0); }
  50%  { transform: rotateY(-89deg);   clip-path: inset(0 48% 0 0); }
  100% { transform: rotateY(0deg);     clip-path: inset(0 0 0 0); }
`;

/* Mobile/Small: booklet turn (vertical flip with curl) */
const sheetTurnNext = keyframes`
  0%   { transform: rotateX(0deg);     clip-path: inset(0 0 0 0 round 22px); }
  50%  { transform: rotateX(-90deg);   clip-path: inset(40% 0 0 0 round 22px); }
  100% { transform: rotateX(-180deg);  clip-path: inset(60% 0 0 0 round 22px); }
`;
const sheetTurnPrev = keyframes`
  0%   { transform: rotateX(-180deg);  clip-path: inset(60% 0 0 0 round 22px); }
  50%  { transform: rotateX(-90deg);   clip-path: inset(40% 0 0 0 round 22px); }
  100% { transform: rotateX(0deg);     clip-path: inset(0 0 0 0 round 22px); }
`;

/* Progress bar for autoplay (mobile) */
const progressGrow = keyframes`
  0% { width: 0% }
  100% { width: 100% }
`;

/* ===================== Swipe & Drag (desktop + mobile) ===================== */
const useDragSwipe = (onLeft, onRight, setDragX) => {
  const start = useRef({ x: 0, y: 0, active: false });

  const startDrag = (x, y) => { start.current = { x, y, active: true }; };
  const endDrag = (x, y) => {
    if (!start.current.active) return;
    const dx = x - start.current.x;
    const dy = y - start.current.y;
    setDragX(0);
    start.current.active = false;
    if (Math.abs(dx) > 48 && Math.abs(dy) < 80) {
      if (dx < 0) onLeft?.();
      else onRight?.();
    }
  };
  const moveDrag = (x) => {
    if (!start.current.active) return;
    const dx = x - start.current.x;
    setDragX(Math.max(-80, Math.min(80, dx))); // clamp for slight slide feedback
  };

  // Touch handlers
  const onTouchStart = (e) => startDrag(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchMove  = (e) => moveDrag(e.touches[0].clientX);
  const onTouchEnd   = (e) => {
    const t = e.changedTouches[0];
    endDrag(t.clientX, t.clientY);
  };

  // Pointer handlers (mouse / trackpad)
  const onPointerDown = (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); startDrag(e.clientX, e.clientY); };
  const onPointerMove = (e) => moveDrag(e.clientX);
  const onPointerUp   = (e) => endDrag(e.clientX, e.clientY);

  return { onTouchStart, onTouchMove, onTouchEnd, onPointerDown, onPointerMove, onPointerUp };
};

/* ===================== Card Variants ===================== */
// DesktopCard: centered avatar + perfectly centered layout
const DesktopCard = ({ t }) => {
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);
  const imageSrc = getImageSrc(t);
  
  // Debug logging
  console.log('Desktop Card - testimonial:', t.name, 'photoUrl:', t.photoUrl, 'imageSrc:', imageSrc);
  
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        mx: 'auto',
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 26,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 16px 45px rgba(0,0,0,.16)',
        p: { xs: 3, md: 3.5 },
        animation: `${floatSoft} 10s ease-in-out infinite`,
      }}
    >
      {/* subtle brand glow */}
      <Box
        sx={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          borderRadius: 26,
          background:
            `radial-gradient(780px 120px at 50% -60px, ${BRAND_GLOW}, transparent 70%)`,
          zIndex: 0,
        }}
      />
      {/* avatar (TOP-CENTER) */}
      <Box sx={{ position: 'absolute', top: -34, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
        <Avatar
          src={!imageError && imageSrc ? imageSrc : undefined}
          onError={(e) => {
            console.log('Desktop Image load error:', e.target.src);
            setImageError(true);
          }}
          onLoad={() => {
            console.log('Desktop Image loaded successfully:', imageSrc);
          }}
          sx={{
            width: 62,
            height: 62,
            border: `3px solid ${theme.palette.primary.main}`,
            background: theme.palette.primary.main,
            color: '#fff',
            fontWeight: 900,
            fontSize: '1.5rem',
          }}
        >
          {(!imageSrc || imageError) ? t.name?.charAt(0)?.toUpperCase() || 'U' : ''}
        </Avatar>
        {t.rating >= 5 && (
          <VerifiedIcon
            sx={{
              position: 'absolute',
              bottom: -4,
              right: -6,
              fontSize: 20,
              color: theme.palette.primary.main,
              background: '#fff',
              borderRadius: '50%',
              p: '2px',
              boxShadow: '0 2px 6px rgba(0,0,0,.18)',
              animation: `${dotPulse} 2.2s ease-in-out infinite`,
            }}
          />
        )}
      </Box>

      {/* top row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: .5, mt: 1 }}>
        <Rating
          value={t.rating}
          readOnly
          sx={{
            '& .MuiRating-iconFilled': { color: STAR_COLOR },
            '& .MuiRating-iconHover': { color: STAR_COLOR },
            '& .MuiRating-iconEmpty': { color: 'rgba(0,0,0,.16)' },
          }}
        />
        {t.featured && (
          <Chip
            label="★ Featured"
            size="small"
            sx={{
              fontWeight: 900,
              color: '#fff',
              px: 1.25,
              height: 22,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${STAR_COLOR})`,
            }}
          />
        )}
      </Box>

      <QuoteIcon
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          fontSize: 26,
          color: theme.palette.primary.main,
          opacity: 0.35,
        }}
      />

      <Typography
        variant="body1"
        sx={{
          position: 'relative',
          zIndex: 1,
          mt: 1.5,
          color: '#0f172a',
          lineHeight: 1.7,
          fontWeight: 500,
          animation: `${textReveal} .45s ease both`,
        }}
      >
        "{t.content}"
      </Typography>

      <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', gap: 1, zIndex: 1, position: 'relative' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
          {t.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: .75, ml: 1 }}>
          <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {t.position && t.company ? `${t.position} • ${t.company}` : t.position || t.company || 'Client'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// MobileCard: centered header + progress bar (all perfectly centered)
const MobileCard = ({ t, active, total, autoplayMs }) => {
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);
  const imageSrc = getImageSrc(t);
  
  // Debug logging
  console.log('Mobile Card - testimonial:', t.name, 'photoUrl:', t.photoUrl, 'imageSrc:', imageSrc);
  
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        mx: 'auto',
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 22,
        p: 2.25,
        boxShadow: '0 14px 36px rgba(0,0,0,.14)',
        textAlign: 'center',
      }}
    >
      {/* curl corner */}
      <Box
        sx={{
          position: 'absolute',
          right: 0, top: 0,
          width: 60, height: 60,
          borderTopRightRadius: 22,
          background:
            `conic-gradient(from 180deg at 0% 0%, rgba(0,0,0,.08), rgba(0,0,0,0))`,
          maskImage: 'radial-gradient(120% 120% at 100% 0%, black 50%, transparent 52%)',
          pointerEvents: 'none',
        }}
      />

      {/* centered header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 1 }}>
        <Avatar
          src={!imageError && imageSrc ? imageSrc : undefined}
          onError={(e) => {
            console.log('Mobile Image load error:', e.target.src);
            setImageError(true);
          }}
          onLoad={() => {
            console.log('Mobile Image loaded successfully:', imageSrc);
          }}
          sx={{
            width: 56, height: 56,
            border: `2px solid ${theme.palette.primary.main}`,
            background: theme.palette.primary.main,
            color: '#fff', 
            fontWeight: 900,
            fontSize: '1.25rem',
          }}
        >
          {(!imageSrc || imageError) ? t.name?.charAt(0)?.toUpperCase() || 'U' : ''}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
          {t.name}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {t.position && t.company ? `${t.position} • ${t.company}` : t.position || t.company || 'Client'}
        </Typography>
        <Rating
          value={t.rating}
          readOnly
          size="small"
          sx={{
            '& .MuiRating-iconFilled': { color: STAR_COLOR },
            '& .MuiRating-iconHover': { color: STAR_COLOR },
            '& .MuiRating-iconEmpty': { color: 'rgba(0,0,0,.2)' },
          }}
        />
      </Box>

      <Typography variant="body2" sx={{ color: '#0f172a', lineHeight: 1.65, fontWeight: 500 }}>
        "{t.content}"
      </Typography>

      {/* autoplay progress bar */}
      <Box sx={{ mt: 1.75, height: 3.5, borderRadius: 999, background: 'rgba(0,0,0,.08)', overflow: 'hidden' }}>
        <Box
          key={`${active}-${total}`} // restart animation each slide
          sx={{
            height: '100%',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${STAR_COLOR})`,
            animation: `${progressGrow} ${autoplayMs}ms linear`,
          }}
        />
      </Box>
    </Box>
  );
};

/* ===================== Main Component ===================== */
const Testimonials = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));   // < 600
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));      // ≥ 900

  const [data, setData] = useState([]); // Changed from TESTIMONIALS_DATA to empty array
  const [active, setActive] = useState(0);
  const [turn, setTurn] = useState(null); // 'next' | 'prev' | null
  const [dragX, setDragX] = useState(0);
  const [loading, setLoading] = useState(true);
  const autoplayRef = useRef(null);

  // Fetch testimonials from backend and set up real-time updates
  useEffect(() => {
    // 1. Fetch initial data from the backend
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/testimonials?status=approved&sort=-rating,-createdAt&limit=20`);
        if (response.data.success) {
          console.log('Testimonials loaded:', response.data.data);
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        // Optional: Set some fallback data or show error state
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 2. Set up socket for real-time updates
    const socket = io(API_URL);

    socket.on('connect', () => {
      console.log('Connected to testimonials socket');
    });

    socket.on('testimonial-created', (socketData) => {
      if (socketData.success && socketData.data.status === 'approved') {
        console.log('New testimonial added in real-time:', socketData.data);
        setData(prev => [socketData.data, ...prev]);
      }
    });

    socket.on('testimonial-updated', (socketData) => {
      if (socketData.success) {
        console.log('Testimonial updated in real-time:', socketData.data);
        setData(prev => {
          // If status changed to approved, add to list
          if (socketData.data.status === 'approved') {
            const exists = prev.find(item => item._id === socketData.data._id);
            if (!exists) {
              return [socketData.data, ...prev];
            }
            return prev.map(item => 
              item._id === socketData.data._id ? socketData.data : item
            );
          } else {
            // Remove if not approved anymore
            return prev.filter(item => item._id !== socketData.data._id);
          }
        });
      }
    });

    socket.on('testimonial-deleted', (socketData) => {
      if (socketData.success) {
        console.log('Testimonial deleted in real-time:', socketData.id);
        setData(prev => {
          const newData = prev.filter(item => item._id !== socketData.id);
          // Adjust active index if necessary
          setActive(prevActive => {
            if (prevActive >= newData.length && newData.length > 0) {
              return Math.max(0, newData.length - 1);
            }
            return prevActive;
          });
          return newData;
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from testimonials socket');
    });

    // 3. Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const go = useCallback((dir) => {
    if (!data.length) return;
    setTurn(dir);
    setTimeout(() => {
      setActive(prev => {
        if (dir === 'next') return (prev + 1) % data.length;
        if (dir === 'prev') return (prev - 1 + data.length) % data.length;
        return prev;
      });
      setTimeout(() => setTurn(null), TURN_MS + 20);
    }, 8);
  }, [data.length]);

  // autoplay (always on)
  useEffect(() => {
    if (data.length > 1) {
      autoplayRef.current = setInterval(() => go('next'), AUTOPLAY_MS);
    }
    return () => clearInterval(autoplayRef.current);
  }, [data.length, go]);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go('prev');
      if (e.key === 'ArrowRight') go('next');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // swipe + desktop drag
  const swipe = useDragSwipe(() => go('next'), () => go('prev'), setDragX);

  const t = data[active] || null;
  const prevT = data[(active - 1 + data.length) % data.length] || null;
  const nextT = data[(active + 1) % data.length] || null;

  // Stage sizing (smaller center card on desktop)
  const containerMax = isMdUp ? 'lg' : 'md';
  const stageWidth = isMdUp ? 980 : 720;
  const centerWidth = isMdUp ? '78%' : '88%'; // smaller center card
  const ghostWidth = isMdUp ? '38%' : '42%';
  const stageMinH = isMdUp ? 380 : isSmall ? 330 : 350;

  // Show loading or nothing if no testimonials
  if (loading) {
    return (
      <Box
        component="section"
        sx={{
          position: 'relative',
          py: { xs: 6, sm: 7, md: 9 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading testimonials...
        </Typography>
      </Box>
    );
  }

  if (!t || data.length === 0) return null;

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        py: { xs: 6, sm: 7, md: 9 },
        background: `
          radial-gradient(circle at 12% 18%, rgba(26,201,159,0.06) 0%, transparent 45%),
          radial-gradient(circle at 86% 10%, rgba(46,139,139,0.05) 0%, transparent 50%),
          radial-gradient(circle at 50% 100%, rgba(52,152,219,0.04) 0%, transparent 50%),
          linear-gradient(180deg, #f8fafc 0%, #f0fdfb 100%)
        `,
        overflow: 'hidden',
      }}
    >
      {/* Header (centered) */}
      <Container
        maxWidth="md"
        sx={{
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          mb: { xs: 5, md: 7 },
        }}
      >
        <Chip
          label="CLIENT TESTIMONIALS"
          sx={{
            px: 3, py: 1.5,
            fontWeight: 900,
            letterSpacing: 1.2,
            color: theme.palette.primary.main,
            border: `2px solid ${theme.palette.primary.main}`,
            background: 'rgba(26,201,159,.10)',
            backdropFilter: 'blur(10px)',
            mb: 2.25,
          }}
        />
        <Typography
          variant={isMdUp ? 'h3' : 'h4'}
          sx={{
            fontWeight: 900,
            mb: .75,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, #2E8B8B)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Trusted by Industry Leaders
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: 'text.secondary', maxWidth: 760, lineHeight: 1.65 }}
        >
          Real-time testimonials from our valued clients and partners.
        </Typography>
      </Container>

      {/* Stage (everything hard-centered) */}
      <Container
        maxWidth={containerMax}
        sx={{
          position: 'relative',
          display: 'grid',
          placeItems: 'center',        // << forces absolute centering
          perspective: isSmall ? '1200px' : '1600px',
        }}
      >
        <Box
          {...swipe}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: stageWidth,
            minHeight: stageMinH,
            display: 'grid',
            placeItems: 'center',      // << center inner stack
            touchAction: 'pan-y',
          }}
        >
          {/* Ghosts (desktop only, centered around the main) */}
          {!isSmall && prevT && (
            <Box aria-hidden
              sx={{
                position: 'absolute',
                left: '50%',
                top: 16,
                width: ghostWidth,
                transform: 'translate(-120%, 0) rotateY(13deg)',
                opacity: .30,
                filter: 'blur(.25px)',
                pointerEvents: 'none',
              }}
            >
              <DesktopCard t={prevT} />
            </Box>
          )}
          {!isSmall && nextT && (
            <Box aria-hidden
              sx={{
                position: 'absolute',
                left: '50%',
                top: 16,
                width: ghostWidth,
                transform: 'translate(20%, 0) rotateY(-13deg)',
                opacity: .30,
                filter: 'blur(.25px)',
                pointerEvents: 'none',
              }}
            >
              <DesktopCard t={nextT} />
            </Box>
          )}

          {/* Active card with turn + drag feedback (centered) */}
          <Box
            sx={{
              position: 'relative',
              width: centerWidth,
              transformStyle: 'preserve-3d',
              transform: `translateX(${dragX * 0.25}px) rotateY(${dragX * -0.08}deg)`,
              transition: turn ? 'none' : 'transform .18s ease',
              '& > .page': {
                transformOrigin: isSmall ? 'top center' : 'left center',
                backfaceVisibility: 'hidden',
                willChange: 'transform, clip-path',
              },
            }}
          >
            <Box
              className="page"
              sx={{
                animation:
                  turn === 'next'
                    ? `${isSmall ? sheetTurnNext : pageTurnNext} ${TURN_MS}ms ease`
                    : turn === 'prev'
                    ? `${isSmall ? sheetTurnPrev : pageTurnPrev} ${TURN_MS}ms ease`
                    : 'none',
              }}
            >
              {isSmall
                ? <MobileCard t={t} active={active} total={data.length} autoplayMs={AUTOPLAY_MS} />
                : <DesktopCard t={t} />
              }
            </Box>
          </Box>
        </Box>

        {/* Controls (centered) */}
        <Box
          sx={{
            mt: 3.5,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          <IconButton
            aria-label="Previous"
            onClick={() => go('prev')}
            disabled={data.length <= 1}
            sx={{
              width: 46,
              height: 46,
              color: '#fff',
              background: theme.palette.primary.main,
              '&:hover': { transform: 'scale(1.06)' },
              '&:disabled': { 
                background: 'rgba(0,0,0,0.12)',
                color: 'rgba(0,0,0,0.26)',
                transform: 'none',
              },
              boxShadow: '0 10px 24px rgba(26,201,159,.32)',
              transition: 'all .25s ease',
            }}
          >
            <PrevIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.05 }}>
            {data.map((_, i) => (
              <Box
                key={i}
                onClick={() => setActive(i)}
                sx={{
                  width: i === active ? 13 : 8,
                  height: i === active ? 13 : 8,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  background:
                    i === active
                      ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${STAR_COLOR})`
                      : 'rgba(0,0,0,.18)',
                  animation: i === active ? `${dotPulse} 2s ease-in-out infinite` : 'none',
                  boxShadow: i === active ? `0 4px 12px ${theme.palette.primary.main}66` : 'none',
                  transition: 'all .25s ease',
                }}
              />
            ))}
          </Box>

          <IconButton
            aria-label="Next"
            onClick={() => go('next')}
            disabled={data.length <= 1}
            sx={{
              width: 46,
              height: 46,
              color: '#fff',
              background: theme.palette.primary.main,
              '&:hover': { transform: 'scale(1.06)' },
              '&:disabled': { 
                background: 'rgba(0,0,0,0.12)',
                color: 'rgba(0,0,0,0.26)',
                transform: 'none',
              },
              boxShadow: '0 10px 24px rgba(26,201,159,.32)',
              transition: 'all .25s ease',
            }}
          >
            <NextIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default Testimonials;
