export default function Cv() {
  const cvUrl = `${import.meta.env.BASE_URL}docs/CV.pdf`;

  return (
    <section className="cv-page">
      <header className="cv-head glass panel">
        <div>
          <span className="badge">Document</span>
          <h1>CV</h1>
          <p>Mon parcours, mes compétences et mes expériences.</p>
        </div>

        <div className="cv-actions" aria-label="Actions du CV">
          <a className="btn primary" href={cvUrl} download="CV.pdf">
            Télécharger le CV
          </a>
          <a className="btn" href={cvUrl} target="_blank" rel="noreferrer">
            Ouvrir dans un nouvel onglet
          </a>
        </div>
      </header>

      <section className="cv-viewer-panel glass panel" aria-labelledby="cv-viewer-title">
        <div className="cv-viewer-head">
          <h2 id="cv-viewer-title">Consulter le CV</h2>
          <p>Document PDF intégré à la page.</p>
        </div>

        <div className="cv-viewer-scroll-region">
          <object
            className="cv-viewer"
            data={cvUrl}
            type="application/pdf"
            aria-label="CV au format PDF"
          >
            <div className="cv-viewer-fallback">
              <p>Le lecteur PDF intégré n’est pas disponible dans ce navigateur.</p>
              <a className="btn" href={cvUrl} target="_blank" rel="noreferrer">
                Ouvrir le CV dans un nouvel onglet
              </a>
            </div>
          </object>
        </div>
      </section>
    </section>
  );
}
