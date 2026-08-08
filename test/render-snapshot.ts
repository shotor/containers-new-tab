import type { FieldValues, Path, UseFormRegister } from 'react-hook-form'
import { type JSX, render } from 'preact'
import { act } from 'preact/test-utils'

/**
 * Render UI into a fresh container under `document.body`.
 * @param ui - Element tree to render.
 * @returns The DOM container holding the render output.
 */
export const renderTo = (ui: JSX.Element) => {
  const container = document.createElement('div')
  document.body.appendChild(container)

  act(() => {
    render(ui, container)
  })

  return container
}

/**
 * Render UI for HTML snapshot assertions.
 * @param ui - Element tree to render.
 * @returns The DOM container holding the render output.
 */
export const renderSnapshot = (ui: JSX.Element) => renderTo(ui)

/**
 * Click an element inside `act`.
 * @param element - Element to click.
 */
export const click = (element: Element) => {
  act(() => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
}

/**
 * Set an input's value and fire `input` (matches Preact `onInput` handlers).
 * @param input - Target input/textarea.
 * @param value - Next value.
 */
export const typeInput = (input: HTMLInputElement, value: string) => {
  act(() => {
    input.value = value
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

/**
 * Minimal react-hook-form `register` stub for presentational form snapshots.
 * @returns A typed register function that ignores validation wiring.
 */
export const stubRegister = <
  TFieldValues extends FieldValues,
>(): UseFormRegister<TFieldValues> =>
  // Trust boundary: tests only need name/attrs on controls, not RHF internals.
  ((name: Path<TFieldValues>) => ({
    name,
    onBlur: async () => undefined,
    onChange: async () => undefined,
    ref: () => undefined,
  })) as UseFormRegister<TFieldValues>
