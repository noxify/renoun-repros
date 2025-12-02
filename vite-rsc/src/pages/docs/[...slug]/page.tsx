import type { PageProps } from "@/routes"
import { transformedEntries } from "@/collections"
import { DirectoryContent } from "@/components/directory-content"
import { FileContent } from "@/components/file-content"
import { removeFromArray } from "@/lib/utils"

export async function generateStaticParams() {
  const slugs = []

  const entries = await transformedEntries()

  for (const entry of entries) {
    slugs.push({
      slug: removeFromArray(entry.segments, ["docs"]),
    })
  }

  const staticPaths = entries
    // get all possible routes including the collection routes
    .map((entry) => {
      return { slug: removeFromArray(entry.segments, ["docs"]) }
    })
    // since we have a dedicated page for /docs/[collection], we can skip the empty slug entries here
    .filter(({ slug }) => slug.length > 0)

  return staticPaths
}

export default async function DocsPage({
  params,
}: PageProps<"/docs/[...slug]">) {
  const searchParam = `/${params.slug.join("/")}`

  const transformedEntry = (await transformedEntries(params.slug[0])).find(
    (ele) => ele.raw_pathname == searchParam,
  )

  if (!transformedEntry) {
    return <>Page not found</>
  }

  // if we can't find an index file, but we have a valid directory
  // use the directory component for rendering
  if (!transformedEntry.hasFile && transformedEntry.isDirectory) {
    return (
      <>
        <DirectoryContent transformedEntry={transformedEntry} />
      </>
    )
  }

  // if we have a valid file ( including the index file )
  // use the file component for rendering
  if (transformedEntry.hasFile) {
    return (
      <>
        <FileContent transformedEntry={transformedEntry} />
      </>
    )
  }

  return <>Page not found</>
}
