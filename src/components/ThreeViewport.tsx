import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CalculationResults, CupParameters } from '../types';
import { Play, Pause, RotateCcw, Eye, Layers, Scissors, Maximize2, Compass } from 'lucide-react';

interface ThreeViewportProps {
  params: CupParameters;
  results: CalculationResults;
  isAnimating: boolean;
  setIsAnimating: (anim: boolean) => void;
  animProgress: number;
  setAnimProgress: (p: number | ((prev: number) => number)) => void;
}

type ViewMode = 'comparison' | 'animation' | 'cup-only' | 'blank-only';

export const ThreeViewport: React.FC<ThreeViewportProps> = ({
  params,
  results,
  isAnimating,
  setIsAnimating,
  animProgress,
  setAnimProgress,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('comparison');
  const [showSectionCut, setShowSectionCut] = useState<boolean>(false);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showPunch, setShowPunch] = useState<boolean>(false);

  // Three.js instances stored in refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);
  const reqAnimIdRef = useRef<number | null>(null);

  // Camera spherical coordinates for smooth manual orbit
  const cameraControlRef = useRef({
    radius: 95,
    theta: Math.PI / 4, // azimuth
    phi: Math.PI / 3,   // elevation
    target: new THREE.Vector3(0, 10, 0),
    isDragging: false,
    prevPointer: { x: 0, y: 0 },
  });

  const { dz, h, s } = params;
  const { D0, d } = results;

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9); // slate-100 technical clean background
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 500);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting setup (crisp engineering lighting on aluminum metal)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight1.position.set(40, 70, 50);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    dirLight1.shadow.bias = -0.001;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe0f2fe, 0.45); // cool blue-sky fill
    dirLight2.position.set(-50, 40, -40);
    scene.add(dirLight2);

    const rimLight = new THREE.DirectionalLight(0xf8fafc, 0.4);
    rimLight.position.set(0, -20, -50);
    scene.add(rimLight);

    // 5. Technical Floor Grid (Blueprint style)
    const gridHelper = new THREE.GridHelper(120, 24, 0x0284c7, 0x94a3b8);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // Subtle floor shadow receiver plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(140, 140);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.08;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 6. Dynamic Group for all models & dimensions
    const dynamicGroup = new THREE.Group();
    dynamicGroupRef.current = dynamicGroup;
    scene.add(dynamicGroup);

    // Update Camera position from spherical coords
    const updateCameraPos = () => {
      const cc = cameraControlRef.current;
      const x = cc.radius * Math.sin(cc.phi) * Math.sin(cc.theta);
      const y = cc.radius * Math.cos(cc.phi);
      const z = cc.radius * Math.sin(cc.phi) * Math.cos(cc.theta);
      camera.position.set(x + cc.target.x, y + cc.target.y, z + cc.target.z);
      camera.lookAt(cc.target);
    };
    updateCameraPos();

    // Render loop
    const animate = () => {
      reqAnimIdRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 420;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqAnimIdRef.current) cancelAnimationFrame(reqAnimIdRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Pointer drag controls (orbit rotation and wheel zoom)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const cc = cameraControlRef.current;

    const onPointerDown = (e: PointerEvent) => {
      cc.isDragging = true;
      cc.prevPointer = { x: e.clientX, y: e.clientY };
      container.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!cc.isDragging || !cameraRef.current) return;
      const dx = e.clientX - cc.prevPointer.x;
      const dy = e.clientY - cc.prevPointer.y;
      cc.prevPointer = { x: e.clientX, y: e.clientY };

      // Orbit angles
      cc.theta -= dx * 0.009;
      cc.phi -= dy * 0.009;
      // Clamp elevation so camera doesn't flip or go under floor
      cc.phi = Math.max(0.08, Math.min(Math.PI / 2 - 0.04, cc.phi));

      const camera = cameraRef.current;
      const x = cc.radius * Math.sin(cc.phi) * Math.sin(cc.theta);
      const y = cc.radius * Math.cos(cc.phi);
      const z = cc.radius * Math.sin(cc.phi) * Math.cos(cc.theta);
      camera.position.set(x + cc.target.x, y + cc.target.y, z + cc.target.z);
      camera.lookAt(cc.target);
    };

    const onPointerUp = (e: PointerEvent) => {
      cc.isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {}
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cc.radius += e.deltaY * 0.08;
      cc.radius = Math.max(25, Math.min(180, cc.radius));

      if (cameraRef.current) {
        const camera = cameraRef.current;
        const x = cc.radius * Math.sin(cc.phi) * Math.sin(cc.theta);
        const y = cc.radius * Math.cos(cc.phi);
        const z = cc.radius * Math.sin(cc.phi) * Math.cos(cc.theta);
        camera.position.set(x + cc.target.x, y + cc.target.y, z + cc.target.z);
        camera.lookAt(cc.target);
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Animation frame updater for drawing transition
  useEffect(() => {
    let animTimer: number;
    if (isAnimating) {
      animTimer = window.setInterval(() => {
        setAnimProgress((prev) => {
          if (prev >= 1) {
            // Loop smoothly with a short pause
            return 0;
          }
          return Math.min(1, prev + 0.015);
        });
      }, 30);
    }
    return () => {
      if (animTimer) clearInterval(animTimer);
    };
  }, [isAnimating, setAnimProgress]);

  // Create & Rebuild 3D Meshes whenever params, viewMode, cut, or animProgress change
  const rebuildScene = useCallback(() => {
    const group = dynamicGroupRef.current;
    if (!group) return;

    // Clear previous children and dispose geometries/materials
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    }

    // Material: Clean Realistic Sheet Aluminum (сірий алюмінієвий метал, без розжарення)
    const aluminumMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8d0d8,
      metalness: 0.88,
      roughness: 0.32,
      side: THREE.DoubleSide,
    });

    const punchMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.7,
      roughness: 0.4,
      transparent: true,
      opacity: 0.65,
    });

    // Helper to create 3D text/line annotations
    const createDimArrow = (start: THREE.Vector3, end: THREE.Vector3, color = 0x0284c7) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([start, end]);
      const lineMat = new THREE.LineBasicMaterial({ color, linewidth: 2 });
      return new THREE.Line(lineGeo, lineMat);
    };

    // Arc angle for lathe geometry (half cut if section cut is active)
    const phiLength = showSectionCut ? Math.PI * 1.5 : Math.PI * 2;

    const ro = dz / 2;
    const ri = Math.max(0.1, (dz - 2 * s) / 2);
    const R0 = D0 / 2;

    // Dynamic spacing based on workpiece size
    const spacing = Math.max(R0 + 8, ro + 12);

    if (viewMode === 'comparison') {
      // 1. FLAT CIRCULAR BLANK (on the left: -X)
      const blankPoints: THREE.Vector2[] = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(R0, 0),
        new THREE.Vector2(R0, s),
        new THREE.Vector2(0, s),
      ];
      const blankGeo = new THREE.LatheGeometry(blankPoints, 64, 0, phiLength);
      const blankMesh = new THREE.Mesh(blankGeo, aluminumMaterial);
      blankMesh.position.set(-spacing, 0, 0);
      blankMesh.castShadow = true;
      blankMesh.receiveShadow = true;
      group.add(blankMesh);

      // 2. FINISHED CUP (on the right: +X)
      // Cylindrical cup with closed bottom, wall thickness s, height h
      const cupPoints: THREE.Vector2[] = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(ro, 0),
        new THREE.Vector2(ro, h),
        new THREE.Vector2(ri, h),
        new THREE.Vector2(ri, s),
        new THREE.Vector2(0, s),
      ];
      const cupGeo = new THREE.LatheGeometry(cupPoints, 64, 0, phiLength);
      const cupMesh = new THREE.Mesh(cupGeo, aluminumMaterial);
      cupMesh.position.set(spacing, 0, 0);
      cupMesh.castShadow = true;
      cupMesh.receiveShadow = true;
      group.add(cupMesh);

      // Dimension lines & helpers
      if (showDimensions) {
        // Blank diameter D0 annotation
        const d0Y = s + 4;
        const d0Line = createDimArrow(
          new THREE.Vector3(-spacing - R0, d0Y, 0),
          new THREE.Vector3(-spacing + R0, d0Y, 0),
          0x0284c7
        );
        group.add(d0Line);

        // Cup diameter dz annotation
        const dzY = h + 4;
        const dzLine = createDimArrow(
          new THREE.Vector3(spacing - ro, dzY, 0),
          new THREE.Vector3(spacing + ro, dzY, 0),
          0xe11d48 // rose/accent
        );
        group.add(dzLine);

        // Cup height h annotation
        const hLine = createDimArrow(
          new THREE.Vector3(spacing + ro + 5, 0, 0),
          new THREE.Vector3(spacing + ro + 5, h, 0),
          0xd97706 // amber/orange
        );
        group.add(hLine);
      }
    } else if (viewMode === 'animation') {
      // 3. MORPHING FORMING WORKPIECE (Cold Deep Drawing in Progress)
      // Conservation of surface area:
      // At animProgress t in [0, 1]:
      // Current drawn wall height = h * t
      // Current outer flange radius Rf(t) = sqrt(R0^2 - d * h * t)
      const t = Math.max(0.001, Math.min(1, animProgress));
      const currentH = h * t;
      const currentFlangeR = Math.max(ro, Math.sqrt(Math.max(ro * ro, R0 * R0 - d * currentH)));

      // Cross-section profile for Lathe:
      // Bottom flat disk (punch bottom), vertical wall, then bending into remaining flange
      const bendRadius = Math.min(2.5, currentH / 2);
      const animPoints: THREE.Vector2[] = [];

      // Inside bottom
      animPoints.push(new THREE.Vector2(0, s));
      animPoints.push(new THREE.Vector2(ri, s));

      if (currentH > 0.3) {
        // Wall inner profile
        animPoints.push(new THREE.Vector2(ri, currentH));
        // Wall outer top rim / flange transition
        animPoints.push(new THREE.Vector2(ro, currentH));
        if (currentFlangeR > ro + 0.1) {
          // Un-drawn outer flange pulling inward
          animPoints.push(new THREE.Vector2(currentFlangeR, currentH));
          animPoints.push(new THREE.Vector2(currentFlangeR, currentH - s));
          animPoints.push(new THREE.Vector2(ro, currentH - s));
        }
        // Outer wall down to bottom
        animPoints.push(new THREE.Vector2(ro, 0));
      } else {
        // Almost flat disk
        animPoints.push(new THREE.Vector2(currentFlangeR, s));
        animPoints.push(new THREE.Vector2(currentFlangeR, 0));
        animPoints.push(new THREE.Vector2(ro, 0));
      }
      animPoints.push(new THREE.Vector2(0, 0));

      const animGeo = new THREE.LatheGeometry(animPoints, 64, 0, phiLength);
      const animMesh = new THREE.Mesh(animGeo, aluminumMaterial);
      animMesh.position.set(0, 0, 0);
      animMesh.castShadow = true;
      animMesh.receiveShadow = true;
      group.add(animMesh);

      // Punch tool visualization (optional toggle)
      if (showPunch) {
        const punchHeight = 25;
        const punchGeo = new THREE.CylinderGeometry(ri - 0.2, ri - 0.2, punchHeight, 32);
        const punchMesh = new THREE.Mesh(punchGeo, punchMaterial);
        punchMesh.position.set(0, s + punchHeight / 2, 0);
        group.add(punchMesh);
      }

      // Live annotations during animation
      if (showDimensions) {
        // Height marker
        const hAnimLine = createDimArrow(
          new THREE.Vector3(ro + 6, 0, 0),
          new THREE.Vector3(ro + 6, currentH, 0),
          0xd97706
        );
        group.add(hAnimLine);

        // Flange marker
        const flangeLine = createDimArrow(
          new THREE.Vector3(-currentFlangeR, currentH + 3, 0),
          new THREE.Vector3(currentFlangeR, currentH + 3, 0),
          0x0284c7
        );
        group.add(flangeLine);
      }
    } else if (viewMode === 'cup-only') {
      // 4. FOCUS ON CUP
      const cupPoints: THREE.Vector2[] = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(ro, 0),
        new THREE.Vector2(ro, h),
        new THREE.Vector2(ri, h),
        new THREE.Vector2(ri, s),
        new THREE.Vector2(0, s),
      ];
      const cupGeo = new THREE.LatheGeometry(cupPoints, 64, 0, phiLength);
      const cupMesh = new THREE.Mesh(cupGeo, aluminumMaterial);
      cupMesh.position.set(0, 0, 0);
      cupMesh.castShadow = true;
      cupMesh.receiveShadow = true;
      group.add(cupMesh);

      if (showDimensions) {
        const dzLine = createDimArrow(new THREE.Vector3(-ro, h + 4, 0), new THREE.Vector3(ro, h + 4, 0), 0xe11d48);
        const hLine = createDimArrow(new THREE.Vector3(ro + 5, 0, 0), new THREE.Vector3(ro + 5, h, 0), 0xd97706);
        group.add(dzLine);
        group.add(hLine);
      }
    } else if (viewMode === 'blank-only') {
      // 5. FOCUS ON BLANK
      const blankPoints: THREE.Vector2[] = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(R0, 0),
        new THREE.Vector2(R0, s),
        new THREE.Vector2(0, s),
      ];
      const blankGeo = new THREE.LatheGeometry(blankPoints, 64, 0, phiLength);
      const blankMesh = new THREE.Mesh(blankGeo, aluminumMaterial);
      blankMesh.position.set(0, 0, 0);
      blankMesh.castShadow = true;
      blankMesh.receiveShadow = true;
      group.add(blankMesh);

      if (showDimensions) {
        const d0Line = createDimArrow(new THREE.Vector3(-R0, s + 4, 0), new THREE.Vector3(R0, s + 4, 0), 0x0284c7);
        group.add(d0Line);
      }
    }
  }, [dz, h, s, D0, d, viewMode, showSectionCut, showDimensions, showPunch, animProgress]);

  // Re-run build whenever inputs change
  useEffect(() => {
    rebuildScene();
  }, [rebuildScene]);

  // Reset Camera View
  const handleResetCamera = () => {
    const cc = cameraControlRef.current;
    cc.radius = 95;
    cc.theta = Math.PI / 4;
    cc.phi = Math.PI / 3;
    cc.target.set(0, 10, 0);
    if (cameraRef.current) {
      const camera = cameraRef.current;
      const x = cc.radius * Math.sin(cc.phi) * Math.sin(cc.theta);
      const y = cc.radius * Math.cos(cc.phi);
      const z = cc.radius * Math.sin(cc.phi) * Math.cos(cc.theta);
      camera.position.set(x, y + 10, z);
      camera.lookAt(cc.target);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-100 shadow-sm flex flex-col">
      {/* 3D Viewport Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-white/95 border-b border-slate-200 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
            3D Векторна модель (Three.js)
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded border border-slate-200">
            Матеріал: Алюміній листовий
          </span>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => {
              setViewMode('comparison');
              setIsAnimating(false);
            }}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              viewMode === 'comparison'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Порівняння 1:1
          </button>
          <button
            onClick={() => {
              setViewMode('animation');
              setIsAnimating(true);
            }}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'animation'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            Витягування
          </button>
          <button
            onClick={() => {
              setViewMode('cup-only');
              setIsAnimating(false);
            }}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              viewMode === 'cup-only'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Стакан
          </button>
          <button
            onClick={() => {
              setViewMode('blank-only');
              setIsAnimating(false);
            }}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              viewMode === 'blank-only'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Заготовка
          </button>
        </div>
      </div>

      {/* Canvas container */}
      <div
        ref={mountRef}
        className="relative w-full h-[380px] sm:h-[450px] cursor-grab active:cursor-grabbing touch-none select-none"
        title="Затисніть і тягніть для обертання, коліщатко або жест для масштабу"
      />

      {/* Floating Viewport Overlays */}
      <div className="absolute top-16 left-3 sm:left-4 z-10 pointer-events-none flex flex-col gap-1.5">
        {viewMode === 'comparison' && (
          <div className="flex gap-2">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs text-xs">
              <span className="text-slate-400 font-mono block text-[10px] uppercase">Заготовка (ліворуч)</span>
              <span className="font-semibold text-sky-700 font-mono">D₀ = {results.formatted.D0} мм</span>
            </div>
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs text-xs">
              <span className="text-slate-400 font-mono block text-[10px] uppercase">Стакан (праворуч)</span>
              <span className="font-semibold text-rose-600 font-mono">dз = {results.formatted.dz} мм</span>
              <span className="text-slate-400 font-mono mx-1">·</span>
              <span className="font-semibold text-amber-600 font-mono">h = {results.formatted.h} мм</span>
            </div>
          </div>
        )}
        {viewMode === 'animation' && (
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs text-xs">
            <span className="text-slate-400 font-mono block text-[10px] uppercase">Поточна глибина витяжки</span>
            <span className="font-semibold text-amber-600 font-mono">
              h(t) = {(h * animProgress).toFixed(1)} / {h.toFixed(1)} мм ({(animProgress * 100).toFixed(0)}%)
            </span>
          </div>
        )}
      </div>

      {/* Floating Action Controls (Right side) */}
      <div className="absolute top-16 right-3 sm:right-4 z-10 flex flex-col gap-1.5">
        <button
          onClick={() => setShowSectionCut((prev) => !prev)}
          className={`p-2 rounded-xl backdrop-blur-md border shadow-xs transition-colors flex items-center gap-1.5 text-xs font-medium ${
            showSectionCut
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-white/90 text-slate-700 hover:bg-white border-slate-200'
          }`}
          title="Переріз (Розріз) 1/2 моделі для огляду стінки"
        >
          <Scissors className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Розріз</span>
        </button>
        <button
          onClick={() => setShowDimensions((prev) => !prev)}
          className={`p-2 rounded-xl backdrop-blur-md border shadow-xs transition-colors flex items-center gap-1.5 text-xs font-medium ${
            showDimensions
              ? 'bg-sky-600 text-white border-sky-700'
              : 'bg-white/90 text-slate-700 hover:bg-white border-slate-200'
          }`}
          title="Показати/приховати розмірні лінії"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Розміри</span>
        </button>
        {viewMode === 'animation' && (
          <button
            onClick={() => setShowPunch((prev) => !prev)}
            className={`p-2 rounded-xl backdrop-blur-md border shadow-xs transition-colors flex items-center gap-1.5 text-xs font-medium ${
              showPunch
                ? 'bg-indigo-600 text-white border-indigo-700'
                : 'bg-white/90 text-slate-700 hover:bg-white border-slate-200'
            }`}
            title="Показати контур пуансона"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Пуансон</span>
          </button>
        )}
        <button
          onClick={handleResetCamera}
          className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-xs transition-colors flex items-center gap-1.5 text-xs font-medium"
          title="Скинути ракурс камери"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ракурс</span>
        </button>
      </div>

      {/* Animation Scrubber & Controls (visible in animation mode) */}
      {viewMode === 'animation' && (
        <div className="px-4 py-3 bg-white/95 border-t border-slate-200 z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {isAnimating ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isAnimating ? 'Пауза' : 'Пуск'}
          </button>

          <button
            onClick={() => {
              setIsAnimating(false);
              setAnimProgress(0);
            }}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
            title="Скинути на початок"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex-1 min-w-[140px] flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">0%</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={animProgress}
              onChange={(e) => {
                setIsAnimating(false);
                setAnimProgress(parseFloat(e.target.value));
              }}
              className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
            <span className="text-[11px] font-mono text-slate-400">100%</span>
          </div>

          <span className="text-xs font-mono font-semibold text-sky-800 bg-sky-50 px-2.5 py-1 rounded border border-sky-100">
            {(animProgress * 100).toFixed(0)}% деформації
          </span>
        </div>
      )}

      {/* Mobile Hint footer */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          Обертайте курсором / дотиком пальця · Масштаб колесом / щипком
        </span>
        <span className="font-mono text-slate-400 text-[10px]">Масштаб 1:1 збережено</span>
      </div>
    </div>
  );
};
