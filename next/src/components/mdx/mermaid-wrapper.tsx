"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import RenderMermaid from "react-x-mermaid"

function MermaidWrapper({
  wrapped = false,
  chart,
}: {
  wrapped?: boolean
  chart: string
}) {
  const { resolvedTheme } = useTheme()
  return (
    <div className={cn({ "rounded-md border p-8": wrapped })}>
      <RenderMermaid
        mermaidCode={chart}
        mermaidConfig={{
          theme: resolvedTheme == "dark" ? "dark" : "default",
        }}
      />
    </div>
  )
}

export default MermaidWrapper
