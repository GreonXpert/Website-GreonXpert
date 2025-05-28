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

    // Create floating geometric shapes
    const geometries = [
      new THREE.TetrahedronGeometry(0.5),
      new THREE.OctahedronGeometry(0.5),
      new THREE.IcosahedronGeometry(0.5),
      new THREE.DodecahedronGeometry(0.5)
    ];

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x1AC99F, transparent: true, opacity: 0.7 }),
      new THREE.MeshPhongMaterial({ color: 0x2E8B8B, transparent: true, opacity: 0.7 }),
      new THREE.MeshPhongMaterial({ color: 0x3498db, transparent: true, opacity: 0.7 }),
      new THREE.MeshPhongMaterial({ color: 0x9c27b0, transparent: true, opacity: 0.7 })
    ];

    const meshes = [];
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.x = (Math.random() - 0.5) * 20;
      mesh.position.y = (Math.random() - 0.5) * 20;
      mesh.position.z = (Math.random() - 0.5) * 20;
      
      meshes.push(mesh);
      scene.add(mesh);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 10;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      meshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.01 + index * 0.001;
        mesh.rotation.y += 0.01 + index * 0.001;
        mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
      });

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
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
        opacity: 0.4,
      }}
    />
  );
};

export default ThreeJSBackground;