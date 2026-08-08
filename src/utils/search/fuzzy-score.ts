/**
 * Subsequence fuzzy match.
 * @param haystack - The string to search in.
 * @param needle - The query to match.
 * @returns A score (higher = better), or null when the needle is not a subsequence.
 */
export const fuzzyScore = (haystack: string, needle: string): number | null => {
  const h = haystack.toLowerCase()
  const n = needle.toLowerCase().trim()

  if (!n) {
    return 0
  }

  let hi = 0
  let score = 0
  let prev = -2

  for (let ni = 0; ni < n.length; ni++) {
    const ch = n[ni]
    const found = h.indexOf(ch, hi)

    if (found === -1) {
      return null
    }

    if (found === prev + 1) {
      score += 5
    } else {
      score += 1
    }

    if (found === 0 || /[.\-_/]/.test(h[found - 1])) {
      score += 3
    }

    prev = found
    hi = found + 1
  }

  return score - h.length * 0.01
}
