// src/components/Home/ClimateIntelligence/index.js
import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
  Chip
} from '@mui/material';
import { keyframes } from '@emotion/react';
import * as THREE from 'three';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

// Floating animation for background elements
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

// Pulse animation for hint indicators
const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`;

// Glow animation
const glowAnimation = keyframes`
  0%, 100% { filter: drop-shadow(0 0 10px currentColor); }
  50% { filter: drop-shadow(0 0 25px currentColor) drop-shadow(0 0 35px currentColor); }
`;

// Interactive 3D Shape Component
const Interactive3DShape = ({ feature, isActive, onActivate, shapeType }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const shapeRef = useRef(null);
  const frameRef = useRef();
  const isDraggingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      premultipliedAlpha: false 
    });
    
    const size = window.innerWidth < 768 ? 220 : 300;
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create different geometries based on shape type
    let geometry;
    let shape;
    
    if (shapeType === 'cube') {
      // MONITOR - Transparent Cube with wireframe
      geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
      
      // Transparent material
      const material = new THREE.MeshPhongMaterial({
        color: feature.color,
        transparent: true,
        opacity: 0.15,
        shininess: 100,
        side: THREE.DoubleSide
      });
      
      shape = new THREE.Mesh(geometry, material);
      
      // Add multiple wireframe layers for depth
      const wireframe1 = new THREE.EdgesGeometry(geometry);
      const wireframeMaterial1 = new THREE.LineBasicMaterial({ 
        color: feature.color,
        transparent: true,
        opacity: 0.8,
        linewidth: 2
      });
      const wireframeLines1 = new THREE.LineSegments(wireframe1, wireframeMaterial1);
      shape.add(wireframeLines1);
      
      // Inner wireframe
      const innerGeometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
      const wireframe2 = new THREE.EdgesGeometry(innerGeometry);
      const wireframeMaterial2 = new THREE.LineBasicMaterial({ 
        color: feature.color,
        transparent: true,
        opacity: 0.5,
        linewidth: 1
      });
      const wireframeLines2 = new THREE.LineSegments(wireframe2, wireframeMaterial2);
      shape.add(wireframeLines2);
      
    } else if (shapeType === 'pyramid') {
      // MANAGE - Transparent Pyramid with wireframe
      geometry = new THREE.ConeGeometry(2, 3, 4);
      
      const material = new THREE.MeshPhongMaterial({
        color: feature.color,
        transparent: true,
        opacity: 0.12,
        shininess: 100,
        side: THREE.DoubleSide
      });
      
      shape = new THREE.Mesh(geometry, material);
      
      // Pyramid wireframe
      const wireframe1 = new THREE.EdgesGeometry(geometry);
      const wireframeMaterial1 = new THREE.LineBasicMaterial({ 
        color: feature.color,
        transparent: true,
        opacity: 0.9,
        linewidth: 2
      });
      const wireframeLines1 = new THREE.LineSegments(wireframe1, wireframeMaterial1);
      shape.add(wireframeLines1);
      
      // Inner pyramid
      const innerGeometry = new THREE.ConeGeometry(1.4, 2.2, 4);
      const wireframe2 = new THREE.EdgesGeometry(innerGeometry);
      const wireframeMaterial2 = new THREE.LineBasicMaterial({ 
        color: feature.color,
        transparent: true,
        opacity: 0.6,
        linewidth: 1
      });
      const wireframeLines2 = new THREE.LineSegments(wireframe2, wireframeMaterial2);
      shape.add(wireframeLines2);
      
    } else if (shapeType === 'globe') {
      // DRIVE - Transparent Globe with wireframe
      geometry = new THREE.SphereGeometry(2, 32, 32);
      
      const material = new THREE.MeshPhongMaterial({
        color: feature.color,
        transparent: true,
        opacity: 0.1,
        shininess: 100,
        side: THREE.DoubleSide
      });
      
      shape = new THREE.Mesh(geometry, material);
      
      // Globe wireframe with latitude/longitude lines
      const wireframe1 = new THREE.EdgesGeometry(geometry);
      const wireframeMaterial1 = new THREE.LineBasicMaterial({ 
        color: feature.color,
        transparent: true,
        opacity: 0.7,
        linewidth: 1
      });
      const wireframeLines1 = new THREE.LineSegments(wireframe1, wireframeMaterial1);
      shape.add(wireframeLines1);
      
      // Add custom latitude/longitude lines
      const createLatLonLines = () => {
        const group = new THREE.Group();
        
        // Latitude lines
        for (let i = 0; i < 8; i++) {
          const phi = (i / 8) * Math.PI;
          const points = [];
          for (let j = 0; j <= 64; j++) {
            const theta = (j / 64) * Math.PI * 2;
            const x = 2 * Math.sin(phi) * Math.cos(theta);
            const y = 2 * Math.cos(phi);
            const z = 2 * Math.sin(phi) * Math.sin(theta);
            points.push(new THREE.Vector3(x, y, z));
          }
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({ 
            color: feature.color, 
            transparent: true, 
            opacity: 0.4 
          });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          group.add(line);
        }
        
        // Longitude lines
        for (let i = 0; i < 12; i++) {
          const theta = (i / 12) * Math.PI * 2;
          const points = [];
          for (let j = 0; j <= 32; j++) {
            const phi = (j / 32) * Math.PI;
            const x = 2 * Math.sin(phi) * Math.cos(theta);
            const y = 2 * Math.cos(phi);
            const z = 2 * Math.sin(phi) * Math.sin(theta);
            points.push(new THREE.Vector3(x, y, z));
          }
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({ 
            color: feature.color, 
            transparent: true, 
            opacity: 0.4 
          });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          group.add(line);
        }
        
        return group;
      };
      
      const latLonLines = createLatLonLines();
      shape.add(latLonLines);
    }

    shapeRef.current = shape;
    scene.add(shape);

    // Add animated particles around shape
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 80;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      // Position particles in a larger sphere around the shape
      const radius = 4 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i * 3 + 2] = radius * Math.cos(phi);

      // Color particles based on feature color
      const color = new THREE.Color(feature.color);
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
      
      scaleArray[i] = Math.random() * 0.5 + 0.5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Dynamic colored lights
    const pointLight1 = new THREE.PointLight(feature.color, 1, 15);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(feature.color, 0.5, 10);
    pointLight2.position.set(-4, -4, 4);
    scene.add(pointLight2);

    // Add rim light for better edge definition
    const rimLight = new THREE.DirectionalLight(feature.color, 0.5);
    rimLight.position.set(-5, 0, -5);
    scene.add(rimLight);

    camera.position.z = 6;

    // Mouse/Touch interaction handlers
    const handleMouseDown = (event) => {
      isDraggingRef.current = true;
      const clientX = event.clientX || event.touches?.[0]?.clientX;
      const clientY = event.clientY || event.touches?.[0]?.clientY;
      
      previousMouseRef.current = { x: clientX, y: clientY };
      renderer.domElement.style.cursor = 'grabbing';
      onActivate();
    };

    const handleMouseMove = (event) => {
      const clientX = event.clientX || event.touches?.[0]?.clientX;
      const clientY = event.clientY || event.touches?.[0]?.clientY;
      
      if (isDraggingRef.current && clientX !== undefined && clientY !== undefined) {
        const deltaX = clientX - previousMouseRef.current.x;
        const deltaY = clientY - previousMouseRef.current.y;

        targetRotationRef.current.y += deltaX * 0.012;
        targetRotationRef.current.x += deltaY * 0.012;

        previousMouseRef.current = { x: clientX, y: clientY };
        event.preventDefault();
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      renderer.domElement.style.cursor = 'grab';
    };

    // Event listeners
    const canvas = renderer.domElement;
    canvas.style.cursor = 'grab';
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    // Touch events
    canvas.addEventListener('touchstart', handleMouseDown, { passive: false });
    canvas.addEventListener('touchmove', handleMouseMove, { passive: false });
    canvas.addEventListener('touchend', handleMouseUp);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      if (shapeRef.current) {
        // Smooth rotation interpolation
        shapeRef.current.rotation.x += (targetRotationRef.current.x - shapeRef.current.rotation.x) * 0.08;
        shapeRef.current.rotation.y += (targetRotationRef.current.y - shapeRef.current.rotation.y) * 0.08;

        // Auto-rotation when not being dragged
        if (!isDraggingRef.current) {
          targetRotationRef.current.y += 0.004;
          if (shapeType === 'pyramid') {
            targetRotationRef.current.x += 0.002;
          }
        }

        // Animate particles with different patterns for each shape
        if (shapeType === 'cube') {
          particlesMesh.rotation.y += 0.002;
          particlesMesh.rotation.x += 0.001;
        } else if (shapeType === 'pyramid') {
          particlesMesh.rotation.y += 0.003;
          particlesMesh.rotation.z += 0.001;
        } else if (shapeType === 'globe') {
          particlesMesh.rotation.y += 0.001;
          particlesMesh.rotation.x += 0.002;
        }

        // Dynamic lighting animation
        const time = Date.now() * 0.001;
        pointLight1.position.x = Math.cos(time * 0.5) * 4;
        pointLight1.position.z = Math.sin(time * 0.5) * 4;
        pointLight2.position.x = Math.sin(time * 0.3) * -4;
        pointLight2.position.z = Math.cos(time * 0.3) * 4;

        // Pulse effect for active shape
        if (isActive) {
          const pulse = (Math.sin(time * 3) + 1) * 0.1 + 0.9;
          shapeRef.current.scale.setScalar(pulse);
        } else {
          shapeRef.current.scale.setScalar(1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const newSize = window.innerWidth < 768 ? 220 : 300;
      renderer.setSize(newSize, newSize);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      const canvas = renderer.domElement;
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('touchstart', handleMouseDown);
      canvas.removeEventListener('touchmove', handleMouseMove);
      canvas.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', handleResize);

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose of Three.js objects
      if (geometry) geometry.dispose();
      renderer.dispose();
    };
  }, [feature, onActivate, isActive, shapeType]);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.4s ease',
        transform: isActive ? 'scale(1.08)' : 'scale(1)',
        '&:hover': {
          transform: isActive ? 'scale(1.08)' : 'scale(1.03)',
        }
      }}
    >
      {/* 3D Shape Container */}
      <Box
        ref={mountRef}
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          background: isActive 
            ? `radial-gradient(circle, rgba(${parseInt(feature.color.toString(16).slice(0,2), 16)}, ${parseInt(feature.color.toString(16).slice(2,4), 16)}, ${parseInt(feature.color.toString(16).slice(4,6), 16)}, 0.15) 0%, rgba(0,0,0,0.05) 70%)`
            : 'rgba(255, 255, 255, 0.03)',
        //  backdropFilter: 'blur(15px)',
          border: isActive 
            ? `2px solid ${feature.colorHex}` 
            : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isActive 
            ? `0 0 40px ${feature.colorHex}30, 0 15px 35px rgba(0,0,0,0.15)` 
            : '0 8px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.4s ease',
        //   animation: isActive ? `${glowAnimation} 3s ease-in-out infinite` : 'none',
        }}
      />

      {/* Shape Type Label */}
      <Box
        sx={{
          position: 'absolute',
          top: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
        }}
      >
        <Chip
          label={shapeType.toUpperCase()}
          size="small"
          sx={{
            background: `${feature.colorHex}20`,
            border: `1px solid ${feature.colorHex}`,
            color: feature.colorHex,
            fontWeight: 700,
            fontSize: '0.7rem',
            backdropFilter: 'blur(10px)',
            animation: isActive ? `${pulseAnimation} 2s infinite` : 'none',
          }}
        />
      </Box>

      {/* Interaction Hint */}
      {!isActive && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            animation: `${pulseAnimation} 3s infinite`,
            zIndex: 2,
          }}
        >
          <Chip
            icon={<TouchAppIcon />}
            label="Drag & Rotate"
            size="small"
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              fontSize: '0.65rem',
              '& .MuiChip-icon': {
                fontSize: '0.8rem',
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

const ClimateIntelligence = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 'monitor',
      icon: <MonitorHeartIcon sx={{ fontSize: 40 }} />,
      title: 'Monitor',
      description: 'Real-time visibility of every emission source with Zero Carbon.',
      color: 0x1AC99F,
      colorHex: '#1AC99F',
      shape: 'cube',
      benefits: [
        'Live emission tracking across all scopes',
        'Real-time data visualization dashboards',
        'Instant alerts for anomalies',
        'Source-level carbon footprint mapping'
      ]
    },
    {
      id: 'manage',
      icon: <ManageAccountsIcon sx={{ fontSize: 40 }} />,
      title: 'Manage',
      description: 'Streamline sustainability reporting and regulatory workflows without manual effort.',
      color: 0x2E8B8B,
      colorHex: '#2E8B8B',
      shape: 'pyramid',
      benefits: [
        'Automated ESG report generation',
        'Regulatory compliance management',
        'Workflow optimization tools',
        'Multi-framework reporting support'
      ]
    },
    {
      id: 'drive',
      icon: <RocketLaunchIcon sx={{ fontSize: 40 }} />,
      title: 'Drive',
      description: 'Activate AI-powered decarbonization plans to meet your sustainability goals.',
      color: 0x3498db,
      colorHex: '#3498db',
      shape: 'globe',
      benefits: [
        'AI-powered reduction strategies',
        'Science-based target setting',
        'Carbon offset recommendations',
        'ROI-focused action plans'
      ]
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: `
          radial-gradient(circle at 15% 25%, rgba(26, 201, 159, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 85% 75%, rgba(52, 152, 219, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(46, 139, 139, 0.05) 0%, transparent 70%),
          linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(248, 249, 250, 0.5) 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      {/* Floating background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '8%',
          left: '3%',
          width: 120,
          height: 120,
          background: 'linear-gradient(45deg, rgba(26, 201, 159, 0.1), rgba(52, 152, 219, 0.1))',
          borderRadius: '50%',
          animation: `${floatAnimation} 25s linear infinite`,
          display: { xs: 'none', md: 'block' }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '65%',
          right: '5%',
          width: 90,
          height: 90,
          background: 'linear-gradient(45deg, rgba(52, 152, 219, 0.1), rgba(46, 139, 139, 0.1))',
          borderRadius: '50%',
          animation: `${floatAnimation} 18s linear infinite reverse`,
          display: { xs: 'none', md: 'block' }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '90%',
          width: 60,
          height: 60,
          background: 'linear-gradient(45deg, rgba(46, 139, 139, 0.08), rgba(26, 201, 159, 0.08))',
          borderRadius: '50%',
          animation: `${floatAnimation} 22s linear infinite`,
          display: { xs: 'none', lg: 'block' }
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Fade in timeout={800}>
          <Box textAlign="center" mb={8}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                mb: 4,
                p: 2.5,
                px: 4,
                borderRadius: 30,
                background: 'rgba(26, 201, 159, 0.08)',
                border: '1px solid rgba(26, 201, 159, 0.2)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 25px rgba(26, 201, 159, 0.15)',
              }}
            >
              <ViewInArIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
              <Typography
                variant="overline"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 800,
                  letterSpacing: 2.5,
                  fontSize: '1rem',
                }}
              >
                Interactive 3D Experience
              </Typography>
            </Box>

            <Typography
              variant="h1"
              component="h2"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2.8rem', md: '4.5rem' },
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, #3498db)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Climate Intelligence
            </Typography>
            
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: '950px',
                mx: 'auto',
                fontSize: { xs: '1.2rem', md: '1.6rem' },
                fontWeight: 400,
                lineHeight: 1.5,
                mb: 4,
              }}
            >
              Your all-in-one toolkit for real-time insights, seamless compliance, and strategic decarbonization.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontStyle: 'italic',
                opacity: 0.8,
              }}
            >
              ✨ Drag and rotate each 3D shape to explore our features
            </Typography>
          </Box>
        </Fade>

        {/* Interactive 3D Features */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', xl: 'row' },
            alignItems: 'center',
            gap: { xs: 8, md: 10, xl: 6 },
            minHeight: { xs: 'auto', xl: '700px' },
          }}
        >
          {/* 3D Shapes Section */}
          <Box
            sx={{
              flex: { xs: 'none', xl: '1 1 65%' },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 6, md: 8 },
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {features.map((feature, index) => (
              <Box key={feature.id} sx={{ position: 'relative' }}>
                <Interactive3DShape
                  feature={feature}
                  isActive={activeFeature === index}
                  onActivate={() => setActiveFeature(index)}
                  shapeType={feature.shape}
                />
                
                {/* Feature Title below shape */}
                <Typography
                  variant="h4"
                  sx={{
                    mt: 3,
                    textAlign: 'center',
                    fontWeight: 800,
                    color: feature.colorHex,
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    letterSpacing: '0.5px',
                    textShadow: activeFeature === index ? `0 0 10px ${feature.colorHex}40` : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {feature.title}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Feature Details Section */}
          <Box
            sx={{
              flex: { xs: 'none', xl: '1 1 35%' },
              maxWidth: { xs: '100%', xl: '550px' },
              p: { xs: 4, md: 5 },
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 4,
              minHeight: { xs: 'auto', xl: '500px' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
            }}
          >
            <Fade in key={activeFeature} timeout={600}>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    mb: 4,
                  }}
                >
                  <Box
                    sx={{
                      color: features[activeFeature].colorHex,
                      filter: `drop-shadow(0 0 8px ${features[activeFeature].colorHex}40)`,
                    }}
                  >
                    {features[activeFeature].icon}
                  </Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      color: features[activeFeature].colorHex,
                      fontSize: { xs: '2.2rem', md: '2.8rem' },
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {features[activeFeature].title}
                  </Typography>
                </Box>

                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    mb: 5,
                    fontSize: { xs: '1.15rem', md: '1.3rem' },
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                >
                  {features[activeFeature].description}
                </Typography>

                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 3,
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      fontSize: { xs: '1.3rem', md: '1.5rem' },
                    }}
                  >
                    Key Capabilities:
                  </Typography>
                  <Box sx={{ space: 2 }}>
                    {features[activeFeature].benefits.map((benefit, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2.5,
                          mb: 2.5,
                          p: 3,
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${features[activeFeature].colorHex}08, ${features[activeFeature].colorHex}15)`,
                          border: `2px solid ${features[activeFeature].colorHex}25`,
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateX(8px)',
                            background: `linear-gradient(135deg, ${features[activeFeature].colorHex}15, ${features[activeFeature].colorHex}25)`,
                            border: `2px solid ${features[activeFeature].colorHex}40`,
                            boxShadow: `0 8px 25px ${features[activeFeature].colorHex}20`,
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: `linear-gradient(45deg, ${features[activeFeature].colorHex}, ${features[activeFeature].colorHex}AA)`,
                            mt: 0.5,
                            flexShrink: 0,
                            boxShadow: `0 0 10px ${features[activeFeature].colorHex}60`,
                          }}
                        />
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '1rem', md: '1.1rem' }, 
                            lineHeight: 1.6,
                            fontWeight: 500,
                          }}
                        >
                          {benefit}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Box>
        </Box>

        
        
      </Container>
    </Box>
  );
};

export default ClimateIntelligence;