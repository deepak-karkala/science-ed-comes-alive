'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { computeRBCColor } from '../../../lib/simulations/rbcEngine';

interface BloodCircuitSceneProps {
  heartRate: number;
  o2Saturation: number;
}

export default function BloodCircuitScene({ heartRate, o2Saturation }: BloodCircuitSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    rbcMesh: THREE.Mesh;
    rbcMaterial: THREE.MeshStandardMaterial;
    heartMesh: THREE.Mesh;
    vesselTube: THREE.Mesh;
    animationId: number;
    clock: THREE.Clock;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mountElement = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0a0a');

    const camera = new THREE.PerspectiveCamera(
      55,
      mountElement.clientWidth / mountElement.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 8, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
    mountElement.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight('#ffffff', 0.3));
    const dirLight = new THREE.DirectionalLight('#ffffff', 1.2);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // Blood vessel — circular torus as simplified circulatory path
    const vesselPath = new THREE.TorusGeometry(4, 0.15, 16, 80);
    const vesselMaterial = new THREE.MeshStandardMaterial({
      color: '#8B0000',
      roughness: 0.7,
      metalness: 0.1,
    });
    const vesselTube = new THREE.Mesh(vesselPath, vesselMaterial);
    scene.add(vesselTube);

    // Heart — pulsing sphere at center
    const heartGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const heartMaterial = new THREE.MeshStandardMaterial({
      color: '#CC0000',
      roughness: 0.3,
      emissive: '#330000',
      emissiveIntensity: 0.3,
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMaterial);
    scene.add(heartMesh);

    // RBC particle — small disc
    const rbcGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.08, 16);
    const rbcColor = computeRBCColor(o2Saturation);
    const rbcMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(rbcColor),
      roughness: 0.2,
      metalness: 0.1,
      emissive: new THREE.Color(rbcColor),
      emissiveIntensity: 0.4,
    });
    const rbcMesh = new THREE.Mesh(rbcGeo, rbcMaterial);
    rbcMesh.rotation.z = Math.PI / 2; // disc faces forward
    scene.add(rbcMesh);

    // Small particles along vessel for visual effect
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 60;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 4 + (Math.random() - 0.5) * 0.4;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: '#FF4444',
      size: 0.06,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    const clock = new THREE.Clock();
    sceneRef.current = {
      renderer, scene, camera, rbcMesh, rbcMaterial,
      heartMesh, vesselTube, animationId: 0, clock,
    };

    // Resize handler
    const handleResize = () => {
      if (!sceneRef.current) return;
      const w = mountElement.clientWidth;
      const h = mountElement.clientHeight;
      sceneRef.current.camera.aspect = w / h;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(w, h);
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

  // Animation loop
  useEffect(() => {
    if (!sceneRef.current) return;
    const { renderer, scene, camera, rbcMesh, rbcMaterial, heartMesh, clock } = sceneRef.current;

    // Speed factor: heart rate relative to 60 bpm
    const speedFactor = heartRate / 60;
    let angle = 0;

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.1);
      angle += dt * speedFactor * 1.5;

      // Move RBC along circular vessel path
      const r = 4;
      rbcMesh.position.x = Math.cos(angle) * r;
      rbcMesh.position.z = Math.sin(angle) * r;
      rbcMesh.position.y = Math.sin(angle * 2) * 0.3; // slight vertical wobble
      rbcMesh.rotation.y = -angle + Math.PI / 2;

      // Update RBC color from engine
      const color = computeRBCColor(o2Saturation);
      rbcMaterial.color.set(color);
      rbcMaterial.emissive.set(color);

      // Heart pulse — subtle scale oscillation at heart rate
      const pulse = 1 + Math.sin(angle * 3 * speedFactor) * 0.1;
      heartMesh.scale.setScalar(pulse);

      renderer.render(scene, camera);
      sceneRef.current!.animationId = requestAnimationFrame(animate);
    };

    cancelAnimationFrame(sceneRef.current.animationId);
    animate();
  }, [heartRate, o2Saturation]);

  return (
    <div className="w-full h-full relative">
      <div ref={mountRef} className="w-full h-full absolute inset-0" />

      {/* HUD overlays */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
        <div className="bg-[var(--surface)] border border-[var(--border)] px-3 py-2 rounded-lg shadow-sm">
          <span className="text-xs text-[var(--text-muted)] font-mono block mb-1">O₂ SATURATION</span>
          <span className="font-mono text-xl text-[var(--accent)] font-bold">{o2Saturation}</span>
          <span className="text-xs text-[var(--text-muted)] ml-1">%</span>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] px-3 py-2 rounded-lg shadow-sm">
          <span className="text-xs text-[var(--text-muted)] font-mono block mb-1">HEART RATE</span>
          <span className="font-mono text-xl text-[var(--text-primary)] font-bold">{heartRate}</span>
          <span className="text-xs text-[var(--text-muted)] ml-1">bpm</span>
        </div>
      </div>

      {/* RBC color indicator */}
      <div className="absolute bottom-4 right-4 pointer-events-none flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full border border-[var(--border)]"
          style={{ backgroundColor: computeRBCColor(o2Saturation) }}
        />
        <span className="font-mono text-xs text-[var(--text-muted)]">RBC</span>
      </div>
    </div>
  );
}
