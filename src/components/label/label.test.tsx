import { describe, expect, it } from 'vitest'
import { Label } from '@/components/label/label'
import { renderSnapshot } from '@/test/render-snapshot'

describe('Label', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <Label for="detail-name" class="extra">
          Name
        </Label>,
      ),
    ).toMatchSnapshot()
  })
})
