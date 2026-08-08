import { describe, expect, it } from 'vitest'
import { DeleteConfirmDialog } from '@/features/container-detail/components/delete-confirm-dialog'
import { renderSnapshot } from '@/test/render-snapshot'

describe('DeleteConfirmDialog', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <DeleteConfirmDialog
          name="Work"
          color="blue"
          icon="briefcase"
          onCancel={() => undefined}
          onConfirm={() => undefined}
        />,
      ),
    ).toMatchSnapshot()
  })
})
