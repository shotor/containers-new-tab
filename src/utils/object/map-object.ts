/**
 * Build a new object by mapping each own enumerable entry through a callback.
 * Keys are preserved as `keyof T` so the callback can index related records.
 * @param obj - The source record.
 * @param callback - Maps each value (and key) to the result value.
 * @returns A new record with the same keys and mapped values.
 */
export const mapObject = <
  T extends Record<string, unknown>,
  R extends { [K in keyof T]: unknown },
>(
  obj: T,
  callback: (value: T[keyof T], key: keyof T & string) => R[keyof T & string],
): R => {
  const result = {} as R
  for (const key of Object.keys(obj) as (keyof T & string)[]) {
    result[key] = callback(obj[key], key) as R[typeof key]
  }
  return result
}
