import { describe, expect, it } from 'vitest'

import { TopBar } from '@/components/top-bar/top-bar'

import { renderSnapshot } from '@/test/render-snapshot'

describe('TopBar', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <TopBar title="Containers">
          <button type="button">Sort</button>
        </TopBar>,
      ),
    ).toMatchSnapshot()
  })
})
