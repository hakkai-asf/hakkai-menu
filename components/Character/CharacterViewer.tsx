'use client';
import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

interface CharacterViewerProps {
  mode: 'hero' | 'profile';
  rotation?: number;
  zoom?: number;
  onRotate?: (delta: number) => void;
}

function createProceduralCharacterModel() {
  const group = new THREE.Group();
  const armor     = new THREE.MeshStandardMaterial({ color: 0x181923, roughness: 0.56, metalness: 0.45 });
  const armorDark = new THREE.MeshStandardMaterial({ color: 0x0b0c12, roughness: 0.65, metalness: 0.35 });
  const gold      = new THREE.MeshStandardMaterial({ color: 0xc8a96e, roughness: 0.28, metalness: 0.75 });
  const teal      = new THREE.MeshStandardMaterial({ color: 0x4ecdc4, roughness: 0.25, metalness: 0.55, emissive: 0x173d3a });
  const skin      = new THREE.MeshStandardMaterial({ color: 0xb98766, roughness: 0.5,  metalness: 0.05 });
  const hair      = new THREE.MeshStandardMaterial({ color: 0x151016, roughness: 0.7,  metalness: 0.1  });

  const add = (mesh: THREE.Mesh, position: [number, number, number], rotation: [number, number, number] = [0, 0, 0]) => {
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    mesh.castShadow    = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  add(new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.78, 8, 18), armor),    [0, 1.33, 0]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.15, 0.32),       gold),    [0, 1.75, 0.01]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.09, 0.18),       teal),    [0, 1.44, 0.19]);
  add(new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.18, 8, 12),  skin),    [0, 1.96, 0]);
  add(new THREE.Mesh(new THREE.SphereGeometry(0.28, 28, 22),        skin),    [0, 2.23, 0]);
  add(new THREE.Mesh(new THREE.SphereGeometry(0.29, 28, 12, 0, Math.PI * 2, 0, Math.PI * 0.48), hair), [0, 2.34, -0.02]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.045, 0.035),     armorDark), [-0.09, 2.23, 0.25]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.045, 0.035),     armorDark), [0.09,  2.23, 0.25]);

  add(new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.62, 8, 14), armor),    [-0.49, 1.36, 0], [0, 0, -0.2]);
  add(new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.62, 8, 14), armor),    [0.49,  1.36, 0], [0, 0,  0.2]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.2),        gold),    [-0.39, 1.75, 0.01], [0, 0, -0.16]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.2),        gold),    [0.39,  1.75, 0.01], [0, 0,  0.16]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.16),       armorDark), [-0.58, 0.98, 0.01]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.16),       armorDark), [0.58,  0.98, 0.01]);

  add(new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.76, 8, 14), armorDark), [-0.18, 0.5, 0], [0.04, 0, 0]);
  add(new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.76, 8, 14), armorDark), [0.18,  0.5, 0], [0.04, 0, 0]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.34),       gold),    [-0.18, 0.9, 0.01]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.34),       gold),    [0.18,  0.9, 0.01]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.12, 0.42),       armorDark), [-0.18, 0.08, 0.06]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.12, 0.42),       armorDark), [0.18,  0.08, 0.06]);

  group.userData.procedural = true;
  return group;
}

