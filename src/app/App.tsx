import AppLayout from "./layout/AppLayout";
import PinnedProjects from "../components/pinned/PinnedProjects";

export default function App() {
  const cvUrl = `${import.meta.env.BASE_URL}docs/CV.pdf`;

  return (
    <AppLayout>
      <section className="grid">
        <aside className="glass panel">
          <div className="badge">À propos</div>
          <div className="divider" />
          <p className="small" style={{ marginTop: 0 }}>
            Je construis des applications web structurées, performantes et maintenables.
          </p>
          <div className="divider" />
          <div className="row">
            <a className="btn primary" href="#projets">
              Voir les projets
            </a>
            <a className="btn" href="#docs">
              CV
            </a>
          </div>
        </aside>

        <section className="glass panel">
          <h1 className="h-title">Enzo Castetbon</h1>
          <p className="h-sub">
            Fullstack developer. React/TypeScript côté front, et bases solides côté back & data.
          </p>

          <div className="row">
            <button className="btn primary">Me contacter</button>
            <a className="btn" href="https://github.com/IceliosPY" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="btn" href="#" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>

          <div className="divider" />

          {/* Projets épinglés */}
          <div id="projets" style={{ marginTop: 12 }}>
            <PinnedProjects />
          </div>

          <div className="divider" />

          <div id="skills" className="badge">
            Skills
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <span className="badge">Frontend</span>
            <span className="badge">Backend</span>
            <span className="badge">DB</span>
            <span className="badge">DevOps</span>
          </div>

          <div className="divider" />

          <div id="docs" className="badge">
            Documents
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <a className="btn" href={cvUrl} target="_blank" rel="noreferrer">
              CV
            </a>
          </div>
        </section>
      </section>
    </AppLayout>
  );
}