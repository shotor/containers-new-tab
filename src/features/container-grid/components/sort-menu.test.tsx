import { click, renderSnapshot, renderTo } from '@/test/render-snapshot'
import { describe, expect, it, vi } from 'vitest'
import { SortMenu } from '@/features/container-grid/components/sort-menu'

const setSortMode = vi.fn<(mode: string) => void>()

vi.mock('@/features/container-grid/hooks/use-sorted-containers', () => ({
  useSortedContainers: () => ({
    setSortMode,
    sortMode: 'mostUsed',
  }),
}))

vi.mock('@/utils/dom/use-dismiss-on-outside-or-escape', () => ({
  useDismissOnOutsideOrEscape: () => undefined,
}))

vi.mock('preact/hooks', async () => {
  const actual =
    await vi.importActual<typeof import('preact/hooks')>('preact/hooks')
  return {
    ...actual,
    useId: () => 'sort-list-id',
  }
})

describe('SortMenu', () => {
  it('matches snapshot', () => {
    expect(renderSnapshot(<SortMenu />)).toMatchSnapshot()
  })

  it('opens and applies a sort mode', () => {
    setSortMode.mockClear()
    const container = renderTo(<SortMenu />)

    const trigger = container.querySelector('[aria-haspopup="listbox"]')
    expect(trigger).toBeTruthy()
    click(trigger as Element)

    const option = [...container.querySelectorAll('[role="option"]')].find(
      (el) => el.textContent === 'Alphabetical',
    )
    expect(option).toBeTruthy()
    click(option as Element)
    expect(setSortMode).toHaveBeenCalledWith('alpha')
  })
})
