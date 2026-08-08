/**
 * Whether a startup tab URL is dead and should be replaced with our page.
 * @param url - The tab URL to inspect.
 * @param extensionId - This extension's runtime id (for moz-extension checks).
 * @returns True when the tab shows nothing useful.
 */
export const looksLikeBrokenStartupTab = (
  url: string | undefined,
  extensionId: string,
): boolean => {
  if (!url) {
    return true
  }

  if (url === 'about:blank') {
    return true
  }

  if (url.startsWith('about:neterror') || url.startsWith('about:certerror')) {
    return true
  }

  // Stale temporary-addon pages from a previous reload (different UUID).
  if (url.startsWith('moz-extension://')) {
    return !url.startsWith(`moz-extension://${extensionId}`)
  }

  // web-ext / misparsed hosts sometimes surface as dotted numeric URLs.
  try {
    const host = new URL(url).hostname

    if (/^0\.\d+\.\d+\.\d+$/.test(host) || host === '0.0.0.0') {
      return true
    }
  } catch {
    /* ignore */
  }

  return false
}
