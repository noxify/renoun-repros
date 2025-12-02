import type { z } from "zod"
import { cache } from "react"
import { Collection, isDirectory, isFile } from "renoun/file-system"

import type { frontmatterSchema } from "./validations"
import { removeFromArray } from "./lib/utils"
import { generateDirectories } from "./sources"

export const DocumentationGroup = new Collection({
  entries: [...generateDirectories()],
})

export type EntryType = Awaited<ReturnType<typeof DocumentationGroup.getEntry>>
export type DirectoryType = Awaited<
  ReturnType<typeof DocumentationGroup.getDirectory>
>

/**
 * Helper function to get the title for an element in the sidebar/navigation
 * @param entry {EntryType} the entry to get the title for
 * @param frontmatter {z.infer<typeof frontmatterSchema>} the frontmatter to get the title from
 * @param includeTitle? {boolean} whether to include the title in the returned string
 * @returns {string} the title to be displayed in the sidebar/navigation
 */
export function getTitle(
  entry: EntryType,
  frontmatter: z.infer<typeof frontmatterSchema>,
  includeTitle = false,
): string {
  return includeTitle
    ? (frontmatter.navTitle ?? frontmatter.title ?? entry.getTitle())
    : (frontmatter.navTitle ?? entry.getTitle())
}

/**
 * Recursively builds a flat list of all entries in the documentation
 * Similar to buildTreeNavigation but returns a flat array
 */
async function flattenEntries(entry: EntryType): Promise<EntryType[]> {
  if (isHidden(entry)) {
    return []
  }

  const entries: EntryType[] = [entry]

  if (isDirectory(entry)) {
    const children = await entry.getEntries()
    const childEntries = await Promise.all(
      children.map((child) => flattenEntries(child)),
    )
    entries.push(...childEntries.flat())
  }

  return entries
}

/**
 * Caches and returns an array of transformed entries from the DocumentationGroup collection
 * Recursively gets all entries including index and readme files and transforms them
 * Uses the same approach as buildTreeNavigation for consistency
 */
export const transformedEntries = cache(async (group?: string) => {
  let collections = await DocumentationGroup.getEntries({
    recursive: false,
    includeIndexAndReadmeFiles: true,
  })

  if (group) {
    collections = collections.filter(
      (ele) => ele.getPathnameSegments()[0] === group,
    )
  }

  // Flatten all entries from all collections using recursive approach
  const allEntries: EntryType[] = []
  for (const collection of collections) {
    const flattened = await flattenEntries(collection)
    allEntries.push(...flattened)
  }

  // Transform to serializable format
  const entries = await Promise.all(
    allEntries.map((entry) => getTransformedEntry(entry)),
  )

  return entries
})

/**
 * Helper function to get the sections for a given source entry
 * This function will try to get the sections based on the given path
 *
 * If there there are no entries/children for the current path, it will return an empty array
 *
 * @param source {EntryType} the source entry to get the sections for
 * @returns
 */
export async function getSections(source: EntryType) {
  if (source.getDepth() > -1) {
    if (isDirectory(source)) {
      const parent = await (await getDirectory(source)).getEntries()
      return await Promise.all(
        parent.map(async (ele) => await getTransformedEntry(ele)),
      )
    }

    if (isFile(source) && source.getBaseName() === "index") {
      const parent = await (await getDirectory(source.getParent())).getEntries()
      return await Promise.all(
        parent.map(async (ele) => await getTransformedEntry(ele)),
      )
    }
    return []
  } else {
    const parent = await (await getDirectory(source)).getEntries()
    return await Promise.all(
      parent.map(async (ele) => await getTransformedEntry(ele)),
    )
  }
}

/**
 * Helper function to get the breadcrumb items for a given slug
 *
 * @param slug {string[]} the slug to get the breadcrumb items for
 */
