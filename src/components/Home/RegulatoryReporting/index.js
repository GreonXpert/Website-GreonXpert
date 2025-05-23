import React, { useState, useEffect } from 'react';
import {  CheckCircle } from 'lucide-react';

// Enhanced animations
const floatAnimation = `
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg);
    }
    25% { 
      transform: translateY(-12px) rotate(0.5deg);
    }
    50% { 
      transform: translateY(-20px) rotate(0deg);
    }
    75% { 
      transform: translateY(-12px) rotate(-0.5deg);
    }
  }
`;

const slideInFromLeft = `
  @keyframes slideInFromLeft {
    0% {
      opacity: 0;
      transform: translateX(-60px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const slideInFromBottom = `
  @keyframes slideInFromBottom {
    0% {
      opacity: 0;
      transform: translateY(40px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const scaleBreath = `
  @keyframes scaleBreath {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
`;

const blinkCursor = `
  @keyframes blinkCursor {
    0%, 50% { border-color: transparent; }
    51%, 100% { border-color: #1AC99F; }
  }
`;

const shimmer = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const pulse = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }
`;

// Typewriter Text Component
const TypewriterText = ({ text, delay = 0, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, isTyping]);

  return (
    <span>
      {displayText}
      {isTyping && currentIndex < text.length && (
        <span
          style={{
            borderRight: '2px solid #1AC99F',
            animation: 'blinkCursor 1s infinite',
          }}
        />
      )}
    </span>
  );
};

// Animated Word Reveal Component
const AnimatedWordReveal = ({ text, delay = 0 }) => {
  const [visibleWords, setVisibleWords] = useState(0);
  const words = text.split(' ');

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleWords(prev => {
          if (prev >= words.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 150);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [words.length, delay]);

  return (
    <span>
      {words.map((word, index) => (
        <span
          key={index}
          style={{
            opacity: index < visibleWords ? 1 : 0,
            transform: index < visibleWords ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            display: 'inline-block',
            marginRight: '0.3em',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
};



// Floating Particle Component
const FloatingParticle = ({ delay = 0, size = 4, color = '#1AC99F', top, left }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: top,
        left: left,
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        borderRadius: '50%',
        opacity: 0.6,
        animation: `float ${8 + Math.random() * 4}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        filter: `blur(${size > 6 ? 2 : 1}px)`,
      }}
    />
  );
};



const RegulatoryReporting = () => {
  const [visibleElements, setVisibleElements] = useState({});

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleElements(prev => ({ ...prev, header: true })), 300),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, subtitle: true })), 1000),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, description: true })), 1800),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, features: true })), 2500),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, cta: true })), 3200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

 



  return (
    <>
      <style>{`
        ${floatAnimation}
        ${slideInFromLeft}
        ${slideInFromBottom}
        ${scaleBreath}
        ${blinkCursor}
        ${shimmer}
        ${pulse}
        
        .floating-particle {
          animation: float 8s ease-in-out infinite;
        }
        
        .fade-in {
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
        }
        
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        
        .slide-in-left {
          animation: slideInFromLeft 1s ease-out;
        }
        
        .slide-in-bottom {
          animation: slideInFromBottom 1s ease-out;
        }
        
        .scale-breath {
          animation: scaleBreath 4s ease-in-out infinite;
        }

        .gradient-text {
          background: linear-gradient(135deg, #1AC99F, #2E8B8B);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hover-glow:hover {
          box-shadow: 0 0 30px rgba(26, 201, 159, 0.3);
        }
      `}</style>
      
      <div
        style={{
          padding: '4rem 0 6rem 0',
          background: `
            radial-gradient(circle at 15% 25%, rgba(26, 201, 159, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 85% 75%, rgba(46, 139, 139, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(52, 152, 219, 0.04) 0%, transparent 70%),
            linear-gradient(135deg, #f8f9fa 0%, rgba(248, 249, 250, 0.3) 100%)
          `,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
        }}
      >
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.5}
            size={Math.random() * 8 + 2}
            color={i % 3 === 0 ? '#1AC99F' : i % 3 === 1 ? '#3498db' : '#e74c3c'}
            top={`${Math.random() * 100}%`}
            left={`${Math.random() * 100}%`}
          />
        ))}

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            {/* Badge */}
            <div
              style={{
                opacity: visibleElements.header ? 1 : 0,
                transform: visibleElements.header ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease-out',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, rgba(26, 201, 159, 0.1), rgba(46, 139, 139, 0.1))',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '50px',
                  border: '1px solid rgba(26, 201, 159, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <CheckCircle size={16} style={{ color: '#1AC99F' }} />
                <span style={{ color: '#1AC99F', fontWeight: 600, fontSize: '0.9rem' }}>
                  Regulatory Reporting
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                color: '#1e293b',
                letterSpacing: '-0.02em',
              }}
            >
              <TypewriterText text=" GLOBAL CLIMATE COMPLIANCE" delay={500} speed={80} />
              <br />
              <span className="gradient-text">
                <TypewriterText text="Reporting Made Effortless" delay={2500} speed={80} />
              </span>
            </h1>

            {/* Subtitle */}
            <div
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                color: '#64748b',
                marginBottom: '3rem',
                maxWidth: '600px',
                margin: '0 auto 3rem auto',
                lineHeight: 1.6,
              }}
            >
              <AnimatedWordReveal 
                text="Report with confidence every time. Our 
tools—designed by engineers, climate scientists, and data experts—
 help leading companies stay ahead of climate disclosure and evolving 
regulations"
                delay={3500}
              />
            </div>

        


         
          </div>

          
          
        </div>
      </div>
    </>
  );
};

export default RegulatoryReporting;