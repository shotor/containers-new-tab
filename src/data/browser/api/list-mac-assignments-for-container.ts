import {
  type MacSiteAssignment,
  probeMacAssignments,
} from './probe-mac-assignments'
import { gatherAssignmentProbeUrls } from './gather-assignment-probe-urls'

/**
 * MAC assignments for one container (probe top sites, then filter).
 * @param cookieStoreId - The container's cookieStoreId.
 * @returns Sorted assignments for the container.
 */
export const listMacAssignmentsForContainer = async (
  cookieStoreId: string,
): Promise<MacSiteAssignment[]> => {
  const probed = await probeMacAssignments(await gatherAssignmentProbeUrls())

  return Object.values(probed)
    .filter((site) => site.cookieStoreId === cookieStoreId)
    .sort((a, b) => a.host.localeCompare(b.host))
}
