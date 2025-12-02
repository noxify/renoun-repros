// import {glob} from "tinyglobby";
// import path from "node:path";
import { PAGES_DIR } from "./shared"

/**
 * Converts a Next.js-style file path to a route pattern.
 * Supports dynamic (`[slug]`) and catch-all (`[...slug]`) segments and grouping (`(group)`).
 *
 * @param filePath e.g. "src/pages/(home)/page.tsx", "src/pages/blog/[slug]/page.tsx"
 * @param basePath The base folder/directory (default: 'src/pages')
 * @returns e.g. "/", "/blog/[slug]"
 */
export function filePathToRoutePattern(
  filePath: string,
  basePath = PAGES_DIR,
): { route: string; layoutPath: string } {
  // Remove basePath from the start
  const basePattern = new RegExp(
    `^${basePath.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}/`,
  )

  let layoutPath = filePath.replace(basePattern, "")
  layoutPath = layoutPath.replace(/^\.?\//, "")

  // Für route: Gruppenordner entfernen
  let routePath = layoutPath
  routePath = routePath.replace(/\([^)]+\)\//g, "")
  routePath = routePath.replace(/^\([^)]+\)$/, "")

  // Remove '/page.{js,ts,jsx,tsx}' am Ende
  layoutPath = layoutPath.replace(/^((page|layout)\.(js|ts|jsx|tsx))$/, "")
  layoutPath = layoutPath.replace(/\/(page|layout)\.(js|ts|jsx|tsx)$/, "")
  routePath = routePath.replace(/^((page|layout)\.(js|ts|jsx|tsx))$/, "")
  routePath = routePath.replace(/\/(page|layout)\.(js|ts|jsx|tsx)$/, "")

  // Empty path becomes "/"
  const route = routePath === "" ? "/" : `/${routePath}`
  const layoutPathNormalized = layoutPath === "" ? "/" : `/${layoutPath}/`
  return { route, layoutPath: layoutPathNormalized }
}

/**
 * Fills a dynamic route template with the provided parameters.
 *
 * Replaces dynamic segments in a route string with actual values from the params object.
 * Supports both regular dynamic segments `[param]` and catch-all segments `[...param]`.
 *
 * @param route - The route template string containing dynamic segments in brackets (e.g., "/users/[id]" or "/posts/[...slug]")
 * @param params - Record containing the parameter values to fill into the route
 * @returns The route string with dynamic segments replaced by actual parameter values
 *
 * @example
 * ```typescript
 * // Regular dynamic segment
 * fillDynamicRoute("/users/[id]", { id: "123" })
 * // Returns: "/users/123"
 *
 * // Catch-all segment
 * fillDynamicRoute("/docs/[...path]", { path: ["api", "users", "create"] })
 * // Returns: "/docs/api/users/create"
 * ```
 */
export function fillDynamicRoute<T extends Record<string, string | string[]>>(
  route: string,
  params: T,
): string {
  return route.replace(
    /\[(\.\.\.[^\]]+|[^\]]+)\]/g,
    (_match, paramName: string) => {
      if (paramName.startsWith("...")) {
        const key = paramName.slice(3)
        const value = params[key]
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return Array.isArray(value) ? value.join("/") : String(value ?? "")
      }
      return String(params[paramName] ?? "")
    },
  )
}

type TreeView = Record<string, string[]>

export function printTreeView(tree: TreeView, maxChildren = 5): void {
  const keys = Object.keys(tree)
  keys.forEach((key, idx) => {
    const isLast = idx === keys.length - 1
    const prefix = idx === 0 ? " ┌" : isLast ? " └" : " ├"
    console.log(`${prefix} ${key}`)
    const children = tree[key]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (children && children.length > 0) {
      const showCount = Math.min(children.length, maxChildren)
      const childIndent = isLast ? "    " : " │   "
      for (let cidx = 0; cidx < showCount; cidx++) {
        const childPrefix = "├"
        console.log(`${childIndent}${childPrefix} ${children[cidx]}`)
      }
      if (children.length > maxChildren) {
        // [+N more paths] immer als letzter Eintrag mit '└'
        console.log(
          `${childIndent}└ [+${children.length - maxChildren} more paths]`,
        )
      } else if (children.length > 0) {
        // Letztes Child bekommt '└', wenn kein [+N more paths]
        const lastIdx = showCount - 1
        if (lastIdx >= 0) {
          // Optional: Zeile davor ignorieren, hier nur die finale Ausgabe
          // (Konsolen-Ästhetik, keine Zeile löschen)
        }
      }
    }
  })
}
