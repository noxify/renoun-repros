import type { getSections } from "@/collections"
import type { frontmatterSchema } from "@/validations"
import type { z } from "zod"
import {
  getFileForEntry,
  isExternalTransformed,
  isHiddenTransformed,
} from "@/collections"

import Link from "./link-component"
import { Card, CardContent, CardHeader } from "./ui/card"

export default async function SectionGrid({
  sections,
}: {
  sections: Awaited<ReturnType<typeof getSections>>
}) {
  if (sections.length === 0) {
    return <></>
  }

  const elements = []

  for (const section of sections) {
    if (
      isHiddenTransformed(section) ||
      (await isExternalTransformed(section))
    ) {
      continue
    }

    let frontmatter: z.infer<typeof frontmatterSchema> | undefined
    try {
      const file = await getFileForEntry(section)
      frontmatter = await file?.getExportValue("frontmatter")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      continue
    }

    if (!frontmatter) {
      elements.push({
        title: section.title,
        description: "",
        path: `/docs${section.raw_pathname}`,
      })
    } else {
      elements.push({
        title: section.title,
        description: frontmatter.description ?? "",
        path: `/docs${section.raw_pathname}`,
      })
    }
  }

  return (
    <div
      className="mt-12 grid auto-rows-fr items-stretch gap-4 md:grid-cols-2 2xl:grid-cols-2"
      data-pagefind-ignore
    >
      {elements.map((ele, index) => {
        return (
          <Link href={ele.path} key={index}>
            <Card className="group h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <h3 className="text-xl leading-tight font-semibold transition-colors">
                  {ele.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  {ele.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
