import { describe, expect, it } from 'vitest'

import { siteLabelFromUrl } from '@/utils/url/site-label-from-url'

describe('siteLabelFromUrl', () => {
  it('shows only the hostname without scheme, www, path or query', () => {
    expect(siteLabelFromUrl('https://google.com/travel/flights')).toBe(
      'google.com',
    )
    expect(
      siteLabelFromUrl('https://app.fastmail.com/mail/Inbox?u=500940a4'),
    ).toBe('app.fastmail.com')
    expect(siteLabelFromUrl('https://www.amazon.com/')).toBe('amazon.com')
    expect(siteLabelFromUrl('https://unsplash.com/')).toBe('unsplash.com')
  })

  it('returns the input when it is not a URL', () => {
    expect(siteLabelFromUrl('not a url')).toBe('not a url')
  })
})
