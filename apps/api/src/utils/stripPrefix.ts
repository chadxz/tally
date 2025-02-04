/**
 * Removes a prefix from a string.
 *
 * @example
 * ```ts
 * stripPrefix("APP_", "APP_FOO")
 * // => "FOO"
 * ```
 */
export default function stripPrefix(prefix: string, str: string): string {
  return str.startsWith(prefix) ? str.slice(prefix.length) : str;
}
