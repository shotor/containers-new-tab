import { describe, expect, it } from 'vitest'
import { parseThemeMode } from '@/data/extension/parsers/parse-theme-mode'

describe('parseThemeMode', () => {
  it('accepts known modes', () => {
    expect(parseThemeMode('light')).toBe('light')
    expect(parseThemeMode('dark')).toBe('dark')
    expect(parseThemeMode('system')).toBe('system')
  })

  it('falls back for unknown or non-string values', () => {
    expect(parseThemeMode('sepia')).toBe('system')
    expect(parseThemeMode({})).toBe('system')
  })
})
