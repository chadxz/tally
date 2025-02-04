/**
 * Convert the keys of an object, while preserving the original values.
 *
 * @example
 * ```ts
 * transformKeys({ foo: "bar", baz: "qux" }, (key) => key.toUpperCase())
 * // => { FOO: "bar", BAZ: "qux" }
 * ```
 */
export default function transformKeys<
  T extends Record<string, unknown>,
  U extends string,
>(obj: T, transformFn: (key: keyof T) => U): Record<U, T[keyof T]> {
  return Object.keys(obj).reduce(
    (acc, key) => {
      const newKey = transformFn(key as keyof T);
      acc[newKey] = obj[key] as T[keyof T];
      return acc;
    },
    {} as Record<U, T[keyof T]>,
  );
}
