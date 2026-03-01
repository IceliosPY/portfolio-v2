import { useEffect, useState } from "react";

type LinkItem = { label: string; url: string };

type Experience = {
  period: string;
  title: string;
  org: string;
  place: string;
  type: string;
  mission: string;
  skills: string;
  links?: LinkItem[];
};

export default function Experiences() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}data/experiences.json`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setItems(Array.isArray(data) ? (data as Experience[]) : []))
      .catch(() => setError("Impossible de charger data/experiences.json"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="exp-page">
      <header className="exp-head glass panel">
        <h1 className="exp-title">Expériences</h1>
        <p className="exp-sub">Timeline de mes expériences principales.</p>
      </header>

      <section className="exp-timeline glass panel">
        {loading ? <p className="exp-muted">Chargement…</p> : null}
        {error ? <p className="exp-warn">{error}</p> : null}

        {!loading && !error && items.length === 0 ? (
          <p className="exp-muted">Aucune expérience pour le moment.</p>
        ) : null}

        {items.map((e, idx) => (
          <article className="exp-item" key={`${e.period}-${idx}`}>
            {/* Col 1 : date */}
            <div className="exp-dateWrap">
              <div className="exp-date">{e.period}</div>
            </div>

            {/* Col 2 : rail (dot + line) */}
            <div className="exp-rail" aria-hidden="true">
              <span className="exp-dot" />
              <span className={`exp-line ${idx === items.length - 1 ? "is-last" : ""}`} />
            </div>

            {/* Col 3 : contenu */}
            <div className="exp-content">
              <h2 className="exp-role">{e.title}</h2>

              <div className="exp-meta">
                <strong>{e.org}</strong> <span>•</span> {e.place} <span>•</span>{" "}
                <em>{e.type}</em>
              </div>

              <p className="exp-block">
                <strong>Mission :</strong> {e.mission}
              </p>

              <p className="exp-block">
                <strong>Compétences :</strong> {e.skills}
              </p>

              {e.links?.length ? (
                <div className="exp-links" aria-label="Liens du projet">
                  {e.links.map((l, i) => (
                    <a
                      key={`${l.url}-${i}`}
                      className="exp-link"
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      title={l.url}
                    >
                      <span className="exp-link-label">{l.label}</span>
                      <span className="exp-link-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}