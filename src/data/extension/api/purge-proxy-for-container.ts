import { setProxyForContainer } from '@/data/extension/api/set-proxy-for-container'

/**
 * Remove any stored proxy config for a container.
 * @param cookieStoreId - The container's cookieStoreId.
 */
export const purgeProxyForContainer = async (
  cookieStoreId: string,
): Promise<void> => {
  await setProxyForContainer(cookieStoreId, null)
}
