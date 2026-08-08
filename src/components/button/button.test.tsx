import { Button, ButtonRow } from '@/components/button/button'
import { describe, expect, it } from 'vitest'
import { renderSnapshot } from '@/test/render-snapshot'

describe('Button', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <Button variant="ghost" class="extra">
          Label
        </Button>,
      ),
    ).toMatchSnapshot()
  })
})

describe('ButtonRow', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <ButtonRow>
          <Button>One</Button>
          <Button variant="danger">Two</Button>
        </ButtonRow>,
      ),
    ).toMatchSnapshot()
  })
})
