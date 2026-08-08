/** A Firefox container identity. */
export type ContainerIdentity = browser.contextualIdentities.ContextualIdentity

/** All container color names, in display order. */
export const CONTAINER_COLOR_NAMES = [
  'blue',
  'turquoise',
  'green',
  'yellow',
  'orange',
  'red',
  'pink',
  'purple',
  'toolbar',
] as const

/** All container icon names, in display order. */
export const CONTAINER_ICON_NAMES = [
  'fingerprint',
  'briefcase',
  'dollar',
  'cart',
  'vacation',
  'gift',
  'food',
  'fruit',
  'pet',
  'tree',
  'chill',
  'circle',
  'fence',
] as const

/** cookieStoreId of the default (no container) context. */
export const DEFAULT_COOKIE_STORE = 'firefox-default'
