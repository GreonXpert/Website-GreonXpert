// src/components/SustainabilityStory/ResourceDocumentDialogContent.jsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  useTheme,
  Divider,
  Alert,
  LinearProgress,
  Avatar,
  Stack,
  Snackbar,
  Collapse,
  IconButton,
  Paper,
  CircularProgress
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

// Icons
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GetAppIcon from '@mui/icons-material/GetApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import TagIcon from '@mui/icons-material/Tag';
import ListIcon from '@mui/icons-material/List';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import axios from 'axios';
import { API_BASE } from '../../utils/api';

const API_URL = `${API_BASE}/api/stories`;

// Animations
const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Enhanced content sanitizer
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

// Dialog Content Container
const DialogContentContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 'calc(80vh - 120px)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  maxHeight: '600px'
}));

// Sticky TOC Header
const StickyTOCHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  background: `linear-gradient(135deg, ${alpha('#1AC99F', 0.95)}, ${alpha('#2E8B8B', 0.95)})`,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: `0 4px 20px ${alpha('#1AC99F', 0.3)}`,
  border: `1px solid ${alpha('#1AC99F', 0.2)}`,
  borderRadius: '0 0 16px 16px',
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(0.5),
  flexShrink: 0,
  maxHeight: '40vh',
  overflow: 'hidden',
}));

// TOC Navigation
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
    },
  },
  
  [theme.breakpoints.down('md')]: {
    maxHeight: '20vh',
  },
}));

// TOC Navigation Buttons
const TOCNavButton = styled(Button)(({ theme, level = 1, active }) => ({
  minWidth: 'auto',
  width: '100%',
  justifyContent: 'flex-start',
  padding: theme.spacing(1, 2),
  borderRadius: 12,
  fontSize: level === 1 ? '0.9rem' : level === 2 ? '0.85rem' : '0.8rem',
  fontWeight: active ? 700 : level === 1 ? 600 : 500,
  lineHeight: 1.4,
  color: active ? '#2E8B8B' : 'rgba(255, 255, 255, 0.9)',
  backgroundColor: active ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.1)',
  border: active ? '2px solid #2E8B8B' : '2px solid transparent',
  textTransform: 'none',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
  textAlign: 'left',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    transform: 'translateX(4px)',
    boxShadow: `0 4px 16px ${alpha('#000000', 0.2)}`,
    
    '&::before': {
      left: '100%',
    },
  },
  
  '&:active': {
    transform: 'translateX(2px)',
  },
  
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
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: '50%',
    },
  }),
  
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.75, 1.5),
    fontSize: level === 1 ? '0.85rem' : level === 2 ? '0.8rem' : '0.75rem',
    marginLeft: (level - 1) * 8,
  },
}));

// TOC Header Section
const TOCHeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  borderBottom: `1px solid ${alpha('#ffffff', 0.2)}`
}));

// Scrollable Content
const ScrollableContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingTop: theme.spacing(1),
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

// Resource Preview Container
const ResourcePreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 220,
  background: `linear-gradient(145deg, 
    ${alpha('#1AC99F', 0.08)}, 
    ${alpha('#2E8B8B', 0.05)}
  )`,
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  borderRadius: 20,
  marginBottom: theme.spacing(3),
  border: `2px dashed ${alpha('#1AC99F', 0.3)}`,
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, #1AC99F, #4EDCB9, #2E8B8B)`,
    borderRadius: '20px 20px 0 0',
  },
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 30px ${alpha('#1AC99F', 0.2)}`,
    
    '& .resource-icon': {
      animation: `${float} 2s ease-in-out infinite`,
    },
  },
  
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

// Enhanced Info Card
const InfoCard = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(145deg, 
    ${alpha('#ffffff', 0.8)}, 
    ${alpha('#1AC99F', 0.03)}
  )`,
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  borderRadius: 20,
  border: `1px solid ${alpha('#1AC99F', 0.15)}`,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: `0 8px 32px ${alpha('#1AC99F', 0.1)}`,
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: `linear-gradient(90deg, #1AC99F, #4EDCB9)`,
  },
}));

