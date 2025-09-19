// src/components/SustainabilityStory/ResourceCard.jsx
import React, { useState, useEffect, forwardRef } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GetAppIcon from '@mui/icons-material/GetApp';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionIcon from '@mui/icons-material/Description';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import axios from 'axios';

import { API_BASE } from '../../utils/api';

const API_URL = `${API_BASE}/api/stories`;

const hoverGlow = keyframes`
  0%, 100% { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
  50% { box-shadow: 0 8px 25px rgba(46, 139, 139, 0.15); }
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
  minWidth: '70px',
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
}));

const ResourceCard = forwardRef(({ story, categoryColor, index, onClick }, ref) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // ✅ Like functionality state
  const [likes, setLikes] = useState(story?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Check if user has liked this story
    const likedStories = JSON.parse(localStorage.getItem('likedStories') || '[]');
    setIsLiked(likedStories.includes(story._id));
  }, [story._id]);

  const getFileIcon = () => {
    switch (story.fileType?.toLowerCase()) {
      case 'pdf':
        return <DescriptionIcon sx={{ fontSize: 40, color: categoryColor }} />;
      case 'excel':
        return <InsertDriveFileIcon sx={{ fontSize: 40, color: categoryColor }} />;
      case 'word':
        return <DescriptionIcon sx={{ fontSize: 40, color: categoryColor }} />;
      case 'powerpoint':
        return <InsertDriveFileIcon sx={{ fontSize: 40, color: categoryColor }} />;
      default:
        return <InsertDriveFileIcon sx={{ fontSize: 40, color: categoryColor }} />;
    }
  };

  // ✅ Handle Direct Download
  const handleDownload = async (e) => {
    e.stopPropagation();
    setIsDownloading(true);
    
    try {
      // Construct file URL
      const fileUrl = story.filePath ? `${API_BASE}${story.filePath}` : story.downloadUrl;
      
      if (!fileUrl) {
        throw new Error('No file URL available');
      }

      // Fetch the file
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob
      const blob = await response.blob();
      
      // Create download URL
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Create temporary link element
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Generate filename
      const fileExtension = story.filePath ? 
        story.filePath.substring(story.filePath.lastIndexOf('.')) : 
        `.${story.fileType?.toLowerCase() || 'pdf'}`;
      const sanitizedTitle = story.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
      link.download = `${sanitizedTitle}${fileExtension}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);

      // Track download engagement
      try {
        await axios.post(`${API_URL}/${story._id}/engagement`, { action: 'download' });
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

  // ✅ Handle Like Button Click
  const handleLike = async (e) => {
    e.stopPropagation();
    
    try {
      const newLiked = !isLiked;
      const newLikesCount = newLiked ? likes + 1 : likes - 1;
      
      setIsLiked(newLiked);
      setLikes(newLikesCount);

      // Update localStorage
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

      // Update backend
      await axios.post(`${API_URL}/${story._id}/engagement`, { action: 'like' });

      setSnackbar({
        open: true,
        message: newLiked ? '❤️ Liked!' : '💔 Unliked',
        severity: 'success'
      });

    } catch (error) {
      console.error('Failed to like:', error);
      // Revert optimistic update
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes + 1 : likes - 1);
      
      setSnackbar({
        open: true,
        message: 'Failed to update like',
        severity: 'error'
      });
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
      await axios.post(`${API_URL}/${story._id}/engagement`, { action: 'share' });

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
        {/* File Preview Section */}
        <Box
          sx={{
            position: 'relative',
            minWidth: 200,
            width: 200,
            height: 150,
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${categoryColor}10`,
          }}
        >
          {story.image ? (
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
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              {getFileIcon()}
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: categoryColor,
                  fontWeight: 600,
                  mt: 1,
                }}
              >
                {story.fileType?.toUpperCase()}
              </Typography>
            </Box>
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
            }}
          />

          {/* File Size Badge */}
          {story.fileSize && (
            <Chip
              label={story.fileSize}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
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

          {/* Resource Details */}
          {story.pages && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
              📄 {story.pages} pages
            </Typography>
          )}

          {story.includes && story.includes.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
              📦 Includes: {story.includes.slice(0, 2).join(', ')}{story.includes.length > 2 ? '...' : ''}
            </Typography>
          )}

          {/* Tags */}
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

          {/* Footer with Meta Info and Actions */}
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
                <GetAppIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {story.downloadCount || '0'} downloads
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Like & Share Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <LikeButtonCard
                  liked={isLiked}
                  onClick={handleLike}
                  title={isLiked ? 'Unlike' : 'Like'}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {isLiked ? <FavoriteIcon sx={{ fontSize: 16 }} /> : <FavoriteBorderIcon sx={{ fontSize: 16 }} />}
                    <Typography variant="caption" fontWeight={600}>
                      {likes}
                    </Typography>
                  </Box>
                </LikeButtonCard>

                <IconButton
                  onClick={handleShare}
                  sx={{
                    color: theme.palette.secondary.main,
                    '&:hover': {
                      background: `${theme.palette.secondary.main}15`,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  title="Share"
                >
                  <ShareIcon />
                </IconButton>
              </Box>

              {/* Download Button */}
              <Button
                variant="contained"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                disabled={isDownloading}
                sx={{
                  background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}CC)`,
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  fontSize: '0.8rem',
                  textTransform: 'none',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${categoryColor}DD, ${categoryColor}AA)`,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 15px ${categoryColor}40`,
                  },
                  '&:disabled': {
                    background: theme.palette.grey[400],
                    color: theme.palette.grey[600],
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isDownloading ? 'Downloading...' : 'Download'}
              </Button>
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

export default ResourceCard;
