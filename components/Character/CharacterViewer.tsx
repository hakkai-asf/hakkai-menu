'use client';
import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'three';

interface CharacterViewerProps {
  mode: 'hero' | 'profile';
  rotation?: number;
  zoom?: number;
  onRotate?: (delta: number) => void;
}

/* ─────────────────────────────────────────────────────────────
   Error boundary for catching FBX load/parse or WebGL errors
   Must render a 3D component since it is inside the Canvas
   ───────────────────────────────────────────────────────────── */
class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: any }
> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("CanvasErrorBoundary caught a rendering error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function FallbackMesh() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.8;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.4;
    }
  });
  return (
    <mesh ref={mesh} position={[0, 1.1, 0]}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#C8A96E" wireframe roughness={0.15} metalness={0.85} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────
   Inner model component — renders inside <Canvas>
   Uses refs passed from parent so nothing re-renders the canvas
   ───────────────────────────────────────────────────────────── */
interface ModelProps {
  targetRotRef:   React.MutableRefObject<number>;
  currentRotRef:  React.MutableRefObject<number>;
  targetZoomRef:  React.MutableRefObject<number>;
  currentZoomRef: React.MutableRefObject<number>;
}

function FBXModel({ targetRotRef, currentRotRef, targetZoomRef, currentZoomRef }: ModelProps) {
  const fbx    = useLoader(FBXLoader, '/character-model/character.fbx');
  const group  = useRef<THREE.Group>(null);
  const innerGroup = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const mixerRef   = useRef<THREE.AnimationMixer | null>(null);

  /* Compute scaling & position offsets purely without mutating the cached asset */
  const { scale, offsetX, offsetY, offsetZ } = useMemo(() => {
    // Compute bounding box from pristine cached fbx object
    const box = new THREE.Box3().setFromObject(fbx);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleVal = maxDim > 0 ? (2.2 / maxDim) : 1;

    // We want the average X, Z to be 0 and min Y to be 0
    return {
      scale: scaleVal,
      offsetX: -center.x * scaleVal,
      offsetY: -box.min.y * scaleVal,
      offsetZ: -center.z * scaleVal,
    };
  }, [fbx]);

  /* Traverses materials to enable shadows & update settings */
  useEffect(() => {
    fbx.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow    = true;
      mesh.receiveShadow = true;

      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m: THREE.Material) => {
        if (m instanceof THREE.MeshPhongMaterial) {
          m.shininess   = 60;
          m.needsUpdate = true;
        }
      });
    });
  }, [fbx]);

  /* Lifecycle and mixer manager for animations */
  useEffect(() => {
    if (fbx.animations && fbx.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(fbx);
      const action = mixer.clipAction(fbx.animations[0]);
      action.play();
      mixerRef.current = mixer;
      return () => {
        action.stop();
        mixer.uncacheRoot(fbx);
        mixerRef.current = null;
      };
    }
  }, [fbx]);

  /* Zero-lag animation loop */
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    /* Smooth rotation (applied to outer group) */
    currentRotRef.current += (targetRotRef.current - currentRotRef.current) * 0.1;
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.degToRad(currentRotRef.current);
    }

    /* Smooth zoom (camera Z position) */
    currentZoomRef.current += (targetZoomRef.current - currentZoomRef.current) * 0.12;
    (camera as THREE.PerspectiveCamera).position.z = 4.5 / currentZoomRef.current;

    /* Idle bobbing (applied to inner group position relative to root) */
    if (innerGroup.current) {
      innerGroup.current.position.y = offsetY + Math.sin(t * 1.1) * 0.028;
    }

    /* Update animations */
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return (
    <group ref={group}>
      <group ref={innerGroup} scale={[scale, scale, scale]} position={[offsetX, offsetY, offsetZ]}>
        <primitive object={fbx} />
      </group>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   Loading placeholder rendered inside the Canvas via Suspense
   ───────────────────────────────────────────────────────────── */
function LoadingPlaceholder() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.8;
    }
  });
  return (
    <mesh ref={mesh} position={[0, 1.1, 0]}>
      <octahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#C8A96E" wireframe />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main exported component
   ───────────────────────────────────────────────────────────── */
export default function CharacterViewer({
  mode,
  rotation = 0,
  zoom = 1,
  onRotate,
}: CharacterViewerProps) {
  const [mounted, setMounted] = useState(false);

  /* Control refs — never cause a re-render */
  const targetRotRef   = useRef(rotation);
  const currentRotRef  = useRef(rotation);
  const targetZoomRef  = useRef(zoom);
  const currentZoomRef = useRef(zoom);

  useEffect(() => { targetRotRef.current  = rotation; }, [rotation]);
  useEffect(() => { targetZoomRef.current = zoom;     }, [zoom]);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Drag-to-rotate */
  const isDragging = useRef(false);
  const lastPtrX   = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (mode !== 'profile') return;
    isDragging.current = true;
    lastPtrX.current   = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx    = e.clientX - lastPtrX.current;
    lastPtrX.current = e.clientX;
    const delta = dx * 0.55;
    targetRotRef.current += delta;
    onRotate?.(delta);
  };

  const handlePointerUp = () => { isDragging.current = false; };

  // Render static styled container during SSR to prevent layout shifts
  if (!mounted) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 0, top: '15%', width: 3, height: '60%', background: 'linear-gradient(to bottom, transparent, rgba(200,169,110,0.5), transparent)', filter: 'blur(2px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: 0, top: '25%', width: 2, height: '40%', background: 'linear-gradient(to bottom, transparent, rgba(78,205,196,0.25), transparent)', filter: 'blur(2px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)', width: '55%', height: 40, background: 'radial-gradient(ellipse, rgba(200,169,110,0.22) 0%, transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
      </div>
    );
  }

  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        gl={{
          antialias:           true,
          alpha:               true,
          powerPreference:     'high-performance',
          toneMapping:         THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5,
        }}
        camera={{ position: [0, 1.1, 4.5], fov: 50, near: 0.01, far: 5000 }}
        shadows
        style={{ position: 'absolute', inset: 0, cursor: mode === 'profile' ? 'grab' : 'default' }}
      >
        {/* Lights */}
        <ambientLight intensity={2.0} color="#fff8ee" />
        <directionalLight
          position={[3, 6, 4]}
          intensity={3.0}
          color="#fff4e0"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-4, 2, 2]} intensity={1.0} color="#4ecdc4" />
        <directionalLight position={[0, 4, -4]}  intensity={1.5} color="#c8a96e" />
        <pointLight position={[0, 0, 3]} intensity={0.8} />

        {/* Ground disc for dynamic shadows */}
        <mesh rotation-x={-Math.PI / 2} position-y={0.001} receiveShadow>
          <planeGeometry args={[15, 15]} />
          <shadowMaterial opacity={0.4} />
        </mesh>

        {/* Decorative golden circle base */}
        <mesh rotation-x={-Math.PI / 2} position-y={0.002}>
          <circleGeometry args={[0.9, 48]} />
          <meshBasicMaterial color="#c8a96e" transparent opacity={0.12} depthWrite={false} />
        </mesh>

        {/* FBX model with Suspense & Error Boundary */}
        <Suspense fallback={<LoadingPlaceholder />}>
          <CanvasErrorBoundary fallback={<FallbackMesh />}>
            <FBXModel
              targetRotRef={targetRotRef}
              currentRotRef={currentRotRef}
              targetZoomRef={targetZoomRef}
              currentZoomRef={currentZoomRef}
            />
          </CanvasErrorBoundary>
        </Suspense>
      </Canvas>

      {/* CSS rim-light overlays */}
      <div style={{ position: 'absolute', right: 0, top: '15%', width: 3, height: '60%', background: 'linear-gradient(to bottom, transparent, rgba(200,169,110,0.5), transparent)', filter: 'blur(2px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 0, top: '25%', width: 2, height: '40%', background: 'linear-gradient(to bottom, transparent, rgba(78,205,196,0.25), transparent)', filter: 'blur(2px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)', width: '55%', height: 40, background: 'radial-gradient(ellipse, rgba(200,169,110,0.22) 0%, transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
    </div>
  );
}
