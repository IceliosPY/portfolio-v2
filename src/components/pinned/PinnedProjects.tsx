import { githubFallbackProjects } from "../../data/projects";
import { usePinnedRepos } from "../../hooks/usePinnedRepos";
import type { PinnedRepo } from "../../types/pinned";

type RepositoryCard = {
  id: string;
  title: string;
  description: string;
  url: string;
  label: string;
  technologies: readonly string[];
  github?: PinnedRepo;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR");

function formatDate(value: string): string | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date);
}

export default function PinnedProjects() {
  const { loading, available, data, error } = usePinnedRepos(6);
  const repositories: RepositoryCard[] = available
    ? data.map((repository) => ({
        id: repository.id,
        title: repository.name,
        description: repository.description || "Aucune description GitHub.",
        url: repository.url,
        label: "GitHub",
        technologies: repository.language ? [repository.language] : [],
        github: repository,
      }))
    : githubFallbackProjects.flatMap((project) =>
        project.repository
          ? [
              {
                id: project.id,
                title: project.title,
                description: project.shortDescription,
                url: project.repository.url,
                label: project.category,
                technologies: project.primaryTechnologies,
              },
            ]
          : [],
      );

  return (
    <div className="section">
      <div className="section-head">
        <div>
          <span className="badge">Activité GitHub</span>
          <h2>Repositories GitHub épinglés</h2>
        </div>
        <span className={`hint ${error ? "warn" : ""}`} aria-live="polite">
          {loading ? "Synchronisation GitHub…" : error}
        </span>
      </div>

      <div className="pinned-grid">
        {repositories.map((repository) => {
          const updatedAt = repository.github ? formatDate(repository.github.updatedAt) : null;

          return (
            <a
              key={repository.id}
              className="card link project-card"
              href={repository.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${repository.title} sur GitHub`}
            >
              <div className="card-top">
                <h3>{repository.title}</h3>
                <span className="badge">{repository.label}</span>
              </div>

              <p className="muted">{repository.description}</p>

              <div className="meta project-card__technologies" aria-label="Technologies">
                {repository.technologies.map((technology) => (
                  <span className="pill" key={technology}>
                    {technology}
                  </span>
                ))}
              </div>

              {repository.github ? (
                <div className="meta project-card__github" aria-label="Informations GitHub">
                  {repository.github.archived ? <span className="pill">Archivé</span> : null}
                  <span className="pill">★ {repository.github.stars}</span>
                  <span className="pill">⑂ {repository.github.forks}</span>
                  {updatedAt ? <span className="pill">Mis à jour le {updatedAt}</span> : null}
                </div>
              ) : null}
            </a>
          );
        })}
      </div>
    </div>
  );
}
