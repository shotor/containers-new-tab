/** Shared storage schema for Containers Tab. */

export type SortMode = 'mostUsed' | 'alpha' | 'custom'

export type ThemeMode = 'system' | 'light' | 'dark'

export type ProxyType = 'direct' | 'http' | 'https' | 'socks' | 'socks4'

/** All selectable sort modes. */
export const SORT_MODES: readonly SortMode[] = ['mostUsed', 'alpha', 'custom']

/** All selectable theme modes. */
export const THEME_MODES: readonly ThemeMode[] = ['system', 'light', 'dark']

/** All selectable proxy types, in display order. */
export const PROXY_TYPES: readonly ProxyType[] = [
  'direct',
  'http',
  'https',
  'socks',
  'socks4',
]

export interface ContainerProxy {
  type: ProxyType
  host: string
  port: number
  username?: string
  password?: string
  doNotProxyLocal: boolean
}

export interface ExtensionStorageObject {
  sortMode: SortMode
  themeMode: ThemeMode
  usageCounts: Record<string, number>
  customOrder: string[]
  containerProxies: Record<string, ContainerProxy>
}

/** Defaults used when a stored value is missing or invalid. */
export const DEFAULT_STORE: ExtensionStorageObject = {
  containerProxies: {},
  customOrder: [],
  sortMode: 'mostUsed',
  themeMode: 'system',
  usageCounts: {},
}
