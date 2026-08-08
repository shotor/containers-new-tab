import { describe, expect, it } from 'vitest'
import { siteLabelFromUrl } from '@/utils/url/site-label-from-url'

describe('siteLabelFromUrl', () => {
  it('shows host and path without scheme or www', () => {
    expect(siteLabelFromUrl('https://google.com/travel/flights')).toBe(
      'google.com/travel/flights',
    )
    expect(siteLabelFromUrl('https://www.amazon.com/')).toBe('amazon.com')
    expect(siteLabelFromUrl('https://unsplash.com/')).toBe('unsplash.com')
  })
})
