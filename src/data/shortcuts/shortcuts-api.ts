import { DEFAULT_COOKIE_STORE } from '@/data/browser/types'
import { getItem } from '@/data/extension/api/get-item'
import { setStore } from '@/data/extension/api/set-store'
import type { Shortcut } from '@/data/types'

import { toHttpsUrl } from '@/utils/url/to-https-url'

/** Serialises read-modify-write across extension tabs. */
const LOCK = 'shortcuts'

export type NewShortcut = {
  url: string
  /** Defaults to no container. */
  cookieStoreId?: string
}

/**
 * Reject an address another shortcut already uses.
 * @param shortcuts - Current shortcuts.
 * @param url - Normalised address to check.
 * @param exceptId - Shortcut being edited, allowed to keep its own address.
 * @throws {Error} When another shortcut has the same address.
 */
const assertUnique = (
  shortcuts: Shortcut[],
  url: string,
  exceptId?: string,
): void => {
  if (shortcuts.some((item) => item.url === url && item.id !== exceptId)) {
    throw new Error('This website is already a shortcut.')
  }
}

/**
 * Read the saved shortcuts.
 * @returns Shortcuts in creation order.
 */
const get = (): Promise<Shortcut[]> => getItem('shortcuts')

/**
 * Add a shortcut, normalising the address to https.
 * @param input - Website (host or URL) and the container to open it in.
 * @returns The stored shortcut.
 * @throws {Error} When the address is invalid or already a shortcut.
 */
const add = (input: NewShortcut): Promise<Shortcut> =>
  navigator.locks.request(LOCK, async () => {
    const url = toHttpsUrl(input.url)

    if (!url) {
      throw new Error('Enter a valid website address.')
    }

    const shortcuts = await getItem('shortcuts')
    assertUnique(shortcuts, url)

    const shortcut: Shortcut = {
      cookieStoreId: input.cookieStoreId ?? DEFAULT_COOKIE_STORE,
      id: crypto.randomUUID(),
      url,
    }

    await setStore({ shortcuts: [...shortcuts, shortcut] })
    return shortcut
  })

/**
 * Change a shortcut's address and/or container.
 * @param id - Shortcut identifier.
 * @param input - New website (host or URL) and container.
 * @returns The updated shortcut.
 * @throws {Error} When the shortcut is gone, or the address is invalid or taken.
 */
const update = (id: string, input: NewShortcut): Promise<Shortcut> =>
  navigator.locks.request(LOCK, async () => {
    const url = toHttpsUrl(input.url)

    if (!url) {
      throw new Error('Enter a valid website address.')
    }

    const shortcuts = await getItem('shortcuts')
    const current = shortcuts.find((item) => item.id === id)

    if (!current) {
      throw new Error('This shortcut no longer exists.')
    }

    assertUnique(shortcuts, url, id)

    const shortcut: Shortcut = {
      cookieStoreId: input.cookieStoreId ?? current.cookieStoreId,
      id,
      url,
    }

    await setStore({
      shortcuts: shortcuts.map((item) => (item.id === id ? shortcut : item)),
    })
    return shortcut
  })

/**
 * Delete a shortcut.
 * @param id - Shortcut identifier.
 * @returns Completion of deletion.
 */
const remove = (id: string): Promise<void> =>
  navigator.locks.request(LOCK, async () => {
    const shortcuts = await getItem('shortcuts')
    await setStore({
      shortcuts: shortcuts.filter((shortcut) => shortcut.id !== id),
    })
  })

/** User-defined website shortcuts and the containers they open in. */
export const shortcutsApi = { add, get, remove, update }
