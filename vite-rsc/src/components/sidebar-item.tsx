"use client"

import type { TreeItem } from "@/lib/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useRouter } from "@/hooks/use-router"
import { current } from "@/lib/helpers"
import { ChevronRight } from "lucide-react"

import Link from "./link-component"
import { RenderIcon } from "./render-icon"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "./ui/sidebar"

export function SidebarItem({ item }: { item: TreeItem }) {
  const { pathname } = useRouter()
  const isActive = current({ pathname, item })

  if (!item.children || item.children.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isActive}
          className="data-[active=true]:bg-transparent"
          asChild
        >
          <Link clean href={item.externalLink ?? item.path}>
            <RenderIcon icon={item.icon} className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible defaultOpen={isActive} className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={isActive}
            className="[&[data-state=open]>svg:last-child]:rotate-90"
          >
            <RenderIcon icon={item.icon} className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 ml-2 pr-0 pl-2">
            {item.children.map((subItem, index) => (
              <SidebarItem key={index} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
