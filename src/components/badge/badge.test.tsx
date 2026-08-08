import { describe, expect, it } from 'vitest'
import { Badge } from '@/components/badge/badge'
import { renderSnapshot } from '@/test/render-snapshot'

describe('Badge', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(<Badge label="Work" color="#ff0000" />),
    ).toMatchSnapshot()
  })
})
