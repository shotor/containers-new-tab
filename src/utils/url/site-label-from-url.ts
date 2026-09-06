/**
 * Human-readable site label: the bare hostname (no scheme, no www, no path).
 * @param href - Absolute URL.
 * @returns Label for display and search.
 */
export const siteLabelFromUrl = (href: string): string => {
  try {
    return new URL(href).hostname.replace(/^www\./i, '')
  } catch {
    return href
  }
}
