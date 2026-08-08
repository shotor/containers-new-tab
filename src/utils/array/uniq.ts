/**
 * Return the unique values from an array, preserving first-seen order.
 * @param values - The values to dedupe.
 * @returns A new array with duplicates removed.
 */
export const uniq = <T>(values: readonly T[]): T[] => [...new Set(values)]
