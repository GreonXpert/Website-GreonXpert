// src/components/SustainabilityStory/VideoDialogContent.jsx
// Open with TOC visible at top, no transitions, no initial blank gap.

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  useTheme,
  Divider,
  Alert,
  IconButton,
  Button,
  Snackbar,
  Stack,
  Avatar,
  Collapse,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LaunchIcon from '@mui/icons-material/Launch';
import TagIcon from '@mui/icons-material/Tag';
import ListIcon from '@mui/icons-material/List';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import axios from 'axios';
import {API_BASE} from '../../utils/api';

const API_URL = `${API_BASE}/api/stories`;

// ——— Sanitizer ———
const sanitizeHtml = (html) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p','br','strong','em','u','s','ol','ul','li',
      'h1','h2','h3','h4','h5','h6','blockquote','pre','code',
      'a','img','span','div',
      'table','thead','tbody','tfoot','tr','th','td','caption','colgroup','col'
    ],
    ALLOWED_ATTR: [
      'href','src','alt','title','class','style','id',
      'colspan','rowspan','scope','border','cellpadding','cellspacing',
      'width','height','align','valign'
    ],
  });

// ——— Containers ———
const DialogContentContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 'calc(80vh - 120px)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  maxHeight: 600,
}));

/**
 * Sticky header is always rendered and visible from the start.
 * No transform/opacity/transition that could leave phantom space.
 */
const StickyTOCHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  background: `linear-gradient(135deg, ${alpha('#3498DB', 0.95)}, ${alpha('#2E8B8B', 0.95)})`,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: `0 4px 20px ${alpha('#3498DB', 0.3)}`,
  border: `1px solid ${alpha('#3498DB', 0.2)}`,
  borderRadius: '0 0 16px 16px',
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(0.5),
  flexShrink: 0,
  maxHeight: '40vh',
  overflow: 'hidden',
}));

const TOCNavigation = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  maxHeight: '25vh',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  '&::-webkit-scrollbar': { width: 6 },
  '&::-webkit-scrollbar-track': { background: alpha('#ffffff', 0.1), borderRadius: 3 },
  '&::-webkit-scrollbar-thumb': {
    background: alpha('#ffffff', 0.3),
    borderRadius: 3,
    '&:hover': { background: alpha('#ffffff', 0.5) },
  },
  [theme.breakpoints.down('md')]: { maxHeight: '20vh' },
}));

const TOCNavButton = styled(Button)(({ theme, level = 1, active }) => ({
  minWidth: 'auto',
  width: '100%',
  justifyContent: 'flex-start',
  padding: theme.spacing(1, 2),
  borderRadius: 12,
  fontSize: level === 1 ? '0.9rem' : level === 2 ? '0.85rem' : '0.8rem',
  fontWeight: active ? 700 : level === 1 ? 600 : 500,
  lineHeight: 1.4,
  color: active ? '#2E8B8B' : 'rgba(255,255,255,0.9)',
  backgroundColor: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.1)',
  border: active ? '2px solid #2E8B8B' : '2px solid transparent',
  textTransform: 'none',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
  textAlign: 'left',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  position: 'relative',
  overflow: 'visible',
  marginLeft: (level - 1) * 12,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    transform: 'translateX(4px)',
    boxShadow: `0 4px 16px ${alpha('#000', 0.2)}`,
    '&::before': { left: '100%' },
  },
  '&:active': { transform: 'translateX(2px)' },
  ...(level === 1 && { fontWeight: active ? 800 : 700, fontSize: '1rem', marginBottom: theme.spacing(0.25) }),
  ...(level === 2 && {
    fontSize: '0.9rem',
    marginLeft: 16,
    '&::after': {
      content: '""',
      position: 'absolute',
      left: -8,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 4,
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.5)',
      borderRadius: '50%',
    },
  }),
  ...(level >= 3 && {
    fontSize: '0.85rem',
    marginLeft: 24,
    opacity: 0.9,
    '&::after': {
      content: '""',
      position: 'absolute',
      left: -8,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 2,
      height: 2,
      backgroundColor: 'rgba(255,255,255,0.4)',
      borderRadius: '50%',
    },
  }),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.75, 1.5),
    fontSize: level === 1 ? '0.85rem' : level === 2 ? '0.8rem' : '0.75rem',
    marginLeft: (level - 1) * 8,
  },
}));

const TOCHeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  borderBottom: `1px solid ${alpha('#ffffff', 0.2)}`,
}));

// Scroll container — no extra top space
const ScrollableContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  minHeight: 0,
  '&::-webkit-scrollbar': { width: 6 },
  '&::-webkit-scrollbar-track': { background: alpha('#3498DB', 0.1) },
  '&::-webkit-scrollbar-thumb': {
    background: '#3498DB',
    borderRadius: 3,
    '&:hover': { background: '#0E9A78' },
  },
}));

const VideoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '56.25%',
  height: 0,
  overflow: 'hidden',
  borderRadius: 20,
  background: `linear-gradient(145deg, ${alpha('#3498DB', 0.05)}, ${alpha('#2E8B8B', 0.03)})`,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: `2px solid ${alpha('#3498DB', 0.2)}`,
  boxShadow: `0 20px 60px ${alpha('#3498DB', 0.15)}, 0 8px 25px ${alpha('#000', 0.1)}`,
  marginBottom: theme.spacing(1.5),
  marginTop: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #3498DB, #4EDCB9, #2E8B8B)',
    borderRadius: '20px 20px 0 0',
    zIndex: 1,
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: 12,
    margin: '12px 0',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '16px 0',
    border: '2px solid #3498DB',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(26,201,159,0.15)',
    background: '#fff',
  },
  '& th': {
    backgroundColor: '#3498DB',
    color: 'white',
    padding: '16px 12px',
    textAlign: 'left',
    fontWeight: 700,
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: 'none',
  },
  '& td': {
    padding: '16px 12px',
    borderBottom: '1px solid #f0f0f0',
    verticalAlign: 'top',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    transition: 'background-color 0.2s ease',
  },
  '& tr:nth-of-type(even) td': { backgroundColor: alpha('#3498DB', 0.03) },
  '& tr:hover td': { backgroundColor: alpha('#3498DB', 0.08), transform: 'scale(1.005)' },
  '& blockquote': {
    borderLeft: '4px solid #3498DB',
    marginLeft: 0,
    paddingLeft: 24,
    fontStyle: 'italic',
    color: '#666',
    backgroundColor: alpha('#3498DB', 0.03),
    padding: '16px 24px',
    borderRadius: '0 12px 12px 0',
    margin: '16px 0',
    fontSize: '1.1rem',
  },
  '& pre': {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    overflow: 'auto',
    border: '1px solid #e9ecef',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    margin: '12px 0',
  },
  '& code': {
    backgroundColor: '#f1f3f4',
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: '0.9em',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    color: '#d73a49',
  },
  '& ul, & ol': {
    paddingLeft: 28,
    margin: '12px 0',
    '& li': {
      marginBottom: 6,
      lineHeight: 1.7,
      '&::marker': { color: '#3498DB', fontWeight: 700 },
    },
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    color: '#2E8B8B',
    fontWeight: 700,
    marginTop: 24,
    marginBottom: 12,
    scrollMarginTop: '140px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': { color: '#3498DB', transform: 'translateX(4px)' },
    '&::before': {
      content: '"#"',
      position: 'absolute',
      left: -24,
      color: alpha('#3498DB', 0.3),
      fontSize: '0.8em',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&:hover::before': { opacity: 1 },
  },
  '& h1': {
    fontSize: '2.2rem',
    borderBottom: '3px solid #3498DB',
    paddingBottom: 12,
    background: 'linear-gradient(135deg, #3498DB, #2E8B8B)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  '& h2': { fontSize: '1.8rem', borderLeft: '5px solid #3498DB', paddingLeft: 16, color: '#3498DB' },
  '& h3': { fontSize: '1.4rem', color: '#2E8B8B' },
  '& p': { lineHeight: 1.8, marginBottom: 12, color: '#333', textAlign: 'justify', fontSize: '1rem' },
  '& a': {
    color: '#3498DB',
    textDecoration: 'none',
    fontWeight: 600,
    '&:hover': { textDecoration: 'underline', color: '#0E9A78' },
  },
}));

