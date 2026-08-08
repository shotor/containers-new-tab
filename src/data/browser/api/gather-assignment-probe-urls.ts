import { isDefined } from '@/utils/object/is-defined'
import { parseHostname } from '@/utils/url/parse-hostname'
import { preferSiteUrl } from '@/utils/url/prefer-site-url'
import { redirectTargetUrls } from '@/utils/url/redirect-target-urls'
import { toHttpsUrl } from '@/utils/url/to-https-url'

/**
 * Unique probe URLs from top sites (and extras), keeping the richest path per host.
 * @param extraHosts - Additional hosts/URLs to probe on top of top sites.
 * @returns Deduped https probe URLs (path preserved when known).
 */
export const gatherAssignmentProbeUrls = async (
  extraHosts: string[] = [],
): Promise<string[]> => {
  let siteUrls: string[] = []

  try {
    const top = await browser.topSites.get({
      includeFavicon: false,
      limit: 100,
    })
    siteUrls = top.flatMap((site) => (site.url ? [site.url] : []))
  } catch {
    /* topSites unavailable */
  }

  const byHost = new Map<string, string>()

  for (const raw of [...siteUrls, ...extraHosts]) {
    const candidates = [raw, ...redirectTargetUrls(raw)]

    for (const candidate of candidates) {
      const host = parseHostname(candidate)
      const href = toHttpsUrl(candidate)

      if (!host || !href) {
        continue
      }

      const prev = byHost.get(host)
      byHost.set(host, prev ? preferSiteUrl(prev, href) : href)
    }
  }

  return [...byHost.values()].filter(isDefined)
}
