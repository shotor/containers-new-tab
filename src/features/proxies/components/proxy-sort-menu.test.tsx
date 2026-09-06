import { click, renderSnapshot, renderTo } from '@/test/render-snapshot'
import { describe, expect, it, vi } from 'vitest'
import { ProxySortMenu } from '@/features/proxies/components/proxy-sort-menu'

const setSortMode = vi.fn<(mode: string) => void>()

vi.mock('@/features/proxies/hooks/use-proxy-sort', () => ({
  useProxySort: () => ({
    setSortMode,
    sortDirection: 'desc',
    sortMode: 'port',
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
    useId: () => 'proxy-sort-list-id',
  }
})

describe('ProxySortMenu', () => {
  it('matches snapshot with a reversed sort', () => {
    expect(renderSnapshot(<ProxySortMenu />)).toMatchSnapshot()
  })

  it('labels the reversed state and applies a pick', () => {
    setSortMode.mockClear()
    const container = renderTo(<ProxySortMenu />)
    const trigger = container.querySelector('[aria-haspopup="listbox"]')!
    expect(trigger.getAttribute('aria-label')).toBe(
      'Sort proxies: Port (reversed)',
    )
    click(trigger)

    const option = [...container.querySelectorAll('[role="option"]')].find(
      (el) => el.textContent === 'Containers',
    )!
    click(option)
    expect(setSortMode).toHaveBeenCalledWith('containers')
  })
})
