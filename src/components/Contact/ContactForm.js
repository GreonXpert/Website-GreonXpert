// src/components/Contact/ContactForm.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  useTheme,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { keyframes } from '@emotion/react';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { API_BASE } from '../../utils/api';

// Enhanced animations
const shimmerEffect = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;


const API_URL = `${API_BASE}/api`;

const ContactForm = ({ visibleElements }) => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
    subject: '',
    message: '',
    inquiryType: 'general',
    priority: 'medium'
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields correctly.',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('📝 Submitting contact form...');
      
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        designation: formData.designation.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        inquiryType: formData.inquiryType,
        priority: formData.priority
      };

      const response = await axios.post(`${API_URL}/contact-forms`, submitData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.success) {
        console.log('✅ Contact form submitted successfully');
        
        setSnackbar({
          open: true,
          message: response.data.message || 'Thank you for your message! We\'ll get back to you soon.',
          severity: 'success'
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          designation: '',
          subject: '',
          message: '',
          inquiryType: 'general',
          priority: 'medium'
        });
        
        setErrors({});
      } else {
        throw new Error(response.data?.message || 'Submission failed');
      }
      
    } catch (error) {
      console.error('❌ Contact form submission error:', error);
      
      let errorMessage = 'Sorry, there was an error sending your message. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 3,
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      '& fieldset': {
        borderColor: 'rgba(26, 201, 159, 0.3)',
        borderWidth: 2,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        boxShadow: `0 0 10px ${theme.palette.primary.main}20`,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: 3,
        boxShadow: `0 0 20px ${theme.palette.primary.main}30`,
      },
      '&.Mui-error fieldset': {
        borderColor: theme.palette.error.main,
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
      fontWeight: 600,
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
      '&.Mui-error': {
        color: theme.palette.error.main,
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '16px 14px',
      fontSize: '1rem',
    },
  };

  return (
    <>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 600, md: 700, lg: 800 },
          background: isHovered 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(25px)',
          borderRadius: 4,
          border: isHovered 
            ? `3px solid ${theme.palette.primary.main}` 
            : '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: isHovered
            ? `0 25px 50px rgba(26, 201, 159, 0.15), 0 0 0 1px ${theme.palette.primary.main}20`
            : '0 20px 40px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isHovered 
              ? `linear-gradient(135deg, ${theme.palette.primary.main}08, transparent, ${theme.palette.secondary.main}08)`
              : 'none',
            animation: isHovered ? `${shimmerEffect} 3s linear infinite` : 'none',
            pointerEvents: 'none',
          }
        }}
      >
        <CardContent sx={{ p: { xs: 4, md: 6 } }}>
          {/* Form Title */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: theme.palette.text.primary,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
              textAlign: 'center',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Send us a Message
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              textAlign: 'center',
              mb: 5,
              fontSize: '1.1rem',
              lineHeight: 1.6,
            }}
          >
            Let's discuss how we can help transform your sustainability journey
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {/* Name and Email Row */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
              }}
            >
              <TextField
                label="Full Name *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
                error={!!errors.name}
                helperText={errors.name}
                variant="outlined"
                sx={textFieldStyle}
              />
              
              <TextField
                label="Email Address *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
                sx={textFieldStyle}
              />
            </Box>

            {/* Phone and Company Row */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
              }}
            >
              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={loading}
                variant="outlined"
                sx={textFieldStyle}
              />
              
              <TextField
                label="Company Name"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                disabled={loading}
                variant="outlined"
                sx={textFieldStyle}
              />
            </Box>

            {/* Designation and Subject Row */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
              }}
            >
              <TextField
                label="Designation/Title"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                disabled={loading}
                variant="outlined"
                sx={textFieldStyle}
              />
              
              <TextField
                label="Subject *"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                disabled={loading}
                error={!!errors.subject}
                helperText={errors.subject}
                variant="outlined"
                sx={textFieldStyle}
              />
            </Box>

            {/* Message Field */}
            <TextField
              label="Message *"
              name="message"
              multiline
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              required
              disabled={loading}
              error={!!errors.message}
              helperText={errors.message}
              variant="outlined"
              sx={{
                ...textFieldStyle,
                '& .MuiOutlinedInput-root': {
                  ...textFieldStyle['& .MuiOutlinedInput-root'],
                  height: 'auto',
                }
              }}
            />

            {/* Submit Button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mt: 3
            }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                sx={{
                  background: loading 
                    ? 'rgba(0, 0, 0, 0.12)'
                    : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  px: { xs: 4, md: 8 },
                  py: { xs: 2, md: 2.5 },
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 700,
                  borderRadius: 50,
                  boxShadow: loading 
                    ? 'none'
                    : `0 10px 30px ${theme.palette.primary.main}40`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  minWidth: { xs: 180, md: 220 },
                  position: 'relative',
                  overflow: 'hidden',
                  
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
                  
                  '&:hover:not(:disabled)': {
                    transform: 'translateY(-3px) scale(1.05)',
                    boxShadow: `0 15px 40px ${theme.palette.primary.main}60`,
                    
                    '&::before': {
                      left: '100%',
                    }
                  },

                  '&:disabled': {
                    color: 'rgba(0, 0, 0, 0.26)',
                    cursor: 'not-allowed',
                  }
                }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar for form submission feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 3,
            boxShadow: `0 10px 30px ${theme.palette.primary.main}30`,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactForm;
