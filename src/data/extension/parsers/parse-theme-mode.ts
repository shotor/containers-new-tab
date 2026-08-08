import { DEFAULT_STORE, THEME_MODES, type ThemeMode } from '@/data/types'

const isThemeMode = (value: unknown): value is ThemeMode =>
  typeof value === 'string' &&
  (THEME_MODES as readonly string[]).includes(value)

/**
 * Parse a stored theme mode, or fall back to the default.
 * @param value - Raw storage value.
 * @returns A valid theme mode.
 */
export const parseThemeMode = (value: unknown): ThemeMode =>
  isThemeMode(value) ? value : DEFAULT_STORE.themeMode