export const getBreadcrumbItems = async (slug: string[] = []) => {
  // we do not want to have "index" as breadcrumb element
  const cleanedSlug = removeFromArray(slug, ["index"])

  const combinations = cleanedSlug.map((_, index) =>
    cleanedSlug.slice(0, index + 1),
  )

  const items = []

  for (const currentPageSegement of combinations) {
    const entry = (await transformedEntries(slug[0])).find(
      (ele) => ele.raw_pathname === `/${currentPageSegement.join("/")}`,
    )

    if (!entry) {
      continue
    }

    items.push({
      title: entry.title,
      path: entry.segments,
    })
  }

  return items
}

/**
 * Checks if an entry is hidden (starts with an underscore)
 *
 * @param entry {EntryType} the entry to check for visibility
 */
export function isHidden(entry: EntryType) {
  return entry.getBaseName().startsWith("_")
}

/**
 * Checks if a transformed entry is hidden (starts with an underscore)
 * Uses the last segment to check for underscore prefix
 *
 * @param transformedEntry the transformed entry to check for visibility
 */
export function isHiddenTransformed(
  transformedEntry: Awaited<ReturnType<typeof getTransformedEntry>>,
) {
  const lastSegment =
    transformedEntry.segments[transformedEntry.segments.length - 1]
  return lastSegment.startsWith("_")
}

/**
 * Gets a file from the documentation collection based on the source entry
 * Attempts to find the file in the following order:
 * 1. Direct segment file
 * 2. Index file in the segment directory
 * 3. Readme file in the segment directory
 *
 * Handles special case for examples by excluding "docs" segment from the path
 *
 * @param source {EntryType} The source entry to get the file for
 * @returns The found file or null if no file exists
 */

export const getFileContent = cache(async (source: EntryType) => {
  // Don't early return for directories - they might have index.mdx files
  // if (!isFile(source) && isDirectory(source)) {
  //   return null
  // }

  const segments = source.getPathnameSegments({
    includeBasePathname: true,
    includeDirectoryNamedSegment: true,
  })

  // if (segments[0] === "datareef") {
  //   console.dir({ path: source.getPathname(), segments }, { depth: null })
  // }

  const [segmentFile, indexFile, readmeFile] = await Promise.all([
    DocumentationGroup.getFile(segments, "mdx").catch(() => null),
    DocumentationGroup.getFile([...segments, "index"], "mdx").catch(() => null),
    DocumentationGroup.getFile([...segments, "readme"], "mdx").catch(
      () => null,
    ),
  ])

  return segmentFile ?? indexFile ?? readmeFile ?? null
})

/**
 * Gets a directory from the documentation collection based on the source entry
 * Handles special case for examples by excluding "docs" segment from the path
 *
 * @param source {EntryType} The source entry to get the directory for
 * @returns The directory corresponding to the source entry
 */
export async function getDirectory(source: EntryType) {
  const segments = source.getPathnameSegments({
    includeBasePathname: true,
    includeDirectoryNamedSegment: true,
  })

  const excludeSegments = segments[1] === "examples" ? ["docs"] : []

  const currentDirectory = await DocumentationGroup.getDirectory(
    removeFromArray(segments, excludeSegments),
  )

  return currentDirectory
}

/**
 * Retrieves the frontmatter metadata from a documentation file
 * @param source {Awaited<ReturnType<typeof getFile>>} The file to get metadata from
 * @returns The frontmatter metadata if it exists
 */
export const getMetadata = cache(
  async (source: Awaited<ReturnType<typeof getFileContent>>) => {
    return await source?.getExportValue("frontmatter")
  },
)

/**
 * Gets the previous and next entries relative to the current entry in the documentation
 * Returns a tuple containing [previousEntry, nextEntry] where either can be undefined
 * if at the start/end of the documentation
 * Navigates through the entire documentation tree (including child pages)
 * Filters out hidden and external entries
 *
 * @param source {Awaited<ReturnType<typeof getTransformedEntry>>} The current entry to get siblings for
 * @returns Tuple of previous and next entries
 */
export async function getSiblings(
  source: Awaited<ReturnType<typeof getTransformedEntry>>,
): Promise<
  [
    Awaited<ReturnType<typeof getTransformedEntry>> | undefined,
    Awaited<ReturnType<typeof getTransformedEntry>> | undefined,
  ]
