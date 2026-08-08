/** Firefox container color codes (approximate official palette). */
const CONTAINER_COLORS: Record<string, string> = {
  blue: '#37adff',
  green: '#51cd00',
  orange: '#ff9f00',
  pink: '#ff4bda',
  purple: '#af51f5',
  red: '#ff613d',
  toolbar: '#7c7c7c',
  turquoise: '#00c79a',
  yellow: '#ffcb00',
}

/**
 * Resolve a container color name to its hex code.
 * @param color - Container color name (e.g. "blue").
 * @param fallback - Hex code used when the name is unknown.
 * @returns The hex color code (blue when nothing matches).
 */
export const colorCodeFor = (color: string, fallback?: string): string =>
  CONTAINER_COLORS[color] ?? fallback ?? CONTAINER_COLORS.blue
