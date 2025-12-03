import type { getTransformedEntry } from "@/collections"
import { getSiblings } from "@/collections"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import Link from "./link-component"

export default async function Siblings({
  transformedEntry,
}: {
  transformedEntry: Awaited<ReturnType<typeof getTransformedEntry>>
}) {
  const [previousPage, nextPage] = await getSiblings(transformedEntry)

  if (!previousPage && !nextPage) {
    return <></>
  }

  return (
    <nav
      className="mt-6 flex items-center justify-between border-t pt-6"
      data-pagefind-ignore
    >
      <div className="flex w-0 flex-1">
        {previousPage && (
          <>
            <Link
              href={`/docs${previousPage.raw_pathname}`}
              title={`Go to previous page: ${previousPage.title}`}
            >
              <div className="group flex shrink-0 items-center gap-x-4">
                <ChevronLeftIcon className="h-5 w-5 flex-none text-sidebar-foreground transition-colors duration-200 group-hover:text-primary" />
                <div className="flex flex-col items-start">
                  <p className="text-xs leading-5 text-gray-500">
                    Previous page
                  </p>
                  <p className="text-sm leading-5 font-medium text-secondary-foreground/70 transition-colors duration-200 group-hover:text-secondary-foreground">
                    {previousPage.title}
                  </p>
                </div>
              </div>
            </Link>
          </>
        )}
      </div>

      <div className="-mt-px flex w-0 flex-1 justify-end">
        {nextPage && (
          <>
            <Link
              href={`/docs${nextPage.raw_pathname}`}
              title={`Go to next page: ${nextPage.title}`}
            >
              <div className="group flex shrink-0 items-center gap-x-4">
                <div className="flex flex-col items-end">
                  <p className="text-xs leading-5 text-gray-500">Next page</p>
                  <p className="text-sm leading-5 font-medium text-secondary-foreground/70 transition-colors duration-200 group-hover:text-secondary-foreground">
                    {nextPage.title}
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 flex-none text-sidebar-foreground transition-colors duration-200 group-hover:text-primary" />
              </div>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
