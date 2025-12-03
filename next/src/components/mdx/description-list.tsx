import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export const DescriptionList = ({ children }: { children: ReactNode }) => {
  return <dl className="divide-y divide-accent-foreground/15">{children}</dl>
}

export const DescriptionListItem = ({
  label,
  className,
  ddClassName,
  children,
}: {
  label: string | (() => React.JSX.Element)
  className?: string
  ddClassName?: string
  children: ReactNode
}) => {
  return (
    <div className={cn("px-0 py-6 lg:grid lg:grid-cols-3 lg:gap-4", className)}>
      <dt className="text-sm leading-6 font-bold text-foreground lg:mt-0">
        {typeof label === "function" ? label() : label}
      </dt>
      <dd
        className={cn(
          "mt-1 text-sm leading-6 text-foreground lg:col-span-2 lg:mt-0",
          ddClassName,
        )}
      >
        {children}
      </dd>
    </div>
  )
}
