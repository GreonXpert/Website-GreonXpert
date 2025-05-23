// src/components/Home/PrecisionInAction/index.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
  Chip,
  Button,
  Grow,
  Zoom
} from '@mui/material';
import { keyframes } from '@emotion/react';
import * as THREE from 'three';
import VerifiedIcon from '@mui/icons-material/Verified';
import SettingsIcon from '@mui/icons-material/Settings';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SecurityIcon from '@mui/icons-material/Security';

// Advanced animations
const glowPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor;
    filter: brightness(1);
  }
  50% { 
    box-shadow: 0 0 30px currentColor, 0 0 60px currentColor, 0 0 90px currentColor;
    filter: brightness(1.2);
  }
`;

const floatAnimation = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
  }
  25% { 
    transform: translateY(-15px) rotate(1deg);
  }
  50% { 
    transform: translateY(-25px) rotate(0deg);
  }
  75% { 
    transform: translateY(-15px) rotate(-1deg);
  }
`;

const slideInFromLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const shimmerEffect = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const rotateGlow = keyframes`
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
`;

// 3D Icon Component using Three.js
const ThreeJSIcon = ({ feature, isActive }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef();
  const meshRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    const size = 120;
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create 3D geometry based on feature type
    let geometry;
    if (feature.id === 'data-confidence') {
      geometry = new THREE.OctahedronGeometry(1.2, 1);
    } else if (feature.id === 'compliance-automation') {
      geometry = new THREE.TorusGeometry(1, 0.4, 8, 16);
    } else if (feature.id === 'impact-acceleration') {
      geometry = new THREE.ConeGeometry(1, 2, 8);
    }

    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(feature.colorHex),
      transparent: true,
      opacity: 0.8,
      emissive: new THREE.Color(feature.colorHex).multiplyScalar(0.2),
      shininess: 100,
    });

    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    // Add wireframe
    const wireframe = new THREE.WireframeGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ 
      color: new THREE.Color(feature.colorHex),
      transparent: true,
      opacity: 0.6
    });
    const wireframeMesh = new THREE.LineSegments(wireframe, wireframeMaterial);
    scene.add(wireframeMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(new THREE.Color(feature.colorHex), 1, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    camera.position.z = 4;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      if (meshRef.current) {
        // Continuous rotation
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.02;
        
        // Enhanced animation when active
        if (isActive) {
          const time = Date.now() * 0.002;
          meshRef.current.position.y = Math.sin(time) * 0.1;
          meshRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
        } else {
          meshRef.current.position.y = 0;
          meshRef.current.scale.setScalar(1);
        }
        
        wireframeMesh.rotation.x = meshRef.current.rotation.x;
        wireframeMesh.rotation.y = meshRef.current.rotation.y;
        wireframeMesh.position.y = meshRef.current.position.y;
        wireframeMesh.scale.copy(meshRef.current.scale);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [feature, isActive]);

  return (
    <Box
      ref={mountRef}
      sx={{
        width: 120,
        height: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
};

// Enhanced Feature Card Component
// Enhanced Feature Card Component with Mouse Motion Effect
const PrecisionFeatureCard = ({ feature, isActive, onActivate, index }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [transform, setTransform] = useState('');

  // Mouse movement handler for 3D tilt effect
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || isMobile) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to card center
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation angles (max 20 degrees)
    const rotateX = (mouseY / rect.height) * -20;
    const rotateY = (mouseX / rect.width) * 20;
    
    // Calculate translation for subtle movement
    const translateX = (mouseX / rect.width) * 10;
    const translateY = (mouseY / rect.height) * 10;
    
    // Enhanced transform with perspective and glow
    const newTransform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateX(${translateX}px) 
      translateY(${translateY}px)
      translateZ(20px)
      scale(${isActive ? 1.05 : 1.02})
    `;
    
    setTransform(newTransform);
    setMousePosition({ 
      x: (mouseX / rect.width) * 100, 
      y: (mouseY / rect.height) * 100 
    });
  }, [isMobile, isActive]);

  // Mouse enter handler
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Mouse leave handler
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px) translateZ(0px) scale(1)');
    setMousePosition({ x: 50, y: 50 });
  }, []);

  // Throttled mouse move for performance
  const throttledMouseMove = useCallback(
    throttle(handleMouseMove, 16), // ~60fps
    [handleMouseMove]
  );

  return (
    <Zoom in timeout={800 + index * 300}>
      <Box
        ref={cardRef}
        onClick={onActivate}
        onMouseMove={throttledMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: transform || 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px) translateZ(0px) scale(1)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          '&:hover': {
            '& .card-glow': {
              opacity: 1,
              transform: 'scale(1.1)',
            },
            '& .floating-particles': {
              opacity: 1,
              transform: 'scale(1.2)',
            }
          }
        }}
      >
        {/* Animated glow effect that follows mouse */}
        <Box
          className="card-glow"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200%',
            height: '200%',
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${feature.colorHex}20 0%, transparent 70%)`,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%) scale(0.8)',
            transition: 'all 0.3s ease',
            opacity: isHovered ? 0.8 : 0,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Main Card */}
        <Box
          sx={{
            width: { xs: '100%', md: 380 },
            height: { xs: 'auto', md: 520 },
            background: isHovered 
              ? `linear-gradient(135deg at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.92) 100%)`
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: isActive 
              ? `3px solid ${feature.colorHex}` 
              : isHovered 
                ? `2px solid ${feature.colorHex}60`
                : '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: isActive 
              ? `0 25px 50px ${feature.colorHex}30, 0 0 0 1px ${feature.colorHex}20`
              : isHovered
                ? `0 20px 40px rgba(0, 0, 0, 0.15), 0 0 20px ${feature.colorHex}20`
                : '0 15px 35px rgba(0, 0, 0, 0.1)',
            p: { xs: 4, md: 5 },
            position: 'relative',
            overflow: 'hidden',
            zIndex: 1,
            transformStyle: 'preserve-3d',
            
            // Dynamic shimmer effect based on mouse position
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isHovered || isActive
                ? `linear-gradient(${mousePosition.x + 45}deg, transparent 30%, ${feature.colorHex}08 50%, transparent 70%)`
                : 'none',
              animation: (isActive || isHovered) ? `${shimmerEffect} 3s linear infinite` : 'none',
              pointerEvents: 'none',
              opacity: isHovered ? 1 : 0.5,
              transition: 'opacity 0.3s ease',
            },
            
            // Enhanced glow border effect
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderRadius: 4,
              background: isHovered 
                ? `conic-gradient(from ${mousePosition.x * 3.6}deg at ${mousePosition.x}% ${mousePosition.y}%, ${feature.colorHex}, transparent, ${feature.colorHex})`
                : 'none',
              zIndex: -1,
              animation: isActive ? `${rotateGlow} 4s linear infinite` : 'none',
              opacity: isHovered ? 0.6 : 0.4,
              transition: 'opacity 0.3s ease',
            }
          }}
        >
          {/* Interactive light spot that follows mouse */}
          {isHovered && (
            <Box
              sx={{
                position: 'absolute',
                top: `${mousePosition.y}%`,
                left: `${mousePosition.x}%`,
                width: 100,
                height: 100,
                background: `radial-gradient(circle, ${feature.colorHex}15 0%, transparent 70%)`,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.1s ease',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}

          {/* 3D Icon with enhanced interaction */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 4,
              transform: isHovered ? 'translateZ(20px) scale(1.1)' : 'translateZ(0px) scale(1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transformStyle: 'preserve-3d',
            }}
          >
            <ThreeJSIcon feature={feature} isActive={isActive || isHovered} />
          </Box>

          {/* Feature Title with 3D effect */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              textAlign: 'center',
              mb: 3,
              color: isActive ? feature.colorHex : theme.palette.text.primary,
              fontSize: { xs: '1.6rem', md: '2rem' },
              textShadow: isActive || isHovered ? `0 0 20px ${feature.colorHex}60` : 'none',
              transform: isHovered ? 'translateZ(15px)' : 'translateZ(0px)',
              transition: 'all 0.3s ease',
              transformStyle: 'preserve-3d',
            }}
          >
            {feature.title}
          </Typography>

          {/* Feature Description with depth */}
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: theme.palette.text.secondary,
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.7,
              mb: 5,
              minHeight: { xs: 'auto', md: '120px' },
              transform: isHovered ? 'translateZ(10px)' : 'translateZ(0px)',
              transition: 'all 0.3s ease',
              transformStyle: 'preserve-3d',
            }}
          >
            {feature.description}
          </Typography>

          {/* Enhanced Status Indicator */}
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: isActive 
                ? `linear-gradient(45deg, ${feature.colorHex}, #ffffff)`
                : isHovered
                  ? `linear-gradient(45deg, ${feature.colorHex}80, #ffffff80)`
                  : 'rgba(0, 0, 0, 0.2)',
              animation: (isActive || isHovered) ? `${glowPulse} 2s infinite` : 'none',
              transform: isHovered ? 'translateZ(25px) scale(1.2)' : 'translateZ(0px) scale(1)',
              transition: 'all 0.3s ease',
              transformStyle: 'preserve-3d',
              boxShadow: isHovered ? `0 0 15px ${feature.colorHex}60` : 'none',
            }}
          />
        </Box>

        {/* Enhanced Floating Elements - Active and Hovered states */}
        {(isActive || isHovered) && (
          <Box
            className="floating-particles"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              opacity: isHovered ? 0.8 : 0.6,
              transition: 'all 0.3s ease',
            }}
          >
            {/* Dynamic orbiting particles */}
            {[...Array(isHovered ? 12 : 8)].map((_, i) => {
              const angle = (i * 360) / (isHovered ? 12 : 8);
              const radius = isHovered ? 100 : 80;
              const offsetX = Math.cos((angle + mousePosition.x * 2) * Math.PI / 180) * radius;
              const offsetY = Math.sin((angle + mousePosition.y * 2) * Math.PI / 180) * radius;
              
              return (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: isHovered ? 8 : 6,
                    height: isHovered ? 8 : 6,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${feature.colorHex}, ${feature.colorHex}80)`,
                    top: '50%',
                    left: '50%',
                    animation: `${floatAnimation} ${3 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                    transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) translateZ(30px)`,
                    opacity: 0.8,
                    boxShadow: `0 0 ${isHovered ? 20 : 15}px ${feature.colorHex}`,
                    transition: 'all 0.3s ease',
                  }}
                />
              );
            })}

            {/* Mouse trail effect */}
            {isHovered && (
              <Box
                sx={{
                  position: 'absolute',
                  top: `${mousePosition.y}%`,
                  left: `${mousePosition.x}%`,
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: feature.colorHex,
                  transform: 'translate(-50%, -50%) translateZ(40px)',
                  boxShadow: `0 0 20px ${feature.colorHex}`,
                  animation: `${glowPulse} 1s infinite`,
                }}
              />
            )}
          </Box>
        )}
      </Box>
    </Zoom>
  );
};

// Add throttle utility function if not already available
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Real-time Metrics Bar
const MetricsBar = ({ isVisible }) => {
  const [metrics, setMetrics] = useState({
    accuracy: 0,
    speed: 0,
    compliance: 0
  });

  useEffect(() => {
    if (!isVisible) return;

    const targets = { accuracy: 99.9, speed: 98.7, compliance: 100 };
    const duration = 2500;
    const steps = 60;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);

      setMetrics({
        accuracy: targets.accuracy * easeOut,
        speed: targets.speed * easeOut,
        compliance: targets.compliance * easeOut
      });

      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <Fade in={isVisible} timeout={1500}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          mt: 10,
          flexWrap: 'wrap',
        }}
      >
        {[
          { key: 'accuracy', label: 'Data Accuracy', value: metrics.accuracy.toFixed(1), suffix: '%', color: '#1AC99F', icon: <VerifiedIcon /> },
          { key: 'speed', label: 'Processing Speed', value: metrics.speed.toFixed(1), suffix: '%', color: '#2E8B8B', icon: <AutoGraphIcon /> },
          { key: 'compliance', label: 'Compliance Rate', value: metrics.compliance.toFixed(0), suffix: '%', color: '#3498db', icon: <SecurityIcon /> },
        ].map((metric, index) => (
          <Grow key={metric.key} in timeout={1000 + index * 300}>
            <Box
              sx={{
                textAlign: 'center',
                p: 4,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${metric.color}15, ${metric.color}25)`,
                border: `2px solid ${metric.color}40`,
                backdropFilter: 'blur(10px)',
                minWidth: 180,
                transition: 'all 0.3s ease',
                animation: `${floatAnimation} ${4 + index}s ease-in-out infinite`,
                '&:hover': {
                  transform: 'translateY(-10px) scale(1.05)',
                  boxShadow: `0 20px 40px ${metric.color}30`,
                }
              }}
            >
              <Box sx={{ color: metric.color, mb: 2, fontSize: 28 }}>
                {metric.icon}
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: metric.color,
                  fontSize: '2.5rem',
                  textShadow: `0 0 15px ${metric.color}60`,
                  mb: 1,
                }}
              >
                {metric.value}{metric.suffix}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {metric.label}
              </Typography>
            </Box>
          </Grow>
        ))}
      </Box>
    </Fade>
  );
};

