import { describe, expect, it } from 'vitest'
import { ColorField } from '@/features/container-detail/components/color-field'
import { renderSnapshot } from '@/test/render-snapshot'

describe('ColorField', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(<ColorField color="blue" onChange={() => undefined} />),
    ).toMatchSnapshot()
  })
})
