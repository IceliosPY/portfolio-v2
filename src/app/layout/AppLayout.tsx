import { useEffect, useMemo, useState } from "react";
import BackgroundVaporwave from "../../components/background/BackgroundVaporwave";

function IconGithub(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.14-1.1-1.44-1.1-1.44-.9-.62.07-.6.07-.6 1 .07 1.52 1.03 1.52 1.03.9 1.52 2.36 1.08 2.94.83.09-.64.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.5 9.5 0 0 1 12 6.8c.85 0 1.7.11 2.5.33 1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.93.68 1.88v2.79c0 .26.18.57.69.48A10 10 0 0 0 12 2z"
      />
    </svg>
  );
}

function IconLinkedIn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 23.5h4V7.98h-4V23.5zM8.5 7.98h3.83v2.12h.05c.53-1.01 1.83-2.08 3.77-2.08 4.03 0 4.78 2.65 4.78 6.1v9.38h-4v-8.31c0-1.98-.04-4.52-2.76-4.52-2.76 0-3.18 2.16-3.18 4.39v8.44h-4V7.98z"
      />
    </svg>
  );
}

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
      dim.style.background = `rgba(0,0,0,${0.10 + p * 0.25})`;
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

            <nav className="nav-links" aria-label="Navigation principale">
              <a href="#projets">Projets</a>
              <a href="#skills">Skills</a>
              <a href="#docs">Documents</a>

              {/* ✅ Réseaux : un seul hover */}
              <div className="nav-social" aria-label="Réseaux sociaux">
                <button type="button" className="icon-btn social-trigger" aria-haspopup="true">
                  <span className="icon-btn-dot" />
                  <span className="sr-only">Réseaux</span>
                </button>

                <div className="social-pop" role="menu">
                  <a
                    role="menuitem"
                    className="social-item"
                    href="https://github.com/IceliosPY"
                    target="_blank"
                    rel="noreferrer"
                    title="GitHub"
                  >
                    <IconGithub />
                    <span>GitHub</span>
                  </a>

                  <a
                    role="menuitem"
                    className="social-item"
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    title="LinkedIn"
                  >
                    <IconLinkedIn />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

              <button className="btn" onClick={() => setFxEnabled((v) => !v)}>
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