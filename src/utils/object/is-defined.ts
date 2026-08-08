/**
 * Type guard that narrows away null and undefined.
 * @param value - The value to test.
 * @returns True when the value is defined (neither null nor undefined).
 */
export const isDefined = <T>(value: T | null | undefined): value is T => !!value
