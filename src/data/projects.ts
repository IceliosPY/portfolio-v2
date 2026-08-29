import type { PortfolioProject } from "../types/project";

export const portfolioProjects: readonly PortfolioProject[] = [
  {
    id: "mankind-renewal",
    slug: "mankind-renewal",
    title: "Mankind: Renewal",
    shortDescription: "RPG tactique au tour par tour développé avec Godot et C#.",
    detailedDescription:
      "Mankind: Renewal est un RPG tactique au tour par tour actuellement en développement.",
    primaryTechnologies: ["Godot", "C#"],
    technologies: ["Godot", "C#"],
    category: "Jeu vidéo",
    status: "En développement",
    featured: true,
  },
  {
    id: "transfemera",
    slug: "transfemera",
    title: "TransfemEra",
    shortDescription: "Plateforme communautaire développée avec React et PHP.",
    detailedDescription:
      "TransfemEra est une plateforme communautaire actuellement en développement.",
    primaryTechnologies: ["React", "PHP"],
    technologies: ["React", "PHP"],
    category: "Site web",
    status: "En développement",
    repository: {
      fullName: "IceliosPY/TransfemEra",
      url: "https://github.com/IceliosPY/TransfemEra",
    },
    featured: true,
    githubFallback: true,
  },
  {
    id: "hearthstone-conquest-of-azeroth",
    slug: "hearthstone-conquest-of-azeroth",
    title: "Hearthstone, Conquest of Azeroth",
    shortDescription: "Jeu de cartes stratégique inspiré de Hearthstone, développé avec Unity et C#.",
    detailedDescription:
      "Hearthstone, Conquest of Azeroth est un jeu de cartes stratégique inspiré de Hearthstone et actuellement en développement.",
    primaryTechnologies: ["Unity", "C#"],
    technologies: ["Unity", "C#"],
    category: "Jeu vidéo",
    status: "En développement",
    featured: true,
  },
  {
    id: "projet-ccs",
    slug: "projet-ccs",
    title: "Projet CCS",
    shortDescription: "Projet scolaire universitaire développé avec React et TypeScript.",
    detailedDescription:
      "Projet CCS est un projet scolaire universitaire réalisé avec React et TypeScript.",
    primaryTechnologies: ["React", "TypeScript"],
    technologies: ["React", "TypeScript"],
    category: "Application web",
    status: "Terminé",
    repository: {
      fullName: "IceliosPY/projet-ccs",
      url: "https://github.com/IceliosPY/projet-ccs",
    },
    featured: true,
    githubFallback: true,
  },
  {
    id: "clair-obscur-minecraft-mod",
    slug: "clair-obscur-minecraft-mod",
    title: "Clair Obscur Minecraft Mod",
    shortDescription:
      "Mod fan-made non officiel inspiré de Clair Obscur: Expedition 33, développé en Java.",
    detailedDescription:
      "Clair Obscur Minecraft Mod est un mod fan-made non officiel inspiré de Clair Obscur: Expedition 33 et actuellement en développement.",
    primaryTechnologies: ["Java"],
    technologies: ["Java"],
    category: "Mod / Modding",
    status: "En développement",
    repository: {
      fullName: "IceliosPY/Clair-Obscur-minecraft-mod",
      url: "https://github.com/IceliosPY/Clair-Obscur-minecraft-mod",
    },
    featured: true,
    githubFallback: true,
  },
  {
    id: "portfolio-v1",
    slug: "portfolio-v1",
    title: "Portfolio",
    shortDescription: "Première version de mon portfolio.",
    primaryTechnologies: ["CSS"],
    technologies: ["CSS"],
    category: "Portfolio",
    repository: {
      fullName: "IceliosPY/Portfolio",
      url: "https://github.com/IceliosPY/Portfolio",
    },
    githubFallback: true,
  },
  {
    id: "gmtk",
    slug: "gmtk",
    title: "GMTK",
    shortDescription: "Projet réalisé pour la GMTK Game Jam 2025.",
    primaryTechnologies: ["ShaderLab"],
    technologies: ["ShaderLab"],
    category: "Jeu vidéo",
    repository: {
      fullName: "IceliosPY/GMTK",
      url: "https://github.com/IceliosPY/GMTK",
    },
    githubFallback: true,
  },
  {
    id: "ada-hashi",
    slug: "ada-hashi",
    title: "ADA-Hashi",
    shortDescription: "Projet en Ada avec une interface GTK.",
    primaryTechnologies: ["Ada", "GTK"],
    technologies: ["Ada", "GTK"],
    category: "Algorithmique",
    repository: {
      fullName: "IceliosPY/ADA-Hashi",
      url: "https://github.com/IceliosPY/ADA-Hashi",
    },
    githubFallback: true,
  },
];

export const featuredProjects = portfolioProjects.filter((project) => project.featured);

export const githubFallbackProjects = portfolioProjects.filter(
  (project) => project.githubFallback,
);

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return featuredProjects.find((project) => project.slug === slug);
}
