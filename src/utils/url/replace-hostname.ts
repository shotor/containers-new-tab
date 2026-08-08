import { toHttpsUrl } from '@/utils/url/to-https-url'

/**
 * Rewrite a URL's hostname, preserving path/query/hash.
 * @param href - Absolute URL.
 * @param host - Replacement hostname.
 * @returns https URL with the new host, or null when unparseable.
 */
export const replaceHostname = (href: string, host: string): string | null => {
  try {
    const url = new URL(href)
    url.hostname = host
    return toHttpsUrl(url.href)
  } catch {
    return null
  }
}
