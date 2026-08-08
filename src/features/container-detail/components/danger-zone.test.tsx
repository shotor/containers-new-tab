import { describe, expect, it } from 'vitest'
import { DangerZone } from '@/features/container-detail/components/danger-zone'
import { renderSnapshot } from '@/test/render-snapshot'

describe('DangerZone', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(<DangerZone onDelete={() => undefined} />),
    ).toMatchSnapshot()
  })
})
