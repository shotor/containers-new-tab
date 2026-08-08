import { describe, expect, it } from 'vitest'
import { FieldError } from '@/features/container-detail/components/field-error'
import { renderSnapshot } from '@/test/render-snapshot'

describe('FieldError', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <FieldError id="detail-name-error" message="Name is required" />,
      ),
    ).toMatchSnapshot()
  })

  it('renders nothing without a message', () => {
    expect(renderSnapshot(<FieldError />).innerHTML).toBe('')
  })
})
