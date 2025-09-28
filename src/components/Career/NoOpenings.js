import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import { keyframes } from '@emotion/react';

const glitterAnimation = keyframes`
  0% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 rgba(255,255,255,0.4); }
  25% { transform: scale(1.05) rotate(2deg); box-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(26, 201, 159, 0.4); }
  50% { transform: scale(1.1) rotate(-1deg); box-shadow: 0 0 30px rgba(255,255,255,1), 0 0 40px rgba(26, 201, 159, 0.6); }
  75% { transform: scale(1.05) rotate(1deg); box-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(26, 201, 159, 0.4); }
  100% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 rgba(255,255,255,0.4); }
`;

const NoOpenings = ({ onNotifyClick }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
        border: `2px solid ${theme.palette.primary.main}20`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`,
          animation: `${glitterAnimation} 4s ease-in-out infinite`,
        }}
      />
      
      <WorkIcon 
        sx={{ 
          fontSize: 64, 
          color: theme.palette.primary.main, 
          mb: 3,
          opacity: 0.7
        }} 
      />
      
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: theme.palette.primary.main,
          mb: 2,
        }}
      >
        No Current Openings
      </Typography>
      
      <Typography
        variant="body1"
        color="text.secondary"
        paragraph
        sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.8, mb: 4 }}
      >
        We don't have any open positions right now, but we're always looking for talented individuals 
        who are passionate about environmental technology and sustainability. Submit your details below 
        and we'll reach out when suitable opportunities arise.
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={onNotifyClick}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 3,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
          },
          transition: 'all 0.3s ease',
        }}
      >
        Notify Me of Future Openings
      </Button>
    </Paper>
  );
};

export default NoOpenings;
