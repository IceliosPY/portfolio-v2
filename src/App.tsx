import AppLayout from "./app/layout/AppLayout";
import PinnedProjects from "./components/sections/PinnedProjects";

export default function App() {
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
            <button className="btn">GitHub</button>
            <button className="btn">LinkedIn</button>
          </div>

          <div className="divider" />

          {/* Projets épinglés (dynamiques via JSON généré par GitHub Actions) */}
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
            <a className="btn" href="/assets/docs/CV.pdf">
              CV
            </a>
          </div>
        </section>
      </section>
    </AppLayout>
  );
}