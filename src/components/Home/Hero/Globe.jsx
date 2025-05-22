// src/components/Home/Hero/Globe.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Globe = ({ containerRef }) => {
  const sceneRef = useRef();
  const rendererRef = useRef();
  const globeRef = useRef();
  const animationIdRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(
      containerRef.current.clientWidth, 
      containerRef.current.clientHeight
    );
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create globe geometry
    const geometry = new THREE.SphereGeometry(2, 64, 64);

    // Create wireframe material with gradient effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x1AC99F) }, // Primary color from theme
        color2: { value: new THREE.Color(0x2E8B8B) }, // Secondary color from theme
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          // Add subtle wave animation
          vec3 newPosition = position;
          newPosition.x += sin(position.y * 10.0 + time) * 0.02;
          newPosition.y += cos(position.x * 10.0 + time) * 0.02;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Create gradient based on position
          float gradient = (vPosition.y + 2.0) / 4.0;
          vec3 finalColor = mix(color1, color2, gradient);
          
          // Add pulsing effect
          float pulse = sin(time * 2.0) * 0.1 + 0.9;
          finalColor *= pulse;
          
          // Add wireframe effect
          float wireframe = 1.0 - smoothstep(0.0, 0.02, 
            min(min(abs(vUv.x), abs(vUv.x - 1.0)), 
                min(abs(vUv.y), abs(vUv.y - 1.0))));
          
          gl_FragColor = vec4(finalColor, 0.6 + wireframe * 0.4);
        }
      `,
      transparent: true,
      wireframe: false,
    });

    // Create globe mesh
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
    globeRef.current = globe;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0x1AC99F, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (globeRef.current) {
        // Rotate globe
        globeRef.current.rotation.x += 0.005;
        globeRef.current.rotation.y += 0.01;

        // Update shader time uniform
        if (globeRef.current.material.uniforms) {
          globeRef.current.material.uniforms.time.value += 0.02;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Mouse interaction
    const handleMouseMove = (event) => {
      if (!containerRef.current || !globeRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Subtle rotation based on mouse position
      globeRef.current.rotation.x += (y * 0.1 - globeRef.current.rotation.x) * 0.05;
      globeRef.current.rotation.y += (x * 0.1 - globeRef.current.rotation.y) * 0.05;
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      
      window.removeEventListener('resize', handleResize);
      
      // Dispose of Three.js objects
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, [containerRef]);

  return null; // This component doesn't render anything directly
};

export default Globe;