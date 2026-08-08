import { describe, expect, it } from 'vitest'
import { renderSnapshot, renderTo, typeInput } from '@/test/render-snapshot'
import { AssignedSites } from '@/features/container-detail/components/assigned-sites'

const sites = [
  {
    cookieStoreId: 'firefox-container-1',
    host: 'github.com',
    url: 'https://github.com',
  },
  {
    cookieStoreId: 'firefox-container-1',
    host: 'example.com',
    url: 'https://example.com',
  },
]

describe('AssignedSites', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <AssignedSites sites={sites} onOpenSite={() => undefined} />,
      ),
    ).toMatchSnapshot()
  })

  it('filters sites by search query', () => {
    const container = renderTo(
      <AssignedSites sites={sites} onOpenSite={() => undefined} />,
    )

    const input = container.querySelector('input[type="search"]')
    expect(input).toBeTruthy()
    typeInput(input as HTMLInputElement, 'git')

    expect(container.textContent).toContain('github.com')
    expect(container.textContent).not.toContain('example.com')
  })
})
