// src/components/SustainabilityStory/BlogDialogContent.jsx - FIXED FULL HEADING DISPLAY

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box, Typography, Avatar, Chip, useTheme, Divider, Paper,
  Stack, Button, Tooltip, Container, Collapse, IconButton
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import TagIcon from '@mui/icons-material/Tag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ListIcon from '@mui/icons-material/List';
import NavigationIcon from '@mui/icons-material/Navigation';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import axios from 'axios';
import { API_BASE } from '../../utils/api';


// ✅ Enhanced content sanitizer that allows tables and IDs
const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'ol', 'ul', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
      'a', 'img', 'span', 'div',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'caption', 'colgroup', 'col'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'style', 'id',
      'colspan', 'rowspan', 'scope', 'border', 'cellpadding', 'cellspacing',
      'width', 'height', 'align', 'valign'
    ]
  });
};

// ✅ FIXED: Dialog Content Container with proper sizing
const DialogContentContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 'calc(80vh - 120px)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  maxHeight: '600px'
}));

// ✅ ENHANCED: Sticky TOC Header with better spacing for full content
const StickyTOCHeader = styled(Box)(({ theme, visible, hasHeaders }) => ({
  position: 'sticky',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  background: `linear-gradient(135deg, 
    ${alpha('#1AC99F', 0.95)}, 
    ${alpha('#2E8B8B', 0.95)}
  )`,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: visible ? `0 4px 20px ${alpha('#1AC99F', 0.3)}` : 'none',
  border: `1px solid ${alpha('#1AC99F', 0.2)}`,
  borderRadius: '0 0 16px 16px',
  transform: visible && hasHeaders ? 'translateY(0)' : 'translateY(-100%)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: visible && hasHeaders ? 1 : 0,
  padding: theme.spacing(1.5, 2), // ✅ Increased padding for better spacing
  marginBottom: theme.spacing(0.5),
  flexShrink: 0,
  // ✅ Enhanced to handle longer content
  maxHeight: '40vh', // Allow more space for TOC
  overflow: 'hidden'
}));

// ✅ REDESIGNED: TOC Navigation with better layout for full headings
const TOCNavigation = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column', // ✅ Changed to column for better space utilization
  gap: theme.spacing(0.75),
  maxHeight: '25vh', // ✅ Set max height
  overflowY: 'auto', // ✅ Allow vertical scrolling instead of horizontal
  overflowX: 'hidden',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
  paddingRight: theme.spacing(1), // Space for scrollbar
  
  // ✅ Custom scrollbar for vertical scrolling
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: alpha('#ffffff', 0.1),
    borderRadius: 3,
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha('#ffffff', 0.3),
    borderRadius: 3,
    '&:hover': {
      background: alpha('#ffffff', 0.5),
    }
  },
  
  // ✅ Responsive design for smaller screens
  [theme.breakpoints.down('md')]: {
    maxHeight: '20vh',
  }
}));

// ✅ REDESIGNED: TOC Navigation Buttons with full text display
const TOCNavButton = styled(Button)(({ theme, level = 1, active }) => ({
  minWidth: 'auto',
  width: '100%', // ✅ Full width to accommodate longer text
  justifyContent: 'flex-start', // ✅ Left align text
  padding: theme.spacing(1, 2), // ✅ Increased padding
  borderRadius: 12,
  fontSize: level === 1 ? '0.9rem' : level === 2 ? '0.85rem' : '0.8rem',
  fontWeight: active ? 700 : level === 1 ? 600 : 500,
  lineHeight: 1.4, // ✅ Better line height for readability
  color: active ? '#2E8B8B' : 'rgba(255, 255, 255, 0.9)',
  backgroundColor: active ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.1)',
  border: active ? '2px solid #2E8B8B' : '2px solid transparent',
  textTransform: 'none',
  whiteSpace: 'normal', // ✅ Allow text wrapping
  wordWrap: 'break-word', // ✅ Break long words
  textAlign: 'left', // ✅ Left align text
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  position: 'relative',
  overflow: 'visible', // ✅ Show full content
  marginLeft: (level - 1) * 12, // ✅ Indentation for different levels
  
  // ✅ Hover effect with shimmer
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    transform: 'translateX(4px)', // ✅ Subtle slide effect
    boxShadow: `0 4px 16px ${alpha('#000000', 0.2)}`,
    '&::before': {
      left: '100%',
    }
  },
  
  '&:active': {
    transform: 'translateX(2px)',
  },
  
  // ✅ Level-specific styling
  ...(level === 1 && {
    fontWeight: active ? 800 : 700,
    fontSize: '1rem',
    marginBottom: theme.spacing(0.25),
  }),
  
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
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '50%',
    }
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
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: '50%',
    }
  }),
  
  // ✅ Responsive adjustments
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.75, 1.5),
    fontSize: level === 1 ? '0.85rem' : level === 2 ? '0.8rem' : '0.75rem',
    marginLeft: (level - 1) * 8,
  }
}));

// ✅ TOC Header with toggle functionality
const TOCHeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  borderBottom: `1px solid ${alpha('#ffffff', 0.2)}`
}));

// ✅ FIXED: Scrollable Content Container with proper sizing
const ScrollableContent = styled(Box)(({ theme, hasHeaders }) => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingTop: hasHeaders ? theme.spacing(0.5) : theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  minHeight: 0,
  '&::-webkit-scrollbar': {
    width: '6px'
  },
  '&::-webkit-scrollbar-track': {
    background: alpha('#1AC99F', 0.1)
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#1AC99F',
    borderRadius: '3px',
    '&:hover': {
      background: '#0E9A78'
    }
  }
}));

// ✅ FIXED: Content Container with proper spacing
const ContentContainer = styled(Box)(({ theme, hasHeaders }) => ({
  '& img': { 
    maxWidth: '100%', 
    height: 'auto',
    borderRadius: 12,
    margin: '12px 0',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '16px 0',
    border: '2px solid #1AC99F',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(26, 201, 159, 0.15)',
    background: '#fff'
  },
  '& th': {
    backgroundColor: '#1AC99F',
    color: 'white',
    padding: '16px 12px',
    textAlign: 'left',
    fontWeight: 700,
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: 'none'
  },
  '& td': {
    padding: '16px 12px',
    borderBottom: '1px solid #f0f0f0',
    verticalAlign: 'top',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    transition: 'background-color 0.2s ease'
  },
  '& tr:nth-of-type(even) td': {
    backgroundColor: alpha('#1AC99F', 0.03)
  },
  '& tr:hover td': {
    backgroundColor: alpha('#1AC99F', 0.08),
    transform: 'scale(1.005)'
  },
  '& blockquote': {
    borderLeft: '4px solid #1AC99F',
    marginLeft: 0,
    paddingLeft: '24px',
    fontStyle: 'italic',
    color: '#666',
    backgroundColor: alpha('#1AC99F', 0.03),
    padding: '16px 24px',
    borderRadius: '0 12px 12px 0',
    margin: '16px 0',
    fontSize: '1.1rem'
  },
  '& pre': {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '12px',
    overflow: 'auto',
    border: '1px solid #e9ecef',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    margin: '12px 0'
  },
  '& code': {
    backgroundColor: '#f1f3f4',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.9em',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    color: '#d73a49'
  },
  '& ul, & ol': {
    paddingLeft: '28px',
    margin: '12px 0',
    '& li': {
      marginBottom: '6px',
      lineHeight: 1.7,
      '&::marker': {
        color: '#1AC99F',
        fontWeight: 700
      }
    }
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    color: '#2E8B8B',
    fontWeight: 700,
    marginTop: '24px',
    marginBottom: '12px',
    scrollMarginTop: hasHeaders ? '140px' : '80px', // ✅ Adjusted for new TOC height
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#1AC99F',
      transform: 'translateX(4px)'
    },
    '&::before': {
      content: '"#"',
      position: 'absolute',
      left: -24,
      color: alpha('#1AC99F', 0.3),
      fontSize: '0.8em',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&:hover::before': {
      opacity: 1,
    }
  },
  '& h1': {
    fontSize: '2.2rem',
    borderBottom: '3px solid #1AC99F',
    paddingBottom: '12px',
    background: 'linear-gradient(135deg, #1AC99F, #2E8B8B)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  '& h2': {
    fontSize: '1.8rem',
    borderLeft: '5px solid #1AC99F',
    paddingLeft: '16px',
    color: '#1AC99F'
  },
  '& h3': {
    fontSize: '1.4rem',
    color: '#2E8B8B'
  },
  '& p': {
    lineHeight: 1.8,
    marginBottom: '12px',
    color: '#333',
    textAlign: 'justify',
    fontSize: '1rem'
  },
  '& a': {
    color: '#1AC99F',
    textDecoration: 'none',
    fontWeight: 600,
    '&:hover': {
      textDecoration: 'underline',
      color: '#0E9A78'
    }
  }
}));

