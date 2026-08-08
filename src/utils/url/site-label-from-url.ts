/**
 * Human-readable site label: hostname plus path/query (no scheme, no www).
 * @param href - Absolute URL.
 * @returns Label for display and search.
 */
export const siteLabelFromUrl = (href: string): string => {
  try {
    const url = new URL(href)
    const host = url.hostname.replace(/^www\./i, '')
    const path = url.pathname === '/' ? '' : url.pathname.replace(/\/+$/, '')
    return `${host}${path}${url.search}`
  } catch {
    return href
  }
}
