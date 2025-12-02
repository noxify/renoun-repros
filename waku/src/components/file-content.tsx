import type { transformedEntries } from "@/collections"
import {
  getBreadcrumbItems,
  getEntryForTransformed,
  getFileForEntry,
  getMetadata,
  getSections,
} from "@/collections"
import { SiteBreadcrumb } from "@/components/breadcrumb"
import SectionGrid from "@/components/section-grid"
import Siblings from "@/components/siblings"
import { MobileTableOfContents } from "@/components/table-of-contents"
import { cn } from "@/lib/utils"
import { MDX, TableOfContents as RenounTableOfContents } from "renoun"

export async function FileContent({
  transformedEntry,
}: {
  transformedEntry: Awaited<ReturnType<typeof transformedEntries>>[number]
}) {
  if (!transformedEntry.hasFile) {
    return <>Page not found</>
  }

  const file = await getFileForEntry(transformedEntry)
  if (!file) {
    return <>Page not found</>
  }

  const entry = await getEntryForTransformed(transformedEntry)

  try {
    const [Content, frontmatter, headings, breadcrumbItems, sections] =
      await Promise.all([
        file.getExportValue("default"),
        getMetadata(file),
        file.getExportValue("headings"),
        getBreadcrumbItems(transformedEntry.segments),
        getSections(entry),
      ])

    return (
      <>
        <div className="container py-6">
          <MobileTableOfContents
            toc={headings}
            showToc={headings.length > 0 && frontmatter?.toc}
          />

          <div
            className={cn("mt-12 gap-8 xl:grid", {
              "xl:grid-cols-[1fr_300px]": frontmatter?.toc,
              "xl:grid-cols-1": !frontmatter?.toc,
            })}
          >
            <div
              className={cn("mx-auto", {
                "w-full 2xl:w-4xl": !frontmatter?.toc,
                "w-full 2xl:w-3xl": frontmatter?.toc,
              })}
            >
              <SiteBreadcrumb items={breadcrumbItems} />

              <div data-pagefind-body>
                <MDX
                  components={{
                    h1: (props) => (
                      <h1
                        {...props}
                        className="no-prose mb-2 scroll-m-20 text-3xl font-light tracking-tight sm:text-4xl md:text-5xl"
                        data-pagefind-meta="title"
                      />
                    ),
                  }}
                >
                  {`# ${frontmatter?.title ?? transformedEntry.title}`}
                </MDX>

                <MDX
                  components={{
                    p: (props) => (
                      <p
                        {...props}
                        className="prose mb-8 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8"
                      />
                    ),
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    code: (props) => <code>{props.children ?? ""}</code>,
                  }}
                >
                  {frontmatter?.description ?? "&nbsp;"}
                </MDX>
                <article>
                  <div
                    className={cn(
                      // default prose
                      "prose dark:prose-invert",
                      // remove backtick from inline code block
                      "prose-code:before:hidden prose-code:after:hidden",
                      // use full width
                      "max-w-auto w-full min-w-full",
                      "grow",

                      // headings
                      "prose-headings:scroll-mt-28",
                      "prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2 prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight",
                      "prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:tracking-tight",
                      "prose-h4:mt-6 prose-h4:mb-3 prose-h4:text-lg prose-h4:font-semibold prose-h4:tracking-tight",
                      "prose-h5:mt-6 prose-h5:mb-3 prose-h5:text-base prose-h5:font-semibold",
                      "prose-h6:mt-6 prose-h6:mb-3 prose-h6:text-sm prose-h6:font-semibold",

                      // tables
                      "prose-th:pb-0",
                      "prose-table:my-0",

                      // paragraphs
                      "prose-p:leading-7 not-first:prose-p:mt-6",

                      // blockquotes
                      "prose-blockquote:mt-6 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic",

                      // lists
                      "prose-ul:ml-6 prose-ul:list-disc [&>li]:prose-ul:mt-2 [&>ul]:prose-ul:my-2 [&>ul]:prose-ul:ml-0",
                    )}
                  >
                    {/* <MDXContentWrapper> */}
                    <Content />
                    {/* </MDXContentWrapper> */}
                  </div>

                  <SectionGrid sections={sections} />
                </article>
              </div>
              <Siblings transformedEntry={transformedEntry} />
            </div>

            {frontmatter?.toc ? (
              <div className="hidden w-78 xl:sticky xl:top-20 xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:pr-6 xl:pb-16">
                <RenounTableOfContents
                  headings={headings}
                  components={{
                    Title: (props) => (
                      <h4
                        className="mt-0 mb-4 text-xs font-medium uppercase"
                        {...props}
                      >
                        On this page
                      </h4>
                    ),
                    List: ({ depth, children }) => {
                      return (
                        <ol
                          aria-level={depth}
                          className={cn("mt-1", {
                            "pl-0": depth === 0,
                            "pl-4": depth >= 1,
                          })}
                        >
                          {children}
                        </ol>
                      )
                    },
                    Item: (props) => {
                      return (
                        <li
                          className="mb-1 text-sm leading-6 last:mb-0"
                          {...props}
                        />
                      )
                    },
                    Link: (props) => {
                      return (
                        <a
                          {...props}
                          className="aria-current:font-bold aria-current:text-primary"
                        />
                      )
                    },
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.error("[FileContent] ERROR:", error)
    return (
      <div className="container py-6">
        <div className="rounded border border-red-500 bg-red-50 p-4 dark:bg-red-950">
          <h2 className="text-lg font-bold text-red-700 dark:text-red-300">
            Error Loading Content
          </h2>
          <pre className="mt-2 overflow-auto text-sm">
            {error instanceof Error ? error.message : String(error)}
          </pre>
          {error instanceof Error && error.stack && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm">Stack trace</summary>
              <pre className="mt-2 overflow-auto text-xs">{error.stack}</pre>
            </details>
          )}
        </div>
      </div>
    )
  }
}
