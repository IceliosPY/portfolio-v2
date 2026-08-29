import { Link } from "react-router-dom";
import type { PortfolioProject } from "../../types/project";
import ProjectLinks from "./ProjectLinks";
import ProjectVisual from "./ProjectVisual";

type FeaturedProjectCardProps = {
  project: PortfolioProject;
};

export default function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  return (
    <article className="glass project-feature">
      <Link
        className="project-feature__visual-link"
        to={`/projects/${project.slug}`}
        aria-label={`Découvrir ${project.title}`}
      >
        <ProjectVisual
          className="project-feature__visual"
          image={project.image}
          title={project.title}
        />
      </Link>

      <div className="project-feature__content">
        <div className="project-feature__meta">
          <span className="badge">{project.category}</span>
          {project.status === "En développement" ? (
            <span className="pill project-status">En développement</span>
          ) : null}
        </div>

        <h2>
          <Link to={`/projects/${project.slug}`}>{project.title}</Link>
        </h2>
        <p>{project.shortDescription}</p>

        {project.primaryTechnologies.length > 0 ? (
          <div className="meta" aria-label={`Technologies de ${project.title}`}>
            {project.primaryTechnologies.map((technology) => (
              <span className="pill" key={technology}>
                {technology}
              </span>
            ))}
          </div>
        ) : null}

        <div className="project-feature__actions">
          <Link className="btn primary" to={`/projects/${project.slug}`}>
            Découvrir le projet <span aria-hidden="true">→</span>
          </Link>
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}
