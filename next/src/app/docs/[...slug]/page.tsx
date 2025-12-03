import { transformedEntries } from "@/collections"
import { DirectoryContent } from "@/components/directory-content"
import { FileContent } from "@/components/file-content"
import { removeFromArray } from "@/lib/utils"

export default async function DocsPage({
  params,
}: PageProps<"/docs/[...slug]">) {
  const { slug } = await params

  const searchParam = `/${slug.join("/")}`

  const transformedEntry = (await transformedEntries(slug[0])).find(
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

export async function generateStaticParams() {
  const entries = await transformedEntries()

  const staticPaths = entries
    // get all possible routes including the collection routes
    .map((entry) => {
      return { slug: removeFromArray(entry.segments, ["docs"]) }
    })
    .filter(({ slug }) => slug.length > 0)

  return staticPaths
}
