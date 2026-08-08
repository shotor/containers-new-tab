import { describe, expect, it } from 'vitest'
import { DetailHeader } from '@/features/container-detail/components/detail-header'
import { renderSnapshot } from '@/test/render-snapshot'

describe('DetailHeader', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <DetailHeader
          title="Work"
          color="blue"
          icon="briefcase"
          status="saved"
          onBack={() => undefined}
        />,
      ),
    ).toMatchSnapshot()
  })
})
