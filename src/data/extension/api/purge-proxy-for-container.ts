import { proxyLibraryApi } from '@/data/proxy/proxy-library-api'

/**
 * Remove any stored proxy config for a container.
 * @param cookieStoreId - The container's cookieStoreId.
 */
export const purgeProxyForContainer = async (
  cookieStoreId: string,
): Promise<void> => {
  await proxyLibraryApi.assign(cookieStoreId, '')
}
