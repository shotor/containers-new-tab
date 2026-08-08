import type { ContainerIdentity } from '@/data/browser/types'

/**
 * Create a container identity.
 * @param name - Display name.
 * @param color - Container color name.
 * @param icon - Container icon name.
 * @returns The created identity.
 */
export const createContainer = async (
  name: string,
  color: string,
  icon: string,
): Promise<ContainerIdentity> =>
  browser.contextualIdentities.create({ color, icon, name })
