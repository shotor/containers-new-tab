/**
 * Score how specific a URL's path is (longer non-root paths win).
 * @param href - Absolute URL.
 * @returns Path specificity score.
 */
export const pathScore = (href: string): number => {
  try {
    const path = new URL(href).pathname.replace(/\/+$/, '')
    return path.length
  } catch {
    return 0
  }
}
