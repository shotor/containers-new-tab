import { getMacAssignment } from './get-mac-assignment'
import { isDefined } from '@/utils/object/is-defined'
import { parseHostname } from '@/utils/url/parse-hostname'
import { preferSiteUrl } from '@/utils/url/prefer-site-url'
import { replaceHostname } from '@/utils/url/replace-hostname'
import { toHttpsUrl } from '@/utils/url/to-https-url'
import { wwwHostVariants } from '@/utils/url/www-host-variants'

/** One MAC site assignment discovered by probing. */
export type MacSiteAssignment = {
  cookieStoreId: string
  host: string
  /** Preferred open URL (may include a path from topSites). */
  url: string
}

/**
 * Map a MAC userContextId to the browser cookieStoreId.
 * @param userContextId - The numeric MAC context id.
 * @returns The cookieStoreId, e.g. "firefox-container-3".
 */
const cookieStoreFromUserContextId = (userContextId: string): string =>
  `firefox-container-${userContextId}`

/**
 * Probe candidate URLs via MAC getAssignment.
 * Tries apex + www for each host (MAC keys exact hostnames).
 * @param candidateUrls - Hosts/URLs to probe.
 * @returns Hostname → assignment (cookieStoreId + preferred URL).
 */
export const probeMacAssignments = async (
  candidateUrls: string[],
): Promise<Record<string, MacSiteAssignment>> => {
  const preferredByHost = new Map<string, string>()

  for (const raw of candidateUrls) {
    const host = parseHostname(raw)
    const href = toHttpsUrl(raw)

    if (!host || !href) {
      continue
    }

    const prev = preferredByHost.get(host)
    preferredByHost.set(host, prev ? preferSiteUrl(prev, href) : href)
  }

  const probeJobs = [...preferredByHost.entries()].flatMap(([host, url]) =>
    wwwHostVariants(host).map(async (variantHost) => {
      const probeUrl = replaceHostname(url, variantHost)

      if (!probeUrl) {
        return null
      }

      const mac = await getMacAssignment(probeUrl)

      if (!mac) {
        return null
      }

      return {
        cookieStoreId: cookieStoreFromUserContextId(mac.userContextId),
        host: variantHost,
        url: probeUrl,
      } satisfies MacSiteAssignment
    }),
  )

  const pairs = await Promise.all(probeJobs)

  return Object.fromEntries(
    pairs.filter(isDefined).map((assignment) => [assignment.host, assignment]),
  )
}
