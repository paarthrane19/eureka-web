// Warm sage accent scale — mirrors the green-* tokens in globals.css.
export const palette = {
  acid: "#7FA96D", // green-500 — primary accent
  acidDim: "#5C7F4E", // green-700 — green text on light bg
  acidGlow: "#96BE85", // green-400 — accent in dark mode
};

// Restrained category hues for the small dot/tag accents — mostly monochrome.
export const categoryColors: Record<string, string> = {
  Physics: "#3B82F6",
  Astronomy: "#8B5CF6",
  Biology: "#10B981",
  Chemistry: "#F59E0B",
  Math: "#EF4444",
  "Earth Science": "#14B8A6",
  Technology: "#0EA5E9",
  Medicine: "#EC4899",
};

export function categoryColor(category: string): string {
  return categoryColors[category] ?? palette.acid;
}
