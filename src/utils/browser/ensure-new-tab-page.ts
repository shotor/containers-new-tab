/**
 * New-tab / homepage URL for this extension build.
 * @returns The extension-page URL.
 */
export const newTabUrl = (): string => browser.runtime.getURL('src/index.html')

/** Firefox startup pages we replace when our new-tab override is active. */
const FIREFOX_STARTUP_URLS = new Set([
  'about:home',
  'about:privatebrowsing',
  'about:welcome',
])

/**
 * After install/reload, land on our new-tab page instead of a dead tab.
 * @param looksBroken - Predicate for tabs that should be repaired.
 */
export const ensureNewTabPage = async (
  looksBroken: (url: string | undefined, extensionId: string) => boolean,
): Promise<void> => {
  const target = newTabUrl()
  const tabs = await browser.tabs.query({})
  let focusId: number | undefined

  for (const tab of tabs) {
    if (tab.id == null) {
      continue
    }

    if (looksBroken(tab.url, browser.runtime.id)) {
      await browser.tabs.update(tab.id, { active: true, url: target })
      focusId = tab.id
      continue
    }

    if (tab.url && FIREFOX_STARTUP_URLS.has(tab.url)) {
      await browser.tabs.remove(tab.id)
    }
  }

  const remaining = await browser.tabs.query({})
  const ours = remaining.find((t) =>
    t.url?.startsWith(`moz-extension://${browser.runtime.id}`),
  )

  if (ours?.id != null) {
    await browser.tabs.update(ours.id, { active: true })
    return
  }

  if (focusId != null) {
    return
  }

  await browser.tabs.create({ active: true, url: target })
}
