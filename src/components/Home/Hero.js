// src/components/Home/index.js
import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardMedia
} from '@mui/material';

const HomeComponent = () => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper', 
          pt: { xs: 8, md: 12 }, 
          pb: { xs: 8, md: 12 }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h2"
                color="text.primary"
                gutterBottom
              >
                Welcome to Our Website
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                paragraph
                sx={{ mb: 4 }}
              >
                A short and engaging description of what we do. This is where we capture 
                the attention of visitors and explain our value proposition.
              </Typography>
              <Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  size="large"
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: { xs: '300px', md: '400px' },
                  width: '100%',
                  bgcolor: 'grey.200',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Hero Image Placeholder
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      
    </Box>
  );
};

export default HomeComponent;