// ✅ FIXED: Author Section with reduced padding
const AuthorSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  marginBottom: 16,
  padding: '16px 20px',
  backgroundColor: alpha('#1AC99F', 0.06),
  borderRadius: 16,
  border: `1px solid ${alpha('#1AC99F', 0.15)}`
}));

// ✅ Main Component
const BlogDialogContent = ({ story, onEngagement }) => {
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState('');
  const [tocSections, setTocSections] = useState([]);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [tocOpen, setTocOpen] = useState(true);
  const contentRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const headerTriggerRef = useRef(null);

  // ✅ Process and parse content with IDs injected
  const processedContent = useMemo(() => {
    if (!story?.content) return '';
    let htmlContent = sanitizeHtml(story.content);
    const sections = [];
    
    // Create a temporary DOM element to parse and modify HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Find all headings and add IDs
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const title = heading.textContent.trim();
      const id = `section-${index}-${title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50)}`;
      
      // Set ID attribute
      heading.setAttribute('id', id);
      heading.setAttribute('data-section', 'true');
      
      // Store section info
      sections.push({
        id,
        title,
        level,
        index
      });
    });
    
    // Update sections state
    setTocSections(sections);
    
    // Return the modified HTML
    return tempDiv.innerHTML;
  }, [story?.content]);

  // ✅ Intersection Observer for sticky header visibility and active section tracking
  useEffect(() => {
    if (!scrollContainerRef.current || !headerTriggerRef.current) return;
    
    // Observer for sticky header visibility
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShowStickyHeader(!entry.isIntersecting);
        });
      },
      {
        root: scrollContainerRef.current,
        rootMargin: '-50px 0px 0px 0px',
        threshold: 0
      }
    );
    headerObserver.observe(headerTriggerRef.current);

    // Observer for active section tracking
    let sectionObserver;
    if (tocSections.length > 0) {
      sectionObserver = new IntersectionObserver(
        (entries) => {
          let maxRatio = 0;
          let activeId = '';
          entries.forEach((entry) => {
            if (entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              activeId = entry.target.id;
            }
          });
          if (activeId) {
            setActiveSection(activeId);
          }
        },
        {
          root: scrollContainerRef.current,
          rootMargin: '-120px 0px -70% 0px', // ✅ Adjusted for new TOC height
          threshold: [0, 0.25, 0.5, 0.75, 1]
        }
      );

      // Observe all headings after content is rendered
      const timer = setTimeout(() => {
        const headings = contentRef.current?.querySelectorAll('[data-section="true"]');
        headings?.forEach((heading) => {
          sectionObserver.observe(heading);
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        headerObserver.disconnect();
        if (sectionObserver) sectionObserver.disconnect();
      };
    }

    return () => {
      headerObserver.disconnect();
    };
  }, [tocSections, processedContent]);

  // ✅ Smooth scroll to section within dialog
  const scrollToSection = (sectionId) => {
    if (!scrollContainerRef.current) return;
    
    const element = document.getElementById(sectionId);
    if (element) {
      const container = scrollContainerRef.current;
      const containerTop = container.getBoundingClientRect().top;
      const elementTop = element.getBoundingClientRect().top;
      const offsetPosition = container.scrollTop + (elementTop - containerTop) - 140; // ✅ Adjusted offset
      
      container.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update active section immediately
      setActiveSection(sectionId);
    }
  };

  // ✅ Track engagement on mount
  useEffect(() => {
    const trackView = async () => {
      try {
        await axios.post(`${API_BASE}/api/stories/${story._id}/engagement`, {
          action: 'view'
        });
        if (onEngagement) onEngagement('view');
      } catch (error) {
        console.warn('Failed to track view engagement:', error);
      }
    };

    if (story?._id) trackView();
  }, [story?._id, onEngagement]);

  // ✅ Engagement handlers
  const handleLike = async () => {
    try {
      await axios.post(`${API_BASE}/api/stories/${story._id}/engagement`, {
        action: 'like'
      });
      if (onEngagement) onEngagement('like');
    } catch (error) {
      console.warn('Failed to track like engagement:', error);
    }
  };

  const handleShare = async () => {
    try {
      await axios.post(`${API_BASE}/api/stories/${story._id}/engagement`, {
        action: 'share'
      });
      
      if (navigator.share) {
        await navigator.share({
          title: story.title,
          text: story.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
      
      if (onEngagement) onEngagement('share');
    } catch (error) {
      console.warn('Failed to share:', error);
    }
  };

  if (!story) return null;

  const hasHeaders = tocSections.length > 0;

  return (
    <DialogContentContainer>
      {/* ✅ ENHANCED: Sticky TOC Header with Full Heading Display */}
      {hasHeaders && (
        <StickyTOCHeader visible={showStickyHeader} hasHeaders={hasHeaders}>
          <TOCHeaderSection>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ListIcon sx={{ color: 'white', fontSize: '1.3rem' }} />
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}
              >
                Table of Contents ({tocSections.length} sections)
              </Typography>
            </Stack>
            <IconButton
              size="small"
              onClick={() => setTocOpen(!tocOpen)}
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.1)
                }
              }}
            >
              {tocOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </TOCHeaderSection>
          
          <Collapse in={tocOpen}>
            <TOCNavigation>
              {tocSections.map((section, index) => (
                <Tooltip 
                  key={section.id} 
                  title={`Navigate to: ${section.title}`}
                  placement="right"
                  arrow
                >
                  <TOCNavButton
                    level={section.level}
                    active={activeSection === section.id}
                    onClick={() => scrollToSection(section.id)}
                  >
                    {/* ✅ FIXED: Display full heading without truncation */}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        lineHeight: 1.4,
                        textAlign: 'left',
                        display: 'block',
                        width: '100%'
                      }}
                    >
                      {section.title}
                    </Typography>
                  </TOCNavButton>
                </Tooltip>
              ))}
            </TOCNavigation>
          </Collapse>
        </StickyTOCHeader>
      )}

      {/* ✅ Scrollable Content */}
      <ScrollableContent ref={scrollContainerRef} hasHeaders={hasHeaders}>
        <ContentContainer ref={contentRef} hasHeaders={hasHeaders}>
          {/* ✅ Header Trigger Point */}
          <Box ref={headerTriggerRef} sx={{ height: 1, width: '100%' }} />
          
          {/* ✅ Story Image */}
          {story.image && (
            <Box sx={{ mb: 2 }}>
              <img
                src={`${API_BASE}${story.image}`}
                alt={story.title}
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
          )}

          {/* ✅ Author Information */}
          {story.author && (
            <AuthorSection>
              {story.authorImage ? (
                <Avatar
                  src={`${API_BASE}${story.authorImage}`}
                  alt={story.author}
                  sx={{ width: 48, height: 48 }}
                />
              ) : (
                <Avatar sx={{ width: 48, height: 48, bgcolor: '#1AC99F' }}>
                  <PersonIcon />
                </Avatar>
              )}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2E8B8B' }}>
                  {story.author}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <CalendarTodayIcon sx={{ fontSize: 16, color: '#1AC99F' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(story.createdAt || story.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric'
                      })}
                    </Typography>
                  </Stack>
                  {story.readTime && (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <AccessTimeIcon sx={{ fontSize: 16, color: '#1AC99F' }} />
                      <Typography variant="body2" color="text.secondary">
                        {story.readTime}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            </AuthorSection>
          )}

          {/* ✅ Description */}
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: '#2E8B8B', 
              fontWeight: 600,
              lineHeight: 1.6
            }}
          >
            {story.description}
          </Typography>

          {/* ✅ Main Content */}
          <Box sx={{ '& > *:last-child': { mb: 0 } }}>
            {processedContent && parse(processedContent)}
          </Box>

          {/* ✅ Tags */}
          {story.tags && story.tags.length > 0 && (
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1.5, color: '#2E8B8B', fontWeight: 700 }}>
                <TagIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Tags
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {story.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #1AC99F, #4EDCB9)',
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0E9A78, #1AC99F)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(26, 201, 159, 0.3)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* ✅ Engagement Actions */}
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center" 
            sx={{ 
              mt: 3, 
              pt: 2, 
              borderTop: `1px solid ${alpha('#1AC99F', 0.2)}` 
            }}
          >
            <Button
              startIcon={<FavoriteIcon />}
              onClick={handleLike}
              sx={{
                color: '#1AC99F',
                fontWeight: 600,
                borderRadius: 3,
                px: 2,
                py: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: alpha('#1AC99F', 0.1),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${alpha('#1AC99F', 0.2)}`
                }
              }}
            >
              {story.likes || 0}
            </Button>
            
            <Button
              startIcon={<ShareIcon />}
              onClick={handleShare}
              sx={{
                color: '#1AC99F',
                fontWeight: 600,
                borderRadius: 3,
                px: 2,
                py: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: alpha('#1AC99F', 0.1),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${alpha('#1AC99F', 0.2)}`
                }
              }}
            >
              Share
            </Button>
            
            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
              👁️ {story.analytics?.impressions || 0} views
            </Typography>
          </Stack>
        </ContentContainer>
      </ScrollableContent>
    </DialogContentContainer>
  );
};

export default BlogDialogContent;
