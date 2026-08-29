import type { PortfolioProject } from "../../types/project";
import { getProjectLinks } from "../../utils/projectLinks";

type ProjectLinksProps = {
  project: PortfolioProject;
};

export default function ProjectLinks({ project }: ProjectLinksProps) {
  const links = getProjectLinks(project);

  if (links.length === 0) return null;

  return (
    <div className="project-links" aria-label={`Liens de ${project.title}`}>
      {links.map((link) => (
        <a
          className={`btn ${link.kind === "cta" ? "primary" : ""}`}
          href={link.url}
          key={link.label}
          target="_blank"
          rel="noreferrer"
        >
          {link.label}
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}
