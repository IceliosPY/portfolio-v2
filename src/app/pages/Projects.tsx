import FeaturedProjectCard from "../../components/projects/FeaturedProjectCard";
import { featuredProjects } from "../../data/projects";

export default function Projects() {
  return (
    <section className="projects-page">
      <header className="glass panel projects-head">
        <span className="badge">Sélection éditoriale</span>
        <h1>Projets</h1>
        <p>Une sélection de projets de développement présentés au-delà de leur repository.</p>
      </header>

      <section className="projects-showcase" aria-labelledby="featured-projects-title">
        <h2 className="sr-only" id="featured-projects-title">
          Projets mis en avant
        </h2>

        {featuredProjects.length > 0 ? (
          featuredProjects.map((project) => (
            <FeaturedProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="glass panel projects-empty">
            <p>Aucun projet n’est mis en avant pour le moment.</p>
          </div>
        )}
      </section>
    </section>
  );
}
