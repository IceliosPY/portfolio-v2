import type { ProjectImage } from "../../types/project";

type ProjectVisualProps = {
  image?: ProjectImage;
  title: string;
  className?: string;
};

export default function ProjectVisual({ image, title, className = "" }: ProjectVisualProps) {
  const classes = ["project-visual", className].filter(Boolean).join(" ");

  if (image) {
    return (
      <figure className={classes}>
        <img src={image.src} alt={image.alt} loading="lazy" />
      </figure>
    );
  }

  return (
    <div
      className={`${classes} project-visual--placeholder`}
      role="img"
      aria-label={`Visuel de ${title} à venir`}
    >
      <span className="project-visual__mark" aria-hidden="true" />
      <span className="project-visual__label">Visuel à venir</span>
    </div>
  );
}
