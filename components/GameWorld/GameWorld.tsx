'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGame } from '@/lib/contexts/GameContext';

function createParticles(count: number, spread: number) {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
    velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.002;
    velocities[i * 3 + 1] = Math.random() * 0.004 + 0.001;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    sizes[i] = Math.random() * 2 + 0.5;
  }
  return { positions, velocities, sizes };
}

export default function GameWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { settings } = useGame();
  const rafRef = useRef<number>(0);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesMeshRef = useRef<THREE.Points | null>(null);
  const particleDataRef = useRef<ReturnType<typeof createParticles> | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const light1Ref = useRef<THREE.PointLight | null>(null);
  const light2Ref = useRef<THREE.PointLight | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.08);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !settings.performanceMode,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, settings.performanceMode ? 1 : 1.5));
    renderer.setClearColor(0x050508, 1);
    renderer.shadowMap.enabled = false;
    rendererRef.current = renderer;

    // Ambient light
    const ambient = new THREE.AmbientLight(0x0a0820, 0.6);
    scene.add(ambient);

    // Dynamic point lights
    const light1 = new THREE.PointLight(0xC8A96E, 2, 15);
    light1.position.set(3, 2, 2);
    scene.add(light1);
    light1Ref.current = light1;

    const light2 = new THREE.PointLight(0x4ECDC4, 1.5, 12);
    light2.position.set(-4, -1, 3);
    scene.add(light2);
    light2Ref.current = light2;

    const light3 = new THREE.PointLight(0x3a2a6e, 1, 8);
    light3.position.set(0, 3, -2);
    scene.add(light3);

    // Particles
    const particleCount = settings.performanceMode ? 300 : 600;
    const data = createParticles(particleCount, 14);
    particleDataRef.current = data;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(data.positions.slice(), 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(data.sizes, 1));

    const material = new THREE.PointsMaterial({
      color: 0xC8A96E,
      size: 0.04,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesMeshRef.current = particles;

    // Ground plane (subtle)
    const planeGeo = new THREE.PlaneGeometry(30, 30);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x080812,
      metalness: 0.1,
      roughness: 0.9,
      transparent: true,
      opacity: 0.6,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -3;
    scene.add(plane);

    // Animate
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();

      // Particle drift
      if (particlesMeshRef.current && particleDataRef.current && settings.particles) {
        const pos = particlesMeshRef.current.geometry.attributes.position;
        const vel = particleDataRef.current.velocities;
        const arr = pos.array as Float32Array;
        const orig = particleDataRef.current.positions;

        for (let i = 0; i < particleCount; i++) {
          arr[i * 3 + 1] += vel[i * 3 + 1];
          if (arr[i * 3 + 1] > orig[i * 3 + 1] + 4) {
            arr[i * 3 + 1] = orig[i * 3 + 1] - 4;
          }
          arr[i * 3 + 0] += Math.sin(t * 0.3 + i) * 0.0003;
          arr[i * 3 + 2] += Math.cos(t * 0.2 + i) * 0.0003;
        }
        pos.needsUpdate = true;
      }

      // Light movement
      if (light1Ref.current) {
        light1Ref.current.position.x = Math.sin(t * 0.4) * 4;
        light1Ref.current.position.y = Math.cos(t * 0.3) * 2 + 1;
        light1Ref.current.intensity = 2 + Math.sin(t * 0.7) * 0.4;
      }
      if (light2Ref.current) {
        light2Ref.current.position.x = Math.cos(t * 0.35) * 5 - 2;
        light2Ref.current.position.y = Math.sin(t * 0.25) * 2 - 1;
        light2Ref.current.intensity = 1.5 + Math.cos(t * 0.6) * 0.3;
      }

      // Camera idle drift
      if (cameraRef.current) {
        camera.position.x = Math.sin(t * 0.08) * 0.3;
        camera.position.y = Math.cos(t * 0.06) * 0.15;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
