import type { TreeItem } from "@/lib/navigation"
import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEnd } from "lucide-react"
import { Link as GitHostLink, Logo as GitHostLogo } from "renoun"

import Link from "./link-component"
import { RenderIcon } from "./render-icon"
import { SearchForm } from "./search-sidebar"
import { SidebarItem } from "./sidebar-item"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"

function DocsSidebar({
  items,
  ...props
}: React.ComponentProps<typeof Sidebar> & { items: TreeItem[] }) {
  const standaloneItems = items.filter(
    (item) => !item.children || item.children.length === 0,
  )
  const groupItems = items.filter(
    (item) => item.children && item.children.length > 0,
  )

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="relative flex items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Documentation</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {standaloneItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {standaloneItems.map((item, index) => (
                  <SidebarItem key={index} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {groupItems.map((item) => {
          return (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>
                <RenderIcon icon={item.icon} className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.children?.map((subItem, index) => (
                    <SidebarItem key={index} item={subItem} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex justify-between">
          <Button variant={"outline"} size="icon" asChild>
            <GitHostLink variant="repository">
              <GitHostLogo variant="gitHost" />
            </GitHostLink>
          </Button>
          <ThemeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export { DocsSidebar }
