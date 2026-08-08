import { extensionStorageApi } from '@/data/extension/extension-storage-api'

/**
 * Open a URL (or blank tab) in a container, replacing the current tab by default.
 * @param cookieStoreId - The container's cookieStoreId.
 * @param url - Optional URL to open; blank tab when omitted.
 * @param opts - replaceCurrent defaults to true; false opens beside.
 */
export const openContainerTab = async (
  cookieStoreId: string,
  url?: string,
  opts?: { replaceCurrent?: boolean },
): Promise<void> => {
  const replaceCurrent = opts?.replaceCurrent !== false
  await extensionStorageApi.bumpUsage(cookieStoreId)
  const current = await browser.tabs.getCurrent()
  const createProps: browser.tabs._CreateCreateProperties = {
    active: replaceCurrent,
    cookieStoreId,
  }

  if (url) {
    createProps.url = url
  }

  await browser.tabs.create(createProps)

  if (replaceCurrent && current?.id != null) {
    await browser.tabs.remove(current.id)
  }
}
