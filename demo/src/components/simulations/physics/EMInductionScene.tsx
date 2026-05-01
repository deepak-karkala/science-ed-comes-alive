'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { computeEMF } from '../../../lib/simulations/emInductionEngine';

interface EMInductionSceneProps {
  magneticField: number;
  velocity: number;
}

export default function EMInductionScene({ magneticField, velocity }: EMInductionSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Refs for animated objects
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    wire: THREE.Mesh;
    bulbMaterial: THREE.MeshStandardMaterial;
    bulbLight: THREE.PointLight;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mountElement = mountRef.current;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0a0a'); // var(--background)

    // 2. Setup Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mountElement.clientWidth / mountElement.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // 3. Setup Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      preserveDrawingBuffer: true // Required by acceptance criteria
    });
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
    mountElement.appendChild(renderer.domElement);

    // 4. Create Objects
    
    // Magnetic Field representation (simple grid/plane for now)
    const gridHelper = new THREE.GridHelper(10, 10, '#333333', '#222222');
    scene.add(gridHelper);

    // The Wire
    const wireGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
    // Rotate to lie along X axis
    wireGeometry.rotateZ(Math.PI / 2);
    const wireMaterial = new THREE.MeshStandardMaterial({ color: '#cccccc', metalness: 0.8, roughness: 0.2 });
    const wire = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wire);

    // The Bulb
    const bulbGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const bulbMaterial = new THREE.MeshStandardMaterial({ 
      color: '#ffffff',
      emissive: '#ffaa00',
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0.9
    });
    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulb.position.set(0, 2, -2);
    scene.add(bulb);

    const bulbLight = new THREE.PointLight('#ffaa00', 0, 10);
    bulbLight.position.set(0, 2, -2);
    scene.add(bulbLight);

    // Ambient Light
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.2);
    scene.add(ambientLight);

    // Directional Light
    const dirLight = new THREE.DirectionalLight('#ffffff', 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Store refs for animation loop
    sceneRef.current = {
      renderer,
      scene,
      camera,
      wire,
      bulbMaterial,
      bulbLight,
      animationId: 0
    };

    // Handle Resize
    const handleResize = () => {
      if (!sceneRef.current) return;
      const width = mountElement.clientWidth;
      const height = mountElement.clientHeight;
      
      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        mountElement.removeChild(sceneRef.current.renderer.domElement);
        sceneRef.current.renderer.dispose();
      }
    };
  }, []);

  // Update Animation based on props
  useEffect(() => {
    if (!sceneRef.current) return;

    const { renderer, scene, camera, wire, bulbMaterial, bulbLight } = sceneRef.current;
    
    let time = 0;
    
    const animate = () => {
      // 1. Calculate physics
      const physicsState = computeEMF(velocity, magneticField);
      
      // 2. Update Wire position based on velocity
      // Just oscillating it for visual effect, speed proportional to velocity
      time += 0.016 * velocity;
      wire.position.z = Math.sin(time) * 2; // move back and forth
      
      // 3. Update Bulb brightness
      // Stationary wire produces zero brightness; moving wire increases brightness
      bulbMaterial.emissiveIntensity = physicsState.bulbBrightness * 2;
      bulbLight.intensity = physicsState.bulbBrightness * 5;

      // 4. Render
      renderer.render(scene, camera);
      sceneRef.current!.animationId = requestAnimationFrame(animate);
    };

    cancelAnimationFrame(sceneRef.current.animationId);
    animate();

  }, [magneticField, velocity]);

  return (
    <div className="w-full h-full relative">
      <div ref={mountRef} className="w-full h-full absolute inset-0" />
      
      {/* HUD overlays */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
        <div className="bg-[var(--surface)] border border-[var(--border)] px-3 py-2 rounded-lg shadow-sm">
          <span className="text-xs text-[var(--text-muted)] font-mono block mb-1">INDUCED EMF</span>
          <span className="font-mono text-xl text-[var(--accent)] font-bold">
            {computeEMF(velocity, magneticField).emf.toFixed(2)} V
          </span>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] px-3 py-2 rounded-lg shadow-sm">
          <span className="text-xs text-[var(--text-muted)] font-mono block mb-1">BRIGHTNESS</span>
          <span className="font-mono text-xl text-[var(--text-primary)] font-bold">
            {Math.round(computeEMF(velocity, magneticField).bulbBrightness * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
