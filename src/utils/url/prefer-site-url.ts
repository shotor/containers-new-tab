import { pathScore } from '@/utils/url/path-score'

/**
 * Prefer the more specific site URL (longer path) when two share a host.
 * @param current - URL already chosen for the host.
 * @param candidate - New candidate URL.
 * @returns The preferred URL.
 */
export const preferSiteUrl = (current: string, candidate: string): string =>
  pathScore(candidate) > pathScore(current) ? candidate : current
