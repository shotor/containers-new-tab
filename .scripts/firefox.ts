import assert from 'node:assert/strict'
import { once } from 'node:events'
import { mkdir, writeFile } from 'node:fs/promises'
import repl from 'node:repl'
import { By, until } from 'selenium-webdriver'

import { createFirefoxSession, readFirefoxSession } from './firefox-session.ts'

const driver = await createFirefoxSession()

try {
  if (process.argv.includes('--interactive')) {
    const { sessionId, url } = await readFirefoxSession()
    console.log(
      'Firefox is ready on Xpra. Use driver, By and until; .exit closes it.',
    )
    console.log(
      `WebDriver ${url} session ${sessionId} (attachFirefoxSession() reuses it).`,
    )

    const prompt = repl.start({ prompt: 'firefox> ' })

    Object.assign(prompt.context, { By, driver, until })

    await once(prompt, 'exit')
  } else {
    const name = await driver.executeScript(
      'return browser.runtime.getManifest().name',
    )

    assert.equal(name, 'Containers New Tab')

    const tile = await driver.findElement(
      By.css('[aria-label="New container"]'),
    )

    await tile.click()

    await driver.wait(until.urlContains('#/new'), 10_000)
    await driver.wait(until.elementLocated(By.css('input')), 10_000)

    await mkdir('.cache/firefox', { recursive: true })

    await writeFile(
      '.cache/firefox/smoke.png',
      await driver.takeScreenshot(),
      'base64',
    )

    console.log(
      'Firefox smoke test passed: extension API, new-tab UI, editor navigation.',
    )
    console.log('Screenshot: .cache/firefox/smoke.png')
  }
} finally {
  await driver.quit()
}
