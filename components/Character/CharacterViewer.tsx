'use client';
import React, { useRef, useEffect, useCallback, useState } from 'react';

export type CharacterKey = 'knight1' | 'knight2' | 'knight3';

interface CharacterViewerProps {
  mode: 'hero' | 'profile';
  character?: CharacterKey;
  rotation?: number;
  zoom?: number;
  onRotate?: (delta: number) => void;
}

// ── Module-level singletons ────────────────────────────────────────────────────
let _three: typeof import('three') | null = null;
let _GLTFLoader: any = null;
let _DRACOLoader: any = null;
let _loaderInstance: any = null;

// Per-character cache
const _sceneCache: Partial<Record<CharacterKey, any>> = {};
const _animCache:  Partial<Record<CharacterKey, any[]>> = {};
const _loadPromises: Partial<Record<CharacterKey, Promise<void>>> = {};

async function ensureThree() {
  if (_three) return _three;
  const [three, { GLTFLoader }, { DRACOLoader }] = await Promise.all([
    import('three'),
    import('three/examples/jsm/loaders/GLTFLoader.js'),
    import('three/examples/jsm/loaders/DRACOLoader.js'),
  ]);
  _three = three;
  _GLTFLoader = GLTFLoader;
  _DRACOLoader = DRACOLoader;
  return three;
}

function getLoader() {
  if (_loaderInstance) return _loaderInstance;
  const draco = new _DRACOLoader();
  draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  draco.preload();
  const loader = new _GLTFLoader();
  loader.setDRACOLoader(draco);
  _loaderInstance = loader;
  return loader;
}

function loadCharacter(key: CharacterKey): Promise<void> {
  if (_sceneCache[key]) return Promise.resolve();
  if (_loadPromises[key]) return _loadPromises[key]!;
  _loadPromises[key] = new Promise((resolve) => {
    getLoader().load(
      `/character-model/${key}.glb`,
      (gltf: any) => {
        _sceneCache[key] = gltf.scene;
        _animCache[key]  = gltf.animations ?? [];
        resolve();
      },
      undefined,
      () => { resolve(); }, // fail silently → procedural fallback
    );
  });
  return _loadPromises[key]!;
}

// ── Procedural fallback ────────────────────────────────────────────────────────
function buildProceduralModel(THREE: typeof import('three')) {
  const g   = new THREE.Group();
  const mat = (c: number, r: number, m: number) =>
    new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
  const armor = mat(0x181923, 0.56, 0.45);
  const dark  = mat(0x0b0c12, 0.65, 0.35);
  const gold  = mat(0xc8a96e, 0.28, 0.75);
  const teal  = mat(0x4ecdc4, 0.25, 0.55);
  const skin  = mat(0xb98766, 0.50, 0.05);
  const hair  = mat(0x151016, 0.70, 0.10);

  const add = (mesh: any, p: [number,number,number], r: [number,number,number] = [0,0,0]) => {
    mesh.position.set(...p); mesh.rotation.set(...r);
    mesh.castShadow = mesh.receiveShadow = true;
    g.add(mesh);
  };
  add(new THREE.Mesh(new THREE.CapsuleGeometry(0.34,0.78,8,18), armor), [0,1.33,0]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.72,0.15,0.32), gold),      [0,1.75,0.01]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.55,0.09,0.18), teal),      [0,1.44,0.19]);
  add(new THREE.Mesh(new THREE.CapsuleGeometry(0.12,0.18,8,12), skin),  [0,1.96,0]);
  add(new THREE.Mesh(new THREE.SphereGeometry(0.28,28,22), skin),       [0,2.23,0]);
  add(new THREE.Mesh(new THREE.SphereGeometry(0.29,28,12,0,Math.PI*2,0,Math.PI*0.48), hair), [0,2.34,-0.02]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.22,0.045,0.035), dark),    [-0.09,2.23,0.25]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.22,0.045,0.035), dark),    [0.09,2.23,0.25]);
  add(new THREE.Mesh(new THREE.CapsuleGeometry(0.09,0.62,8,14), armor), [-0.49,1.36,0],[0,0,-0.2]);
  add(new THREE.Mesh(new THREE.CapsuleGeometry(0.09,0.62,8,14), armor), [0.49,1.36,0],[0,0,0.2]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.18,0.16,0.2), gold),       [-0.39,1.75,0.01],[0,0,-0.16]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.18,0.16,0.2), gold),       [0.39,1.75,0.01],[0,0,0.16]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.18,0.18,0.16), dark),      [-0.58,0.98,0.01]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.18,0.18,0.16), dark),      [0.58,0.98,0.01]);
  add(new THREE.Mesh(new THREE.CapsuleGeometry(0.11,0.76,8,14), dark),  [-0.18,0.5,0],[0.04,0,0]);
  add(new THREE.Mesh(new THREE.CapsuleGeometry(0.11,0.76,8,14), dark),  [0.18,0.5,0],[0.04,0,0]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.24,0.12,0.34), gold),      [-0.18,0.9,0.01]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.24,0.12,0.34), gold),      [0.18,0.9,0.01]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.27,0.12,0.42), dark),      [-0.18,0.08,0.06]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.27,0.12,0.42), dark),      [0.18,0.08,0.06]);
  g.userData.procedural = true;
  return g;
}

