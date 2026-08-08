import { describe, expect, it } from 'vitest'
import { replaceHostname } from '@/utils/url/replace-hostname'

describe('replaceHostname', () => {
  it('swaps the host and keeps the path', () => {
    expect(replaceHostname('https://amazon.com/dp/123', 'www.amazon.com')).toBe(
      'https://www.amazon.com/dp/123',
    )
  })
})
