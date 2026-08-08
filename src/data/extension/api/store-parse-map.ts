import type { ExtensionStorageObject } from '@/data/types'
import { parseContainerProxies } from '@/data/extension/parsers/parse-container-proxies'
import { parseCustomOrder } from '@/data/extension/parsers/parse-custom-order'
import { parseSortMode } from '@/data/extension/parsers/parse-sort-mode'
import { parseThemeMode } from '@/data/extension/parsers/parse-theme-mode'
import { parseUsageCounts } from '@/data/extension/parsers/parse-usage-counts'

/** Per-key parsers for `browser.storage.local` extension fields. */
export const storeParseMap: {
  [K in keyof ExtensionStorageObject]: (
    value: unknown,
  ) => ExtensionStorageObject[K]
} = {
  containerProxies: parseContainerProxies,
  customOrder: parseCustomOrder,
  sortMode: parseSortMode,
  themeMode: parseThemeMode,
  usageCounts: parseUsageCounts,
}
