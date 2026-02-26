export type PinnedRepo = {
    id: string;
    name: string;
    fullName: string;
    description: string;
    url: string;
    homepageUrl?: string;
    stars: number;
    forks: number;
    language?: string;
    languageColor?: string;
    updatedAt: string;
    archived: boolean;
  };