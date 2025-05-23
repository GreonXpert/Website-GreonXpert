// src/components/Hero/ThreeJSGlobe.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeJSGlobe = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const globeRef = useRef(null);
  const wireframeRef = useRef(null);
  const particlesRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef();
  
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    mountRef.current.appendChild(renderer.domElement);

    // Create larger Earth-like globe with network pattern
    const geometry = new THREE.SphereGeometry(5.5, 124, 124);
    
    // Create main globe with subtle transparency
    const material = new THREE.MeshPhongMaterial({
      color: 0xf8f9fa, // Light gray base
      transparent: true,
      opacity: 0.1,
      shininess: 30,
    });
    
    const globe = new THREE.Mesh(geometry, material);
    globeRef.current = globe;
    scene.add(globe);

    // Create network connections (geodesic pattern)
    const createNetworkSphere = () => {
      const networkGroup = new THREE.Group();
      
      // Create vertices for icosphere pattern
      const vertices = [];
      const baseRadius   = 5.5; 
      const drawRadius   = baseRadius + 0.02;
      
      // Generate fibonacci sphere points for more natural distribution
      const samples = 120;
      for (let i = 0; i < samples; i++) {
        const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = (i * Math.PI * (3 - Math.sqrt(5))); // golden angle
        
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        
         const dir = new THREE.Vector3(x, y, z).normalize();
         vertices.push(dir.multiplyScalar(drawRadius));
      }
      
      // Create points (nodes)
      const nodeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: 0x9ca3af, // Gray-400
        transparent: true,
        opacity: 0.8,
      });
      
      vertices.forEach(vertex => {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(vertex);
        networkGroup.add(node);
      });
      
      // Create connections between nearby points
      const connectionMaterial = new THREE.LineBasicMaterial({
        color: 0xd1d5db, // Gray-300
        transparent: true,
        opacity:0.9,
        depthTest:   false,
      });
      
      for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
          const distance = vertices[i].distanceTo(vertices[j]);
          // Only connect nearby points to create network effect
          if (distance < 2.5) {
            // Create line geometry between two points  
            const geometry = new THREE.BufferGeometry().setFromPoints([vertices[i], vertices[j]]);
            const line = new THREE.Line(geometry, connectionMaterial);
            networkGroup.add(line);
          }
        }
      }
      
      return networkGroup;
    };
    
    const networkSphere = createNetworkSphere();
    wireframeRef.current = networkSphere;
    scene.add(networkSphere);

    // Add floating particles with gray tones
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      // Position particles in a larger sphere around the globe
      const radius = 4 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i * 3 + 2] = radius * Math.cos(phi);
      
      // Gray color variations
      const grayLevel = 0.6 + Math.random() * 0.4;
      colorArray[i * 3] = grayLevel;     // R
      colorArray[i * 3 + 1] = grayLevel; // G
      colorArray[i * 3 + 2] = grayLevel; // B
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.008,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    particlesRef.current = particlesMesh;
    scene.add(particlesMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Position camera for better view of larger globe
    camera.position.set(8, 2, 8);
    camera.lookAt(0, 0, 0);

    // Enhanced mouse/touch interaction for user control
    const handleMouseDown = (event) => {
      isDraggingRef.current = true;
      previousMouseRef.current = {
        x: event.clientX,
        y: event.clientY
      };
      document.body.style.cursor = 'grabbing';
    };

    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      if (isDraggingRef.current) {
        const deltaX = event.clientX - previousMouseRef.current.x;
        const deltaY = event.clientY - previousMouseRef.current.y;
        
        // Convert mouse movement to rotation
        rotationVelocityRef.current.y = deltaX * 0.01;
        rotationVelocityRef.current.x = deltaY * 0.01;
        
        previousMouseRef.current = {
          x: event.clientX,
          y: event.clientY
        };
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
    };

    // Touch events for mobile
    const handleTouchStart = (event) => {
      if (event.touches.length === 1) {
        isDraggingRef.current = true;
        previousMouseRef.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
      }
    };

    const handleTouchMove = (event) => {
      if (isDraggingRef.current && event.touches.length === 1) {
        const deltaX = event.touches[0].clientX - previousMouseRef.current.x;
        const deltaY = event.touches[0].clientY - previousMouseRef.current.y;
        
        rotationVelocityRef.current.y = deltaX * 0.01;
        rotationVelocityRef.current.x = deltaY * 0.01;
        
        previousMouseRef.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
        
        event.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    // Enhanced animation loop with user control and auto-rotation
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      if (globeRef.current && wireframeRef.current) {
        if (isDraggingRef.current) {
          // User is controlling - apply user rotation
          globeRef.current.rotation.x += rotationVelocityRef.current.x;
          globeRef.current.rotation.y += rotationVelocityRef.current.y;
          wireframeRef.current.rotation.x += rotationVelocityRef.current.x;
          wireframeRef.current.rotation.y += rotationVelocityRef.current.y;
          
          // Apply damping to rotation velocity
          rotationVelocityRef.current.x *= 0.95;
          rotationVelocityRef.current.y *= 0.95;
        } else {
          // Auto rotation when not being controlled
          globeRef.current.rotation.y += 0.003; // Slower, Earth-like rotation
          wireframeRef.current.rotation.y += 0.003;
          
          // Continue momentum from user interaction
          if (Math.abs(rotationVelocityRef.current.x) > 0.001 || Math.abs(rotationVelocityRef.current.y) > 0.001) {
            globeRef.current.rotation.x += rotationVelocityRef.current.x;
            globeRef.current.rotation.y += rotationVelocityRef.current.y;
            wireframeRef.current.rotation.x += rotationVelocityRef.current.x;
            wireframeRef.current.rotation.y += rotationVelocityRef.current.y;
            
            // Apply stronger damping when not actively dragging
            rotationVelocityRef.current.x *= 0.98;
            rotationVelocityRef.current.y *= 0.98;
          }
        }
      }
      
      // Animate particles slowly
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0005;
        particlesRef.current.rotation.x += 0.0002;
      }
      
      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Event listeners for enhanced interaction
    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    
    // Prevent context menu on right click
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Set cursor style
    canvas.style.cursor = 'grab';
    
    // Start animation
    animate();

    // Cleanup
    return () => {
      const canvas = renderer.domElement;
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('contextmenu', (e) => e.preventDefault());
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js objects
      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
      
      // Reset cursor
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    />
  );
};

export default ThreeJSGlobe;