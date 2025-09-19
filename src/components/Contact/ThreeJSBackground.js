// src/components/Contact/ThreeJSBackground.js
import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import * as THREE from 'three';

const ThreeJSBackground = () => {
  const mountRef = useRef(null);
  const frameRef = useRef();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Nature Climate Colors
    const leafGreen1 = 0x1AC99F;  // Primary green
    const leafGreen2 = 0x27ae60;  // Emerald
    const leafGreen3 = 0x2E8B8B;  // Teal
    const waterBlue = 0x3498db;   // Blue
    const earthBrown = 0x8B4513;  // Brown

    // === FLOATING LEAVES ===
    const createLeafGeometry = () => {
      const shape = new THREE.Shape();
      
      // Create leaf shape using bezier curves
      shape.moveTo(0, 0);
      shape.bezierCurveTo(0.3, 0.1, 0.8, 0.4, 1.2, 1.0);
      shape.bezierCurveTo(1.0, 1.4, 0.6, 1.6, 0, 1.8);
      shape.bezierCurveTo(-0.6, 1.6, -1.0, 1.4, -1.2, 1.0);
      shape.bezierCurveTo(-0.8, 0.4, -0.3, 0.1, 0, 0);
      
      const extrudeSettings = {
        depth: 0.02,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.01,
        bevelThickness: 0.01
      };
      
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    };

    const leaves = [];
    const leavesGroup = new THREE.Group();

    // Create floating leaves
    for (let i = 0; i < 15; i++) {
      const leafGeometry = createLeafGeometry();
      const leafColors = [leafGreen1, leafGreen2, leafGreen3];
      const leafMaterial = new THREE.MeshPhongMaterial({
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        transparent: true,
        opacity: 0.8,
        emissive: leafColors[Math.floor(Math.random() * leafColors.length)],
        emissiveIntensity: 0.1,
        shininess: 60,
        side: THREE.DoubleSide
      });
      
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      
      // Random positioning
      leaf.position.x = (Math.random() - 0.5) * 40;
      leaf.position.y = (Math.random() - 0.5) * 30;
      leaf.position.z = (Math.random() - 0.5) * 30;
      
      // Random initial rotation
      leaf.rotation.x = Math.random() * Math.PI * 2;
      leaf.rotation.y = Math.random() * Math.PI * 2;
      leaf.rotation.z = Math.random() * Math.PI * 2;
      
      // Random scale for variety
      const scale = 0.8 + Math.random() * 0.6;
      leaf.scale.setScalar(scale);
      
      // Store animation data
      leaf.userData = {
        initialX: leaf.position.x,
        initialY: leaf.position.y,
        initialZ: leaf.position.z,
        floatSpeed: 0.3 + Math.random() * 0.4,
        rotationSpeed: 0.001 + Math.random() * 0.005,
        swayAmplitude: 1 + Math.random() * 2
      };
      
      leaves.push(leaf);
      leavesGroup.add(leaf);
    }
    scene.add(leavesGroup);

    // === ORGANIC PARTICLE SYSTEM (Pollen/Seeds) ===
    const particleCount = 100;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];
    const particleSizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 50;     // x
      particlePositions[i + 1] = (Math.random() - 0.5) * 40; // y
      particlePositions[i + 2] = (Math.random() - 0.5) * 40; // z
      
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: Math.random() * 0.01 + 0.005, // Slight upward drift
        z: (Math.random() - 0.5) * 0.015
      });
      
      particleSizes[i / 3] = Math.random() * 0.1 + 0.05;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    const particlesMaterial = new THREE.PointsMaterial({
      color: leafGreen2,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // === ORGANIC FLOWING BRANCHES ===
    const branches = [];
    for (let b = 0; b < 5; b++) {
      const branchPoints = [];
      const segments = 30;
      
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = Math.sin(t * Math.PI * 3) * (2 - t * 1.5);
        const y = (t - 0.5) * 12;
        const z = Math.cos(t * Math.PI * 2) * (1.5 - t);
        branchPoints.push(new THREE.Vector3(x, y, z));
      }
      
      const branchGeometry = new THREE.BufferGeometry().setFromPoints(branchPoints);
      const branchMaterial = new THREE.LineBasicMaterial({
        color: earthBrown,
        transparent: true,
        opacity: 0.6,
        linewidth: 2
      });
      const branch = new THREE.Line(branchGeometry, branchMaterial);
      
      branch.position.x = (Math.random() - 0.5) * 30;
      branch.position.z = (Math.random() - 0.5) * 30;
      branch.rotation.y = Math.random() * Math.PI * 2;
      
      branches.push(branch);
      scene.add(branch);
    }

    // === WATER DROPLETS ===
    const droplets = [];
    const dropletsGroup = new THREE.Group();

    for (let i = 0; i < 8; i++) {
      const dropletGeometry = new THREE.SphereGeometry(0.15, 12, 12);
      const dropletMaterial = new THREE.MeshPhongMaterial({
        color: waterBlue,
        transparent: true,
        opacity: 0.9,
        emissive: waterBlue,
        emissiveIntensity: 0.2,
        shininess: 200
      });
      
      const droplet = new THREE.Mesh(dropletGeometry, dropletMaterial);
      
      droplet.position.x = (Math.random() - 0.5) * 35;
      droplet.position.y = Math.random() * 20 + 10;
      droplet.position.z = (Math.random() - 0.5) * 25;
      
      droplet.userData = {
        fallSpeed: 0.02 + Math.random() * 0.03,
        initialY: droplet.position.y,
        swayAmount: Math.random() * 2
      };
      
      droplets.push(droplet);
      dropletsGroup.add(droplet);
    }
    scene.add(dropletsGroup);

    // Enhanced Natural Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffd700, 0.8);
    sunLight.position.set(20, 20, 10);
    scene.add(sunLight);

    const skyLight = new THREE.DirectionalLight(waterBlue, 0.5);
    skyLight.position.set(-15, 10, -10);
    scene.add(skyLight);

    const forestLight = new THREE.PointLight(leafGreen1, 1, 25);
    forestLight.position.set(0, 5, 10);
    scene.add(forestLight);

    camera.position.z = 25;
    camera.position.y = 5;

    // Natural Animation Loop
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Animate leaves - gentle swaying like in breeze
      leaves.forEach((leaf, index) => {
        const userData = leaf.userData;
        
        // Swaying motion like wind
        leaf.position.x = userData.initialX + Math.sin(time * userData.floatSpeed + index) * userData.swayAmplitude;
        leaf.position.y = userData.initialY + Math.cos(time * userData.floatSpeed * 0.8 + index * 1.2) * 0.8;
        leaf.position.z = userData.initialZ + Math.sin(time * userData.floatSpeed * 0.6 + index * 0.9) * 1.2;
        
        // Natural rotation like falling leaves
        leaf.rotation.x += userData.rotationSpeed * 2;
        leaf.rotation.y += userData.rotationSpeed;
        leaf.rotation.z += userData.rotationSpeed * 1.5;
        
        // Subtle opacity changes for depth
        const distance = camera.position.distanceTo(leaf.position);
        leaf.material.opacity = Math.max(0.3, Math.min(0.8, (30 - distance) / 20));
      });

      // Animate organic particles (pollen/seeds floating)
      const positions = particleSystem.geometry.attributes.position.array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        const velocityIndex = i / 3;
        positions[i] += particleVelocities[velocityIndex].x + Math.sin(time + velocityIndex) * 0.005;
        positions[i + 1] += particleVelocities[velocityIndex].y;
        positions[i + 2] += particleVelocities[velocityIndex].z + Math.cos(time + velocityIndex) * 0.003;
        
        // Reset particles that float too high
        if (positions[i + 1] > 25) {
          positions[i + 1] = -25;
          positions[i] = (Math.random() - 0.5) * 50;
          positions[i + 2] = (Math.random() - 0.5) * 40;
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Animate branches - gentle swaying
      branches.forEach((branch, index) => {
        branch.rotation.z = Math.sin(time * 0.8 + index) * 0.1;
        branch.position.y = Math.sin(time * 0.5 + index * 2) * 1;
      });

      // Animate water droplets - falling and respawning
      droplets.forEach((droplet, index) => {
        droplet.position.y -= droplet.userData.fallSpeed;
        droplet.position.x += Math.sin(time + index) * droplet.userData.swayAmount * 0.01;
        
        // Reset droplet when it falls too low
        if (droplet.position.y < -20) {
          droplet.position.y = droplet.userData.initialY;
          droplet.position.x = (Math.random() - 0.5) * 35;
          droplet.position.z = (Math.random() - 0.5) * 25;
        }
        
        // Subtle rotation
        droplet.rotation.y += 0.02;
      });

      // Animate forest lighting
      forestLight.position.x = Math.cos(time * 0.4) * 15;
      forestLight.position.z = Math.sin(time * 0.4) * 15 + 10;
      forestLight.intensity = 0.8 + Math.sin(time * 1.2) * 0.3;

      // Gentle camera sway
      camera.position.x = Math.sin(time * 0.2) * 3;
      camera.position.y = 5 + Math.cos(time * 0.15) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Natural camera response to mouse
      camera.position.x += (mouseX * 4 - camera.position.x) * 0.03;
      camera.position.y += (mouseY * 3 + 5 - camera.position.y) * 0.03;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <Box
      ref={mountRef}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.5,
      }}
    />
  );
};

export default ThreeJSBackground;
