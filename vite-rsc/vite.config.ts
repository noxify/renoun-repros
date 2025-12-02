import path from "node:path"
import { defineConfig } from "vite"
import mdx from "@mdx-js/rollup"
import { rehypePlugins as renounRehypePlugins } from "@renoun/mdx/rehype"
import { remarkPlugins as renounRemarkPlugins } from "@renoun/mdx/remark"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import rsc from "@vitejs/plugin-rsc"
import rehypeMdxImportMedia from "rehype-mdx-import-media"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import remarkSqueezeParagraphs from "remark-squeeze-paragraphs"
import remarkStripBadges from "remark-strip-badges"
import tsconfigPaths from "vite-tsconfig-paths"

import rscSsgPlugin from "./src/framework/plugin"
import RouteTypesPlugin from "./src/framework/route-types"

export default defineConfig(({ command }) => ({
  logLevel: command == "build" ? "warn" : "info",
  optimizeDeps: {
    exclude: ["renoun"],
  },
  build: {
    rollupOptions: {
      output: {
        minify: true,

        manualChunks: (moduleId) => {
          if (moduleId.includes("node_modules")) {
            return "vendor"
          }
          return null
        },
      },
      onwarn: (warning) => {
        // the railroad diagram wrapper uses `eval` to generate the diagrams
        // we know this is evil, but it's necessary in this case
        if (warning.code === "EVAL") return
      },
    },
  },
  resolve: {
    alias: {
      "mdx-components": path.resolve(
        import.meta.dirname,
        "./src/mdx-components.tsx",
      ),
    },
  },

  plugins: [
    // auto generate route types for pages
    RouteTypesPlugin(),
    // support tsconfig paths automagically
    tsconfigPaths(),
    // TailwindCSS support
    tailwindcss(),
    // MDX support with Renoun plugins
    mdx({
      providerImportSource: "mdx-components",
      rehypePlugins: [...renounRehypePlugins, rehypeMdxImportMedia],
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        ...renounRemarkPlugins,
        remarkGfm,
        remarkStripBadges,
        remarkSqueezeParagraphs,
        remarkGfm,
      ],
    }),
    // React support
    react(),
    // React Server Components support
    rsc(),
    // extract RSC usage + file based routing + ssg support
    rscSsgPlugin(),
  ],
}))
