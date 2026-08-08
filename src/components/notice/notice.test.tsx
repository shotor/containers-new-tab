import { describe, expect, it } from 'vitest'
import { Notice } from '@/components/notice/notice'
import { renderSnapshot } from '@/test/render-snapshot'

describe('Notice', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(<Notice variant="warning">Watch out</Notice>),
    ).toMatchSnapshot()
  })
})
