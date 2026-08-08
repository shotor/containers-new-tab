import { describe, expect, it } from 'vitest'
import { renderSnapshot } from '@/test/render-snapshot'
import { TopBar } from '@/components/top-bar/top-bar'

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
