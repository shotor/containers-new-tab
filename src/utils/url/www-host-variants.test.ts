import { describe, expect, it } from 'vitest'
import { wwwHostVariants } from '@/utils/url/www-host-variants'

describe('wwwHostVariants', () => {
  it('returns apex and www for either form', () => {
    expect(wwwHostVariants('amazon.com')).toEqual([
      'amazon.com',
      'www.amazon.com',
    ])
    expect(wwwHostVariants('www.amazon.com')).toEqual([
      'amazon.com',
      'www.amazon.com',
    ])
  })
})
