import { describe, expect, it, vi } from 'vitest'
import { renderSnapshot, renderTo, typeInput } from '@/test/render-snapshot'
import { Search } from '@/components/search/search'

describe('Search', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <Search
          id="sites-search"
          label="Search sites"
          value="git"
          placeholder="Search…"
          onChange={() => undefined}
        />,
      ),
    ).toMatchSnapshot()
  })

  it('forwards input changes', () => {
    const onChange = vi.fn<(value: string) => void>()
    const container = renderTo(
      <Search
        id="sites-search"
        label="Search sites"
        value=""
        onChange={onChange}
      />,
    )

    const input = container.querySelector('input[type="search"]')
    expect(input).toBeTruthy()
    typeInput(input as HTMLInputElement, 'a')
    expect(onChange).toHaveBeenCalledWith('a')
  })
})
