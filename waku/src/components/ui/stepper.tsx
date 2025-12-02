import type { PropsWithChildren } from "react"
import type { Simplify } from "type-fest"
import { Children } from "react"
import { cn } from "@/lib/utils"

// export type StepperProps = Simplify<PropsWithChildren>
type StepperItemProps2 = Simplify<
  PropsWithChildren<{
    // The title of the step
    title?: string
  }>
>

type StepperItemProps3 = PropsWithChildren<{ title?: string }>

type StepperProps = PropsWithChildren

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type StepperItemPropsAsType = {
  // The title of the step
  title?: string
  children?: React.ReactNode
}
interface StepperItemProps {
  // The title of the step
  title?: string
  children?: React.ReactNode
}

interface StepperItemPropsExtended extends PropsWithChildren {
  title?: string
}

type StepperItemPropsExtended2 = PropsWithChildren<{ title?: string }>

interface NestedStepperItemProps {
  title?: string
  subSteps?: { title: string; content: React.ReactNode }
}

interface Base {
  id: string
}

interface Extended extends Base {
  name: string
}

/**
 * A vertical stepper component that displays steps with numbers and connecting lines.
 *
 * @param children {React.ReactNode} The stepper items to be displayed within the stepper
 * @returns {React.ReactNode} A React component rendering the stepper
 */
function Stepper({ children }: StepperProps): React.ReactNode {
  const length = Children.count(children)

  return (
    <div className="ml-4 flex flex-col">
      {Children.map(children, (child, index) => {
        return (
          <div
            className={cn(
              "relative border-l pl-9",
              cn({
                "pb-5": index < length - 1,
              }),
            )}
          >
            <div className="font-code absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {index + 1}
            </div>
            {child}
          </div>
        )
      })}
    </div>
  )
}

/**
 * A single item within the Stepper component.
 */
function StepperItem({ title, children }: StepperItemProps): React.ReactNode {
  return (
    <div className="pt-0.5">
      <h4 className="mt-0">{title}</h4>
      <div>{children}</div>
    </div>
  )
}

export { Stepper, StepperItem }

export type {
  StepperProps,
  StepperItemProps,
  StepperItemProps2,
  StepperItemProps3,
  StepperItemPropsAsType,
  StepperItemPropsExtended,
  NestedStepperItemProps,
  StepperItemPropsExtended2,
  Base,
  Extended,
}
