import { describe, expect, it } from 'vitest'
import { renderSnapshot } from '@/test/render-snapshot'
import { SiteRow } from '@/components/site-row/site-row'

describe('SiteRow', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <SiteRow
          url="https://example.com"
          badge={<span>Work</span>}
          onOpen={() => undefined}
        />,
      ),
    ).toMatchSnapshot()
  })

  it('shows path in the label', () => {
    const container = renderSnapshot(
      <SiteRow
        url="https://google.com/travel/flights"
        onOpen={() => undefined}
      />,
    )
    expect(container.textContent).toContain('google.com/travel/flights')
  })
})
