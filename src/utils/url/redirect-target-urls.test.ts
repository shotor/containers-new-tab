import { describe, expect, it } from 'vitest'
import { redirectTargetUrls } from '@/utils/url/redirect-target-urls'

describe('redirectTargetUrls', () => {
  it('extracts continue= destinations from consent URLs', () => {
    expect(
      redirectTargetUrls(
        'https://consent.google.com/m?continue=https://www.google.com/travel/flights&gl=NL',
      ),
    ).toEqual(['https://www.google.com/travel/flights'])
  })
})
