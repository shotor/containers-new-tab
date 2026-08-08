/// <reference types="vite/client" />

declare module '*.svg' {
  const src: string
  // oxlint-disable-next-line import/no-default-export -- Vite asset module contract
  export default src
}
