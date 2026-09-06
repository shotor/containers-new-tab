import {
  DEFAULT_STORE,
  PROXY_SORT_MODES,
  type ProxySortMode,
} from '@/data/types'

const isProxySortMode = (value: unknown): value is ProxySortMode =>
  typeof value === 'string' &&
  (PROXY_SORT_MODES as readonly string[]).includes(value)

/**
 * Parse a stored proxy sort mode, or fall back to the default.
 * @param value - Raw storage value.
 * @returns A valid proxy sort mode.
 */
export const parseProxySortMode = (value: unknown): ProxySortMode =>
  isProxySortMode(value) ? value : DEFAULT_STORE.proxySortMode
