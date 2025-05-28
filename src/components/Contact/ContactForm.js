// src/components/Contact/ContactForm.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  Grow,
  Alert,
  Snackbar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ContactForm = ({ visibleElements }) => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSnackbar({
      open: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      severity: 'success'
    });
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: ''
    });
  };

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 2,
      height: 56, // Consistent height for all input fields
      '& fieldset': {
        borderColor: 'rgba(26, 201, 159, 0.3)',
        borderWidth: 2,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        boxShadow: `0 0 0 1px ${theme.palette.primary.main}30`,
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
      fontWeight: 500,
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '16px 14px',
    },
    // Special styling for multiline textarea
    '&.message-field .MuiOutlinedInput-root': {
      height: 'auto',
      '& .MuiOutlinedInput-input': {
        padding: '16px 14px',
        minHeight: 10,
      },
    },
  };

  return (
    <>
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(26, 201, 159, 0.1)',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          height: 'fit-content',
            width: { xs: '100%', md: 1000 },
          opacity: mounted && visibleElements.form ? 1 : 0,
          transform: mounted && visibleElements.form ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}03, ${theme.palette.secondary.main}03)`,
            pointerEvents: 'none',
          },
          '&:hover': {
            borderColor: 'rgba(26, 201, 159, 0.2)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 5,
                color: theme.palette.text.primary,
                position: 'relative',
                zIndex: 1,
                fontSize: { xs: '2rem', md: '2.5rem' },
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              Send us a Message
            </Typography>

            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              sx={{ 
                position: 'relative', 
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              {/* Full Name Field */}
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={textFieldStyle}
              />

              {/* Email Address Field */}
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={textFieldStyle}
              />

              {/* Company Name Field */}
              <TextField
                fullWidth
                label="Company Name"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                variant="outlined"
                sx={textFieldStyle}
              />

              {/* Subject Field */}
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={textFieldStyle}
              />

              {/* Message Field */}
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                required
                variant="outlined"
                className="message-field"
                sx={textFieldStyle}
              />

              {/* Submit Button */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: { xs: 'center', md: 'flex-start' },
                mt: 2
              }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={<SendIcon />}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    px: 6,
                    py: 2.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 30,
                    boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    minWidth: 200,
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: `0 12px 35px ${theme.palette.primary.main}60`,
                    }
                  }}
                >
                  Send Message
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactForm;