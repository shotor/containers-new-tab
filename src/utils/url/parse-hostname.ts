/**
 * Parse a lowercased hostname from a bare host or URL.
 * @param value - A hostname or URL.
 * @returns The hostname, or null when unparseable.
 */
export const parseHostname = (value: string): string | null => {
  const url =
    value.startsWith('http://') || value.startsWith('https://')
      ? value
      : `https://${value}`

  try {
    return new URL(url).hostname.toLowerCase() || null
  } catch {
    return null
  }
}
