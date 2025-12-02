import { DocumentationGroup } from "@/collections"
import Link from "@/components/link-component"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowRight, MoveUpRightIcon } from "lucide-react"

async function getData() {
  const rootCollections = await DocumentationGroup.getEntries({
    recursive: false,
    includeIndexAndReadmeFiles: true,
  })

  const products = await Promise.all(
    rootCollections.map(async (collection) => {
      const indexFile = await collection.getFile("index", "mdx")

      const frontmatter = await indexFile.getExportValue("frontmatter")

      return {
        title: frontmatter.title ?? collection.getTitle(),
        // if you don't want to redirect the user to a specific page
        // and you haven't defined an entrypoint, then we will use the current path as an entry point
        entrypoint:
          frontmatter.entrypoint ?? `/docs${collection.getPathname()}`,
        description: frontmatter.description ?? "",
      }
    }),
  )

  return products
}

export default async function HomePage() {
  const products = await getData()

  return (
    <>
      <div className="flex min-h-[88vh] flex-col items-center justify-center py-8 text-center sm:min-h-[50vh]">
        <Badge asChild>
          <a
            href="https://github.com/noxify/renoun-docs-template"
            target="_blank"
            className="mb-5 flex items-center gap-2 sm:text-lg"
          >
            Follow along on GitHub{" "}
            <MoveUpRightIcon className="h-4 w-4 font-extrabold" />
          </a>
        </Badge>
        <h1 className="mb-4 text-3xl font-bold sm:text-7xl">
          An example app to build your documentation based on renoun.
        </h1>
        <p className="mb-8 max-w-[800px] sm:text-xl">
          This feature-packed documentation template, built with Vite and
          renoun, offers a sleek and responsive design, perfect for all your
          project documentation needs.
        </p>
      </div>

      <div className="container mx-auto flex flex-col space-y-12 py-32">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Explore Our Documentation Collections
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Card
              className="group transition-shadow hover:shadow-lg"
              key={index}
            >
              <CardHeader>
                <h3 className="text-xl leading-tight font-semibold transition-colors">
                  {product.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href={product.entrypoint}
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  Go to docs
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
