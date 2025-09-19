// website/src/components/Company/index.js
import React from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';

import CompanyHero from './Hero';
import Journey from './Journey'; // Import the new Journey component
import AboutUs from './About';
import Teams from './Teams';

const Company = () => {
  return (
    <Box>
        <AboutUs />
      <CompanyHero />
            

      <Journey />
      <Teams />
      {/* Placeholder for additional company content sections */}
     
    </Box>
  );
};

export default Company;
