import { useEffect, useState } from "react";

const homeSections = [
  { id: "apropos", label: "À propos" },
  { id: "github", label: "GitHub" },
  { id: "skills", label: "Compétences" },
  { id: "contact", label: "Contact" },
] as const;

export default function HomeSectionNav() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const sections = homeSections
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const rootStyles = getComputedStyle(document.documentElement);
    const headerHeight = Number.parseFloat(rootStyles.getPropertyValue("--nav-h")) || 64;
    const subnavHeight = Number.parseFloat(rootStyles.getPropertyValue("--home-subnav-h")) || 54;
    const activationLine = headerHeight + subnavHeight;

    const updateActiveSection = () => {
      const pageBottomReached =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

      if (pageBottomReached) {
        setActiveSection(sections.at(-1)?.id ?? null);
        return;
      }

      const currentSection = sections
        .filter((section) => section.getBoundingClientRect().top <= activationLine + 1)
        .at(-1);

      setActiveSection(currentSection?.id ?? null);
    };

    const observer = new IntersectionObserver(
      updateActiveSection,
      {
        rootMargin: `-${activationLine}px 0px -45% 0px`,
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
    updateActiveSection();
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="home-section-nav" aria-label="Sections de l’accueil">
      <div className="home-section-nav__inner">
        {homeSections.map(({ id, label }) => (
          <a
            key={id}
            className="home-section-nav__link"
            href={`#${id}`}
            aria-current={activeSection === id ? "location" : undefined}
            onClick={() => setActiveSection(id)}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
