import fs from "fs"
import path from "path"
import type { Plugin } from "vite"
import { glob } from "tinyglobby"

import { filePathToRoutePattern } from "./utils"

function extractParams(pattern: string): string[] {
  const matches = Array.from(pattern.matchAll(/\[([^\]]+)\]/g))
  return matches.map((m) => m[1])
}

let hasRun = false
export default function RouteTypesPlugin(): Plugin {
  return {
    name: "vite-plugin-route-types",
    async buildStart() {
      if (hasRun) return
      hasRun = true
      const pageFiles = await glob("src/pages/**/page.tsx")
      const layoutFiles = await glob("src/pages/**/layout.tsx")
      const pageRoutes = pageFiles.map((path) => filePathToRoutePattern(path))
      const layoutRoutes = layoutFiles.map((path) =>
        filePathToRoutePattern(path),
      )
      const pageBranches = pageRoutes
        .map((route) => {
          const params = extractParams(route.route)
          if (params.length === 0) return null // skip static routes
          const paramObj = params
            .map((param) =>
              param.startsWith("...")
                ? `${param.slice(3)}: string[]`
                : `${param}: string`,
            )
            .join("; ")
          return `  T extends '${route.route}'\n    ? { params: { ${paramObj} }; searchParams?: URLSearchParams }`
        })
        .filter(Boolean)
        .join("\n:")

      const layoutBranches = layoutRoutes
        .map((route) => {
          const params = extractParams(route.route)
          if (params.length === 0) return null // skip static routes
          const paramObj = params
            .map((param) =>
              param.startsWith("...")
                ? `${param.slice(3)}: string[]`
                : `${param}: string`,
            )
            .join("; ")
          return `  T extends '${route.route}'\n    ? { params: { ${paramObj} }; searchParams?: URLSearchParams }`
        })
        .filter(Boolean)
        .join("\n:")
      const typeDef = `// prettier-ignore
// eslint-disable
// AUTO-GENERATED FILE
      
export type PageProps<T extends string> =
${pageBranches}
: never;

export type LayoutProps<T extends string> =
${layoutBranches}
: never;

`
      fs.writeFileSync(path.join(process.cwd(), "types/routes.d.ts"), typeDef)
      // console.log("Route types generated in src/routes.types.ts")
    },
  }
}
