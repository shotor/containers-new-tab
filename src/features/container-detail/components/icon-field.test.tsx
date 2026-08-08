import { describe, expect, it } from 'vitest'
import { IconField } from '@/features/container-detail/components/icon-field'
import { renderSnapshot } from '@/test/render-snapshot'

describe('IconField', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <IconField color="blue" icon="briefcase" onChange={() => undefined} />,
      ),
    ).toMatchSnapshot()
  })
})
