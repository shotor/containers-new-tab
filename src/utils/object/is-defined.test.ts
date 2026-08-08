import { describe, expect, it } from 'vitest'
import { isDefined } from '@/utils/object/is-defined'

describe('isDefined', () => {
  it('rejects null and undefined', () => {
    expect(isDefined(null)).toBe(false)
    expect(isDefined(undefined)).toBe(false)
  })

  it('rejects other falsy values via !!', () => {
    expect(isDefined(0)).toBe(false)
    expect(isDefined('')).toBe(false)
  })

  it('accepts truthy values', () => {
    expect(isDefined('x')).toBe(true)
    expect(isDefined(1)).toBe(true)
    expect(isDefined({})).toBe(true)
  })
})
