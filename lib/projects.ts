import { projects, type Project } from '@/content/projects';

export function getAllProjects(): Project[] {
  return projects;
}

export function getAllSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacent(slug: string): { prev: Project; next: Project } {
  const idx = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
  return { prev, next };
}
