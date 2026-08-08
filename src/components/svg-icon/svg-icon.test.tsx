import { describe, expect, it } from 'vitest'
import { iconUrlFor, SvgIcon } from '@/components/svg-icon/svg-icon'
import { renderSnapshot } from '@/test/render-snapshot'

describe('SvgIcon', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(<SvgIcon name="briefcase" class="icon" size={24} />),
    ).toMatchSnapshot()
  })
})

describe('iconUrlFor', () => {
  it('resolves a distinct bundled url for every firefox container icon', () => {
    const names = [
      'fingerprint',
      'briefcase',
      'dollar',
      'cart',
      'vacation',
      'gift',
      'food',
      'fruit',
      'pet',
      'tree',
      'chill',
      'circle',
      'fence',
    ]
    const urls = new Set(names.map((name) => iconUrlFor(name)))
    expect(urls.size).toBe(names.length)
  })

  it('falls back to the circle icon for unknown names', () => {
    expect(iconUrlFor('does-not-exist')).toBe(iconUrlFor('circle'))
  })
})
