// src/components/Footer/index.js
import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  // SEO-friendly routes
  const QUICK_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/company' },
    { label: 'Services', to: '/solutions' },
    { label: 'Careers', to: '/careers' },       // ← added
    { label: 'Contact', to: '/contact-us' },
    { label: 'FAQ', to: '/faq' },
  ];

  const LEGAL_LINKS = [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Cookie Policy', to: '/cookie-policy' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        pt: 6,
        pb: 6,
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              GreonXpert
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We build AI + IoT climate software and consulting to help companies measure, report, and reduce carbon—fast.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="primary" aria-label="facebook" component="a" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="twitter" component="a" href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="instagram" component="a" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" aria-label="linkedin" component="a" href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              {QUICK_LINKS.map((item) => (
                <Link
                  key={item.label}
                  component={RouterLink}
                  to={item.to}
                  color="text.secondary"
                  variant="body2"
                  sx={{
                    display: 'block',
                    mb: 1,
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Box>
              {LEGAL_LINKS.map((item) => (
                <Link
                  key={item.label}
                  component={RouterLink}
                  to={item.to}
                  color="text.secondary"
                  variant="body2"
                  sx={{
                    display: 'block',
                    mb: 1,
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Greon Xpert Pvt Ltd, Door No. 230/A6, Pallath Heights, Fact Road, Kalamassery, Kanayannur, Ernakulam 683104
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Email: info@greonXpert.com
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Phone: +91 98460 70403
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}{' '}
          <Link component={RouterLink} color="inherit" to="/">
            GreonXpert
          </Link>
          {'. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
