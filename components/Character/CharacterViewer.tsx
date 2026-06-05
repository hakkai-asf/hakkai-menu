'use client';
import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

interface CharacterViewerProps {
  mode: 'hero' | 'profile';
  /** External Y-rotation in degrees (fed from button clicks) */
  rotation?: number;
  /** External zoom scale */
  zoom?: number;
  onRotate?: (delta: number) => void;
}

export default function CharacterViewer({
  mode,
  rotation = 0,
  zoom = 1,
  onRotate,
}: CharacterViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Mutable refs so the RAF loop never re-creates closures ── */
  const rendererRef   = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef      = useRef<THREE.Scene | null>(null);
  const cameraRef     = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef      = useRef<THREE.Group | null>(null);
  const rafRef        = useRef<number>(0);
  const clockRef      = useRef(new THREE.Clock());

  /* live values the RAF reads without closures */
  const targetYRotRef = useRef(0);   // degrees
  const currentYRotRef = useRef(0);  // degrees (smoothed)
  const targetZoomRef = useRef(zoom);
  const currentZoomRef = useRef(zoom);

  const isDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);

  /* ── Sync external props into mutable refs ── */
  useEffect(() => { targetYRotRef.current = rotation; }, [rotation]);
  useEffect(() => { targetZoomRef.current = zoom; }, [zoom]);

  /* ── Build scene once ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    const { clientWidth: w, clientHeight: h } = container;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setClearColor(0x000000, 0); // transparent bg
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    /* Scene */
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    /* Camera */
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 1000);
    camera.position.set(0, 1.4, 3.5);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    /* Lights */
    const ambient = new THREE.AmbientLight(0xffeedd, 0.6);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xfff4e0, 1.8);
    key.position.set(2, 5, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.1;
    key.shadow.camera.far = 30;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x4ecdc4, 0.5);
    fill.position.set(-3, 2, 1);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xc8a96e, 0.8);
    rim.position.set(0, 3, -3);
    scene.add(rim);

    /* Ground glow disc */
    const discGeo = new THREE.CircleGeometry(0.7, 32);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0xc8a96e,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = 0.001;
    scene.add(disc);

    /* Load FBX */
    const loader = new FBXLoader();
    loader.load(
      '/character-model/character.fbx',
      (fbx) => {
        /* Normalize scale — FBX files are often in cm (scale 1 = 1 cm) */
        const box = new THREE.Box3().setFromObject(fbx);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const desiredHeight = 2.2;
        const scaleFactor = desiredHeight / maxDim;
        fbx.scale.setScalar(scaleFactor);

        /* Centre model at Y = 0 */
        box.setFromObject(fbx);
        const centre = new THREE.Vector3();
        box.getCenter(centre);
        fbx.position.sub(centre);
        fbx.position.y += desiredHeight / 2;

        /* Enable shadows on all meshes */
        fbx.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            /* Boost material quality */
            const mesh = child as THREE.Mesh;
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(m => {
                if (m instanceof THREE.MeshPhongMaterial || m instanceof THREE.MeshLambertMaterial) {
                  (m as any).envMapIntensity = 0.5;
                }
              });
            }
          }
        });

        modelRef.current = fbx;
        scene.add(fbx);
      },
      undefined,
      (err) => console.error('FBX load error:', err),
    );

    /* Animation loop — all read from refs, zero React setState */
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();

      /* Smooth Y rotation */
      const yDiff = targetYRotRef.current - currentYRotRef.current;
      currentYRotRef.current += yDiff * 0.08;

      /* Smooth zoom (camera Z) */
      const zDiff = targetZoomRef.current - currentZoomRef.current;
      currentZoomRef.current += zDiff * 0.1;

      if (modelRef.current) {
        modelRef.current.rotation.y = THREE.MathUtils.degToRad(currentYRotRef.current);
        /* Gentle idle bob */
        modelRef.current.position.y =
          (modelRef.current.userData.baseY ?? 0) + Math.sin(t * 1.2) * 0.025;
      }

      if (cameraRef.current) {
        /* Zoom by moving camera closer/further */
        const baseZ = 3.5;
        cameraRef.current.position.z = baseZ / currentZoomRef.current;
      }

      renderer.render(scene, camera);
    };
    animate();

    /* Resize observer */
    const ro = new ResizeObserver(() => {
      if (!container) return;
      const { clientWidth: nw, clientHeight: nh } = container;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Pointer drag to rotate (profile mode only) ── */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (mode !== 'profile') return;
    isDraggingRef.current = true;
    lastPointerXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [mode]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPointerXRef.current;
    lastPointerXRef.current = e.clientX;
    const delta = dx * 0.5;
    targetYRotRef.current += delta;
    onRotate?.(delta);
  }, [onRotate]);

  const onPointerUp = useCallback(() => { isDraggingRef.current = false; }, []);

  const size = mode === 'hero'
    ? { width: '100%', height: '100%' }
    : { width: '100%', height: '100%' };

  return (
    <div
      ref={containerRef}
      style={{
        ...size,
        position: 'relative',
        cursor: mode === 'profile' ? 'grab' : 'default',
        touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Gold rim light overlays (CSS-level) */}
      <div style={{
        position: 'absolute', right: 0, top: '15%', width: 3, height: '60%',
        background: 'linear-gradient(to bottom, transparent, rgba(200,169,110,0.5), transparent)',
        filter: 'blur(2px)', pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', left: 0, top: '25%', width: 2, height: '40%',
        background: 'linear-gradient(to bottom, transparent, rgba(78,205,196,0.25), transparent)',
        filter: 'blur(2px)', pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Ground glow */}
      <div style={{
        position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)',
        width: '55%', height: 40,
        background: 'radial-gradient(ellipse, rgba(200,169,110,0.2) 0%, transparent 70%)',
        filter: 'blur(10px)', pointerEvents: 'none', zIndex: 1,
      }} />
    </div>
  );
}
