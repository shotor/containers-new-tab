import type { ContainerIdentity } from '@/data/browser/types'

/**
 * Update name/color/icon of an existing container identity.
 * @param cookieStoreId - The container's cookieStoreId.
 * @param details - The fields to change.
 * @returns The updated identity.
 */
export const updateContainer = async (
  cookieStoreId: string,
  details: { name?: string; color?: string; icon?: string },
): Promise<ContainerIdentity> =>
  browser.contextualIdentities.update(cookieStoreId, details)
