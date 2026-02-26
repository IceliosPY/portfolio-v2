import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { enabled?: boolean };

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
    scene.fog = new THREE.Fog(0x07080b, 10, 55);

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

    const amb = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(amb);

    const dir = new THREE.DirectionalLight(0xff2a55, 0.35);
    dir.position.set(4, 8, 6);
    scene.add(dir);

    // grille
    const grid = new THREE.GridHelper(220, 60, 0xff2a55, 0xff2a55);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    grid.position.y = -0.2;
    scene.add(grid);

    // sol sombre sous la grille
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(220, 220, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x05060a, transparent: true, opacity: 0.7 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.21;
    scene.add(floor);

    // montagnes low-poly wireframe (bords)
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
        opacity: 0.18,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(side * 55, -0.18, -25);
      mesh.rotation.z = side === 1 ? 0.18 : -0.18;
      return mesh;
    }

    const m1 = makeMountains(-1);
    const m2 = makeMountains(1);
    scene.add(m1, m2);

    let t0 = performance.now();
    let scroll = 0;
    const targetFps = 45;
    const frameMin = 1000 / targetFps;

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

        // travelling : la grille avance vers toi
        scroll += 0.055;
        grid.position.z = (scroll % 6) * 1.0;

        // respiration légère des montagnes
        const breathe = Math.sin(now * 0.0006) * 0.04;
        m1.position.y = -0.18 + breathe;
        m2.position.y = -0.18 - breathe;

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
      host.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [enabled]);

  return <div ref={hostRef} className="bg-stage" />;
}