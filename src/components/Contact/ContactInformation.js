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
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        animation: `${floatAnimation} ${6 + delay * 0.5}s ease-in-out infinite`,
        cursor: 'pointer',
        minHeight: { xs: 'auto', lg: 140 },
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
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
        '&:hover': {
          transform: 'translateY(-5px) scale(1.02)',
          border: `2px solid ${color}`,
          animation: `${glowAnimation} 2s ease-in-out infinite`,
          boxShadow: `0 10px 30px ${color}20`,
        }
      }}
    >
        <CardContent 
          sx={{ 
            p: { xs: 3, md: 4 }, 
            display: 'flex', 
            alignItems: 'center',
            gap: { xs: 2, md: 3 },
            height: '100%',
            flexDirection: { xs: 'column', sm: 'row', lg: 'column', xl: 'row' },
            textAlign: { xs: 'center', sm: 'left', lg: 'center', xl: 'left' },
          }}
        >
          <Box
            sx={{
              p: { xs: 1.5, md: 2 },
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${color}15, ${color}25)`,
              border: `2px solid ${color}30`,
              transition: 'all 0.3s ease',
              animation: isHovered ? `${pulseAnimation} 1s ease-in-out infinite` : 'none',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 60, md: 70 },
              height: { xs: 60, md: 70 },
            }}
          >
            {React.cloneElement(icon, { 
              sx: { fontSize: { xs: 28, md: 32 }, color: color }
            })}
          </Box>
          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: theme.palette.text.primary,
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.5,
                fontSize: { xs: '0.85rem', md: '0.9rem' },
                whiteSpace: 'pre-line',
              }}
            >
              {info}
            </Typography>
          </Box>
        </CardContent>
      </Card>
  );
};

const ContactInformation = ({ visibleElements }) => {
  const theme = useTheme();

  const contactInfo = [
    {
      icon: <LocationOnIcon />,
      title: 'Visit Us',
      info: 'GreonXpert Pvt Ltd.\nKalamassery, Ernakulam\nKerala, India',
      color: '#1AC99F',
      delay: 0
    },
    {
      icon: <PhoneIcon />,
      title: 'Call Us',
      info: '+91 77365 38040\nMon - Fri: 9:00 AM - 6:00 PM\nSat: 9:00 AM - 2:00 PM',
      color: '#2E8B8B',
      delay: 200
    },
    {
      icon: <EmailIcon />,
      title: 'Email Us',
      info: 'info@greonXpert.com\nsupport@greonXpert.com\ncareers@greonXpert.com',
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

  return (
    <Box sx={{ height: '100%' }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mb: 6,
          color: theme.palette.text.primary,
          textAlign: { xs: 'center', lg: 'left' },
          fontSize: { xs: '2rem', md: '2.5rem', lg: '2.2rem' },
        }}
      >
        Contact Information
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mb: 6 }}>
        {contactInfo.map((info, index) => (
          <ContactInfoCard key={index} {...info} />
        ))}
      </Box>

      {/* Social Media Links */}
      <Box
        sx={{
          textAlign: { xs: 'center', lg: 'left' },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: theme.palette.text.primary,
            fontSize: { xs: '1.2rem', md: '1.3rem' },
          }}
        >
          Follow Us
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: { xs: 'center', lg: 'flex-start' },
          flexWrap: 'wrap'
        }}>
          {socialMedia.map((social, index) => (
            <IconButton
              key={index}
              aria-label={social.name}
              sx={{
                background: `${social.color}15`,
                border: `2px solid ${social.color}30`,
                color: social.color,
                width: 55,
                height: 55,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: social.color,
                  color: 'white',
                  transform: 'translateY(-3px) scale(1.1)',
                  boxShadow: `0 8px 20px ${social.color}40`,
                }
              }}
            >
              {social.icon}
            </IconButton>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ContactInformation;