const PrecisionInAction = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeFeature, setActiveFeature] = useState(0);
  const [showMetrics, setShowMetrics] = useState(false);
  const [visibleElements, setVisibleElements] = useState({});

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleElements(prev => ({ ...prev, header: true })), 300),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, features: true })), 800),
      setTimeout(() => setShowMetrics(true), 1500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const features = [
    {
      id: 'data-confidence',
      icon: <VerifiedIcon />,
      title: 'Data Confidence',
      description: 'Powered by ISO 14064, GHG Protocol & SBTi with end-to-end validation—every emission captured.',
      linkText: 'View Standards & Validation',
      colorHex: '#1AC99F',
    },
    {
      id: 'compliance-automation',
      icon: <SettingsIcon />,
      title: 'Compliance Automation',
      description: 'Auto-generate ESG & carbon disclosures—BRSR, GRI, CSRD and more—in seconds.',
      linkText: 'Explore Reporting Suite',
      colorHex: '#2E8B8B',
    },
    {
      id: 'impact-acceleration',
      icon: <RocketLaunchIcon />,
      title: 'Impact Acceleration',
      description: 'Live KPIs, AI-driven decarbonization roadmaps and integrated carbon-credit trading.',
      linkText: 'Launch Your Program',
      colorHex: '#3498db',
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: `
          radial-gradient(circle at 20% 30%, rgba(26, 201, 159, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(52, 152, 219, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(46, 139, 139, 0.05) 0%, transparent 70%),
          linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248, 249, 250, 0.5) 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      {/* Animated background elements */}
      {[...Array(15)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: { xs: 4, md: 6 },
            height: { xs: 4, md: 6 },
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${['#1AC99F', '#2E8B8B', '#3498dd'][i % 3]}, transparent)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `${floatAnimation} ${8 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.4,
          }}
        />
      ))}

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Fade in={visibleElements.header} timeout={1000}>
          <Box textAlign="center" mb={12}>
            <Chip
              label="PRECISION IN ACTION"
              sx={{
                mb: 5,
                px: 5,
                py: 3.5,
                fontSize: '1rem',
                fontWeight: 900,
                 background: `linear-gradient(135deg, ${theme.palette.primary.dark}20, ${theme.palette.secondary.main}20)`,
                border: `3px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                letterSpacing: 2.5,
                // animation: `${glowPulse} 3s infinite`,
                 backdropFilter: 'blur(10px)',
                 boxShadow: `0 0 30px ${theme.palette.primary.main}30`,
              }}
            />

            <Typography
              variant="h1"
              component="h2"
              sx={{
                fontWeight: 900,
                mb: 4,
                fontSize: { xs: '3rem', md: '5rem' },
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, #3498db)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                textShadow: '0 0 40px rgba(26, 201, 159, 0.3)',
                animation: `${slideInFromLeft} 1s ease-out`,
              }}
            >
              Where Innovation
              <br />
              Meets Precision
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                fontSize: { xs: '1.3rem', md: '1.6rem' },
                lineHeight: 1.6,
                fontWeight: 400,
                animation: `${slideInFromRight} 1s ease-out 0.3s both`,
              }}
            >
              Experience the future of sustainability with our comprehensive platform that transforms data into actionable insights
            </Typography>
          </Box>
        </Fade>

        {/* Feature Cards */}
        <Fade in={visibleElements.features} timeout={1200}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 4, md: 8 },
              flexWrap: 'wrap',
              mb: 8,
              perspective: '1000px',
            }}
          >
            {features.map((feature, index) => (
              <PrecisionFeatureCard
                key={feature.id}
                feature={feature}
                isActive={activeFeature === index}
                onActivate={() => setActiveFeature(index)}
                index={index}
              />
            ))}
          </Box>
        </Fade>

        {/* Real-time Metrics */}
        <MetricsBar isVisible={showMetrics} />
      </Container>
    </Box>
  );
};

export default PrecisionInAction;