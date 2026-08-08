import { uniq } from '@/utils/array/uniq'

/**
 * Apex and www hostname pair — MAC stores assignments per exact hostname.
 * @param host - A hostname that may already include www.
 * @returns Deduped `[apex, www.apex]`.
 */
export const wwwHostVariants = (host: string): string[] => {
  const apex = host.replace(/^www\./i, '').toLowerCase()

  if (!apex) {
    return []
  }

  return uniq([apex, `www.${apex}`])
}
