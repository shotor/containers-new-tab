import { type ComponentChildren, createContext } from 'preact'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks'
import { extensionStorageApi } from '@/data/extension/extension-storage-api'
import type { ThemeMode } from '@/data/types'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  themeMode: ThemeMode
  resolved: Theme
  setMode: (mode: ThemeMode) => Promise<void>
}

type ThemeProviderProps = {
  children: ComponentChildren
}

/**
 * Resolve a theme mode to the concrete theme to apply.
 * @param mode - The stored theme mode.
 * @returns "light" or "dark" (system preference resolved).
 */
export const resolveTheme = (mode: ThemeMode): Theme => {
  if (mode === 'light') {
    return 'light'
  }

  if (mode === 'dark') {
    return 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * Apply a resolved theme to the document root.
 * @param resolved - The concrete theme to apply.
 */
export const applyResolvedTheme = (resolved: Theme): void => {
  document.documentElement.dataset.theme = resolved
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Provide the theme mode, kept in sync with storage and the OS scheme.
 * @param props - The subtree to theme.
 * @returns The rendered provider.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system')
  const [resolved, setResolved] = useState<Theme>(() => resolveTheme('system'))

  /**
   * Apply a mode locally and reflect it in state and on the document.
   * @param mode - The theme mode to apply.
   */
  const apply = useCallback((mode: ThemeMode) => {
    const next = resolveTheme(mode)
    setThemeModeState(mode)
    setResolved(next)
    applyResolvedTheme(next)
  }, [])

  /**
   * Reload the stored mode and apply it.
   */
  const sync = useCallback(async () => {
    const mode = await extensionStorageApi.get('themeMode')
    apply(mode)
  }, [apply])

  useEffect(() => {
    void sync()
  }, [sync])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    const onScheme = () => {
      void sync()
    }

    mq.addEventListener('change', onScheme)

    const onStorage = (
      changes: { [key: string]: browser.storage.StorageChange },
      area: string,
    ) => {
      if (area === 'local' && changes.themeMode) {
        void sync()
      }
    }

    browser.storage.onChanged.addListener(onStorage)

    return () => {
      mq.removeEventListener('change', onScheme)
      browser.storage.onChanged.removeListener(onStorage)
    }
  }, [sync])

  /**
   * Apply and persist a new theme mode.
   * @param mode - The theme mode to store.
   */
  const setMode = useCallback(
    async (mode: ThemeMode) => {
      apply(mode)
      await extensionStorageApi.set({ themeMode: mode })
    },
    [apply],
  )

  const value = useMemo(
    () => ({ resolved, setMode, themeMode }),
    [themeMode, resolved, setMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Current theme mode and setter from the nearest ThemeProvider.
 * @returns The theme context value.
 * @throws {Error} When used outside a ThemeProvider.
 */
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext)

  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return ctx
}
