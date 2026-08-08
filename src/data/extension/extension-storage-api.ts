import { bumpUsage } from '@/data/extension/api/bump-usage'
import { getContainers } from '@/data/browser/browser-api'
import { getItem } from '@/data/extension/api/get-item'
import { getProxyForContainer } from '@/data/extension/api/get-proxy-for-container'
import { purgeProxyForContainer } from '@/data/extension/api/purge-proxy-for-container'
import { purgeUsageForContainer } from '@/data/extension/api/purge-usage-for-container'
import { setProxyForContainer } from '@/data/extension/api/set-proxy-for-container'
import { setStore } from '@/data/extension/api/set-store'

/** Extension storage helpers bound to `browser.storage.local` + containers. */
export const extensionStorageApi = {
  bumpUsage,
  get: getItem,
  getContainers,
  getProxyForContainer,
  purgeProxyForContainer,
  purgeUsageForContainer,
  set: setStore,
  setProxyForContainer,
}
