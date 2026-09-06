import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { Executor, HttpClient } from 'selenium-webdriver/http/index.js'
import { Session, WebDriver } from 'selenium-webdriver'
import firefox from 'selenium-webdriver/firefox.js'
import { resolve } from 'node:path'

/** Where the live session handle is recorded for `attachFirefoxSession`. */
export const SESSION_FILE = resolve('.cache/firefox/session.json')

export type FirefoxSessionInfo = {
  /** geckodriver HTTP endpoint (classic WebDriver). */
  url: string
  /** WebDriver session id; geckodriver serves exactly one session. */
  sessionId: string
  /** WebDriver BiDi websocket endpoint, already scoped to the session. */
  webSocketUrl?: string
}

/**
 * Download the signed MAC extension once for local browser sessions.
 * @returns {Promise<string>} Cached XPI path.
 */
const macAddon = async (): Promise<string> => {
  const path = resolve('.cache/addons/multi-account-containers.xpi')

  try {
    await access(path)
    return path
  } catch {
    // A fresh checkout has no cached add-on yet.
  }

  const response = await fetch(
    'https://addons.mozilla.org/firefox/downloads/latest/multi-account-containers/latest.xpi',
    { signal: AbortSignal.timeout(60_000) },
  )

  if (!response.ok) {
    throw new Error(`MAC download failed: HTTP ${response.status}`)
  }

  await mkdir(resolve('.cache/addons'), { recursive: true })
  await writeFile(path, Buffer.from(await response.arrayBuffer()))
  return path
}

/**
 * Launch an isolated Firefox profile with MAC and the built extension installed.
 * Selenium Manager supplies geckodriver; Xpra owns the display. geckodriver
 * listens on `GECKODRIVER_PORT` (default 4444) and the
 * session handle is written to `.cache/firefox/session.json` so other scripts
 * can drive the same browser via `attachFirefoxSession`. Quitting removes it.
 * @returns {Promise<import('selenium-webdriver/firefox.js').Driver>} Ready browser.
 */
export const createFirefoxSession = async (): Promise<firefox.Driver> => {
  await access(resolve('dist/manifest.json'))
  const addon = await macAddon()
  const port = Number(process.env.GECKODRIVER_PORT ?? 4444)
  const options = new firefox.Options()
    .setBinary(process.env.FIREFOX_BIN ?? '/usr/bin/firefox')
    .windowSize({ height: 900, width: 1280 })
    .setPreference('privacy.userContext.enabled', true)
    .setPreference('extensions.autoDisableScopes', 0)

  if (process.env.FIREFOX_PROFILE) {
    options.setProfile(resolve(process.env.FIREFOX_PROFILE))
  }

  options.enableBidi()

  if (process.env.HEADLESS === '1') {
    options.addArguments('-headless')
  }

  const service = new firefox.ServiceBuilder()
    .setPort(port)
    .addArguments('--allow-system-access')
    .setEnvironment({
      ...process.env,
      DISPLAY: process.env.DISPLAY ?? ':100',
      MOZ_ENABLE_WAYLAND: '0',
    })

  const driver = firefox.Driver.createSession(options, service.build())

  try {
    // Restore a normal-sized window even when the template was saved maximized.
    await driver.manage().window().setRect({ height: 900, width: 1280 })
    await driver.installAddon(addon, true)
    await driver.installAddon(resolve('dist'), true)
    // onInstalled repairs the startup tab asynchronously. Wait for that page
    // instead of racing it with a second navigation or opening another tab.
    await driver.wait(
      async () => {
        for (const handle of await driver.getAllWindowHandles()) {
          await driver.switchTo().window(handle)

          if (!(await driver.getCurrentUrl()).startsWith('moz-extension://')) {
            continue
          }

          const ready = await driver.executeScript<boolean>(`
          return document.readyState === "complete" &&
            globalThis.browser?.runtime?.id === "containers-new-tab@shotor.dev" &&
            !!document.querySelector('[aria-label="New container"]')
        `)

          if (ready) {
            return true
          }
        }

        return false
      },
      20_000,
      'The extension startup page did not render',
    )

    const info: FirefoxSessionInfo = {
      sessionId: (await driver.getSession()).getId(),
      url: `http://127.0.0.1:${port}`,
      webSocketUrl: (await driver.getCapabilities()).get('webSocketUrl') as
        | string
        | undefined,
    }
    await mkdir(resolve('.cache/firefox'), { recursive: true })
    await writeFile(SESSION_FILE, JSON.stringify(info, null, 2))

    const quit = driver.quit.bind(driver)
    driver.quit = async () => {
      await rm(SESSION_FILE, { force: true })
      await quit()
    }

    return driver
  } catch (error) {
    await driver.quit()
    throw error
  }
}

/**
 * Read the handle of the Firefox session started by `createFirefoxSession`.
 * @returns {Promise<FirefoxSessionInfo>} Endpoint and session id.
 * @throws {Error} When no session file exists (no live session).
 */
export const readFirefoxSession = async (): Promise<FirefoxSessionInfo> => {
  try {
    return JSON.parse(
      await readFile(SESSION_FILE, 'utf8'),
    ) as FirefoxSessionInfo
  } catch {
    throw new Error(
      `No live Firefox session (${SESSION_FILE} missing). Start one with npm run firefox.`,
    )
  }
}

/**
 * Attach a second WebDriver client to the live Firefox session. geckodriver
 * serialises commands, so this can run alongside the owning REPL. The result
 * is a plain WebDriver (no installAddon/setContext); do not call quit() on it
 * unless you mean to close the shared browser.
 * @returns {Promise<WebDriver>} Client bound to the existing session.
 */
export const attachFirefoxSession = async (): Promise<WebDriver> => {
  const { sessionId, url } = await readFirefoxSession()

  return new WebDriver(
    new Session(sessionId, {}),
    new Executor(new HttpClient(url)),
  )
}
