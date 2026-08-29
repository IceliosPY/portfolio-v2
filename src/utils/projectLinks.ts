import type { PortfolioProject } from "../types/project";

export type ProjectLink = {
  label: string;
  url: string;
  kind: "cta" | "github";
};

export function getProjectLinks(project: PortfolioProject): ProjectLink[] {
  const links: ProjectLink[] = [];

  if (project.cta) {
    links.push({ label: project.cta.label, url: project.cta.url, kind: "cta" });
  }
  if (project.repository) {
    links.push({ label: "GitHub", url: project.repository.url, kind: "github" });
  }

  return links;
}

export function hasProjectLinks(project: PortfolioProject): boolean {
  return getProjectLinks(project).length > 0;
}
