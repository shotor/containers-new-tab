import { click, renderSnapshot, renderTo } from '@/test/render-snapshot'
import { describe, expect, it, vi } from 'vitest'
import { ThemeMenu } from '@/features/theme-menu/theme-menu'

const setMode = vi.fn<(mode: string) => void>()

vi.mock('@/theme', () => ({
  useTheme: () => ({
    setMode,
    themeMode: 'system',
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
    useId: () => 'theme-list-id',
  }
})

describe('ThemeMenu', () => {
  it('matches snapshot', () => {
    expect(renderSnapshot(<ThemeMenu />)).toMatchSnapshot()
  })

  it('opens and applies a theme mode', () => {
    setMode.mockClear()
    const container = renderTo(<ThemeMenu />)

    const trigger = container.querySelector('[aria-haspopup="listbox"]')
    expect(trigger).toBeTruthy()
    click(trigger as Element)

    const option = [...container.querySelectorAll('[role="option"]')].find(
      (el) => el.getAttribute('aria-label') === 'Dark',
    )
    expect(option).toBeTruthy()
    click(option as Element)
    expect(setMode).toHaveBeenCalledWith('dark')
  })
})
