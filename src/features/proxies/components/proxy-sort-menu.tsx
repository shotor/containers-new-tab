import { SortMenu, type SortOption } from '@/components/sort-menu/sort-menu'

import type { ProxySortMode } from '@/data/types'

import { useProxySort } from '@/features/proxies/hooks/use-proxy-sort'

/** Sort options shown in the menu, in display order. */
const OPTIONS: SortOption<ProxySortMode>[] = [
  { label: 'Name', value: 'name' },
  { label: 'Type', value: 'type' },
  { label: 'Port', value: 'port' },
  { label: 'Containers', value: 'containers' },
]

/**
 * Dropdown to pick the proxy list sort mode.
 * @returns The rendered dropdown.
 */
export const ProxySortMenu: React.FC = () => {
  const { sortMode, sortDirection, setSortMode } = useProxySort()

  return (
    <SortMenu
      label="Sort proxies"
      options={OPTIONS}
      value={sortMode}
      direction={sortDirection}
      onSelect={(mode) => void setSortMode(mode)}
    />
  )
}