// ── Repivot + freeze ──────────────────────────────────────────────────────────
function repivotModel(
  THREE: typeof import('three'),
  src: any,
  mode: 'hero' | 'profile',
  isClone: boolean,
): any {
  const model = isClone ? src.clone() : src;

  // Step 1: park the model in a throw-away scene so updateMatrixWorld fully
  // resolves ALL nested transforms (bones, armature offsets, export origins).
  const tmp = new THREE.Scene();
  tmp.add(model);
  tmp.updateMatrixWorld(true);

  // Step 2: measure world-space bounds with all transforms resolved.
  const box    = new THREE.Box3().setFromObject(model);
  const size   = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  // Step 3: remove from temp scene before reparenting.
  tmp.remove(model);

  // Guard against empty / degenerate models.
  const h = size.y > 0.001 ? size.y : 1;
  const scale = (mode === 'hero' ? 2.5 : 2.3) / h;

  // Step 4: apply scale, then shift so feet sit exactly on y=0, centred x/z.
  model.scale.setScalar(scale);
  model.position.set(
    -center.x * scale,
    -box.min.y * scale,
    -center.z * scale,
  );
  model.updateMatrixWorld(true);

  // Step 5: freeze every child — only the pivot wrapper updates each frame.
  model.traverse((child: any) => {
    child.matrixAutoUpdate = false;
    child.updateMatrix();
    if (child.isMesh) {
      child.castShadow = child.receiveShadow = true;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((m: any) => {
        m.side = THREE.FrontSide;
        if ('envMapIntensity' in m) m.envMapIntensity = 1.2;
        m.needsUpdate = true;
      });
    }
  });

  const pivot = new THREE.Group();
  pivot.add(model);
  pivot.userData.baseY = 0; // feet are at y=0; bob animates the pivot itself
  return pivot;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CharacterViewer({
  mode,
  character = 'knight1',
  rotation = 0,
  zoom = 1,
  onRotate,
}: CharacterViewerProps) {
  const containerRef    = useRef<HTMLDivElement>(null);
  const rafRef          = useRef<number>(0);
  const clockRef        = useRef<any>(null);
  const rendererRef     = useRef<any>(null);
  const sceneRef        = useRef<any>(null);
  const cameraRef       = useRef<any>(null);
  const pivotRef        = useRef<any>(null);
  const mixerRef        = useRef<any>(null);
  const characterRef    = useRef<CharacterKey>(character);
  const [ready, setReady] = useState(false);

  const targetYRotRef   = useRef(rotation);
  const currentYRotRef  = useRef(rotation);
  const targetZoomRef   = useRef(zoom);
  const currentZoomRef  = useRef(zoom);
  const isDraggingRef   = useRef(false);
  const lastPointerXRef = useRef(0);
  const lastRenderRef   = useRef({ rot: 0, zoom: 0, elapsed: 0 });

  useEffect(() => { targetYRotRef.current = rotation; }, [rotation]);
  useEffect(() => { targetZoomRef.current = zoom; }, [zoom]);

  // ── Swap character without rebuilding renderer ────────────────────────────
  useEffect(() => {
    characterRef.current = character;
    const scene = sceneRef.current;
    const THREE = _three;
    if (!scene || !THREE) return; // renderer not ready yet — initial load handles it

    let cancelled = false;

    (async () => {
      setReady(false);
      await loadCharacter(character);
      if (cancelled) return;

      // Remove old pivot
      if (pivotRef.current) {
        scene.remove(pivotRef.current);
        if (mixerRef.current) { mixerRef.current.stopAllAction(); mixerRef.current = null; }
        pivotRef.current = null;
      }

      const src  = _sceneCache[character];
      const anims = _animCache[character] ?? [];
      const pivot = src
        ? repivotModel(THREE, src, mode, true)
        : repivotModel(THREE, buildProceduralModel(THREE), mode, false);

      // Snap rotation to 0 on character change for a clean reveal
      targetYRotRef.current  = 0;
      currentYRotRef.current = 0;

      if (anims.length > 0) {
        const mixer = new THREE.AnimationMixer(src);
        mixerRef.current = mixer;
        mixer.clipAction(anims[0]).play();
      }

      pivotRef.current = pivot;
      scene.add(pivot);
      if (!cancelled) setReady(true);
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character]);

  // ── Initial mount — build renderer, scene, lights ────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;

    (async () => {
      const THREE = await ensureThree();
      if (disposed) return;

      const charKey = characterRef.current;
      const knightPromise = loadCharacter(charKey);

      // ── Renderer ──────────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({
        antialias: window.devicePixelRatio < 2,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.shadowMap.enabled   = true;
      renderer.shadowMap.type      = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace    = THREE.SRGBColorSpace;
      renderer.toneMapping         = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.inset    = '0';
      renderer.domElement.style.zIndex   = '0';
      renderer.domElement.style.width    = '100%';
      renderer.domElement.style.height   = '100%';
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // ── Scene & Camera ─────────────────────────────────────────────────
      const scene  = new THREE.Scene();
      sceneRef.current = scene;
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 1.3, 3.6);
      camera.lookAt(0, 1.1, 0);
      cameraRef.current = camera;
      clockRef.current  = new THREE.Clock();

      // ── Lighting ───────────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xfff0d0, 0.9));
      const key = new THREE.DirectionalLight(0xfff5e0, 2.8);
      key.position.set(2.5, 6, 4);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.near   = 1;  key.shadow.camera.far  = 18;
      key.shadow.camera.left   = -3; key.shadow.camera.right = 3;
      key.shadow.camera.bottom = -3; key.shadow.camera.top   = 3;
      key.shadow.bias = -0.001;
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x4ecdc4, 0.6);
      fill.position.set(-4, 2, 1.5);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xe8c070, 1.4);
      rim.position.set(0.5, 5, -5);
      scene.add(rim);
      const under = new THREE.DirectionalLight(0x8090b0, 0.25);
      under.position.set(0, -2, 2);
      scene.add(under);

      // ── Ground disc ────────────────────────────────────────────────────
      const ground = new THREE.Mesh(
        new THREE.CircleGeometry(0.85, 32),
        new THREE.MeshBasicMaterial({ color: 0xc8a96e, transparent: true, opacity: 0.13, depthWrite: false }),
      );
      ground.rotation.x       = -Math.PI / 2;
      ground.position.y       = 0.001;
      ground.matrixAutoUpdate = false;
      ground.updateMatrix();
      scene.add(ground);

      // ── Resize ────────────────────────────────────────────────────────
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

      // ── Wait for initial GLB ───────────────────────────────────────────
      await knightPromise;
      if (disposed) return;

      const src   = _sceneCache[charKey];
      const anims = _animCache[charKey] ?? [];
      const pivot = src
        ? repivotModel(THREE, src, mode, true)
        : repivotModel(THREE, buildProceduralModel(THREE), mode, false);

      if (anims.length > 0) {
        const mixer = new THREE.AnimationMixer(src);
        mixerRef.current = mixer;
        mixer.clipAction(anims[0]).play();
      }

      pivotRef.current = pivot;
      scene.add(pivot);
      if (!disposed) setReady(true);

      // ── Render loop ────────────────────────────────────────────────────
      const animate = () => {
        rafRef.current = requestAnimationFrame(animate);
        if (!clockRef.current || !pivotRef.current) return;

        const delta   = clockRef.current.getDelta();
        const elapsed = clockRef.current.getElapsedTime();

        currentYRotRef.current += (targetYRotRef.current - currentYRotRef.current) * 0.08;
        currentZoomRef.current += (targetZoomRef.current - currentZoomRef.current) * 0.1;

        if (mixerRef.current) mixerRef.current.update(delta);

        const lr       = lastRenderRef.current;
        const rotDiff  = Math.abs(currentYRotRef.current - lr.rot);
        const zoomDiff = Math.abs(currentZoomRef.current - lr.zoom);
        const bobDiff  = Math.abs(elapsed - lr.elapsed);

        if (rotDiff > 0.001 || zoomDiff > 0.0001 || bobDiff > 0.016 || !!mixerRef.current) {
          if (pivotRef.current) {
            pivotRef.current.rotation.y = THREE.MathUtils.degToRad(currentYRotRef.current);
            pivotRef.current.position.y = pivotRef.current.userData.baseY + Math.sin(elapsed * 1.1) * 0.022;
          }
          camera.position.z = 3.6 / currentZoomRef.current;
          camera.lookAt(0, 1.1, 0);
          renderer.render(scene, camera);
          lr.rot = currentYRotRef.current; lr.zoom = currentZoomRef.current; lr.elapsed = elapsed;
        }
      };
      animate();

      // ── Cleanup ────────────────────────────────────────────────────────
      (container as any).__threeCleanup = () => {
        cancelAnimationFrame(rafRef.current);
        ro.disconnect();
        if (mixerRef.current) { mixerRef.current.stopAllAction(); mixerRef.current = null; }
        if (pivotRef.current) {
          scene.remove(pivotRef.current);
          pivotRef.current.traverse((child: any) => {
            if (!child.isMesh || !child.userData?.procedural) return;
            child.geometry?.dispose();
            (Array.isArray(child.material) ? child.material : [child.material]).forEach((m: any) => m.dispose());
          });
          pivotRef.current = null;
        }
        ground.geometry.dispose();
        (ground.material as any).dispose();
        renderer.dispose();
        if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
      };
    })();

    return () => {
      disposed = true;
      const cleanup = (container as any).__threeCleanup;
      if (cleanup) { cleanup(); delete (container as any).__threeCleanup; }
      else cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // ── Pointer drag ──────────────────────────────────────────────────────────
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
    const delta = dx * 0.55;
    targetYRotRef.current += delta;
    onRotate?.(delta);
  }, [onRotate]);

  const onPointerUp = useCallback(() => { isDraggingRef.current = false; }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%', height: '100%', position: 'relative',
        overflow: 'hidden', cursor: mode === 'profile' ? 'grab' : 'default', touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {!ready && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 28, height: 28, border: '2px solid rgba(200,169,110,0.2)', borderTopColor: 'rgba(200,169,110,0.85)', borderRadius: '50%', animation: 'cv-spin 0.75s linear infinite' }} />
          <style>{`@keyframes cv-spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}
      <div style={{ position: 'absolute', right: 0, top: '15%', width: 3, height: '60%', background: 'linear-gradient(to bottom,transparent,rgba(200,169,110,0.5),transparent)', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', left: 0, top: '25%', width: 2, height: '40%', background: 'linear-gradient(to bottom,transparent,rgba(78,205,196,0.25),transparent)', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)', width: '55%', height: 40, background: 'radial-gradient(ellipse,rgba(200,169,110,0.22) 0%,transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none', zIndex: 1 }} />
    </div>
  );
}