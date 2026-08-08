import { describe, expect, it } from 'vitest'
import { ContainerTile } from '@/features/container-grid/components/container-tile'
import { renderSnapshot } from '@/test/render-snapshot'

describe('ContainerTile', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <ContainerTile
          name="Work"
          color="#0000ff"
          icon="briefcase"
          current
          onOpen={() => undefined}
          onEdit={() => undefined}
        />,
      ),
    ).toMatchSnapshot()
  })
})
