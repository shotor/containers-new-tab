import { describe, expect, it } from 'vitest'
import { mapObject } from '@/utils/object/map-object'

describe('mapObject', () => {
  it('maps each entry through the callback', () => {
    expect(
      mapObject({ a: 1, b: 2 }, (value, key) => `${key}:${value * 2}`),
    ).toEqual({ a: 'a:2', b: 'b:4' })
  })
})
