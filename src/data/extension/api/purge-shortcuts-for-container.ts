import { DEFAULT_COOKIE_STORE } from '@/data/browser/types'
import { getItem } from '@/data/extension/api/get-item'
import { setStore } from '@/data/extension/api/set-store'

/**
 * Point shortcuts of a deleted container at no container, keeping the sites.
 * @param cookieStoreId - The deleted container's cookieStoreId.
 */
export const purgeShortcutsForContainer = async (
  cookieStoreId: string,
): Promise<void> => {
  const shortcuts = await getItem('shortcuts')

  if (!shortcuts.some((shortcut) => shortcut.cookieStoreId === cookieStoreId)) {
    return
  }

  await setStore({
    shortcuts: shortcuts.map((shortcut) =>
      shortcut.cookieStoreId === cookieStoreId
        ? { ...shortcut, cookieStoreId: DEFAULT_COOKIE_STORE }
        : shortcut,
    ),
  })
}
