// src/components/Contact/ContactInformation.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  IconButton,
  Zoom,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

// Enhanced animations
const floatAnimation = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
  }
  25% { 
    transform: translateY(-15px) rotate(1deg);
  }
  50% { 
    transform: translateY(-25px) rotate(0deg);
  }
  75% { 
    transform: translateY(-15px) rotate(-1deg);
  }
`;

const pulseAnimation = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
`;

const shimmerEffect = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const glowAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(26, 201, 159, 0.3); }
  50% { box-shadow: 0 0 30px rgba(26, 201, 159, 0.6), 0 0 40px rgba(26, 201, 159, 0.4); }
`;

const socialHover = keyframes`
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(-5deg); }
  75% { transform: scale(1.1) rotate(5deg); }
`;

// Contact Info Card Component
const ContactInfoCard = ({ icon, title, info, delay, color }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay + 100);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Zoom in={isVisible} timeout={800}>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          background: isHovered 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: isHovered 
            ? `3px solid ${color}` 
            : '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 4,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          animation: `${floatAnimation} ${6 + delay * 0.5}s ease-in-out infinite`,
          cursor: 'pointer',
          minWidth: { xs: 280, sm: 320 },
          maxWidth: 350,
          
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-200px',
            width: '200px',
            height: '100%',
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
            animation: isHovered ? `${shimmerEffect} 1.5s ease-out` : 'none',
          },
          
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderRadius: 4,
            background: isHovered 
              ? `linear-gradient(45deg, ${color}, transparent, ${color})` 
              : 'none',
            zIndex: -1,
            animation: isHovered ? `${glowAnimation} 2s ease-in-out infinite` : 'none',
          },
          
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: `0 15px 40px ${color}25, 0 0 0 1px ${color}20`,
          }
        }}
      >
        <CardContent 
          sx={{ 
            textAlign: 'center',
            p: { xs: 3, md: 4 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              mb: 2,
              transform: isHovered ? 'scale(1.2) rotate(10deg)' : 'scale(1)',
              transition: 'all 0.3s ease',
              filter: `drop-shadow(0 0 15px ${color}60)`,
            }}
          >
            {React.cloneElement(icon, {
              sx: { fontSize: { xs: 36, md: 42 }, color: color }
            })}
          </Box>
          
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1.5,
              fontSize: { xs: '1.3rem', md: '1.5rem' },
            }}
          >
            {title}
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              lineHeight: 1.6,
              fontSize: { xs: '0.95rem', md: '1rem' },
              whiteSpace: 'pre-line',
            }}
          >
            {info}
          </Typography>
        </CardContent>
      </Card>
    </Zoom>
  );
};

const ContactInformation = ({ visibleElements, displayMode = 'all' }) => {
  const theme = useTheme();
  
  const contactInfo = [
    {
      icon: <LocationOnIcon />,
      title: 'Visit Us',
      info: 'Greon Xpert Pvt Ltd, Door No. 230/A6, Pallath Heights, Fact Road, Kalamassery, Kanayannur, Ernakulam 683104',
      color: '#1AC99F',
      delay: 0
    },
    {
      icon: <PhoneIcon />,
      title: 'Call Us',
      info: '+91 98460 70403\nMon - Fri: 9:00 AM - 6:00 PM\nSat: 9:00 AM - 2:00 PM',
      color: '#2E8B8B',
      delay: 200
    },
    {
      icon: <EmailIcon />,
      title: 'Email Us',
      info: 'info@greonxpert.com',
      color: '#3498db',
      delay: 400
    }
  ];

  const socialMedia = [
    { icon: <LinkedInIcon />, color: '#0077B5', name: 'LinkedIn' },
    { icon: <TwitterIcon />, color: '#1DA1F2', name: 'Twitter' },
    { icon: <FacebookIcon />, color: '#1877F2', name: 'Facebook' },
    { icon: <InstagramIcon />, color: '#E4405F', name: 'Instagram' }
  ];

  if (displayMode === 'cards') {
    return (
      <Box>
        {/* Contact Info Cards in Flex Row */}
        <Box
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: { xs: 3, md: 4 },
            flexWrap: 'wrap',
            px: 2,
          }}
        >
          {contactInfo.map((info, index) => (
            <ContactInfoCard
              key={index}
              icon={info.icon}
              title={info.title}
              info={info.info}
              color={info.color}
              delay={info.delay}
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (displayMode === 'social') {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 4,
            fontSize: { xs: '1.8rem', md: '2.2rem' },
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Follow Us
        </Typography>
        
        <Box
          sx={{ 
            display: 'flex', 
            gap: 3, 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          {socialMedia.map((social, index) => (
            <Zoom key={index} in timeout={1000 + index * 200}>
              <IconButton
                sx={{
                  width: { xs: 60, md: 70 },
                  height: { xs: 60, md: 70 },
                  background: `linear-gradient(135deg, ${social.color}20, ${social.color}10)`,
                  border: `3px solid ${social.color}40`,
                  color: social.color,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  animation: `${floatAnimation} ${4 + index}s ease-in-out infinite`,
                  
                  '&:hover': {
                    background: `linear-gradient(135deg, ${social.color}40, ${social.color}20)`,
                    border: `3px solid ${social.color}`,
                    transform: 'translateY(-5px) scale(1.1)',
                    boxShadow: `0 10px 25px ${social.color}30`,
                    animation: `${socialHover} 0.6s ease-in-out`,
                  }
                }}
                title={social.name}
              >
                {React.cloneElement(social.icon, {
                  sx: { fontSize: { xs: 28, md: 32 } }
                })}
              </IconButton>
            </Zoom>
          ))}
        </Box>
      </Box>
    );
  }

  // Default: show all (for backward compatibility)
  return (
    <Box>
      {/* Contact Info Cards */}
      <Box
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: { xs: 3, md: 4 },
          flexWrap: 'wrap',
          mb: 6,
        }}
      >
        {contactInfo.map((info, index) => (
          <ContactInfoCard key={index} {...info} />
        ))}
      </Box>

      {/* Social Media Links */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Follow Us
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          {socialMedia.map((social, index) => (
            <IconButton key={index} sx={{ color: social.color }}>
              {social.icon}
            </IconButton>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ContactInformation;
