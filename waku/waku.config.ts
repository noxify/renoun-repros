import path from "path"
import mdx from "@mdx-js/rollup"
import { rehypePlugins as renounRehypePlugins } from "@renoun/mdx/rehype"
import { remarkPlugins as renounRemarkPlugins } from "@renoun/mdx/remark"
import tailwindcss from "@tailwindcss/vite"
import rehypeMdxImportMedia from "rehype-mdx-import-media"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import remarkSqueezeParagraphs from "remark-squeeze-paragraphs"
import remarkStripBadges from "remark-strip-badges"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "waku/config"

export default defineConfig({
  vite: {
    optimizeDeps: {
      exclude: ["renoun"],
    },
    build: {
      rollupOptions: {
        output: {
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
        "@": path.resolve(import.meta.dirname, "./src"),
        // needed for lucide-react icons to work properly
        // since they could be imported in the mdx files
        "lucide-react": path.resolve(
          import.meta.dirname,
          "./node_modules/lucide-react",
        ),
      },
    },
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
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
    ],
  },
})
