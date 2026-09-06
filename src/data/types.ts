/** Shared storage schema for Containers Tab. */

export type SortMode = 'mostUsed' | 'alpha' | 'custom'

/** `asc` is a mode's natural order; `desc` reverses it (not for custom). */
export type SortDirection = 'asc' | 'desc'

export type ProxySortMode = 'name' | 'type' | 'port' | 'containers'

export type ThemeMode = 'system' | 'light' | 'dark'

export type ProxyType = 'direct' | 'http' | 'https' | 'socks' | 'socks4'

/** All selectable sort modes. */
export const SORT_MODES: readonly SortMode[] = ['mostUsed', 'alpha', 'custom']

/** All selectable proxy sort modes, in display order. */
export const PROXY_SORT_MODES: readonly ProxySortMode[] = [
  'name',
  'type',
  'port',
  'containers',
]

/** All sort directions. */
export const SORT_DIRECTIONS: readonly SortDirection[] = ['asc', 'desc']

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

export type SavedProxy = ContainerProxy & { name: string }

export type ProxyLibrary = {
  proxies: Record<string, SavedProxy>
  assignments: Record<string, string>
}

/** A user-defined website shortcut that opens in a chosen container. */
export type Shortcut = {
  id: string
  url: string
  /** Container to open in; `firefox-default` for no container. */
  cookieStoreId: string
}

export interface ExtensionStorageObject {
  sortMode: SortMode
  sortDirection: SortDirection
  proxySortMode: ProxySortMode
  proxySortDirection: SortDirection
  themeMode: ThemeMode
  usageCounts: Record<string, number>
  customOrder: string[]
  containerProxies: Record<string, ContainerProxy>
  shortcuts: Shortcut[]
}

/** Defaults used when a stored value is missing or invalid. */
export const DEFAULT_STORE: ExtensionStorageObject = {
  containerProxies: {},
  customOrder: [],
  proxySortDirection: 'asc',
  proxySortMode: 'name',
  shortcuts: [],
  sortDirection: 'asc',
  sortMode: 'mostUsed',
  themeMode: 'system',
  usageCounts: {},
}
