// src/components/SustainabilityStory/VideoCard.jsx - COMPLETE WITH LIKE & SHARE
import React, { useState, useEffect, forwardRef } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import axios from 'axios';
import { API_BASE } from '../../utils/api';

const API_URL = `${API_BASE}/api/stories`;

const hoverGlow = keyframes`
  0%, 100% { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
  50% { box-shadow: 0 8px 25px rgba(52, 152, 219, 0.15); }
`;

// ✅ Styled Like Button for Video Card
const LikeButtonCard = styled(IconButton)(({ theme, liked }) => ({
  background: liked ? 
    `linear-gradient(135deg, #ff6b6b, #ee5a52)` : 
    `${theme.palette.primary.main}10`,
  color: liked ? 'white' : theme.palette.primary.main,
  border: `2px solid ${liked ? '#ff6b6b' : theme.palette.primary.main}`,
  borderRadius: '50px',
  padding: '8px 12px',
  fontSize: '0.875rem',
  fontWeight: 600,
  minWidth: '80px',
  height: '36px',
  transition: 'all 0.3s ease',
  boxShadow: liked ? 
    '0 4px 15px rgba(255, 107, 107, 0.25)' : 
    `0 2px 8px ${theme.palette.primary.main}15`,
  '&:hover': {
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: liked ? 
      '0 8px 20px rgba(255, 107, 107, 0.35)' : 
      `0 4px 12px ${theme.palette.primary.main}25`,
    background: liked ? 
      `linear-gradient(135deg, #ff5252, #e53935)` : 
      `${theme.palette.primary.main}15`,
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

// ✅ Styled Share Button for Video Card
const ShareButtonCard = styled(IconButton)(({ theme }) => ({
  background: `${theme.palette.secondary.main}10`,
  color: theme.palette.secondary.main,
  border: `2px solid ${theme.palette.secondary.main}`,
  borderRadius: '50%',
  padding: '8px',
  fontSize: '0.875rem',
  fontWeight: 600,
  width: '36px',
  height: '36px',
  transition: 'all 0.3s ease',
  boxShadow: `0 2px 8px ${theme.palette.secondary.main}15`,
  '&:hover': {
    transform: 'translateY(-2px) scale(1.1)',
    boxShadow: `0 4px 12px ${theme.palette.secondary.main}25`,
    background: `${theme.palette.secondary.main}15`,
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

const VideoCard = forwardRef(({ story, categoryColor, index, onClick }, ref) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  // ✅ Like functionality state
  const [likes, setLikes] = useState(story?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Check if user has liked this story
    const likedStories = JSON.parse(localStorage.getItem('likedStories') || '[]');
    setIsLiked(likedStories.includes(story._id));
  }, [story._id]);

  // ✅ Helper function to properly parse tags
  const parseTags = (tags) => {
    if (!tags) return [];
    
    if (Array.isArray(tags)) {
      return tags.filter(tag => tag && typeof tag === 'string');
    }
    
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) {
          return parsed.filter(tag => tag && typeof tag === 'string');
        }
        return tags.split(',').map(tag => tag.trim()).filter(Boolean);
      } catch (e) {
        return tags.split(',').map(tag => tag.trim()).filter(Boolean);
      }
    }
    
    return [];
  };

  // ✅ Handle Like Button Click
  const handleLike = async (e) => {
    e.stopPropagation();
    
    if (isLiking) return;
    
    setIsLiking(true);
    
    try {
      const newLikedState = !isLiked;
      const newLikesCount = newLikedState ? likes + 1 : likes - 1;
      
      setIsLiked(newLikedState);
      setLikes(newLikesCount);

      // Update localStorage
      const likedStories = JSON.parse(localStorage.getItem('likedStories') || '[]');
      if (newLikedState) {
        likedStories.push(story._id);
      } else {
        const index = likedStories.indexOf(story._id);
        if (index > -1) likedStories.splice(index, 1);
      }
      localStorage.setItem('likedStories', JSON.stringify(likedStories));

      // Send to backend
      await axios.post(`${API_URL}/${story._id}/engagement`, {
        action: 'like'
      });

      setSnackbar({
        open: true,
        message: newLikedState ? '❤️ Liked!' : '💔 Unliked',
        severity: 'success'
      });

    } catch (error) {
      console.error('Failed to like video:', error);
      
      // Revert optimistic update
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes + 1 : likes - 1);
      
      setSnackbar({
        open: true,
        message: 'Failed to update like',
        severity: 'error'
      });
    } finally {
      setIsLiking(false);
    }
  };

  // ✅ Handle Share Button Click
  const handleShare = async (e) => {
    e.stopPropagation();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: story.title,
          text: story.description,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setSnackbar({
          open: true,
          message: '🔗 Link copied to clipboard!',
          severity: 'success'
        });
      }

      // Track share engagement
      await axios.post(`${API_URL}/${story._id}/engagement`, {
        action: 'share'
      });

    } catch (error) {
      console.error('Failed to share:', error);
      setSnackbar({
        open: true,
        message: 'Failed to share',
        severity: 'error'
      });
    }
  };

  const cleanTags = parseTags(story.tags);

  return (
    <>
      <Box
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onClick && onClick(story)}
        sx={{
          display: 'flex',
          gap: 3,
          p: 3,
          mb: 3,
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderLeft: `4px solid ${categoryColor}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
          animation: isHovered ? `${hoverGlow} 2s ease-in-out infinite` : 'none',
          '&:hover': {
            background: 'rgba(255, 255, 255, 1)',
            boxShadow: `0 8px 30px ${categoryColor}20`,
          },
        }}
      >
        {/* Video Thumbnail Section */}
        <Box
          sx={{
            position: 'relative',
            minWidth: 200,
            width: 200,
            height: 150,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
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

          {/* Play Button Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
            }}
          >
            <IconButton
              sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                color: categoryColor,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 1)',
                  transform: 'scale(1.1)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <PlayCircleOutlineIcon sx={{ fontSize: 40 }} />
            </IconButton>
          </Box>

          {/* Duration Badge */}
          {story.duration && (
            <Chip
              label={story.duration}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
                zIndex: 1,
              }}
            />
          )}

          {/* Category Badge */}
          <Chip
            label={story.category}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              background: categoryColor,
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem',
              zIndex: 1,
            }}
          />

          {/* Video Overlay for Better UX */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isHovered 
                ? 'linear-gradient(45deg, rgba(52, 152, 219, 0.1), rgba(52, 152, 219, 0.2))'
                : 'transparent',
              transition: 'all 0.3s ease',
              zIndex: 1,
            }}
          />
        </Box>

        {/* Content Section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: 'text.primary',
              lineHeight: 1.3,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {story.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 2,
              lineHeight: 1.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {story.description}
          </Typography>

          {/* Speakers Section */}
          {story.speakers && story.speakers.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
              <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Speakers: {Array.isArray(story.speakers) ? story.speakers.join(', ') : story.speakers}
              </Typography>
            </Box>
          )}

          {/* ✅ Tags Section - Clean rendering without brackets */}
          {cleanTags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {cleanTags.slice(0, 3).map((tag, tagIndex) => (
                <Chip
                  key={tagIndex}
                  label={tag}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 24,
                    backgroundColor: `${categoryColor}10`,
                    color: categoryColor,
                    border: `1px solid ${categoryColor}30`,
                    '&:hover': {
                      backgroundColor: `${categoryColor}20`,
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
              {cleanTags.length > 3 && (
                <Chip
                  label={`+${cleanTags.length - 3}`}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 24,
                    backgroundColor: `${categoryColor}10`,
                    color: categoryColor,
                    border: `1px solid ${categoryColor}30`,
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>
          )}

          {/* Footer Section */}
          <Box sx={{ mt: 'auto' }}>
            {/* Meta Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {new Date(story.date).toLocaleDateString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {story.views || '0'} views
                </Typography>
              </Box>
            </Box>

            {/* ✅ Action Buttons - Like & Share */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Like Button */}
              <LikeButtonCard
                liked={isLiked}
                onClick={handleLike}
                disabled={isLiking}
                title={isLiked ? 'Unlike this video' : 'Like this video'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {isLiked ? <FavoriteIcon sx={{ fontSize: 18 }} /> : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
                <Typography variant="caption" fontWeight={600}>
                  {likes}
                </Typography>
              </LikeButtonCard>

              {/* Share Button */}
              <ShareButtonCard
                onClick={handleShare}
                title="Share this video"
              >
                <ShareIcon sx={{ fontSize: 18 }} />
              </ShareButtonCard>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ✅ Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;
