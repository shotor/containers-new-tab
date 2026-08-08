import { describe, expect, it } from 'vitest'
import { toHttpsUrl } from '@/utils/url/to-https-url'

describe('toHttpsUrl', () => {
  it('preserves path on full URLs and bare hosts', () => {
    expect(toHttpsUrl('https://google.com/travel/flights')).toBe(
      'https://google.com/travel/flights',
    )
    expect(toHttpsUrl('http://Example.COM/a')).toBe('https://example.com/a')
    expect(toHttpsUrl('unsplash.com')).toBe('https://unsplash.com')
  })

  it('returns null for empty or invalid input', () => {
    expect(toHttpsUrl('')).toBeNull()
    expect(toHttpsUrl('https://')).toBeNull()
  })
})