// Content Container with enhanced styling
const ContentContainer = styled(Box)(({ theme }) => ({
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
    scrollMarginTop: '140px',
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
    },
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

// Enhanced Engagement Buttons
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
  
  ...(buttonVariant === 'download' && {
    background: `linear-gradient(135deg, #1AC99F, #4EDCB9)`,
    color: 'white',
    border: 'none',
    boxShadow: '0 8px 25px rgba(26, 201, 159, 0.35)',
    
    '&:hover': {
      background: `linear-gradient(135deg, #0E9A78, #1AC99F)`,
      transform: 'translateY(-3px) scale(1.05)',
      boxShadow: '0 12px 35px rgba(26, 201, 159, 0.4)',
    },
    
    '&:disabled': {
      background: alpha('#2E8B8B', 0.3),
      color: alpha('#ffffff', 0.6),
      transform: 'none',
    },
  }),
  
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
    background: `linear-gradient(135deg, ${alpha('#1AC99F', 0.1)}, ${alpha('#4EDCB9', 0.05)})`,
    color: '#1AC99F',
    border: `2px solid ${alpha('#1AC99F', 0.3)}`,
    boxShadow: '0 4px 15px rgba(26, 201, 159, 0.2)',
    
    '&:hover': {
      transform: 'translateY(-3px) scale(1.05)',
      background: `linear-gradient(135deg, ${alpha('#1AC99F', 0.15)}, ${alpha('#4EDCB9', 0.08)})`,
      boxShadow: '0 12px 35px rgba(26, 201, 159, 0.3)',
      borderColor: '#1AC99F',
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
  
  '&:hover::before': {
    left: '100%',
  },
}));

// Enhanced Chip Styling
const StyledChip = styled(Chip)(({ theme, variant: chipVariant }) => ({
  fontWeight: 600,
  borderRadius: 16,
  transition: 'all 0.3s ease',
  
  ...(chipVariant === 'fileType' && {
    background: `linear-gradient(135deg, #1AC99F, #4EDCB9)`,
    color: 'white',
    fontSize: '0.875rem',
    padding: theme.spacing(0.5, 1),
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(26, 201, 159, 0.3)'
    }
  }),
  
  ...(chipVariant === 'info' && {
    background: `linear-gradient(135deg, ${alpha('#1AC99F', 0.1)}, ${alpha('#4EDCB9', 0.05)})`,
    color: '#1AC99F',
    border: `1px solid ${alpha('#1AC99F', 0.2)}`,
    '&:hover': {
      background: `linear-gradient(135deg, ${alpha('#1AC99F', 0.15)}, ${alpha('#4EDCB9', 0.08)})`,
      transform: 'translateY(-1px)'
    }
  }),
  
  ...(chipVariant === 'tag' && {
    background: `linear-gradient(135deg, ${alpha('#2E8B8B', 0.1)}, ${alpha('#1AC99F', 0.05)})`,
    color: '#2E8B8B',
    border: `1px solid ${alpha('#2E8B8B', 0.2)}`,
    '&:hover': {
      background: `linear-gradient(135deg, ${alpha('#2E8B8B', 0.15)}, ${alpha('#1AC99F', 0.08)})`,
      transform: 'translateY(-1px)'
    }
  })
}));

