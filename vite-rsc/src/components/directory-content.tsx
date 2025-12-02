import type { transformedEntries } from "@/collections"
import {
  getBreadcrumbItems,
  getEntryForTransformed,
  getSections,
} from "@/collections"
import { SiteBreadcrumb } from "@/components/breadcrumb"
import SectionGrid from "@/components/section-grid"
import Siblings from "@/components/siblings"
import { cn } from "@/lib/utils"

import { MobileTableOfContents } from "./table-of-contents"

export async function DirectoryContent({
  transformedEntry,
}: {
  transformedEntry: Awaited<ReturnType<typeof transformedEntries>>[number]
}) {
  const entry = await getEntryForTransformed(transformedEntry)

  const [breadcrumbItems, sections] = await Promise.all([
    getBreadcrumbItems(transformedEntry.segments),
    getSections(entry),
  ])

  return (
    <>
      <div className="container py-6">
        <MobileTableOfContents toc={[]} showToc={false} />

        <div className={cn("gap-8 xl:grid")}>
          <div className="mx-auto w-full 2xl:w-6xl">
            <SiteBreadcrumb items={breadcrumbItems} />

            <article data-pagefind-body>
              <div
                className={cn(
                  // default prose
                  "prose dark:prose-invert",
                  // remove backtick from inline code block
                  "prose-code:before:hidden prose-code:after:hidden",
                  // use full width
                  "w-full max-w-full",
                  "prose-a:text-indigo-400 prose-a:hover:text-white",
                )}
              >
                <h1
                  className="no-prose mb-2 scroll-m-20 text-4xl font-light tracking-tight lg:text-5xl"
                  data-pagefind-meta="title"
                >
                  {transformedEntry.title}
                </h1>
              </div>

              <SectionGrid sections={sections} />
            </article>

            <Siblings transformedEntry={transformedEntry} />
          </div>
        </div>
      </div>
    </>
  )
}
