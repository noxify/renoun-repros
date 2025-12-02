import type { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { GalleryVerticalEnd } from "lucide-react"

import Link from "./link-component"
import { sidebarMenuButtonVariants } from "./ui/sidebar"

export function LogoButton({
  size = "lg",
  className = "",
  ...props
}: React.ComponentProps<"a"> & VariantProps<typeof sidebarMenuButtonVariants>) {
  return (
    <Link
      href="/"
      className={cn(
        sidebarMenuButtonVariants({ size, variant: "none" }),
        className,
      )}
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active="false"
      {...props}
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <GalleryVerticalEnd className="size-4" />
      </div>
      <div className="flex flex-col gap-0.5 leading-none">
        <span className="font-medium">Documentation</span>
      </div>
    </Link>
  )
}
