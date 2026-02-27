import { useEffect, useState } from "react";
import BackgroundVaporwave from "../../components/background/BackgroundVaporwave";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [fxEnabled, setFxEnabled] = useState(true);

  // Respecter prefer-reduced-motion (détecté côté client)
  useEffect(() => {
    let mq: MediaQueryList | null = null;
    try {
      mq = window.matchMedia?.("(prefers-reduced-motion: reduce)") ?? null;
    } catch {
      mq = null;
    }
    if (mq?.matches) setFxEnabled(false);

    // Si l'utilisateur change la préférence pendant la session
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setFxEnabled(false);
    };
    mq?.addEventListener?.("change", onChange);
    return () => mq?.removeEventListener?.("change", onChange);
  }, []);

  // Ajuste l'opacité/dim du fond lors du scroll (attache la .bg-dim)
  useEffect(() => {
    const dim = document.querySelector(".bg-dim") as HTMLDivElement | null;
    if (!dim) return;

    const onScroll = () => {
      const p = Math.min(1, window.scrollY / 500);
      dim.style.background = `rgba(0,0,0,${0.05 + p * 0.20})`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Background fullscreen (fixed) - prend tout l'écran et est en dessous */}
      <div className="bg-fixed" aria-hidden="true">
        <BackgroundVaporwave enabled={fxEnabled} />
      </div>

      {/* overlays visuels (vignette, dim, etc.) */}
      <div className="bg-overlay" aria-hidden="true" />
      <div className="bg-vignette" aria-hidden="true" />
      <div className="bg-dim" aria-hidden="true" />

      {/* shell contient header + contenu */}
      <div className="shell">
        {/* Header / navigation - full width but .nav-inner centre le contenu */}
        <header className="nav" role="banner">
          <div className="nav-inner">
            <div className="brand" aria-hidden="false">
              <span className="brand-dot" />
              <span className="brand-title">Icelios</span>
              <span className="badge">Fullstack • React/TS</span>
            </div>

            <nav className="nav-links" role="navigation" aria-label="Main navigation">
              <a href="#projets">Projets</a>
              <a href="#skills">Skills</a>
              <a href="#docs">Documents</a>

              {/* bouton toggle FX */}
              <button
                className="btn"
                onClick={() => setFxEnabled((v) => !v)}
                aria-pressed={fxEnabled}
                title={fxEnabled ? "Désactiver les effets" : "Activer les effets"}
              >
                {fxEnabled ? "Effets: ON" : "Effets: OFF"}
              </button>
            </nav>
          </div>
        </header>

        {/* Main content. IMPORTANT : laisser la place au header (padding-top via CSS) */}
        <main className="container" role="main">
          {children}
        </main>
      </div>
    </>
  );
}