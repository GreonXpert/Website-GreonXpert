import React from 'react';
import {
  Card, CardContent, CardMedia, Typography, Box, Chip, Button, Grow,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StarIcon from '@mui/icons-material/Star';
import { keyframes } from '@emotion/react';

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
`;

const JobCard = ({ job, index, onJobClick }) => {
  const theme = useTheme();

  // Get first 3 words from description
  const getShortDescription = (description) => {
    const words = description.split(' ').slice(0, 3).join(' ');
    return words + '...';
  };

  // Format salary range if it exists
  const formatSalaryRange = (salaryRange) => {
    if (!salaryRange || typeof salaryRange !== 'object') return null;
    const { min, max, currency = 'INR' } = salaryRange;
    if (!min && !max) return null;
    if (min && max) return `${currency} ${Number(min).toLocaleString()} - ${Number(max).toLocaleString()}`;
    if (min) return `${currency} ${Number(min).toLocaleString()}+`;
    if (max) return `Up to ${currency} ${Number(max).toLocaleString()}`;
    return null;
  };

  return (
    <Grow in timeout={1000 + index * 150}>
      <Card
        sx={{
          height: 380, // Slightly increased height for salary info
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          boxShadow: `0 8px 32px ${theme.palette.primary.main}08`,
          border: `1px solid ${theme.palette.primary.main}20`,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          animation: `${floatAnimation} 6s ease-in-out infinite`,
          animationDelay: `${index * 0.5}s`,
          '&:hover': {
            transform: 'translateY(-12px) scale(1.02)',
            boxShadow: `0 20px 60px ${theme.palette.primary.main}25`,
            '& .job-card-media': {
              transform: 'scale(1.05)',
            },
          },
        }}
        onClick={() => onJobClick(job)}
      >
        <CardMedia
          component="img"
          height={120}
          image={job.image}
          alt={job.jobRole}
          className="job-card-media"
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Featured Badge */}
          {job.featured && (
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <Chip
                icon={<StarIcon />}
                label="FEATURED"
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#333',
                  fontWeight: 700,
                  fontSize: '0.6rem'
                }}
              />
            </Box>
          )}

          {/* Job Role Title */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 1,
              fontSize: '1rem',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {job.jobRole}
          </Typography>

          {/* Short Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              fontSize: '0.8rem',
              fontStyle: 'italic',
              opacity: 0.7
            }}
          >
            {getShortDescription(job.jobDescription || job.shortDescription || '')}
          </Typography>

          {/* Job Details - Compact Layout */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 14, color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {job.location}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <ScheduleIcon sx={{ fontSize: 14, color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {job.jobType}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <StarIcon sx={{ fontSize: 14, color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {job.experienceRequired}
              </Typography>
            </Box>
          </Box>

          {/* Salary Range */}
          {formatSalaryRange(job.salaryRange) && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: theme.palette.secondary.main,
                  bgcolor: `${theme.palette.secondary.main}10`,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1
                }}
              >
                💰 {formatSalaryRange(job.salaryRange)}
              </Typography>
            </Box>
          )}

          {/* Skills - Show only 2 main skills */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2.5, alignItems: 'flex-start' }}>
            {job.skills?.slice(0, 2).map((skill, skillIndex) => (
              <Chip
                key={skillIndex}
                label={skill}
                size="small"
                sx={{
                  backgroundColor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                  fontSize: '0.65rem',
                  height: '20px'
                }}
              />
            ))}
            {job.skills?.length > 2 && (
              <Chip
                label={`+${job.skills.length - 2}`}
                size="small"
                sx={{
                  backgroundColor: `${theme.palette.secondary.main}15`,
                  color: theme.palette.secondary.main,
                  fontSize: '0.65rem',
                  height: '20px'
                }}
              />
            )}
          </Box>

          {/* Stats */}
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
              {job.applicationCount || 0} applications
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
              {job.viewCount || 0} views
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default JobCard;
