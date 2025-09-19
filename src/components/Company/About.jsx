import React from 'react';
import { Box, Container, Typography, IconButton } from '@mui/material';
import { keyframes } from '@emotion/react';
import { motion, useMotionValue, useTransform, useInView, animate } from 'framer-motion';
import { ArrowForward } from '@mui/icons-material';
import background1 from '../../assests/About/background-4.jpg';
import background2 from '../../assests/About/background-2.jpg';
import background3 from '../../assests/About/background-3.jpg';

// Keyframes for background color transition
const fadeToBlack = keyframes`
  from { background-color: #00000000; }
  to { background-color: #000000; }
`;

// Background image transition keyframes
const backgroundSlide = keyframes`
  0% { opacity: 1, transform: scale(1); }
  33.33% { opacity: 1, transform: scale(1.1); }
  66.66% { opacity: 0, transform: scale(1.2); }
  100% { opacity: 0, transform: scale(1); }
`;

const About = ({ mediaSrc, mediaType = 'image', href, caption, projectName = "Our Vision in Action" }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.9 });
  
  // Background image cycling state
  const [currentBgIndex, setCurrentBgIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [hasAnimationCompleted, setHasAnimationCompleted] = React.useState(false);
  
  const backgroundImages = [
    background1,
    background2,
    background3,
  ];

  // Text content
  const textContent = [
    {
      title: "Our Vision",
      content: "To revolutionize the digital landscape by creating innovative solutions that empower businesses and transform user experiences across the globe."
    },
    {
      title: "Our Mission", 
      content: "We are dedicated to delivering cutting-edge technology solutions that drive growth, efficiency, and meaningful connections between brands and their audiences."
    },
    {
      title: "About Us",
      content: "A passionate team of innovators, designers, and developers committed to pushing the boundaries of what's possible in digital transformation."
    }
  ];

  // Determine if text should be on left or right side
  const isTextOnLeft = currentBgIndex % 2 === 0; // Even indices = left, odd indices = right

  // Use MotionValues for controlled animations
  const x = useMotionValue(-40);
  const y = useMotionValue(0);
  const scale = useMotionValue(0.96);
  const opacity = useMotionValue(0);
  
  // Text animation values
  const textOpacity = useMotionValue(1);
  const textY = useMotionValue(0);
  const textX = useMotionValue(0); // Added for horizontal positioning

  // Enhanced Background cycling effect with continuous loop
  React.useEffect(() => {
    let intervalId;

    const startCycling = () => {
      intervalId = setInterval(() => {
        setCurrentBgIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % backgroundImages.length;
          console.log(`Switching from background ${prevIndex} to ${nextIndex} - Text will be on ${nextIndex % 2 === 0 ? 'LEFT' : 'RIGHT'}`);
          return nextIndex;
        });
      }, 4000); // Change background every 4 seconds
    };

    startCycling();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  // Animate text position when background changes
  React.useEffect(() => {
    if (hasAnimationCompleted) {
      // Animate text to new position
      const targetX = isTextOnLeft ? 0 : 0; // We'll handle positioning via CSS
      animate(textX, targetX, { 
        duration: 0.8, 
        ease: [0.4, 0.0, 0.2, 1] 
      });
    }
  }, [currentBgIndex, hasAnimationCompleted, isTextOnLeft, textX]);

  // Parallax effect on hover
  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;
    const mouseX = event.clientX - rect.left - halfWidth;
    const mouseY = event.clientY - rect.top - halfHeight;

    x.set(mouseX * 0.05);
    y.set(mouseY * 0.05);
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  // Always call useTransform hooks at the top level
  const motionTransform = useTransform(
    [x, y, scale],
    ([currentX, currentY, currentScale]) => `translateX(${currentX}px) translateY(${currentY}px) scale(${currentScale})`
  );
  const iframeScaleTransform = useTransform(scale, s => `scale(${s})`);
  const textTransform = useTransform([textY, textX], ([y, x]) => `translateY(${y}px) translateX(${x}px)`);

  // Modified animation effect that doesn't interfere with cycling
  React.useEffect(() => {
    if (isInView && !hasAnimationCompleted) {
      const sequence = async () => {
        await Promise.all([
          animate(textOpacity, 1, { duration: 0.8 }),
          animate(textY, 0, { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }),
        ]);

        await Promise.all([
          animate(opacity, 1, { duration: 0.6, delay: 0.3 }),
          animate(scale, 1, { duration: 0.6, delay: 0.3 }),
        ]);

        await Promise.all([
          animate(x, 20, { duration: 2, ease: [0.2, 0.8, 0.2, 1] }),
          animate(y, 3, { duration: 2, ease: [0.2, 0.8, 0.2, 1] }),
        ]);

        await Promise.all([
          animate(x, 0, { duration: 1, ease: [0.2, 0.8, 0.2, 1] }),
          animate(y, 0, { duration: 1, ease: [0.2, 0.8, 0.2, 1] }),
        ]);

        setHasAnimationCompleted(true);
      };
      sequence();
    }
  }, [isInView, hasAnimationCompleted, x, y, scale, opacity, textOpacity, textY]);

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Cycling Background Images with improved transitions */}
      {backgroundImages.map((bgImage, index) => (
        <Box
          key={`bg-${index}`}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: currentBgIndex === index ? 1 : 0,
            transform: currentBgIndex === index ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 1.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
            zIndex: -2,
            willChange: 'opacity, transform',
          }}
        />
      ))}

      {/* Dark overlay for better text readability */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: -1,
        }} 
      />

      {/* Text Content Section - alternates between left and right */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: isTextOnLeft ? '5%' : 'auto',
          right: isTextOnLeft ? 'auto' : '5%',
          transform: textTransform,
          opacity: textOpacity,
          color: 'white',
          zIndex: 1,
          maxWidth: '400px',
          textAlign: isTextOnLeft ? 'left' : 'right',
          transition: 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)',
        }}
      >
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 700, 
            mb: 3,
            fontSize: { xs: '2rem', md: '3rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            transition: 'all 0.8s ease-in-out',
          }}
        >
          {textContent[currentBgIndex].title}
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            lineHeight: 1.6,
            fontSize: { xs: '1rem', md: '1.2rem' },
            textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
            transition: 'all 0.8s ease-in-out',
          }}
        >
          {textContent[currentBgIndex].content}
        </Typography>
      </motion.div>

      {/* Split background panels - reduced opacity to not interfere */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '50%', 
        height: '100%', 
        bgcolor: 'rgba(74, 74, 74, 0.05)',
        zIndex: 0 
      }} />
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        width: '50%', 
        height: '100%', 
        bgcolor: 'rgba(234, 234, 234, 0.05)',
        zIndex: 0 
      }} />

      {/* Main content mockup container - adjusts position based on text placement */}
      {mediaSrc && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: '100%',
            maxWidth: '980px',
            aspectRatio: '16/10',
            position: 'relative',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,.25)',
            cursor: 'pointer',
            willChange: 'transform',
            transform: motionTransform,
            opacity: opacity,
            marginLeft: isTextOnLeft ? '20%' : '-20%', // Adjust based on text position
            transition: 'margin 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {mediaType === 'image' && (
            <motion.img
              src={mediaSrc}
              alt={projectName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10 }}
              loading="lazy"
              decoding="async"
            />
          )}
          {mediaType === 'video' && (
            <motion.video
              src={mediaSrc}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10 }}
            />
          )}
          {mediaType === 'iframe' && (
            <motion.iframe
              src={mediaSrc}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                transform: iframeScaleTransform,
              }}
            />
          )}
          
          {/* Caption overlay */}
          {caption && (
            <Box sx={{
              position: 'absolute',
              bottom: 20,
              left: 30,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              zIndex: 1,
            }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{caption}</Typography>
            </Box>
          )}
        </motion.a>
      )}

      {/* Enhanced Progress indicators for background images */}
      <Box sx={{
        position: 'absolute',
        bottom: 30,
        right: 30,
        display: 'flex',
        gap: 1,
        zIndex: 2,
      }}>
        {backgroundImages.map((_, index) => (
          <Box
            key={`indicator-${index}`}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: currentBgIndex === index ? 'white' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
              transform: currentBgIndex === index ? 'scale(1.3)' : 'scale(1)',
              boxShadow: currentBgIndex === index ? '0 0 15px rgba(255,255,255,0.8)' : 'none',
              cursor: 'pointer',
            }}
            onClick={() => setCurrentBgIndex(index)}
          />
        ))}
      </Box>

      {/* Debug indicator showing text position */}
      <Box sx={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'white',
        background: 'rgba(0,0,0,0.7)',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 3,
        fontFamily: 'monospace',
      }}>
        <Typography variant="caption" sx={{ color: 'white' }}>
          Background: {currentBgIndex + 1}/{backgroundImages.length} | 
          Text: {isTextOnLeft ? 'LEFT' : 'RIGHT'} Side
        </Typography>
      </Box>
    </Box>
  );
};

export default About;
