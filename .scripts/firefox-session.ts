import { access, mkdir, writeFile } from 'node:fs/promises'
import { By, until } from 'selenium-webdriver'
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
    // Keep an already-rendered extension tab; otherwise load the override in place.
    const tiles = await driver.findElements(
      By.css('[aria-label="New container"]'),
    )

    if (tiles.length === 0) {
      // MAC may have selected a welcome tab during installation.
      await driver.switchTo().window(await driver.getWindowHandle())
      await driver.setContext(firefox.Context.CHROME)
      await driver.executeScript(`
        window.gBrowser.selectedBrowser.loadURI(Services.io.newURI(window.BROWSER_NEW_TAB_URL), {
          triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()
        })
      `)
      await driver.setContext(firefox.Context.CONTENT)
    }
    await driver.wait(
      until.elementLocated(By.css('[aria-label="New container"]')),
      20_000,
      'The extension new-tab page did not render',
    )
    return driver
  } catch (error) {
    await driver.quit()
    throw error
  }
}
