import { toHttpsUrl } from '@/utils/url/to-https-url'

/** Query keys that often wrap the real destination (consent / interstitial pages). */
const REDIRECT_PARAM_KEYS = ['continue', 'redirect', 'url', 'next'] as const

/**
 * Extract nested destination URLs from common redirect query params.
 * @param href - Absolute URL that may wrap another URL in the query string.
 * @returns Nested https URLs worth probing for MAC assignments.
 */
export const redirectTargetUrls = (href: string): string[] => {
  try {
    const url = new URL(href)

    return REDIRECT_PARAM_KEYS.flatMap((key) => {
      const value = url.searchParams.get(key)

      if (!value) {
        return []
      }

      const nested = toHttpsUrl(value)
      return nested ? [nested] : []
    })
  } catch {
    return []
  }
}
