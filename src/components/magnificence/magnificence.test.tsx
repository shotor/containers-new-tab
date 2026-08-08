import { describe, expect, it } from 'vitest'
import { Magnificence } from '@/components/magnificence/magnificence'
import { renderSnapshot } from '@/test/render-snapshot'

describe('Magnificence', () => {
  it('matches snapshot', () => {
    expect(renderSnapshot(<Magnificence />)).toMatchSnapshot()
  })
})
