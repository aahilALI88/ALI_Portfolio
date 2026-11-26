// Prefixes files in /public with the deploy base path (e.g. /ALI_Portfolio on GitHub Pages).
// next/link handles routes automatically; plain <img>, next/image `src` strings and
// downloads need this helper.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
