import {
  SortMenu as SortDropdown,
  type SortOption,
} from '@/components/sort-menu/sort-menu'

import type { SortMode } from '@/data/types'

import { useSortedContainers } from '@/features/container-grid/hooks/use-sorted-containers'

/** Sort options shown in the menu, in display order. */
const OPTIONS: SortOption<SortMode>[] = [
  { label: 'Most used', value: 'mostUsed' },
  { label: 'Alphabetical', value: 'alpha' },
  { label: 'Custom', value: 'custom' },
]

/**
 * Dropdown to pick the container grid sort mode.
 * @returns The rendered dropdown.
 */
export const SortMenu: React.FC = () => {
  const { sortMode, sortDirection, setSortMode } = useSortedContainers()

  return (
    <SortDropdown
      label="Sort containers"
      options={OPTIONS}
      value={sortMode}
      direction={sortDirection}
      fixed={['custom']}
      onSelect={(mode) => void setSortMode(mode)}
    />
  )
}
