import { useEffect, useState } from 'preact/hooks'
import { DEFAULT_COOKIE_STORE } from '@/data/browser/types'

/**
 * cookieStoreId of the tab that hosts this page (for highlighting the current tile).
 * @returns The current tab's cookieStoreId, or the default store.
 */
export const useCurrentStoreId = (): string => {
  const [currentStoreId, setCurrentStoreId] =
    useState<string>(DEFAULT_COOKIE_STORE)

  useEffect(() => {
    const load = async () => {
      try {
        const tab = await browser.tabs.getCurrent()
        setCurrentStoreId(tab?.cookieStoreId ?? DEFAULT_COOKIE_STORE)
      } catch {
        setCurrentStoreId(DEFAULT_COOKIE_STORE)
      }
    }

    void load()
  }, [])

  return currentStoreId
}
