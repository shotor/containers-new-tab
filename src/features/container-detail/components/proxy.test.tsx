import {
  type ContainerDetailFormValues,
  DEFAULT_CONTAINER_DETAIL_FORM,
} from '@/features/container-detail/container-detail.schema'
import { describe, expect, it } from 'vitest'
import { renderSnapshot, stubRegister } from '@/test/render-snapshot'
import { Proxy } from '@/features/container-detail/components/proxy'

const register = stubRegister<ContainerDetailFormValues>()

describe('Proxy', () => {
  it('matches snapshot', () => {
    expect(
      renderSnapshot(
        <Proxy register={register} values={DEFAULT_CONTAINER_DETAIL_FORM} />,
      ),
    ).toMatchSnapshot()
  })
})