export default function CharacterViewer({
  mode,
  rotation = 0,
  zoom = 1,
  onRotate,
}: CharacterViewerProps) {
  const containerRef    = useRef<HTMLDivElement>(null);
  const rendererRef     = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef       = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef        = useRef<THREE.Group | null>(null);
  const sceneRef        = useRef<THREE.Scene | null>(null);
  const rafRef          = useRef<number>(0);
  const clockRef        = useRef(new THREE.Clock());
  const mixerRef        = useRef<THREE.AnimationMixer | null>(null);

  const targetYRotRef   = useRef(rotation);
  const currentYRotRef  = useRef(rotation);
  const targetZoomRef   = useRef(zoom);
  const currentZoomRef  = useRef(zoom);
  const isDraggingRef   = useRef(false);
  const lastPointerXRef = useRef(0);

  useEffect(() => { targetYRotRef.current = rotation; }, [rotation]);
  useEffect(() => { targetZoomRef.current = zoom; },    [zoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled  = true;
    renderer.shadowMap.type     = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace   = THREE.SRGBColorSpace;
    renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;           // slightly lower — richer knight textures
    renderer.setClearColor(0x000000, 0);
    Object.assign(renderer.domElement.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '0',
      width: '100%',
      height: '100%',
    });
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Scene & Camera ────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 1000);
    camera.position.set(0, 1.3, 3.6);
    camera.lookAt(0, 1.1, 0);
    cameraRef.current = camera;

    // ── Lighting (tuned for metallic knight armour) ───────────────────────
    // Soft warm ambient so shadow areas aren't pure black
    scene.add(new THREE.AmbientLight(0xfff0d0, 0.9));

    // Key light — warm overhead, slightly front-right
    const key = new THREE.DirectionalLight(0xfff5e0, 2.8);
    key.position.set(2.5, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far  = 20;
    key.shadow.camera.left = key.shadow.camera.bottom = -3;
    key.shadow.camera.right = key.shadow.camera.top   =  3;
    key.shadow.bias = -0.001;
    scene.add(key);

    // Fill light — cool teal from left for rim separation
    const fill = new THREE.DirectionalLight(0x4ecdc4, 0.6);
    fill.position.set(-4, 2, 1.5);
    scene.add(fill);

    // Rim / back light — warm gold from behind, catches armour edges
    const rim = new THREE.DirectionalLight(0xe8c070, 1.4);
    rim.position.set(0.5, 5, -5);
    scene.add(rim);

    // Subtle under-fill to soften harsh shadow on legs
    const under = new THREE.DirectionalLight(0x8090b0, 0.25);
    under.position.set(0, -2, 2);
    scene.add(under);

    // ── Ground glow disc ─────────────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(0.85, 64),
      new THREE.MeshBasicMaterial({
        color: 0xc8a96e,
        transparent: true,
        opacity: 0.13,
        depthWrite: false,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.001;
    scene.add(ground);

    // ── Model helper ─────────────────────────────────────────────────────
    const addModelToScene = (model: THREE.Group, animations: THREE.AnimationClip[] = [], isFallback = false) => {
      const box    = new THREE.Box3().setFromObject(model);
      const size   = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const desiredHeight = mode === 'hero' ? 2.5 : 2.3;
      const scaleFactor   = size.y > 0 ? desiredHeight / size.y : 1;
      model.scale.setScalar(scaleFactor);

      const scaledMinY = box.min.y * scaleFactor;
      model.position.set(
        -center.x * scaleFactor,
        -scaledMinY,
        -center.z * scaleFactor,
      );
      model.userData.baseY = model.position.y;

      model.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.castShadow    = true;
        mesh.receiveShadow = true;

        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          if ('side' in mat)     mat.side = THREE.FrontSide;
          if ('envMapIntensity' in mat) (mat as THREE.MeshStandardMaterial).envMapIntensity = 1.2;
          mat.needsUpdate = true;
        });
      });

      // Play first animation clip if available (idle animations in some GLBs)
      if (animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;
        const action = mixer.clipAction(animations[0]);
        action.play();
      }

      modelRef.current = model;
      scene.add(model);

      if (isFallback) {
        console.warn('Using procedural fallback — knight1.glb not found.');
      }
    };

    // ── Load GLB ──────────────────────────────────────────────────────────
    let disposed = false;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/character-model/knight1.glb',
      (gltf) => {
        if (disposed) return;
        addModelToScene(gltf.scene, gltf.animations);
      },
      undefined,
      (error) => {
        console.error('GLB load error:', error);
        if (!disposed) addModelToScene(createProceduralCharacterModel(), [], true);
      },
    );

    // ── Resize ────────────────────────────────────────────────────────────
    const resize = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // ── Render loop ───────────────────────────────────────────────────────
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const delta   = clockRef.current.getDelta();
      const elapsed = clockRef.current.getElapsedTime();

      // Lerp rotation & zoom
      currentYRotRef.current  += (targetYRotRef.current  - currentYRotRef.current)  * 0.08;
      currentZoomRef.current  += (targetZoomRef.current  - currentZoomRef.current)   * 0.1;

      if (modelRef.current) {
        modelRef.current.rotation.y  = THREE.MathUtils.degToRad(currentYRotRef.current);
        // Gentle floating bob
        modelRef.current.position.y  = modelRef.current.userData.baseY + Math.sin(elapsed * 1.1) * 0.022;
      }

      // Advance animation mixer if present
      if (mixerRef.current) mixerRef.current.update(delta);

      camera.position.z = 3.6 / currentZoomRef.current;
      camera.lookAt(0, 1.1, 0);
      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      disposed = true;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();

      if (mixerRef.current) { mixerRef.current.stopAllAction(); mixerRef.current = null; }

      if (modelRef.current) {
        scene.remove(modelRef.current);
        modelRef.current.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.geometry?.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => m.dispose());
        });
        modelRef.current = null;
      }

      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
      dracoLoader.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mode]);

  // ── Pointer drag ─────────────────────────────────────────────────────────
  const onPointerDown = useCallback((event: React.PointerEvent) => {
    if (mode !== 'profile') return;
    isDraggingRef.current   = true;
    lastPointerXRef.current = event.clientX;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }, [mode]);

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = event.clientX - lastPointerXRef.current;
    lastPointerXRef.current = event.clientX;
    const delta = deltaX * 0.55;
    targetYRotRef.current += delta;
    onRotate?.(delta);
  }, [onRotate]);

  const onPointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: mode === 'profile' ? 'grab' : 'default',
        touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Decorative edge glows */}
      <div style={{
        position: 'absolute', right: 0, top: '15%',
        width: 3, height: '60%',
        background: 'linear-gradient(to bottom, transparent, rgba(200,169,110,0.5), transparent)',
        filter: 'blur(2px)', pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', left: 0, top: '25%',
        width: 2, height: '40%',
        background: 'linear-gradient(to bottom, transparent, rgba(78,205,196,0.25), transparent)',
        filter: 'blur(2px)', pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Ground glow */}
      <div style={{
        position: 'absolute', bottom: '4%', left: '50%',
        transform: 'translateX(-50%)',
        width: '55%', height: 40,
        background: 'radial-gradient(ellipse, rgba(200,169,110,0.22) 0%, transparent 70%)',
        filter: 'blur(10px)', pointerEvents: 'none', zIndex: 1,
      }} />
    </div>
  );
}