import * as React from "react"
import { ThemeProvider } from "next-themes"
import { RootProvider } from "renoun/components"

import "@/styles.css"

import { TailwindIndicator } from "@/components/tailwind-indicator"
import { RouterProvider } from "@/hooks/use-router"

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
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Renoun Docs Template - Home</title>
        </head>

        <body>
          <ThemeProvider attribute={["class", "data-theme"]}>
            <RouterProvider>{children}</RouterProvider>
          </ThemeProvider>
          <TailwindIndicator />
        </body>
      </html>
    </RootProvider>
  )
}
