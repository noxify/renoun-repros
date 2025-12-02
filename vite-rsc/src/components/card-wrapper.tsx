import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface CardWrapperProps {
  link: string
  title: string
  excerpt: string
}

export function CardWrapper({ link, title, excerpt }: CardWrapperProps) {
  return (
    <Card className="group transition-shadow hover:shadow-lg">
      <CardHeader>
        <h3 className="text-xl leading-tight font-semibold transition-colors group-hover:text-accent">
          {title}
        </h3>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed text-muted-foreground">{excerpt}</p>
      </CardContent>
      <CardFooter>
        <a
          href={link}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
        >
          Go to docs
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </a>
      </CardFooter>
    </Card>
  )
}
