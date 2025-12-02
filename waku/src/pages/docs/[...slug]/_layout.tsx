import { cache } from "react"
import { DocumentationGroup } from "@/collections"
import { DocsHeader } from "@/components/docs-header"
import { DocsSidebar } from "@/components/docs-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getTree } from "@/lib/navigation"
import { unstable_getContext } from "waku/server"

const CollectionInfo = cache(() => DocumentationGroup)

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const slug = new URL(unstable_getContext().req.url).pathname
    .replace("/RSC/R/", "")
    .replace(".txt", "")
    .split("/")
    .filter((ele) => (ele === "" || ele === "docs" ? false : true))

  // const rootCollections = await CollectionInfo().getEntries({
  //   recursive: false,
  //   includeIndexAndReadmeFiles: true,
  // })

  const recursiveCollections = await CollectionInfo().getEntries({
    recursive: true,
  })

  const tree = recursiveCollections
    // to get only the relevant menu entries, we have to filter the list of collections
    // based on the provided slug ( via `params.slug` ) and the path segments for the current source in the iteration
    .filter((collection) => {
      return collection.getPathnameSegments()[0] === slug[0]
    })
    // since we generated the nested tree later in the code ( via `getTree` )
    // we can filter the list of collections based on the depth which should be shown as "root"
    // in our case, we filter the list of collections based on depth 2
    .filter((ele) => ele.getDepth() === 0)

  const sidebarItems = await getTree(tree)

  return (
    <>
      <SidebarProvider>
        <DocsSidebar variant={"sidebar"} items={sidebarItems} />
        <SidebarInset>
          <DocsHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

export const getConfig = () => {
  return {
    render: "static",
  } as const
}
