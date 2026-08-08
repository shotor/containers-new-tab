/**
 * Background event page — register listeners at top level for MV3 wakeups.
 * Jobs: per-container proxy.
 * Site “always open in” is owned by Multi-Account Containers.
 */

import type { ContainerProxy } from '@/data/types'
import { ensureNewTabPage } from '@/utils/browser/ensure-new-tab-page'
import { looksLikeBrokenStartupTab } from '@/utils/browser/looks-like-broken-startup-tab'
import { proxyApi } from '@/data/proxy/proxy-cache-api'
import { proxyCache } from '@/data/proxy/proxy-cache'
import { shouldSkipLocal } from '@/data/proxy/utils/should-skip-local'
import { toProxyInfo } from '@/data/proxy/utils/to-proxy-info'

void proxyApi.refreshProxyCache()

browser.runtime.onInstalled.addListener(() => {
  void ensureNewTabPage(looksLikeBrokenStartupTab)
})

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes.containerProxies) {
    return
  }

  // StorageChange.newValue is untyped by the browser; trust boundary cast.
  proxyCache.current =
    (changes.containerProxies.newValue as Record<string, ContainerProxy>) ?? {}
})

browser.proxy.onRequest.addListener(
  (details) => {
    const proxy = proxyApi.getCachedProxy(details.cookieStoreId)

    if (!proxy) {
      return []
    }

    if (shouldSkipLocal(proxy, details.url)) {
      return []
    }

    const info = toProxyInfo(proxy)

    if (info.type === 'direct') {
      return []
    }

    return [info]
  },
  { urls: ['<all_urls>'] },
)

browser.webRequest.onAuthRequired.addListener(
  (details) => {
    if (!details.isProxy) {
      return {}
    }

    const proxy = proxyApi.getCachedProxy(details.cookieStoreId)

    if (!proxy?.username) {
      return {}
    }

    return {
      authCredentials: {
        password: proxy.password ?? '',
        username: proxy.username,
      },
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking'],
)
