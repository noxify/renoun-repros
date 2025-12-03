import { TailwindIndicator } from "@/components/tailwind-indicator"

import "@/styles.css"

import { ThemeProvider } from "next-themes"
import { RootProvider } from "renoun"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RootProvider
      git={"noxify/renoun-docs-vite"}
      theme={{ light: "github-light", dark: "github-dark" }}
      includeThemeScript={false}
      languages={[
        "ini",
        "tsx",
        "typescript",
        "ts",
        "js",
        "jsx",
        "graphql",
        "python",
        "sql",
        "yaml",
      ]}
    >
      <html lang="en">
        <head></head>
        <body>
          <ThemeProvider attribute={["class", "data-theme"]}>
            {children}
          </ThemeProvider>
          <TailwindIndicator />
        </body>
      </html>
    </RootProvider>
  )
}
