import { describe, expect, it } from 'vitest'
import { preferSiteUrl } from '@/utils/url/prefer-site-url'

describe('preferSiteUrl', () => {
  it('keeps the longer path', () => {
    expect(
      preferSiteUrl('https://google.com/', 'https://google.com/travel/flights'),
    ).toBe('https://google.com/travel/flights')

    expect(
      preferSiteUrl('https://google.com/travel/flights', 'https://google.com/'),
    ).toBe('https://google.com/travel/flights')
  })
})
