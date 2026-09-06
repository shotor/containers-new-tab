import { useEffect, useState } from 'preact/hooks'

import {
  gatherAssignmentProbeUrls,
  type MacSiteAssignment,
  probeMacAssignments,
} from '@/data/browser/browser-api'

/**
 * Discover Multi-Account Containers site assignments once, via top sites.
 * @returns Assignments in discovery order plus loading state.
 */
export const useAssignedSites = () => {
  const [sites, setSites] = useState<MacSiteAssignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      const probes = await gatherAssignmentProbeUrls()
      const assignments = await probeMacAssignments(probes)

      if (active) {
        setSites(Object.values(assignments))
        setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  return { loading, sites }
}
