import type { LucideIcon } from "lucide-react"
import { isValidElement } from "react"
import z from "zod"

export const frontmatterSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  navTitle: z.string().optional(),
  entrypoint: z.string().optional(),
  alias: z.string().optional(),
  toc: z.boolean().optional().default(true),
  externalLink: z.url().optional(),
})

export const headingsSchema = z.array(
  z.object({
    id: z.string(),
    level: z.number(),
    children: z.custom<React.ReactElement>(isValidElement),
    text: z.string(),
  }),
)

export const docSchema = z.object({
  frontmatter: frontmatterSchema,
  headings: headingsSchema,
  icon: z.custom<React.ReactElement>(isValidElement).optional(),
})

export type Frontmatter = z.infer<typeof frontmatterSchema>
export type Headings = z.infer<typeof headingsSchema>

export interface DocSchema {
  frontmatter: Frontmatter
  headings: Headings
  icon?: React.ReactNode | LucideIcon
}
