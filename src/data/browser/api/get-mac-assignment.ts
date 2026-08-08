/** Extension ID of Multi-Account Containers (site assignment source of truth). */
const MAC_EXTENSION_ID = '@testpilot-containers'

/** Shape of a MAC "always open in" assignment answer. */
type MacAssignment = {
  userContextId: string
}

/**
 * Narrow an untyped MAC response to a MacAssignment.
 * @param value - The raw sendMessage response.
 * @returns True when the value carries a userContextId.
 */
const isMacAssignment = (
  value: unknown,
): value is { userContextId: string | number } => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  if (!('userContextId' in value)) {
    return false
  }

  const id = value.userContextId
  return typeof id === 'string' || typeof id === 'number'
}

/**
 * Ask MAC whether a URL has an "always open in" assignment.
 * @param url - The URL to probe.
 * @returns The assignment, or null when none / MAC unavailable.
 */
export const getMacAssignment = async (
  url: string,
): Promise<MacAssignment | null> => {
  try {
    const result: unknown = await browser.runtime.sendMessage(
      MAC_EXTENSION_ID,
      {
        method: 'getAssignment',
        url,
      },
    )

    if (!isMacAssignment(result)) {
      return null
    }

    return { userContextId: String(result.userContextId) }
  } catch {
    return null
  }
}
