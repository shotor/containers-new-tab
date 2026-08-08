import { describe, expect, it } from 'vitest'
import { renderSnapshot } from '@/test/render-snapshot'
import { SaveStatusIndicator } from '@/components/save-status-indicator/save-status-indicator'

describe('SaveStatusIndicator', () => {
  it('matches snapshot when saved', () => {
    expect(
      renderSnapshot(<SaveStatusIndicator status="saved" class="muted" />),
    ).toMatchSnapshot()
  })

  it('renders nothing when idle', () => {
    expect(
      renderSnapshot(<SaveStatusIndicator status="idle" />).innerHTML,
    ).toBe('')
  })

  it('shows a pending spinner', () => {
    const container = renderSnapshot(<SaveStatusIndicator status="pending" />)
    expect(container.querySelector('[aria-label="Saving"]')).toBeTruthy()
    expect(container.querySelector('[aria-label="Saved"]')).toBeNull()
  })
})
