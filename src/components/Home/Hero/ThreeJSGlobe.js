// src/components/Home/Hero/ThreeJSGlobe.jsx
import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

const ThreeJSGlobe = () => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.35;
      globeEl.current.controls().enableZoom = false;
      globeEl.current.controls().enablePan = false;
      globeEl.current.pointOfView({ lat: 22.3193, lng: 114.1694, altitude: 2.5 });
    }
  }, []);

  // Project locations with red theme
  const projectLocations = [
    {
      lat: 10.8505,
      lng: 76.2711,
      name: 'Kerala, India',
      status: 'Active',
      color: '#DC2626', // Red-600
      gradientColor: '#F87171', // Red-400 for gradient
      size: 1
    },
    {
      lat: 19.8563,
      lng: 102.4955,
      name: 'Laos',
      status: 'Active',
      color: '#DC2626', // Red-600
      gradientColor: '#F87171', // Red-400 for gradient
      size: 1
    }
  ];

  // Create enhanced 3D markers with red gradient
  const createMarkerObject = () => {
    const markerGroup = new THREE.Group();
    
    // Pulsing base ring with red gradient
    const ringGeometry = new THREE.RingGeometry(0.4, 0.6, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: '#DC2626', // Red-600
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    markerGroup.add(ring);

    // Main pin body with red gradient effect
    const pinGeometry = new THREE.ConeGeometry(0.3, 1.5, 8);
    const pinMaterial = new THREE.MeshPhongMaterial({ 
      color: '#DC2626', // Red-600
      shininess: 100,
      transparent: true,
      opacity: 0.9,
      emissive: new THREE.Color('#991B1B'), // Dark red emissive
      emissiveIntensity: 0.3
    });
    const pin = new THREE.Mesh(pinGeometry, pinMaterial);
    pin.position.y = 0.75;
    markerGroup.add(pin);
    
    // Glowing sphere at tip with gradient effect
    const sphereGeometry = new THREE.SphereGeometry(0.2, 12, 8);
    const sphereMaterial = new THREE.MeshBasicMaterial({ 
      color: '#F87171', // Red-400 for bright top
      transparent: true,
      opacity: 0.9
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.y = 1.5;
    markerGroup.add(sphere);

    // Additional glow ring around sphere for gradient effect
    const glowRingGeometry = new THREE.RingGeometry(0.25, 0.35, 16);
    const glowRingMaterial = new THREE.MeshBasicMaterial({
      color: '#FCA5A5', // Red-300 for outer glow
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const glowRing = new THREE.Mesh(glowRingGeometry, glowRingMaterial);
    glowRing.position.y = 1.5;
    glowRing.rotation.x = -Math.PI / 2;
    markerGroup.add(glowRing);
    
    return markerGroup;
  };

  const generateArcsData = () => {
    return [...Array(8)].map(() => ({
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 180,
      endLng: (Math.random() - 0.5) * 360,
      color: ['rgba(206, 212, 218, 0.3)', 'rgba(173, 181, 189, 0.2)']
    }));
  };

  const generateRingsData = () => {
    return [...Array(4)].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      maxR: Math.random() * 10 + 2,
      propagationSpeed: Math.random() * 10 + 2,
      repeatPeriod: Math.random() * 4000 + 2000
    }));
  };

  // Enhanced project rings with red gradient
  const generateProjectRings = () => {
    return projectLocations.flatMap(location => [
      {
        lat: location.lat,
        lng: location.lng,
        maxR: 8,
        propagationSpeed: 1,
        repeatPeriod: 2000,
        isProjectRing: true,
        ringType: 'outer'
      },
      {
        lat: location.lat,
        lng: location.lng,
        maxR: 5,
        propagationSpeed: 1.5,
        repeatPeriod: 1600,
        isProjectRing: true,
        ringType: 'middle'
      },
      {
        lat: location.lat,
        lng: location.lng,
        maxR: 3,
        propagationSpeed: 2,
        repeatPeriod: 1200,
        isProjectRing: true,
        ringType: 'inner'
      }
    ]);
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
      opacity: 0.4,
    }}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        showAtmosphere={true}
        atmosphereColor="rgba(173, 181, 189, 0.08)"
        atmosphereAltitude={0.15}
        
        polygonsData={countries.features}
        polygonCapColor={d => d === hoverD ? 'rgba(78, 220, 185, 0.3)' : 'rgba(248, 249, 250, 0.1)'}
        polygonSideColor={() => 'rgba(255, 255, 255, 0.05)'}
        polygonStrokeColor={() => '#1AC99F'}
        polygonAltitude={d => d === hoverD ? 0.05 : 0.02}
        polygonsTransitionDuration={400}
        onPolygonHover={setHoverD}
        
        arcsData={generateArcsData()}
        arcColor="color"
        arcDashLength={0.6}
        arcDashGap={2}
        arcDashInitialGap={() => Math.random() * 3}
        arcDashAnimateTime={5000}
        arcStroke={0.2}
        arcsTransitionDuration={1500}
        
        // ENHANCED 3D PROJECT MARKERS WITH RED GRADIENT
        objectsData={projectLocations}
        objectLat="lat"
        objectLng="lng"
        objectAltitude={0.02}
        objectThreeObject={createMarkerObject}
        
        // ENHANCED PROJECT LABELS WITH RED GRADIENT
        labelsData={projectLocations}
        labelLat="lat"
        labelLng="lng"
        labelText="name"
        labelSize={1.6} // Static size
        labelColor={() => '#DC2626'} // Static red color
        labelResolution={6}
        labelAltitude={0.08}
        labelDotRadius={0.5} // Static dot size
        
        // MULTI-LAYER PROJECT RINGS WITH RED GRADIENT
        ringsData={[...generateRingsData(), ...generateProjectRings()]}
        ringColor={(d, i) => {
          const baseRingsCount = generateRingsData().length;
          const isProjectRing = i >= baseRingsCount;
          if (isProjectRing) {
            const ringIndex = i - baseRingsCount;
            const ringType = Math.floor(ringIndex / projectLocations.length);
            
            // Different red shades for gradient effect
            switch(ringType) {
              case 0: return 'rgba(220, 38, 38, 0.4)'; // Red-600 outer
              case 1: return 'rgba(248, 113, 113, 0.5)'; // Red-400 middle  
              case 2: return 'rgba(252, 165, 165, 0.6)'; // Red-300 inner
              default: return 'rgba(220, 38, 38, 0.4)';
            }
          }
          return 'rgba(173, 181, 189, 0.1)';
        }}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        
        enablePointerInteraction={false}
        
        globeMaterial={() => {
          const material = new THREE.MeshPhongMaterial();
          material.bumpScale = 5;
          material.shininess = 60;
          material.specular = new THREE.Color('#e9ecef');
          material.transparent = true;
          material.opacity = 0.85;
          return material;
        }}
        
        backgroundColor="rgba(255, 255, 255, 0.02)"
      />
    </div>
  );
};

export default ThreeJSGlobe;
