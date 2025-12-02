import type { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"
import { ExternalLinkIcon } from "lucide-react"
import { Link as WakuLink } from "waku"

type AnchorProps = ComponentPropsWithoutRef<"a">

export default function Link({
  href,
  children,
  clean = false,
  ...props
}: AnchorProps & { clean?: boolean }) {
  // When clean=true, still merge with props.className to allow parent components to add classes
  const className = !clean
    ? cn("text-primary hover:text-foreground", props.className)
    : props.className
  if (!href) {
    console.log("Invalid link detected")
    return <a href="/">###INVALID_LINK###</a>
  }

  if (
    href.startsWith("http") ||
    href.startsWith("https") ||
    href.startsWith("mailto")
  ) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
        {!clean ? <ExternalLinkIcon className="ml-1 inline h-4 w-4" /> : null}
      </a>
    )
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props} className={className}>
        {children}
      </a>
    )
  }

  const internalHref = href.endsWith("/") ? href : href + "/"

  return (
    <>
      <WakuLink to={internalHref} {...props} className={className}>
        {children ?? internalHref}
      </WakuLink>
    </>
  )
}
