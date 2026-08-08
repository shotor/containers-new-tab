import { describe, expect, it } from 'vitest'
import { renderSnapshot, stubRegister } from '@/test/render-snapshot'
import type { ContainerDetailFormValues } from '@/features/container-detail/container-detail.schema'
import { Identity } from '@/features/container-detail/components/identity'

const register = stubRegister<ContainerDetailFormValues>()

describe('Identity', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <Identity
          register={register}
          values={{ color: 'blue', icon: 'briefcase', name: 'Work' }}
          onColorChange={() => undefined}
          onIconChange={() => undefined}
        />,
      ),
    ).toMatchSnapshot()
  })
})
