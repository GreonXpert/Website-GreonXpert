// src/pages/HomePage.jsx
import React from 'react';
import { Box } from '@mui/material';
import Hero from '../components/Home/Hero/Hero';
import TrustedByLeaders from '../components/Home/TrustedByLeaders/TrustedByLeaders';
import PoweredByScience from '../components/Home/PoweredByScience';

const HomePage = () => {
  return (
    <Box>
      <Hero />
      <TrustedByLeaders/>
      <PoweredByScience/>
      {/* Other sections will be added here later */}
    </Box>
  );
};

export default HomePage;