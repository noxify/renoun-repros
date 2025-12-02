import fs from "node:fs"
import path from "node:path"
import { Readable } from "node:stream"
import type { Plugin, ResolvedConfig } from "vite"
import ora from "ora"
import pMap from "p-map"

import { RSC_POSTFIX } from "./shared"
import { printTreeView } from "./utils"

export default function (): Plugin[] {
  const reactRscConfig: Plugin = {
    name: "vite-plugin-react-rsc-ssg-pages:rscConfig",
    config() {
      return {
        environments: {
          rsc: {
            build: {
              rollupOptions: {
                input: {
                  index: path.resolve(import.meta.dirname, "./entry.rsc.tsx"),
                },
              },
            },
          },
          ssr: {
            build: {
              rollupOptions: {
                input: {
                  index: path.resolve(import.meta.dirname, "./entry.ssr.tsx"),
                },
              },
            },
          },
          client: {
            build: {
              rollupOptions: {
                input: {
                  index: path.resolve(
                    import.meta.dirname,
                    "./entry.browser.tsx",
                  ),
                },
              },
            },
          },
        },
      }
    },
  }

  const rscSsgPagesPlugin: Plugin = {
    name: "vite-plugin-rsc-ssg-pages:ssgPlugin",
    config: {
      order: "pre",
      handler(_config, env) {
        return {
          appType: env.isPreview ? "mpa" : undefined,
          rsc: {
            serverHandler: env.isPreview ? false : undefined,
          },
        }
      },
    },
    buildApp: {
      async handler(builder) {
        console.log("Starting RSC SSG Pages build...")
        await renderStatic(builder.config)
        process.exit(0)
      },
    },
  }

  return [reactRscConfig, rscSsgPagesPlugin]
}

async function renderStatic(config: ResolvedConfig) {
  // import server entry
  const entryPath = path.join(config.environments.rsc.build.outDir, "index.js")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/consistent-type-imports
  const entry: typeof import("./entry.rsc") = await import(entryPath)

  const generateStaticPathsSpinner = ora("Calculating pages to render").start()

  // get static paths from all pages based on their `generateStaticParamss` export
  const staticPaths = await entry.getStaticRoutes()
  generateStaticPathsSpinner.succeed(
    `Fetched ${staticPaths.generated.length} pages`,
  )

  const renderStaticPathsSpinner = ora("Rendering pages")
  const renderProgres = (current: number, max: number) =>
    (renderStaticPathsSpinner.text = `Rendering ${current}/${max} pages`)

  renderStaticPathsSpinner.start()
  let renderCount = 0
  // render rsc and html
  const baseDir = config.environments.client.build.outDir

  await pMap(
    staticPaths.generated,
    async (staticPatch) => {
      const { html, rsc } = await entry.handleSsg(
        new Request(new URL(staticPatch, "http://ssg.local")),
      )

      // Write both files in parallel
      await Promise.all([
        writeFileStream(
          path.join(baseDir, normalizeHtmlFilePath(staticPatch)),
          html,
        ),
        writeFileStream(path.join(baseDir, staticPatch + RSC_POSTFIX), rsc),
      ])

      // Update progress AFTER rendering is complete
      renderProgres(++renderCount, staticPaths.generated.length)
    },
    { concurrency: 30 },
  )

  renderStaticPathsSpinner.succeed("Rendering complete")

  printTreeView(staticPaths.tree)
}

async function writeFileStream(filePath: string, stream: ReadableStream) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  await fs.promises.writeFile(filePath, Readable.fromWeb(stream as any))
}

function normalizeHtmlFilePath(p: string) {
  if (p.endsWith("/")) {
    return p + "index.html"
  }
  return p + ".html"
}
