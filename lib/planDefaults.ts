export const PLAN_WIDTH = 1600;
export const PLAN_HEIGHT = 800;

export const DEFAULT_MODULES: Array<{
  key: string;
  label: string;
  description: string;
  x: number;
  y: number;
}> = Array.from({ length: 11 }).map((_, i) => ({
  key: `module-${i + 1}`,
  label: `Module ${i + 1}`,
  description: `Description du module ${i + 1}`,
  x: 40 + (i % 4) * 220,
  y: 40 + Math.floor(i / 4) * 140,
}));

