import { describe, expect, it } from 'vitest'

import { SiteRow } from '@/components/site-row/site-row'

import { renderSnapshot } from '@/test/render-snapshot'

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

  it('shows only the hostname in the label, full URL in the tooltip', () => {
    const container = renderSnapshot(
      <SiteRow
        url="https://google.com/travel/flights"
        onOpen={() => undefined}
      />,
    )
    expect(container.textContent).toContain('google.com')
    expect(container.textContent).not.toContain('/travel/flights')
    expect(container.querySelector('button')?.getAttribute('title')).toBe(
      'https://google.com/travel/flights',
    )
  })
})
