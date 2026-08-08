import { describe, expect, it } from 'vitest'
import { parseHostname } from '@/utils/url/parse-hostname'

describe('parseHostname', () => {
  it('parses bare hosts and URLs to lowercase hostnames', () => {
    expect(parseHostname('Example.COM')).toBe('example.com')
    expect(parseHostname('https://Example.COM/path')).toBe('example.com')
  })

  it('returns null for unparseable values', () => {
    expect(parseHostname('')).toBeNull()
  })
})
