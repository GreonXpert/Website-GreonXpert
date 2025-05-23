// src/pages/HomePage.jsx
import React from 'react';
import { Box } from '@mui/material';
import Hero from '../components/Home/Hero/Hero';
import TrustedByLeaders from '../components/Home/TrustedByLeaders/TrustedByLeaders';

const HomePage = () => {
  return (
    <Box>
      <Hero />
      <TrustedByLeaders/>
      {/* Other sections will be added here later */}
    </Box>
  );
};

export default HomePage;