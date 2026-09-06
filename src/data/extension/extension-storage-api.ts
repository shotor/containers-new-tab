import { bumpUsage } from '@/data/extension/api/bump-usage'
import { getContainers } from '@/data/browser/browser-api'
import { getItem } from '@/data/extension/api/get-item'
import { purgeProxyForContainer } from '@/data/extension/api/purge-proxy-for-container'
import { purgeUsageForContainer } from '@/data/extension/api/purge-usage-for-container'
import { setStore } from '@/data/extension/api/set-store'

/** Extension storage helpers bound to `browser.storage.local` + containers. */
export const extensionStorageApi = {
  bumpUsage,
  get: getItem,
  getContainers,
  purgeProxyForContainer,
  purgeUsageForContainer,
  set: setStore,
}
