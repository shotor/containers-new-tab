import { describe, expect, it, vi } from 'vitest'
import { PageSection } from '@/components/page-section/page-section'
import { renderSnapshot } from '@/test/render-snapshot'

vi.mock('preact/hooks', async () => {
  const actual =
    await vi.importActual<typeof import('preact/hooks')>('preact/hooks')
  return {
    ...actual,
    useId: () => 'test-heading-id',
  }
})

describe('PageSection', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <PageSection title="Containers">
          <p>Body</p>
        </PageSection>,
      ),
    ).toMatchSnapshot()
  })
})
