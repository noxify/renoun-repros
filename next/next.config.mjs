import createMDXPlugin from "@next/mdx"

const withMDX = createMDXPlugin({
  options: {
    remarkPlugins: [
      "@renoun/mdx/remark/add-headings",
      "remark-frontmatter",
      "remark-mdx-frontmatter",
      "remark-strip-badges",
      "@renoun/mdx/remark/transform-relative-links",
      "remark-gfm",
      "@renoun/mdx/remark/remove-immediate-paragraphs",
      "remark-squeeze-paragraphs",
    ],
    rehypePlugins: [
      "@renoun/mdx/rehype/add-code-block",
      "@renoun/mdx/rehype/add-reading-time",
      "rehype-mdx-import-media",
      "rehype-unwrap-images",
    ],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds
  // ...(process.env.NODE_ENV === "production" && { output: "export" }),
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false,
  experimental: {
    // using only one cpu in CI - this is the same as running it without this option
    // in a vercel deloyment
    cpus: process.env.CI ? 1 : undefined,
  },

  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
}

export default withMDX(nextConfig)
