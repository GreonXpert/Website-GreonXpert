// src/components/SustainabilityStory/BlogCard.jsx - WITH LIKE & SHARE BUTTON FUNCTIONALITY
import React, { useState, useEffect, forwardRef } from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  useTheme,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import axios from 'axios';
import { API_BASE } from '../../utils/api';

const API_URL = `${API_BASE}/api/stories`;

const hoverGlow = keyframes`
  0%, 100% { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
  50% { box-shadow: 0 8px 25px rgba(26, 201, 159, 0.15); }
`;

// ✅ Styled Like Button for Card
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

// ✅ Styled Share Button for Card
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

const BlogCard = forwardRef(({ story, categoryColor, index, onClick }, ref) => {
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

  // ✅ Handle Like Button Click
  const handleLike = async (e) => {
    e.stopPropagation();
    
    if (isLiking) return;
    
    setIsLiking(true);
    
    try {
      // Optimistic update
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
      console.error('Failed to like story:', error);
      
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
        {/* ✅ Image Section with proper src and fallback */}
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
            src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${story.image}` || '/placeholder-image.jpg'}
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
              top: 8,
              left: 8,
              background: categoryColor,
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem',
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

          {/* ✅ Tags Section - Clean rendering without brackets */}
          {story.tags && story.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {story.tags.slice(0, 3).map((tag, tagIndex) => (
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
                  }}
                />
              ))}
              {story.tags.length > 3 && (
                <Chip
                  label={`+${story.tags.length - 3}`}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 24,
                    backgroundColor: `${categoryColor}10`,
                    color: categoryColor,
                    border: `1px solid ${categoryColor}30`,
                  }}
                />
              )}
            </Box>
          )}

          {/* Footer with Author and Meta Info */}
          <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {story.author || 'Unknown'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {new Date(story.date).toLocaleDateString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {story.readTime || 'Quick read'}
              </Typography>
            </Box>
          </Box>

          {/* ✅ Action Buttons Section - Like, Share & Navigate */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Like & Share Buttons Container */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Like Button */}
              <LikeButtonCard
                liked={isLiked}
                onClick={handleLike}
                disabled={isLiking}
                title={isLiked ? 'Unlike this story' : 'Like this story'}
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
                title="Share this story"
              >
                <ShareIcon sx={{ fontSize: 18 }} />
              </ShareButtonCard>
            </Box>

            {/* Navigate Button */}
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onClick && onClick(story);
              }}
              sx={{
                color: categoryColor,
                '&:hover': {
                  background: `${categoryColor}15`,
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.3s ease',
              }}
              title="Read full story"
            >
              <ArrowForwardIcon />
            </IconButton>
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

export default BlogCard;
