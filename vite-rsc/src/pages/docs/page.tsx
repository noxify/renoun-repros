import path from "path"
import { DocumentationGroup } from "@/collections"
import { Header } from "@/components/header"
import Link from "@/components/link-component"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

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
          frontmatter.entrypoint ??
          `/${path.join("docs", collection.getPathname())}`,
        description: frontmatter.description ?? "",
      }
    }),
  )

  return products
}

export default async function DocsIndexPage() {
  const products = await getData()
  return (
    <>
      <title>Docs</title>
      <Header />
      <div className="container mx-auto flex flex-col space-y-12 py-32">
        Custom Search Component can be placed here.
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
