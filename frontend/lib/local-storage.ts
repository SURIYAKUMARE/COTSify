import { AnalyzeResponse } from "./api";

export interface SavedProject {
  id: string;
  project_title: string;
  analysis: AnalyzeResponse;
  bookmarked_components: string[];
  created_at: string;
  notes?: string;
  estimated_cost?: number;
  status?: "planning" | "in_progress" | "completed";
  tags?: string[];
}

const KEY = "cotsify_projects";

export function getProjects(): SavedProject[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}

export function saveProjectLocal(
  project_title: string,
  analysis: AnalyzeResponse,
  bookmarked_components: string[] = []
): SavedProject {
  const projects = getProjects();
  const existing = projects.findIndex(
    (p) => p.project_title.toLowerCase() === project_title.toLowerCase()
  );
  const entry: SavedProject = {
    id: existing >= 0 ? projects[existing].id : crypto.randomUUID(),
    project_title,
    analysis,
    bookmarked_components,
    created_at: existing >= 0 ? projects[existing].created_at : new Date().toISOString(),
    notes: existing >= 0 ? projects[existing].notes : "",
    estimated_cost: existing >= 0 ? projects[existing].estimated_cost : undefined,
    status: existing >= 0 ? projects[existing].status : "planning",
    tags: existing >= 0 ? projects[existing].tags : [],
  };
  if (existing >= 0) projects[existing] = entry;
  else projects.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(projects));
  return entry;
}

export function deleteProjectLocal(id: string) {
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(projects));
}

export function updateProjectLocal(id: string, updates: Partial<SavedProject>) {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx >= 0) {
    projects[idx] = { ...projects[idx], ...updates };
    localStorage.setItem(KEY, JSON.stringify(projects));
  }
}

export function updateBookmarksLocal(id: string, bookmarked_components: string[]) {
  updateProjectLocal(id, { bookmarked_components });
}

export function exportProjectBOM(project: SavedProject): string {
  const lines = [
    `# Bill of Materials — ${project.project_title}`,
    `Generated: ${new Date().toLocaleDateString("en-IN")}`,
    `Status: ${project.status || "planning"}`,
    "",
    "## Hardware Components",
    ...project.analysis.hardware.map(
      (h, i) => `${i + 1}. ${h.name} (×${h.quantity}) — ${h.description}`
    ),
    "",
    "## Software / Tools",
    ...project.analysis.software.map(
      (s, i) => `${i + 1}. ${s.name} — ${s.description}`
    ),
    "",
    project.notes ? `## Notes\n${project.notes}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}
