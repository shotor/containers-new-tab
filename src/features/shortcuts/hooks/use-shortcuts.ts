import { useCallback, useEffect, useState } from 'preact/hooks'

import { type NewShortcut, shortcutsApi } from '@/data/shortcuts/shortcuts-api'
import type { Shortcut } from '@/data/types'

/**
 * Saved shortcuts, kept in sync with storage changes from other tabs.
 * @returns Shortcuts, loading state and add/update/remove actions.
 */
export const useShortcuts = () => {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      const next = await shortcutsApi.get()

      if (active) {
        setShortcuts(next)
        setLoading(false)
      }
    }

    const onChange = (
      changes: Record<string, browser.storage.StorageChange>,
      area: string,
    ) => {
      if (area === 'local' && 'shortcuts' in changes) {
        void load()
      }
    }

    browser.storage.onChanged.addListener(onChange)
    void load()

    return () => {
      active = false
      browser.storage.onChanged.removeListener(onChange)
    }
  }, [])

  const add = useCallback(async (input: NewShortcut): Promise<void> => {
    const shortcut = await shortcutsApi.add(input)
    setShortcuts((prev) =>
      prev.some((item) => item.id === shortcut.id) ? prev : [...prev, shortcut],
    )
  }, [])

  const update = useCallback(
    async (id: string, input: NewShortcut): Promise<void> => {
      const shortcut = await shortcutsApi.update(id, input)
      setShortcuts((prev) =>
        prev.map((item) => (item.id === id ? shortcut : item)),
      )
    },
    [],
  )

  const remove = useCallback(async (id: string): Promise<void> => {
    await shortcutsApi.remove(id)
    setShortcuts((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return { add, loading, remove, shortcuts, update }
}
