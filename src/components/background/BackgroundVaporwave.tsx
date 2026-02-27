import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { enabled?: boolean };

function makeGridTexture({
  size = 512,
  majorEvery = 8,
  minorAlpha = 0.18,
  majorAlpha = 0.35,
  color = "#ff2a55",
  glow = 1,
}: {
  size?: number;
  majorEvery?: number;
  minorAlpha?: number;
  majorAlpha?: number;
  color?: string;
  glow?: number;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  const cells = 64;
  const step = size / cells;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;

  if (glow > 0) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 4;
  }

  for (let i = 0; i <= cells; i++) {
    const isMajor = i % majorEvery === 0;
    ctx.globalAlpha = isMajor ? majorAlpha : minorAlpha;

    const p = i * step + 0.5;

    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(size, p);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 6;
  tex.colorSpace = THREE.SRGBColorSpace;

  return tex;
}

export default function BackgroundVaporwave({ enabled = true }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !enabled) return;

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const animateAllowed = !prefersReduced;

    const scene = new THREE.Scene();

    // Fog un peu moins agressive pour mieux voir les montagnes
    scene.fog = new THREE.Fog(0x07080b, 14, 70);

    const camera = new THREE.PerspectiveCamera(
      55,
      host.clientWidth / host.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 4.2, 10.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    // ===== Lights un peu renforcées
    const amb = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(amb);

    const dir = new THREE.DirectionalLight(0xff2a55, 0.45);
    dir.position.set(4, 8, 6);
    scene.add(dir);

    // ========= GRILLE =========
    const gridTex = makeGridTexture({
      minorAlpha: 0.18,  // + visible
      majorAlpha: 0.42,  // + visible
      glow: 1,
    });

    gridTex.repeat.set(10, 18);

    const floorGeo = new THREE.PlaneGeometry(220, 220, 1, 1);

    // fond moins sombre
    const floorBase = new THREE.Mesh(
      floorGeo,
      new THREE.MeshBasicMaterial({
        color: 0x05060a,
        transparent: true,
        opacity: 0.62, // avant 0.68
      })
    );
    floorBase.rotation.x = -Math.PI / 2;
    floorBase.position.y = -0.21;
    scene.add(floorBase);

    const floorGrid = new THREE.Mesh(
      floorGeo,
      new THREE.MeshBasicMaterial({
        map: gridTex,
        transparent: true,
        opacity: 0.98, // presque plein
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    floorGrid.rotation.x = -Math.PI / 2;
    floorGrid.position.y = -0.20;
    scene.add(floorGrid);

    // ========= MONTAGNES plus visibles =========
    function makeMountains(side: -1 | 1) {
      const geo = new THREE.PlaneGeometry(80, 30, 40, 10);
      const pos = geo.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z =
          Math.max(0, (y + 15) / 30) * (0.7 + Math.random() * 1.5) * 2.2 +
          Math.sin(x * 0.15) * 0.35;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;

      const mat = new THREE.MeshBasicMaterial({
        color: 0xff2a55,
        wireframe: true,
        transparent: true,
        opacity: 0.28, // avant 0.18 → beaucoup plus lisible
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(side * 55, -0.18, -25);
      mesh.rotation.z = side === 1 ? 0.18 : -0.18;

      return { mesh, geo, mat };
    }

    const m1 = makeMountains(-1);
    const m2 = makeMountains(1);
    scene.add(m1.mesh, m2.mesh);

    // ========= LOOP =========
    let t0 = performance.now();
    const targetFps = 45;
    const frameMin = 1000 / targetFps;

    let v = 0;

    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };

    const onMouseMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth) * 2 - 1;
      const cy = (e.clientY / window.innerHeight) * 2 - 1;
      camera.position.x = cx * 0.25;
      camera.position.y = 4.2 + cy * -0.12;
      camera.lookAt(0, 0, 0);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);

    const renderOnce = () => renderer.render(scene, camera);

    const loop = () => {
      const now = performance.now();
      const dt = now - t0;

      if (dt >= frameMin) {
        t0 = now - (dt % frameMin);

        v += 0.00135;
        if (v > 1000) v -= 1000;
        gridTex.offset.y = v;

        const breathe = Math.sin(now * 0.0006) * 0.04;
        m1.mesh.position.y = -0.18 + breathe;
        m2.mesh.position.y = -0.18 - breathe;

        renderer.render(scene, camera);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    if (animateAllowed) rafRef.current = requestAnimationFrame(loop);
    else renderOnce();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);

      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement);
      }

      floorGeo.dispose();
      (floorBase.material as THREE.Material).dispose();
      (floorGrid.material as THREE.Material).dispose();

      gridTex.dispose();

      m1.geo.dispose();
      m1.mat.dispose();
      m2.geo.dispose();
      m2.mat.dispose();

      renderer.dispose();
    };
  }, [enabled]);

  return <div ref={hostRef} className="bg-stage" />;
}