const EngagementButton = styled(Button)(({ theme, variant: buttonVariant, liked }) => ({
  borderRadius: 25,
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  fontWeight: 700,
  textTransform: 'none',
  minWidth: 120,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  ...(buttonVariant === 'like' && {
    background: liked
      ? 'linear-gradient(135deg, #FF6B6B, #FF5252)'
      : `linear-gradient(135deg, ${alpha('#FF6B6B', 0.1)}, ${alpha('#FF5252', 0.05)})`,
    color: liked ? 'white' : '#FF6B6B',
    border: `2px solid ${liked ? '#FF6B6B' : alpha('#FF6B6B', 0.3)}`,
    boxShadow: liked ? '0 8px 25px rgba(255,107,107,.35)' : '0 4px 15px rgba(255,107,107,.2)',
    '&:hover': {
      transform: 'translateY(-3px) scale(1.05)',
      background: liked
        ? 'linear-gradient(135deg, #FF5252, #F44336)'
        : `linear-gradient(135deg, ${alpha('#FF6B6B', 0.15)}, ${alpha('#FF5252', 0.08)})`,
      boxShadow: '0 12px 35px rgba(255,107,107,.4)',
      borderColor: '#FF6B6B',
    },
  }),
  ...(buttonVariant === 'share' && {
    background: `linear-gradient(135deg, ${alpha('#3498DB', 0.1)}, ${alpha('#4EDCB9', 0.05)})`,
    color: '#3498DB',
    border: `2px solid ${alpha('#3498DB', 0.3)}`,
    boxShadow: '0 4px 15px rgba(52,152,219,.2)',
    '&:hover': {
      transform: 'translateY(-3px) scale(1.05)',
      background: `linear-gradient(135deg, ${alpha('#3498DB', 0.15)}, ${alpha('#4EDCB9', 0.08)})`,
      boxShadow: '0 12px 35px rgba(52,152,219,.3)',
      borderColor: '#3498DB',
    },
  }),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.6s',
  },
  '&:hover::before': { left: '100%' },
  '&:disabled': { opacity: 0.6, transform: 'none' },
}));

const InfoCard = styled(Box)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha('#ffffff', 0.8)}, ${alpha('#3498DB', 0.03)})`,
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  borderRadius: 20,
  border: `1px solid ${alpha('#3498DB', 0.15)}`,
  padding: theme.spacing(2.5),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  boxShadow: `0 8px 32px ${alpha('#3498DB', 0.1)}`,
}));

const SpeakerBadge = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(135deg, #3498DB, #4EDCB9)`,
  color: 'white',
  fontWeight: 600,
  borderRadius: 16,
  fontSize: '0.875rem',
  padding: theme.spacing(0.5, 1),
  '& .MuiChip-avatar': { background: alpha('#ffffff', 0.2), color: 'white', fontWeight: 700 },
  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(52,152,219,0.3)' },
  transition: 'all 0.3s ease',
}));

