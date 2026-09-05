import { access, readFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { resolve } from 'node:path'
import { z } from 'zod'

const manifestSchema = z.object({
  background: z.object({ scripts: z.array(z.string()) }),
  chrome_url_overrides: z.object({ newtab: z.string() }),
  content_security_policy: z.object({ extension_pages: z.string() }),
})

/**
 * Wait for Vite's extension manifest, background scripts and HMR client.
 * @returns {Promise<void>} Resolves when the development extension is ready.
 * @throws {Error} When Vite does not become ready within 60 seconds.
 */
const waitForVite = async (): Promise<void> => {
  const deadline = Date.now() + 60_000

  while (Date.now() < deadline) {
    try {
      const manifest = manifestSchema.parse(
        JSON.parse(await readFile('dist/manifest.json', 'utf8')),
      )
      const html = await readFile(
        resolve('dist', manifest.chrome_url_overrides.newtab),
        'utf8',
      )

      await Promise.all(
        manifest.background.scripts.map((path) =>
          access(resolve('dist', path)),
        ),
      )

      if (
        html.includes('/@vite/client') &&
        manifest.content_security_policy.extension_pages.includes(
          'http://localhost:5173',
        )
      ) {
        const response = await fetch('http://127.0.0.1:5173/@vite/client', {
          signal: AbortSignal.timeout(1000),
        })

        if (response.ok) {
          return
        }
      }
    } catch {
      // Vite may still be starting or rewriting the extension build.
    }

    await delay(250)
  }

  throw new Error(
    'Vite did not produce a ready HMR extension within 60 seconds.',
  )
}

await waitForVite()
