const CATEGORY_VAR_MAP: Record<string, string> = {
  general: '--color-cat-general',
  salud: '--color-cat-salud',
  ejercicio: '--color-cat-ejercicio',
  productividad: '--color-cat-productividad',
  aprendizaje: '--color-cat-aprendizaje',
  bienestar: '--color-cat-bienestar',
};

export function categoryColorVar(category: string): string {
  const key = category.trim().toLowerCase();
  return CATEGORY_VAR_MAP[key] ?? '--color-cat-general';
}

export function categoryColor(category: string): string {
  return `var(${categoryColorVar(category)})`;
}
