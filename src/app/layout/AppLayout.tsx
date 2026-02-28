import { useEffect, useMemo, useRef, useState } from "react";
import BackgroundVaporwave from "../../components/background/BackgroundVaporwave";

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

function IconLinkedIn(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className}>
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 23.5h4V7.98h-4V23.5ZM8 7.98h3.83v2.12h.05c.54-1.02 1.86-2.1 3.83-2.1 4.1 0 4.86 2.7 4.86 6.21v9.29h-4v-8.24c0-1.96-.04-4.49-2.73-4.49-2.73 0-3.15 2.13-3.15 4.35v8.38H8V7.98Z"
      />
    </svg>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [fxEnabled, setFxEnabled] = useState(true);

  // Réseaux: open = visible, pinned = maintenu par click
  const [socialOpen, setSocialOpen] = useState(false);
  const [socialPinned, setSocialPinned] = useState(false);

  const socialRef = useRef<HTMLDivElement | null>(null);

  const prefersReduced = useMemo(() => {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (prefersReduced) setFxEnabled(false);
  }, [prefersReduced]);

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

  // fermer au clic dehors + ESC
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!socialRef.current) return;
      if (!socialRef.current.contains(e.target as Node)) {
        setSocialOpen(false);
        setSocialPinned(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSocialOpen(false);
        setSocialPinned(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const openOnHover = () => {
    setSocialOpen(true);
  };

  const closeOnLeave = () => {
    // si pinned: on ne ferme pas
    if (!socialPinned) setSocialOpen(false);
  };

  const togglePinned = () => {
    setSocialPinned((p) => {
      const next = !p;
      setSocialOpen(true); // au click on force l'ouverture
      return next;
    });
  };

  const onFocusIn = () => {
    setSocialOpen(true);
  };

  const onBlurCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    // si on sort du bloc (et pas pinned), on ferme
    const next = e.relatedTarget as Node | null;
    if (!socialRef.current) return;
    if (!socialRef.current.contains(next) && !socialPinned) {
      setSocialOpen(false);
    }
  };

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

            <nav className="nav-links" aria-label="Navigation">
              <a href="#apropos">À propos</a>
              <a href="#projets">Projets</a>
              <a href="#skills">Skills</a>
              <a href="#docs">Documents</a>

              {/* Réseaux (hover = open, click = pinned) */}
              <div
                className="nav-social"
                ref={socialRef}
                data-open={socialOpen ? "true" : "false"}
                data-pinned={socialPinned ? "true" : "false"}
                onMouseEnter={openOnHover}
                onMouseLeave={closeOnLeave}
                onFocus={onFocusIn}
                onBlurCapture={onBlurCapture}
              >
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={socialPinned ? "Réseaux (maintenu)" : "Réseaux"}
                  aria-haspopup="menu"
                  aria-expanded={socialOpen}
                  onClick={togglePinned}
                >
                  <span className="icon-btn-dot" aria-hidden="true" />
                </button>

                <div className="social-pop" role="menu" aria-label="Réseaux sociaux">
                  <a
                    className="social-item"
                    role="menuitem"
                    href="https://github.com/IceliosPY"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      // option: garder pinned ouvert après clic lien ? Ici on ferme.
                      setSocialOpen(false);
                      setSocialPinned(false);
                    }}
                  >
                    <IconGithub className="icon" />
                    <span>GitHub</span>
                  </a>

                  <a
                    className="social-item"
                    role="menuitem"
                    href="TON_LIEN_LINKEDIN_ICI"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      setSocialOpen(false);
                      setSocialPinned(false);
                    }}
                  >
                    <IconLinkedIn className="icon" />
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