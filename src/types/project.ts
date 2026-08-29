export type ProjectCategory =
  | "Portfolio"
  | "Site web"
  | "Application web"
  | "Jeu vidéo"
  | "Algorithmique"
  | "Mod / Modding";

export type ProjectStatus = "En développement" | "Terminé";

export type ProjectImage = {
  src: string;
  alt: string;
};

export type ProjectRepository = {
  fullName: string;
  url: string;
};

export type ProjectCta = {
  label: "Voir le site" | "Jouer" | "Voir la démo" | "Jouer à la démo" | "Télécharger" | "Télécharger la démo";
  url: string;
};

export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  detailedDescription?: string;
  primaryTechnologies: readonly string[];
  technologies: readonly string[];
  category: ProjectCategory;
  status?: ProjectStatus;
  year?: number;
  repository?: ProjectRepository;
  cta?: ProjectCta;
  image?: ProjectImage;
  gallery?: readonly ProjectImage[];
  featured?: boolean;
  githubFallback?: boolean;
  additionalInfo?: readonly string[];
};