> {
  // Get all entries for this group
  const allEntries = await transformedEntries(source.segments[0])

  // Filter out hidden and external entries
  const visibleEntries = []
  for (const entry of allEntries) {
    if (isHiddenTransformed(entry) || (await isExternalTransformed(entry))) {
      continue
    }
    visibleEntries.push(entry)
  }

  // Deduplicate entries with the same pathname (prefer files over directories)
  // Maintain the original order from the file system
  const seenPaths = new Set<string>()
  const uniqueEntries = []

  for (const entry of visibleEntries) {
    if (seenPaths.has(entry.raw_pathname)) {
      continue
    }
    seenPaths.add(entry.raw_pathname)
    uniqueEntries.push(entry)
  }

  // Find current entry in list (already in file system order)
  const currentIndex = uniqueEntries.findIndex(
    (e) => e.raw_pathname === source.raw_pathname,
  )

  if (currentIndex === -1) {
    return [undefined, undefined]
  }

  const previousElement =
    currentIndex > 0 ? uniqueEntries[currentIndex - 1] : undefined
  const nextElement =
    currentIndex < uniqueEntries.length - 1
      ? uniqueEntries[currentIndex + 1]
      : undefined

  return [previousElement, nextElement]
}

/**
 * Transforms a FileSystemEntry into a standardized object containing key information
 * Only stores serializable data - use getEntryForTransformed to get the entry object
 *
 * @param source {EntryType} The file system entry to transform
 */
export const getTransformedEntry = cache(async (source: EntryType) => {
  const file = await getFileContent(source)
  const metadata = file ? await getMetadata(file) : null

  return {
    raw_pathname: source.getPathname({ includeBasePathname: true }),
    pathname: source.getPathname({ includeBasePathname: false }),
    segments: source.getPathnameSegments({ includeBasePathname: true }),
    title: metadata ? getTitle(source, metadata, true) : source.getTitle(),
    path: source.getAbsolutePath(),
    isDirectory: isDirectory(source),
    sortOrder: file?.getOrder() ?? 0,
    depth: source.getDepth(),
    baseName: source.getBaseName(),
    siblings: (await source.getSiblings()).map(
      (ele) => ele?.getPathname() ?? null,
    ),
    hasFile: file !== null,
  }
})

/**
 * Gets the entry object for a transformed entry based on its segments
 * Use this when you need to access entry methods
 *
 * @param transformedEntry The transformed entry to get the entry object for
 * @returns The entry object
 */
export const getEntryForTransformed = cache(
  async (transformedEntry: Awaited<ReturnType<typeof getTransformedEntry>>) => {
    return await DocumentationGroup.getEntry(transformedEntry.segments)
  },
)

/**
 * Gets the file object for a transformed entry
 * Use this when you need to access file methods like getExportValue
 *
 * @param transformedEntry The transformed entry to get the file for
 * @returns The file object or null
 */
export const getFileForEntry = cache(
  async (transformedEntry: Awaited<ReturnType<typeof getTransformedEntry>>) => {
    const entry = await getEntryForTransformed(transformedEntry)
    return await getFileContent(entry)
  },
)

export async function isExternal(entry: EntryType) {
  let frontmatter: z.infer<typeof frontmatterSchema> | undefined
  let file: Awaited<ReturnType<typeof getFileContent>>

  try {
    if (entry.getPathnameSegments().includes("index")) {
      file = await getFileContent(entry.getParent())
    } else {
      file = await getFileContent(entry)
    }

    frontmatter = await file?.getExportValue("frontmatter")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    return false
  }

  if (!frontmatter?.externalLink) {
    return false
  }
  return true
}

export async function isExternalTransformed(
  transformedEntry: Awaited<ReturnType<typeof getTransformedEntry>>,
) {
  try {
    const entry = await getEntryForTransformed(transformedEntry)
    return await isExternal(entry)
  } catch {
    return false
  }
}
