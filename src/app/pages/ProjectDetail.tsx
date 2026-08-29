import { Link, useParams } from "react-router-dom";
import ProjectGallery from "../../components/projects/ProjectGallery";
import ProjectLinks from "../../components/projects/ProjectLinks";
import ProjectVisual from "../../components/projects/ProjectVisual";
import { getProjectBySlug } from "../../data/projects";
import { hasProjectLinks } from "../../utils/projectLinks";

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <section className="glass panel project-not-found" aria-labelledby="project-not-found-title">
        <span className="badge">404</span>
        <h1 id="project-not-found-title">Projet introuvable</h1>
        <p>Ce projet n’existe pas ou n’est pas actuellement présenté dans le portfolio.</p>
        <Link className="btn primary" to="/projects">
          Retour aux projets
        </Link>
      </section>
    );
  }

  return (
    <article className="project-detail-page">
      <Link className="project-back-link" to="/projects">
        <span aria-hidden="true">←</span> Tous les projets
      </Link>

      <header className="glass panel project-detail-hero">
        <ProjectVisual
          className="project-detail-hero__visual"
          image={project.image}
          title={project.title}
        />

        <div className="project-detail-hero__content">
          <div className="project-feature__meta">
            <span className="badge">{project.category}</span>
            {project.status ? <span className="pill project-status">{project.status}</span> : null}
            {project.year ? <span className="pill">{project.year}</span> : null}
          </div>

          <h1>{project.title}</h1>
          <p>{project.shortDescription}</p>
        </div>
      </header>

      <section className="glass panel project-detail-section" aria-labelledby="project-description">
        <h2 id="project-description">Description</h2>
        <p>{project.detailedDescription ?? project.shortDescription}</p>
      </section>

      {project.gallery ? (
        <ProjectGallery images={project.gallery} projectTitle={project.title} />
      ) : null}

      {project.technologies.length > 0 ? (
        <section className="glass panel project-detail-section" aria-labelledby="project-stack">
          <h2 id="project-stack">Stack technique</h2>
          <div className="meta" aria-label={`Technologies de ${project.title}`}>
            {project.technologies.map((technology) => (
              <span className="pill" key={technology}>
                {technology}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {hasProjectLinks(project) ? (
        <section className="glass panel project-detail-section" aria-labelledby="project-links">
          <h2 id="project-links">Liens</h2>
          <ProjectLinks project={project} />
        </section>
      ) : null}
    </article>
  );
}
