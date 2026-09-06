import { describe, expect, it } from 'vitest'

import { parseShortcuts } from '@/data/extension/parsers/parse-shortcuts'

describe('parseShortcuts', () => {
  it('keeps well-formed entries and drops the rest', () => {
    expect(
      parseShortcuts([
        {
          cookieStoreId: 'firefox-container-1',
          id: 'a',
          url: 'https://a.example',
        },
        { id: 'missing-fields' },
        'nope',
        { cookieStoreId: 'firefox-default', id: 'b', url: 'https://b.example' },
      ]),
    ).toEqual([
      {
        cookieStoreId: 'firefox-container-1',
        id: 'a',
        url: 'https://a.example',
      },
      { cookieStoreId: 'firefox-default', id: 'b', url: 'https://b.example' },
    ])
  })

  it('falls back to an empty list for non-arrays', () => {
    expect(parseShortcuts(undefined)).toEqual([])
    expect(parseShortcuts({ id: 'a' })).toEqual([])
  })
})
