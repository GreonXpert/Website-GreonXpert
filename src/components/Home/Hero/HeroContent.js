// src/components/Hero/HeroContent.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroContent = () => {
  const navigate = useNavigate();

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive breakpoints
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  return (
    <div
      style={{
        width: '100%',
        textAlign: isMobile ? 'center' : 'left',
      }}
    >
      {/* Micro Heading */}
      <div
        style={{
          color: '#1AC99F',
          fontWeight: 600,
          letterSpacing: '2px',
          marginBottom: isMobile ? '12px' : isTablet ? '14px' : '16px',
          fontSize: isMobile ? '12px' : isTablet ? '13px' : '14px',
          textTransform: 'uppercase',
        }}
      >
        AI-POWERED SUSTAINABILITY
      </div>

      {/* Main Heading */}
      <h1
        style={{
          fontWeight: 700,
          fontSize: isMobile
            ? 'clamp(2rem, 8vw, 2.5rem)'
            : isTablet
            ? 'clamp(2.5rem, 6vw, 3.5rem)'
            : 'clamp(2.5rem, 5vw, 4rem)',
          lineHeight: 1.1,
          marginBottom: isMobile ? '16px' : isTablet ? '20px' : '24px',
          color: '#212529',
          margin: isMobile ? '0 0 16px 0' : isTablet ? '0 0 20px 0' : '0 0 24px 0',
        }}
      >
        Green today, greater{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #1AC99F 0%, #2E8B8B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          tomorrow
        </span>
      </h1>

      {/* Subtitle */}
      <h2
        style={{
          color: '#6c757d',
          fontWeight: 500,
          marginBottom: isMobile ? '16px' : isTablet ? '20px' : '24px',
          fontSize: isMobile
            ? 'clamp(1rem, 4vw, 1.125rem)'
            : isTablet
            ? 'clamp(1.125rem, 3vw, 1.25rem)'
            : 'clamp(1.125rem, 2.5vw, 1.25rem)',
          lineHeight: 1.4,
          margin: isMobile ? '0 0 16px 0' : isTablet ? '0 0 20px 0' : '0 0 24px 0',
        }}
      >
        One platform, Real progress – Track, Improve and Lead with one Powerful solution
      </h2>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: isMobile ? '12px' : '16px',
          marginBottom: isMobile ? '24px' : isTablet ? '28px' : '32px',
          flexWrap: 'wrap',
          justifyContent: isMobile ? 'center' : 'flex-start',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'flex-start',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/contact-us')}
          style={{
            padding: isMobile ? '14px 40px' : isTablet ? '13px 36px' : '12px 32px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '30px',
            border: 'none',
            background: 'linear-gradient(135deg, #1AC99F 0%, #2E8B8B 100%)',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0px 8px 24px rgba(26, 201, 159, 0.3)',
            transition: 'all 0.3s ease',
            width: isMobile ? '250px' : 'auto',
            maxWidth: isMobile ? '90%' : 'none',
          }}
        >
          Get Started
        </button>

        <button
          type="button"
          onClick={() => navigate('/solutions')}
          style={{
            padding: isMobile ? '14px 40px' : isTablet ? '13px 36px' : '12px 32px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '30px',
            border: '2px solid #1AC99F',
            background: 'transparent',
            color: '#1AC99F',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: isMobile ? '250px' : 'auto',
            maxWidth: isMobile ? '90%' : 'none',
          }}
        >
          Learn More
        </button>
      </div>

      {/* Additional Info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '20px' : isTablet ? '22px' : '24px',
          flexWrap: 'wrap',
          justifyContent: isMobile ? 'center' : 'flex-start',
          flexDirection: 'row',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              color: '#1AC99F',
              fontWeight: 700,
              fontSize: isMobile ? '18px' : isTablet ? '19px' : '20px',
            }}
          >
            10+
          </div>
          <div
            style={{
              color: '#6c757d',
              fontSize: isMobile ? '11px' : '12px',
            }}
          >
            Companies Trust Us
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              color: '#1AC99F',
              fontWeight: 700,
              fontSize: isMobile ? '18px' : isTablet ? '19px' : '20px',
            }}
          >
            99.9%
          </div>
          <div
            style={{
              color: '#6c757d',
              fontSize: isMobile ? '11px' : '12px',
            }}
          >
            Data Accuracy
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              color: '#1AC99F',
              fontWeight: 700,
              fontSize: isMobile ? '18px' : isTablet ? '19px' : '20px',
            }}
          >
            24/7
          </div>
          <div
            style={{
              color: '#6c757d',
              fontSize: isMobile ? '11px' : '12px',
            }}
          >
            Real-time Monitoring
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
