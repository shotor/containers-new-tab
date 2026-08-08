/**
 * Normalize a bare host or URL to an https URL, preserving path/query/hash.
 * @param value - A hostname or URL.
 * @returns An https URL string, or null when unparseable.
 */
export const toHttpsUrl = (value: string): string | null => {
  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const withScheme =
    trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`

  try {
    const url = new URL(withScheme)

    if (!url.hostname) {
      return null
    }

    url.protocol = 'https:'

    // Prefer bare origin for root paths (matches how we used to open sites).
    if (url.pathname === '/' && !url.search && !url.hash) {
      return `https://${url.host}`
    }

    return url.href
  } catch {
    return null
  }
}
