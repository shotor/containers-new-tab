import { describe, expect, it } from 'vitest'
import { colorCodeFor } from '@/data/browser/api/color-code-for'

describe('colorCodeFor', () => {
  it('resolves known colors and falls back', () => {
    expect(colorCodeFor('blue')).toBe('#37adff')
    expect(colorCodeFor('nope', '#111')).toBe('#111')
    expect(colorCodeFor('nope')).toBe('#37adff')
  })
})
