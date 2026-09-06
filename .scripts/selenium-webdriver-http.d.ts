// @types/selenium-webdriver only declares 'selenium-webdriver/http'; at runtime
// (Node ESM, no exports map) the module must be imported by its file path.
declare module 'selenium-webdriver/http/index.js' {
  export * from 'selenium-webdriver/http'
}
