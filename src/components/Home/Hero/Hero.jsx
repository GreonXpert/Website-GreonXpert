// src/components/Hero/Hero.jsx
import React, { useState, useEffect } from 'react';
import HeroContent from './HeroContent';
import ThreeJSGlobe from './ThreeJSGlobe';
import EmissionsChart from './EmissionsChart';

const Hero = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive breakpoints
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(26, 201, 159, 0.05) 0%, rgba(30, 101, 101, 0.1) 100%)',
    }}>
      {/* 3D Globe Background */}
      <ThreeJSGlobe />
      
      {/* Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '20px 16px' : '40px 24px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'center' : 'center',
        gap: isMobile ? '40px' : '32px',
        minHeight: '100vh',
        justifyContent: 'center',
      }}>
        {/* Hero Content */}
        <div style={{
          flex: isMobile ? 'none' : isTablet ? '1 1 55%' : '1 1 60%',
          maxWidth: isMobile ? '100%' : isTablet ? '55%' : '60%',
          width: isMobile ? '100%' : 'auto',
          textAlign: isMobile ? 'center' : 'left',
        }}>
          <HeroContent />
        </div>

        {/* Emissions Chart */}
        <div style={{
          flex: isMobile ? 'none' : isTablet ? '1 1 45%' : '1 1 40%',
          maxWidth: isMobile ? '100%' : isTablet ? '45%' : '40%',
          width: isMobile ? '100%' : 'auto',
          height: isMobile ? '600px' : isTablet ? '480px' : '500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            width: isMobile ? '100%' : isTablet ? '100%' : '100%',
            height: '100%',
            maxWidth: isMobile ? '500px' : 'none',
          }}>
            <EmissionsChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;