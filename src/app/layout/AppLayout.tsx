import { useEffect, useMemo, useState } from "react";
import BackgroundVaporwave from "../../components/background/BackgroundVaporwave";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [fxEnabled, setFxEnabled] = useState(true);

  const prefersReduced = useMemo(() => {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (prefersReduced) setFxEnabled(false);
  }, [prefersReduced]);

  useEffect(() => {
    const dim = document.querySelector(".bg-dim") as HTMLDivElement | null;
    if (!dim) return;

    const onScroll = () => {
      const p = Math.min(1, window.scrollY / 500);
      dim.style.background = `rgba(0,0,0,${0.15 + p * 0.35})`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <BackgroundVaporwave enabled={fxEnabled} />
      <div className="bg-overlay" />
      <div className="bg-vignette" />
      <div className="bg-dim" />

      <div className="shell">
        <header className="nav">
          <div className="nav-inner">
            <div className="brand">
              <span className="brand-dot" />
              <span>Icelios</span>
              <span className="badge">Fullstack • React/TS</span>
            </div>

            <nav className="nav-links">
              <a href="#projets">Projets</a>
              <a href="#skills">Skills</a>
              <a href="#docs">Documents</a>
              <button className="btn" onClick={() => setFxEnabled(v => !v)}>
                {fxEnabled ? "Effets: ON" : "Effets: OFF"}
              </button>
            </nav>
          </div>
        </header>

        <main className="container">{children}</main>
      </div>
    </>
  );
}