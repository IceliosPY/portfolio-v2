import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import BackgroundVaporwave from "../../components/background/BackgroundVaporwave";
import ScrollToHash from "../../components/ScrollToHash";

function IconGithub(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className}>
      <path
        fill="currentColor"
        d="M12 .5C5.73.5.75 5.62.75 12c0 5.1 3.29 9.42 7.86 10.95.58.1.8-.26.8-.57v-2.1c-3.2.72-3.88-1.57-3.88-1.57-.52-1.35-1.27-1.71-1.27-1.71-1.04-.73.08-.72.08-.72 1.15.08 1.75 1.2 1.75 1.2 1.02 1.78 2.67 1.26 3.32.96.1-.76.4-1.26.72-1.55-2.56-.3-5.26-1.31-5.26-5.82 0-1.28.45-2.32 1.2-3.14-.12-.3-.52-1.52.11-3.17 0 0 .98-.32 3.2 1.2a10.8 10.8 0 0 1 2.92-.4c.99 0 1.99.14 2.92.4 2.22-1.52 3.2-1.2 3.2-1.2.63 1.65.23 2.87.11 3.17.75.82 1.2 1.86 1.2 3.14 0 4.52-2.7 5.52-5.28 5.81.41.36.78 1.08.78 2.18v3.24c0 .31.21.68.81.57A11.27 11.27 0 0 0 23.25 12C23.25 5.62 18.27.5 12 .5Z"
      />
    </svg>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [fxEnabled, setFxEnabled] = useState(
    () => !(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false)
  );

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // dim au scroll
  useEffect(() => {
    const dim = document.querySelector(".bg-dim") as HTMLDivElement | null;
    if (!dim) return;

    const onScroll = () => {
      const p = Math.min(1, window.scrollY / 500);
      dim.style.background = `rgba(0,0,0,${0.08 + p * 0.20})`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermer le panneau mobile au clic dehors ou avec Échap.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileNavOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileNavOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Navigation vers les sections de Home, y compris depuis une autre route.
  const goSection = (hash: string) => {
    setMobileNavOpen(false);

    if (location.pathname === "/" && location.hash === hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
      return;
    }

    navigate({ pathname: "/", hash });
  };

  return (
    <>
      <BackgroundVaporwave enabled={fxEnabled} />
      <div className="bg-overlay" />
      <div className="bg-vignette" />
      <div className="bg-dim" />

      <div className="shell">
        <header className="nav">
          <div className="nav-inner" ref={navRef}>
            <NavLink
              to="/"
              className="brand"
              aria-label="Accueil"
              onClick={() => setMobileNavOpen(false)}
            >
              <span className="brand-dot" />
              <span>Icelios</span>
              <span className="badge">Fullstack • React/TS</span>
            </NavLink>

            <button
              type="button"
              className="nav-toggle"
              aria-controls="primary-navigation"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              <span>{mobileNavOpen ? "Fermer" : "Menu"}</span>
              <span className="nav-toggle-indicator" aria-hidden="true" />
            </button>

            <nav
              id="primary-navigation"
              className="nav-links"
              aria-label="Navigation principale"
              data-mobile-open={mobileNavOpen ? "true" : "false"}
            >
              {/* Sections de Home */}
              <button type="button" className="nav-link-btn" onClick={() => goSection("#apropos")}>
                À propos
              </button>
              <button type="button" className="nav-link-btn" onClick={() => goSection("#projets")}>
                Projets
              </button>
              <button type="button" className="nav-link-btn" onClick={() => goSection("#skills")}>
                Skills
              </button>
              <button type="button" className="nav-link-btn" onClick={() => goSection("#docs")}>
                Documents
              </button>

              <NavLink
                to="/experiences"
                className="nav-link-router"
                onClick={() => setMobileNavOpen(false)}
              >
                Expériences
              </NavLink>

              <a
                className="icon-btn nav-network"
                href="https://github.com/IceliosPY"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <IconGithub className="icon" />
                <span className="nav-network-label">GitHub</span>
              </a>

              <button
                className="btn nav-effects"
                type="button"
                aria-pressed={fxEnabled}
                onClick={() => setFxEnabled((v) => !v)}
              >
                {fxEnabled ? "Effets: ON" : "Effets: OFF"}
              </button>
            </nav>
          </div>
        </header>

        <ScrollToHash />
        <main className="container">{children}</main>
      </div>
    </>
  );
}
