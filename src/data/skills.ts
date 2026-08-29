import csharpIcon from "../assets/skills/csharp.svg";
import godotIcon from "../assets/skills/godot.svg";
import javaIcon from "../assets/skills/java.svg";
import phpIcon from "../assets/skills/php.svg";
import reactIcon from "../assets/skills/react.svg";
import typescriptIcon from "../assets/skills/typescript.svg";
import unityIcon from "../assets/skills/unity.svg";
import { featuredProjects } from "./projects";

const editorialSkillOrder = [
  "React",
  "TypeScript",
  "PHP",
  "C#",
  "Java",
  "Godot",
  "Unity",
] as const;

type FeaturedSkillName = (typeof editorialSkillOrder)[number];

type SkillVisual = {
  name: FeaturedSkillName;
  icon: string;
  iconClassName?: string;
};

const skillIcons: Record<FeaturedSkillName, Pick<SkillVisual, "icon" | "iconClassName">> = {
  React: { icon: reactIcon },
  TypeScript: { icon: typescriptIcon },
  PHP: { icon: phpIcon },
  "C#": { icon: csharpIcon },
  Java: { icon: javaIcon },
  Godot: { icon: godotIcon },
  Unity: { icon: unityIcon, iconClassName: "skill-card__icon--unity" },
};

const featuredPrimaryTechnologies = new Set(
  featuredProjects.flatMap((project) => project.primaryTechnologies),
);

export const featuredSkills: readonly SkillVisual[] = editorialSkillOrder
  .filter((name) => featuredPrimaryTechnologies.has(name))
  .map((name) => ({ name, ...skillIcons[name] }));