// ——— Component ———
const VideoDialogContent = ({ story, onEngagement }) => {
  const theme = useTheme();
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [tocSections, setTocSections] = useState([]);
  const [tocOpen, setTocOpen] = useState(true);

  const contentRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Build TOC
  const processedContent = useMemo(() => {
    if (!story?.content) return '';
    const html = sanitizeHtml(story.content);
    const temp = document.createElement('div');
    temp.innerHTML = html;

    const sections = [];
    temp.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h, idx) => {
      const level = parseInt(h.tagName[1], 10);
      const title = h.textContent.trim();
      const id = `section-${idx}-${title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').slice(0, 50)}`;
      h.setAttribute('id', id);
      h.setAttribute('data-section', 'true');
      sections.push({ id, title, level, index: idx });
    });

    setTocSections(sections);
    return temp.innerHTML;
  }, [story?.content]);

  // track view + liked
  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem('likedStories') || '[]');
    setIsLiked(liked.includes(story._id));
    trackEngagement('view');
  }, [story._id]); // eslint-disable-line

  // Observe for active section highlighting
  useEffect(() => {
    if (!scrollContainerRef.current || tocSections.length === 0) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        let max = 0, id = '';
        entries.forEach((e) => {
          if (e.intersectionRatio > max) { max = e.intersectionRatio; id = e.target.id; }
        });
        if (id) setActiveSection(id);
      },
      { root: scrollContainerRef.current, rootMargin: '-120px 0px -70% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    const t = setTimeout(() => {
      contentRef.current?.querySelectorAll('[data-section="true"]')?.forEach((h) => sectionObserver.observe(h));
    }, 100);

    return () => { clearTimeout(t); sectionObserver.disconnect(); };
  }, [tocSections, processedContent]);

  const trackEngagement = async (action) => {
    try {
      await axios.post(`${API_URL}/${story._id}/engagement`, { action });
      onEngagement && onEngagement(action);
    } catch (e) {
      console.warn(`Failed to track ${action}:`, e);
    }
  };

  const scrollToSection = (sectionId) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const el = document.getElementById(sectionId);
    if (!el) return;

    const containerTop = container.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const offset = container.scrollTop + (elTop - containerTop) - 140;
    container.scrollTo({ top: offset, behavior: 'smooth' });
    setActiveSection(sectionId);
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const re = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const m = url.match(re);
    return m && m[2].length === 11 ? m[2] : null;
  };

  const [likes, setLikes] = useState(story?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const nextLiked = !isLiked;
      const nextCount = nextLiked ? likes + 1 : likes - 1;
      setIsLiked(nextLiked);
      setLikes(nextCount);

      const liked = JSON.parse(localStorage.getItem('likedStories') || '[]');
      if (nextLiked) {
        if (!liked.includes(story._id)) liked.push(story._id);
      } else {
        const i = liked.indexOf(story._id);
        if (i > -1) liked.splice(i, 1);
      }
      localStorage.setItem('likedStories', JSON.stringify(liked));

      await trackEngagement('like');
      setSnackbar({ open: true, message: nextLiked ? '❤️ Added to favorites!' : '💔 Removed from favorites', severity: 'success' });
    } catch {
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes + 1 : likes - 1);
      setSnackbar({ open: true, message: 'Failed to update like. Please try again.', severity: 'error' });
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: story.title, text: story.description, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSnackbar({ open: true, message: '🔗 Link copied to clipboard!', severity: 'success' });
      }
      await trackEngagement('share');
    } catch (e) {
      if (e.name !== 'AbortError') setSnackbar({ open: true, message: 'Failed to share. Please try again.', severity: 'error' });
    }
  };

  const videoId = getYouTubeVideoId(story.videoUrl);
  const imageUrl = story.image ? `${API_BASE}${story.image}` : null;

  return (
    <DialogContentContainer>
      {/* TOC is visible immediately; no slide/transition */}
      {tocSections.length > 0 && (
        <StickyTOCHeader>
          <TOCHeaderSection>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ListIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                Table of Contents ({tocSections.length} sections)
              </Typography>
            </Box>
            <IconButton
              onClick={() => setTocOpen(!tocOpen)}
              sx={{ color: 'white', '&:hover': { backgroundColor: alpha('#ffffff', 0.1) } }}
            >
              {tocOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </TOCHeaderSection>

          <Collapse in={tocOpen}>
            <TOCNavigation>
              {tocSections.map((s) => (
                <TOCNavButton
                  key={s.id}
                  level={s.level}
                  active={activeSection === s.id}
                  onClick={() => scrollToSection(s.id)}
                >
                  {s.title}
                </TOCNavButton>
              ))}
            </TOCNavigation>
          </Collapse>
        </StickyTOCHeader>
      )}

      {/* Content shows right away (Title → Video → etc.) */}
      <ScrollableContent ref={scrollContainerRef}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#2E8B8B',
            mb: theme.spacing(2),
            background: 'linear-gradient(135deg, #3498DB, #2E8B8B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '1.8rem', md: '2.2rem' },
            lineHeight: 1.3,
          }}
        >
          {story.title}
        </Typography>

        <VideoContainer>
          {videoId && !videoError ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
              frameBorder="0"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 18 }}
              onError={() => setVideoError(true)}
            />
          ) : (
            <Box
              sx={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha('#3498DB', 0.8)}, ${alpha('#2E8B8B', 0.6)})`,
                color: 'white', flexDirection: 'column', gap: 2,
              }}
            >
              {imageUrl && !imageError ? (
                <Box
                  component="img"
                  src={imageUrl}
                  alt={story.title}
                  sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <Typography variant="h6" color="white" textAlign="center">Video Thumbnail</Typography>
              )}

              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
                <IconButton
                  sx={{
                    color: 'white',
                    backgroundColor: alpha('#000', 0.5),
                    '&:hover': { backgroundColor: alpha('#000', 0.7), transform: 'scale(1.1)' },
                    transition: 'all 0.3s ease',
                    p: 3,
                  }}
                >
                  <PlayCircleOutlineIcon sx={{ fontSize: '4rem' }} />
                </IconButton>
              </Box>

              {story.duration && (
                <Chip
                  icon={<AccessTimeIcon />}
                  label={story.duration}
                  sx={{
                    position: 'absolute', bottom: 16, right: 16,
                    backgroundColor: alpha('#000', 0.7), color: 'white', fontWeight: 600,
                  }}
                />
              )}
            </Box>
          )}
        </VideoContainer>

        {videoError && (
          <Alert
            severity="warning"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" href={story.videoUrl} target="_blank" endIcon={<LaunchIcon />}>
                Watch on YouTube
              </Button>
            }
          >
            Video player not available
          </Alert>
        )}

        <InfoCard>
          <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon sx={{ color: '#3498DB', fontSize: '1.1rem' }} />
              <Typography variant="body2" color="text.secondary">
                {new Date(story.createdAt || story.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VisibilityIcon sx={{ color: '#3498DB', fontSize: '1.1rem' }} />
              <Typography variant="body2" color="text.secondary">{story.views || '0'} views</Typography>
            </Box>

            {story.duration && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon sx={{ color: '#3498DB', fontSize: '1.1rem' }} />
                <Typography variant="body2" color="text.secondary">{story.duration}</Typography>
              </Box>
            )}
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <EngagementButton variant="like" liked={isLiked} disabled={isLiking} onClick={handleLike}
              startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}>
              {likes} {likes === 1 ? 'Like' : 'Likes'}
            </EngagementButton>
            <EngagementButton variant="share" onClick={handleShare} startIcon={<ShareIcon />}>
              Share Video
            </EngagementButton>
          </Stack>
        </InfoCard>

        {story.speakers?.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#2E8B8B', display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon sx={{ color: '#3498DB' }} /> Featured Speakers
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {story.speakers.map((s, i) => (
                <SpeakerBadge key={i} avatar={<Avatar sx={{ bgcolor: alpha('#ffffff', 0.2) }}>{s.charAt(0)}</Avatar>} label={s} />
              ))}
            </Stack>
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: '#333', fontSize: '1.1rem' }}>
          {story.description}
        </Typography>

        <ContentContainer ref={contentRef} sx={{ '& > *:last-child': { mb: 0 } }}>
          {processedContent && parse(processedContent)}
        </ContentContainer>

        {story.tags?.length > 0 && (
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#2E8B8B', display: 'flex', alignItems: 'center', gap: 1 }}>
              <TagIcon sx={{ color: '#3498DB' }} /> Tags
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {story.tags.map((t, i) => (
                <Chip
                  key={i}
                  label={t}
                  sx={{
                    backgroundColor: alpha('#3498DB', 0.1),
                    color: '#3498DB',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: alpha('#3498DB', 0.2),
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 8px rgba(52,152,219,0.2)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          👁️ {story.analytics?.impressions || 0} views
        </Typography>
      </ScrollableContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DialogContentContainer>
  );
};

export default VideoDialogContent;
