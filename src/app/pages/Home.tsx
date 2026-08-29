import { useState } from "react";
import githubAvatar from "../../assets/profile/github-avatar.png";
import PinnedProjects from "../../components/pinned/PinnedProjects";
import { featuredSkills } from "../../data/skills";

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

type Status = "idle" | "sending" | "success" | "error";

export default function Home() {
  const web3Key = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<string>("");

  async function onContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!web3Key) {
      setStatus("error");
      setFeedback("Clé Web3Forms manquante : VITE_WEB3FORMS_KEY");
      return;
    }

    setStatus("sending");
    setFeedback("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    // anti-spam honeypot
    if ((fd.get("botcheck") ?? "").toString().trim().length > 0) {
      setStatus("success");
      setFeedback("Message envoyé.");
      form.reset();
      return;
    }

    fd.set("access_key", web3Key);
    fd.set("subject", "Nouveau message — Portfolio");
    fd.set("from_name", "Portfolio");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.message || "Erreur");

      setStatus("success");
      setFeedback("Message envoyé, merci !");
      form.reset();
    } catch {
      setStatus("error");
      setFeedback("Impossible d’envoyer le message. Réessaie plus tard.");
    }
  }

  return (
    <section className="center-stack">
      {/* HERO */}
      <section className="glass panel hero-pro">
        <div className="hero-pro-inner">
          <div className="hero-pro-left">
            <div className="hero-kicker">
              <span className="badge">Portfolio</span>
            </div>

            <h1 className="hero-title">
              <span className="hero-hello">Je m’appelle</span>{" "}
              <span className="hero-name">Elisys</span>
            </h1>

            <p className="hero-sub">
              Fullstack developer. React/TypeScript côté front, et bases solides côté back & data.
            </p>

            <div className="hero-actions">
              <a className="btn primary" href="#contact">
                Me contacter
              </a>

              <a
                className="icon-btn"
                href="https://github.com/IceliosPY"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <IconGithub className="icon" />
              </a>

            </div>
          </div>

          <div className="hero-pro-right">
            <img
              className="hero-profile-image"
              src={githubAvatar}
              alt="Photo de profil d’Elisys"
              width={220}
              height={220}
            />
          </div>
        </div>
      </section>

      {/* A PROPOS */}
      <section id="apropos" className="glass panel about-card">
        <div className="about-head">
          <h2 className="about-title">À propos</h2>
        </div>

        <div className="about-body">
          <div className="about-bar" aria-hidden="true" />
          <div className="about-text">
            <p>
            Développeur fullstack basé à Toulouse, je construis des applications web structurées, performantes et maintenables. J’aime travailler avec une base front solide (React/TypeScript) et un back propre (API, SQL, auth/roles).
            </p>
            <p>
            J’accorde beaucoup d’importance à l’architecture, à la DX (dev experience), au design system et aux micro-interactions — bref : un rendu “pro” qui reste simple et lisible.
            </p>
          </div>
        </div>
      </section>

      {/* REPOSITORIES GITHUB */}
      <section id="github" className="glass panel">
        <PinnedProjects />
      </section>

      {/* SKILLS */}
      <section id="skills" className="glass panel home-content-panel">
        <h2 className="home-section-title">Compétences</h2>

        <div className="skills-grid home-section-content" aria-label="Technologies principales">
          {featuredSkills.map((skill) => (
            <div className="skill-card" key={skill.name}>
              <span className="skill-card__icon-shell" aria-hidden="true">
                <img
                  className={`skill-card__icon${skill.iconClassName ? ` ${skill.iconClassName}` : ""}`}
                  src={skill.icon}
                  alt=""
                />
              </span>
              <strong className="skill-card__name">{skill.name}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="glass panel home-content-panel">
        <div className="home-section-head">
          <h2 className="home-section-title">Contact</h2>
          {feedback ? (
            <span className={`hint ${status === "error" ? "warn" : ""}`}>{feedback}</span>
          ) : null}
        </div>

        <form onSubmit={onContactSubmit} className="contact-form">
          <input
            type="text"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            className="hp"
            aria-hidden="true"
          />

          <div className="contact-row">
            <label className="field">
              <span>Nom</span>
              <input name="name" required placeholder="Ton nom" />
            </label>

            <label className="field">
              <span>Email</span>
              <input name="email" type="email" required placeholder="ton@email.com" />
            </label>
          </div>

          <label className="field">
            <span>Message</span>
            <textarea name="message" required rows={6} placeholder="Ton message..." />
          </label>

          <div className="row contact-form-actions">
            <button className="btn primary" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Envoi..." : "Envoyer"}
            </button>

            <a className="btn" href="mailto:enzo.castetbon@proton.me">
              Ou par email
            </a>
          </div>
        </form>
      </section>
    </section>
  );
}
