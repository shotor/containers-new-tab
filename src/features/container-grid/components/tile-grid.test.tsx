import { describe, expect, it } from 'vitest'
import { renderSnapshot } from '@/test/render-snapshot'
import { TileGrid } from '@/features/container-grid/components/tile-grid'

describe('TileGrid', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <TileGrid
          identities={[
            {
              color: 'blue',
              colorCode: '#00f',
              cookieStoreId: 'firefox-container-1',
              icon: 'briefcase',
              iconUrl: 'icon:briefcase',
              name: 'Work',
            },
          ]}
          sortableEnabled={false}
          currentStoreId="firefox-default"
          onOpen={() => undefined}
          onEdit={() => undefined}
          onNew={() => undefined}
          onOrderChange={() => undefined}
        />,
      ),
    ).toMatchSnapshot()
  })
})
