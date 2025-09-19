// src/components/Solutions/index.js
import React from 'react';
import Hero from './Hero';
import SolutionsShowcase from './SolutionsShowcase.jsx';

const Solutions = () => {
  return (
    <>
      <Hero />
      <SolutionsShowcase/>
      {/* Additional components for the solutions page can be added here */}
    </>
  );
};

export default Solutions;