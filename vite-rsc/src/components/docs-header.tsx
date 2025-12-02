"use client"

import { cn } from "@/lib/utils"

import { Separator } from "./ui/separator"
import { SidebarTrigger, useSidebar } from "./ui/sidebar"

export function DocsHeader() {
  const { open: sidebarOpen } = useSidebar()

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-20 hidden h-[calc(theme(height.12)+1px)] w-full items-center border-b bg-background px-2 md:left-auto xl:flex",
        {
          "md:w-[calc(theme(width.full)-theme(width.64))]": sidebarOpen,
          "w-full": !sidebarOpen,
        },
      )}
    >
      <div className="flex items-center gap-2 px-2">
        <SidebarTrigger className="-ml-1 h-7 w-7" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />
      </div>
    </div>
  )
}
