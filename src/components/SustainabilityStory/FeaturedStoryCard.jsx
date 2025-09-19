// src/components/SustainabilityStory/FeaturedStoryCard.jsx - FIXED VERSION
import React, { useState, forwardRef } from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  useTheme,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import { API_BASE } from '../../utils/api';

const hoverGlow = keyframes`
  0%, 100% { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
  50% { box-shadow: 0 15px 40px rgba(26, 201, 159, 0.2); }
`;

const FeaturedStoryCard = forwardRef(({ story, categoryColor, index, onClick }, ref) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const getActionIcon = () => {
    switch (story.category) {
      case 'Video':
        return <PlayCircleOutlineIcon />;
      case 'Resources':
        return <DownloadIcon />;
      default:
        return <ArrowForwardIcon />;
    }
  };

  const getMetaInfo = () => {
    switch (story.category) {
      case 'Video':
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">
                {new Date(story.date).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">
                {story.views || '0'} views
              </Typography>
            </Box>
          </>
        );
      case 'Resources':
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">
                {new Date(story.date).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <GetAppIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">
                {story.downloadCount || '0'} downloads
              </Typography>
            </Box>
          </>
        );
      default: // Blog
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">
                {story.author || 'Unknown'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">
                {story.readTime || 'Quick read'}
              </Typography>
            </Box>
          </>
        );
    }
  };

  return (
    <Box
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick && onClick(story)}
      sx={{
        position: 'relative',
        height: 320,
        cursor: 'pointer',
        borderRadius: 3,
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        animation: isHovered ? `${hoverGlow} 2s ease-in-out infinite` : 'none',
        animationDelay: `${index * 0.1}s`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}CC)`,
        },
      }}
    >
      {/* ✅ FIXED: Image Container */}
      <Box sx={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        <img
          src={`${process.env.REACT_APP_API_URL || `${API_BASE}`}${story.image}` || '/placeholder-image.jpg'}
          alt={story.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.jpg';
          }}
        />

        {/* Category Badge */}
        <Chip
          label={story.category}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: categoryColor,
            color: 'white',
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        />

        {/* Duration/File Size Badge */}
        {(story.duration || story.fileSize) && (
          <Chip
            label={story.duration || story.fileSize}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        )}

        {/* Play button for videos */}
        {story.category === 'Video' && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <IconButton
              sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                color: categoryColor,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 1)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <PlayCircleOutlineIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            lineHeight: 1.3,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {story.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {story.description}
        </Typography>

        {/* ✅ FIXED: Tags */}
        {story.tags && story.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {story.tags.slice(0, 2).map((tag, tagIndex) => (
              <Chip
                key={tagIndex}
                label={tag}
                size="small"
                sx={{
                  fontSize: '0.65rem',
                  height: 20,
                  backgroundColor: `${categoryColor}10`,
                  color: categoryColor,
                  border: `1px solid ${categoryColor}30`,
                }}
              />
            ))}
            {story.tags.length > 2 && (
              <Chip
                label={`+${story.tags.length - 2}`}
                size="small"
                sx={{
                  fontSize: '0.65rem',
                  height: 20,
                  backgroundColor: `${categoryColor}10`,
                  color: categoryColor,
                  border: `1px solid ${categoryColor}30`,
                }}
              />
            )}
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, color: 'text.secondary' }}>
            {getMetaInfo()}
          </Box>
          
          <IconButton
            sx={{
              color: categoryColor,
              background: `${categoryColor}10`,
              '&:hover': {
                background: categoryColor,
                color: 'white',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {getActionIcon()}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
});

export default FeaturedStoryCard;
