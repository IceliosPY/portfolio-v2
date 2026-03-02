import { usePinnedRepos } from "../../hooks/usePinnedRepos";

function SkeletonCard() {
  return (
    <div className="card">
      <div className="sk-line sk-title" />
      <div className="sk-line sk-text" />
      <div className="sk-line sk-text short" />
      <div className="sk-row">
        <div className="sk-pill" />
        <div className="sk-pill" />
        <div className="sk-pill" />
      </div>
    </div>
  );
}

export default function PinnedProjects() {
  const { loading, data, error } = usePinnedRepos(6);

  return (
    <section className="section">
      <div className="section-head">
        <h2>Projets épinglés</h2>
        {error ? <span className="hint warn">{error}</span> : null}
      </div>


      <div className="pinned-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : data.map((p) => (
              <a
                key={p.id}
                className="card link"
                href={p.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="card-top">
                  <h3>{p.name}</h3>
                  {p.archived ? <span className="badge">archived</span> : null}
                </div>

                <p className="muted">{p.description || "—"}</p>

                <div className="meta">
                  {p.language ? (
                    <span
                      className="pill"
                      style={{
                        borderColor: p.languageColor || "rgba(255,255,255,.25)",
                        color: p.languageColor || "rgba(255,255,255,.75)",
                      }}
                    >
                      ● {p.language}
                    </span>
                  ) : null}

                  <span className="pill">★ {p.stars}</span>
                  <span className="pill">⑂ {p.forks}</span>
                  <span className="pill">
                    {new Date(p.updatedAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </a>
            ))}
      </div>
    </section>
  );
}