// Main Component
const ResourceDocumentDialogContent = ({ story, onEngagement }) => {
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState('');
  const [tocSections, setTocSections] = useState([]);
  const [tocOpen, setTocOpen] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [likes, setLikes] = useState(story?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const contentRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Process content and extract TOC
  const processedContent = useMemo(() => {
    if (!story?.content) return '';
    
    let htmlContent = sanitizeHtml(story.content);
    const sections = [];
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const title = heading.textContent.trim();
      const id = `section-${index}-${title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50)}`;
      
      heading.setAttribute('id', id);
      heading.setAttribute('data-section', 'true');
      
      sections.push({
        id,
        title,
        level,
        index
      });
    });
    
    setTocSections(sections);
    return tempDiv.innerHTML;
  }, [story?.content]);

  // Initialize liked state
  useEffect(() => {
    const likedStories = JSON.parse(localStorage.getItem('likedStories') || '[]');
    setIsLiked(likedStories.includes(story._id));
    
    // Track initial view
    const trackView = async () => {
      try {
        await axios.post(`${API_URL}/${story._id}/engagement`, { action: 'view' });
        if (onEngagement) onEngagement('view');
      } catch (error) {
        console.warn('Failed to track view engagement:', error);
      }
    };
    
    if (story?._id) trackView();
  }, [story._id, onEngagement]);

  // Intersection Observer for active section tracking
  useEffect(() => {
    if (!scrollContainerRef.current || tocSections.length === 0) return;

    const sectionObserver = new IntersectionObserver(
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
        rootMargin: '-120px 0px -70% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    const timer = setTimeout(() => {
      const headings = contentRef.current?.querySelectorAll('[data-section="true"]');
      headings?.forEach((heading) => {
        sectionObserver.observe(heading);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      sectionObserver.disconnect();
    };
  }, [tocSections, processedContent]);

  // Scroll to section
  const scrollToSection = (sectionId) => {
    if (!scrollContainerRef.current) return;
    
    const element = document.getElementById(sectionId);
    if (element) {
      const container = scrollContainerRef.current;
      const containerTop = container.getBoundingClientRect().top;
      const elementTop = element.getBoundingClientRect().top;
      const offsetPosition = container.scrollTop + (elementTop - containerTop) - 140;
      
      container.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveSection(sectionId);
    }
  };

  // Get file icon based on file type
  const getFileIcon = () => {
    const fileType = story.fileType?.toLowerCase() || story.resourceType?.toLowerCase();
    const iconProps = { className: 'resource-icon', sx: { fontSize: 64 } };
    
    switch (fileType) {
      case 'pdf':
        return <PictureAsPdfIcon {...iconProps} sx={{ ...iconProps.sx, color: '#e74c3c' }} />;
      case 'excel':
        return <TableChartIcon {...iconProps} sx={{ ...iconProps.sx, color: '#2ecc71' }} />;
      case 'word':
        return <DescriptionIcon {...iconProps} sx={{ ...iconProps.sx, color: '#3498db' }} />;
      case 'powerpoint':
        return <SlideshowIcon {...iconProps} sx={{ ...iconProps.sx, color: '#f39c12' }} />;
      default:
        return <InsertDriveFileIcon {...iconProps} sx={{ ...iconProps.sx, color: '#1AC99F' }} />;
    }
  };

  // Handle download
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const fileUrl = story.filePath ? `${API_BASE}${story.filePath}` : story.downloadUrl;
      
      if (!fileUrl) {
        throw new Error('No file URL available');
      }

      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const fileExtension = story.filePath ? 
        story.filePath.substring(story.filePath.lastIndexOf('.')) : 
        `.${story.fileType?.toLowerCase() || 'pdf'}`;
      const sanitizedTitle = story.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
      link.download = `${sanitizedTitle}${fileExtension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
      
      setDownloadComplete(true);
      
      try {
        await axios.post(`${API_URL}/${story._id}/engagement`, { action: 'download' });
        if (onEngagement) onEngagement('download');
      } catch (trackError) {
        console.warn('Failed to track download:', trackError);
      }

      setSnackbar({
        open: true,
        message: `📁 Downloaded: ${sanitizedTitle}${fileExtension}`,
        severity: 'success'
      });

    } catch (error) {
      console.error('Download failed:', error);
      setSnackbar({
        open: true,
        message: 'Download failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle like
  const handleLike = async () => {
    try {
      const newLiked = !isLiked;
      const newLikesCount = newLiked ? likes + 1 : likes - 1;
      
      setIsLiked(newLiked);
      setLikes(newLikesCount);

      const likedStories = JSON.parse(localStorage.getItem('likedStories') || '[]');
      if (newLiked) {
        if (!likedStories.includes(story._id)) {
          likedStories.push(story._id);
        }
      } else {
        const index = likedStories.indexOf(story._id);
        if (index > -1) {
          likedStories.splice(index, 1);
        }
      }
      localStorage.setItem('likedStories', JSON.stringify(likedStories));

      await axios.post(`${API_URL}/${story._id}/engagement`, { action: 'like' });
      if (onEngagement) onEngagement('like');

      setSnackbar({
        open: true,
        message: newLiked ? '❤️ Added to favorites!' : '💔 Removed from favorites',
        severity: 'success'
      });

    } catch (error) {
      console.error('Failed to like:', error);
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes + 1 : likes - 1);
      
      setSnackbar({
        open: true,
        message: 'Failed to update like. Please try again.',
        severity: 'error'
      });
    }
  };

  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: story.title,
          text: story.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSnackbar({
          open: true,
          message: '🔗 Link copied to clipboard!',
          severity: 'success'
        });
      }

      await axios.post(`${API_URL}/${story._id}/engagement`, { action: 'share' });
      if (onEngagement) onEngagement('share');

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to share:', error);
        setSnackbar({
          open: true,
          message: 'Failed to share. Please try again.',
          severity: 'error'
        });
      }
    }
  };

  const hasHeaders = tocSections.length > 0;

  return (
    <DialogContentContainer>
      {/* Sticky TOC Header */}
      {hasHeaders && (
        <StickyTOCHeader>
          <TOCHeaderSection>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ListIcon sx={{ color: 'white', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700 }}>
                Table of Contents ({tocSections.length} sections)
              </Typography>
            </Box>
            <IconButton
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
              {tocSections.map((section) => (
                <TOCNavButton
                  key={section.id}
                  level={section.level}
                  active={activeSection === section.id}
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.title}
                </TOCNavButton>
              ))}
            </TOCNavigation>
          </Collapse>
        </StickyTOCHeader>
      )}

      {/* Scrollable Content */}
      <ScrollableContent ref={scrollContainerRef}>
        <Box ref={contentRef}>
          {/* Story Title */}
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #1AC99F, #2E8B8B, #4EDCB9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 3,
              textAlign: 'center'
            }}
          >
            {story.title}
          </Typography>

          {/* Resource Preview */}
          <ResourcePreviewContainer>
            <Box sx={{ textAlign: 'center' }}>
              {getFileIcon()}
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1AC99F', 
                  mt: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                {story.fileType?.toUpperCase() || story.resourceType?.toUpperCase()} Document
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: alpha('#2E8B8B', 0.8),
                  mt: 1,
                  fontWeight: 500
                }}
              >
                Click download to access this resource
              </Typography>
            </Box>
          </ResourcePreviewContainer>

          {/* Resource Details */}
          <InfoCard elevation={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: '#1AC99F' }} />
                <Typography variant="body2" sx={{ color: '#2E8B8B', fontWeight: 600 }}>
                  Published: {new Date(story.createdAt || story.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GetAppIcon sx={{ fontSize: 16, color: '#1AC99F' }} />
                <Typography variant="body2" sx={{ color: '#2E8B8B', fontWeight: 600 }}>
                  {story.downloadCount || story.analytics?.downloads || 0} downloads
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              {story.fileSize && (
                <StyledChip
                  variant="info"
                  label={`Size: ${story.fileSize}`}
                  size="small"
                />
              )}
              {(story.pages || story.estimatedPages) && (
                <StyledChip
                  variant="info"
                  label={`${story.pages || story.estimatedPages} pages`}
                  size="small"
                />
              )}
              <StyledChip
                variant="fileType"
                label={story.fileType?.toUpperCase() || story.resourceType?.toUpperCase()}
                size="small"
              />
              {story.targetAudience && (
                <StyledChip
                  variant="info"
                  label={story.targetAudience}
                  size="small"
                />
              )}
            </Stack>
          </InfoCard>

          {/* Author Information */}
          {story.author && (
            <InfoCard elevation={0}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {story.authorImage ? (
                  <Avatar 
                    src={`${API_BASE}${story.authorImage}`}
                    sx={{ width: 48, height: 48 }}
                  />
                ) : (
                  <Avatar sx={{ 
                    width: 48, 
                    height: 48,
                    background: 'linear-gradient(135deg, #1AC99F, #4EDCB9)'
                  }}>
                    <PersonIcon />
                  </Avatar>
                )}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2E8B8B' }}>
                    {story.author}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#2E8B8B', 0.7) }}>
                    Resource Author
                  </Typography>
                </Box>
              </Stack>
            </InfoCard>
          )}

          {/* What's Included Section */}
          {(story.includes || story.resourceIncludes) && (story.includes?.length > 0 || story.resourceIncludes?.length > 0) && (
            <InfoCard elevation={0}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1AC99F', 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 20 }} />
                What's Included:
              </Typography>
              <Box sx={{ pl: 2 }}>
                {(story.includes || story.resourceIncludes)?.map((item, index) => (
                  <Typography 
                    key={index} 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      display: 'flex', 
                      alignItems: 'center',
                      color: '#2E8B8B',
                      fontWeight: 500
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 16, color: '#4EDCB9', mr: 1 }} />
                    {item}
                  </Typography>
                ))}
              </Box>
            </InfoCard>
          )}

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              mb: 3,
              color: '#333',
              fontSize: '1.1rem',
              whiteSpace: 'pre-line',
            }}
          >
            {story.description}
          </Typography>

          {/* Main Content */}
          {processedContent && (
            <ContentContainer sx={{ '& > *:last-child': { mb: 0 } }}>
              {parse(processedContent)}
            </ContentContainer>
          )}

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <Box sx={{ mt: 4, mb: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#2E8B8B', 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <TagIcon />
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {story.tags.map((tag, index) => (
                  <StyledChip
                    key={index}
                    variant="tag"
                    label={tag}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Action Buttons Section */}
          <InfoCard elevation={0}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
              alignItems="center"
            >
              {/* Download Button */}
              <EngagementButton
                variant="download"
                onClick={handleDownload}
                disabled={isDownloading}
                startIcon={isDownloading ? <CircularProgress size={20} /> : <DownloadIcon />}
                sx={{ minWidth: { xs: '100%', sm: 180 } }}
              >
                {isDownloading ? 'Preparing...' : 'Download Resource'}
              </EngagementButton>

              {/* Like Button */}
              <EngagementButton
                variant="like"
                liked={isLiked}
                onClick={handleLike}
                startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                sx={{ minWidth: { xs: '100%', sm: 140 } }}
              >
                {likes} {likes === 1 ? 'Like' : 'Likes'}
              </EngagementButton>

              {/* Share Button */}
              <EngagementButton
                variant="share"
                onClick={handleShare}
                startIcon={<ShareIcon />}
                sx={{ minWidth: { xs: '100%', sm: 120 } }}
              >
                Share
              </EngagementButton>
            </Stack>
          </InfoCard>

          {/* Download Progress */}
          {isDownloading && (
            <InfoCard elevation={0}>
              <Typography variant="body2" sx={{ color: '#2E8B8B', mb: 1, fontWeight: 600 }}>
                Preparing download...
              </Typography>
              <LinearProgress 
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: alpha('#1AC99F', 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#1AC99F',
                    borderRadius: 4,
                  }
                }}
              />
            </InfoCard>
          )}

          {/* Download Success */}
          {downloadComplete && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#1AC99F'
                }
              }}
            >
              Download completed successfully! Check your downloads folder.
            </Alert>
          )}

          {/* Analytics */}
          <Box sx={{ 
            textAlign: 'center', 
            pt: 2, 
            borderTop: `1px solid ${alpha('#1AC99F', 0.2)}`,
            color: alpha('#2E8B8B', 0.7),
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            👁️ {story.analytics?.impressions || story.views || 0} views
          </Box>
        </Box>
      </ScrollableContent>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            '& .MuiAlert-icon': {
              fontSize: 20
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DialogContentContainer>
  );
};

export default ResourceDocumentDialogContent;
