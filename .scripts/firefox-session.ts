import { access, mkdir, writeFile } from 'node:fs/promises'
import firefox from 'selenium-webdriver/firefox.js'
import { resolve } from 'node:path'

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
 * Selenium Manager supplies geckodriver; Xpra owns the display.
 * @returns {Promise<import('selenium-webdriver/firefox.js').Driver>} Ready browser.
 */
export const createFirefoxSession = async (): Promise<firefox.Driver> => {
  await access(resolve('dist/manifest.json'))
  const addon = await macAddon()
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
    return driver
  } catch (error) {
    await driver.quit()
    throw error
  }
}
