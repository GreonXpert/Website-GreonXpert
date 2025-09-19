// website/src/pages/CompanyPage.jsx
import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import Company from '../components/Company';

/* ===================== Background Animations ===================== */
// Floating animation
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(-5px) rotate(-1deg); }
`;

// Pulse animation
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Shimmer animation
const shimmerAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Rotate animation
const rotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CompanyPage = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: `linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f0fdfb 100%)`,
      }}
    >
      {/* Animated Background Elements */}
      
      {/* Main floating orb - top right */}
      <Box
        sx={{
          position: 'fixed',
          top: '10%',
          right: '5%',
          width: { xs: 200, md: 300 },
          height: { xs: 200, md: 300 },
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(26, 201, 159, 0.12), transparent 70%)`,
          animation: `${floatAnimation} 8s ease-in-out infinite`,
          filter: 'blur(1px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      
      {/* Secondary floating orb - bottom left */}
      <Box
        sx={{
          position: 'fixed',
          bottom: '15%',
          left: '8%',
          width: { xs: 150, md: 220 },
          height: { xs: 150, md: 220 },
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(78, 205, 196, 0.10), transparent 60%)`,
          animation: `${floatAnimation} 12s ease-in-out infinite reverse`,
          filter: 'blur(2px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Additional floating orb - middle */}
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          right: '15%',
          width: { xs: 120, md: 180 },
          height: { xs: 120, md: 180 },
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(26, 201, 159, 0.08), transparent 65%)`,
          animation: `${floatAnimation} 15s ease-in-out infinite`,
          filter: 'blur(1.5px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Small floating dots */}
      <Box
        sx={{
          position: 'fixed',
          top: '30%',
          left: '20%',
          width: 6,
          height: 6,
          bgcolor: '#1AC99F',
          borderRadius: '50%',
          animation: `${pulseAnimation} 3s ease-in-out infinite`,
          opacity: 0.6,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      
      <Box
        sx={{
          position: 'fixed',
          top: '70%',
          right: '25%',
          width: 4,
          height: 4,
          bgcolor: '#4ECDC4',
          borderRadius: '50%',
          animation: `${pulseAnimation} 4s ease-in-out infinite`,
          opacity: 0.5,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'fixed',
          top: '45%',
          left: '10%',
          width: 8,
          height: 8,
          bgcolor: '#1AC99F',
          borderRadius: '50%',
          animation: `${pulseAnimation} 5s ease-in-out infinite`,
          opacity: 0.4,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Rotating rings */}
      <Box
        sx={{
          position: 'fixed',
          top: '25%',
          right: '30%',
          width: { xs: 80, md: 120 },
          height: { xs: 80, md: 120 },
          border: '1px solid rgba(26, 201, 159, 0.15)',
          borderRadius: '50%',
          animation: `${rotateAnimation} 25s linear infinite`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      
      <Box
        sx={{
          position: 'fixed',
          bottom: '30%',
          left: '25%',
          width: { xs: 60, md: 90 },
          height: { xs: 60, md: 90 },
          border: '1px solid rgba(78, 205, 196, 0.20)',
          borderRadius: '50%',
          animation: `${rotateAnimation} 20s linear infinite reverse`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'fixed',
          top: '60%',
          right: '10%',
          width: { xs: 40, md: 70 },
          height: { xs: 40, md: 70 },
          border: '1px solid rgba(26, 201, 159, 0.25)',
          borderRadius: '50%',
          animation: `${rotateAnimation} 18s linear infinite`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle shimmer overlay */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          background: `linear-gradient(90deg, transparent, rgba(26, 201, 159, 0.03), transparent)`,
          animation: `${shimmerAnimation} 8s ease-in-out infinite`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Gradient wave overlay for depth */}
      <Box
        sx={{
          position: 'fixed',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '120%', md: '100%' },
          height: { xs: '120%', md: '100%' },
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(26, 201, 159, 0.02) 60%, transparent 80%)`,
          animation: `${floatAnimation} 20s ease-in-out infinite`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content Container */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Company />
      </Box>
    </Box>
  );
};

export default CompanyPage;
