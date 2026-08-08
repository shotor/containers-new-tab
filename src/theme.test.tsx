import { applyResolvedTheme, resolveTheme, ThemeProvider } from '@/theme'
import { describe, expect, it, vi } from 'vitest'
import { renderSnapshot } from '@/test/render-snapshot'

vi.mock('@/data/extension/extension-storage-api', () => ({
  extensionStorageApi: {
    get: vi.fn<any>(async () => 'system'),
    set: vi.fn<any>(async () => undefined),
  },
}))

vi.stubGlobal('browser', {
  storage: {
    onChanged: {
      addListener: vi.fn<() => void>(),
      removeListener: vi.fn<() => void>(),
    },
  },
})

describe('resolveTheme', () => {
  it('resolves explicit and system modes', () => {
    expect(resolveTheme('light')).toBe('light')
    expect(resolveTheme('dark')).toBe('dark')

    vi.stubGlobal('matchMedia', (query: string) => ({
      addEventListener: () => undefined,
      matches: query.includes('dark'),
      removeEventListener: () => undefined,
    }))
    expect(resolveTheme('system')).toBe('dark')

    vi.stubGlobal('matchMedia', () => ({
      addEventListener: () => undefined,
      matches: false,
      removeEventListener: () => undefined,
    }))
    expect(resolveTheme('system')).toBe('light')
  })
})

describe('applyResolvedTheme', () => {
  it('sets dataset.theme on the documentElement', () => {
    applyResolvedTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    applyResolvedTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})

describe('ThemeProvider', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <ThemeProvider>
          <span>child</span>
        </ThemeProvider>,
      ),
    ).toMatchSnapshot()
  })
})
