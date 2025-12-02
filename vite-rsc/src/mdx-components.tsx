import type { VariantProps } from "class-variance-authority"
import type { LucideIcon } from "lucide-react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import type { CodeBlockProps, CodeInlineProps } from "renoun/components"
import type { MDXComponents } from "renoun/mdx"
import { DataTableBuilder } from "@/components/data-table/data-table-builder"
import MermaidWrapper from "@/components/mdx/mermaid-wrapper"
import RailroadWrapper from "@/components/mdx/railroad-wrapper"
import Video from "@/components/mdx/video"
import {
  Accordion as BaseAccordion,
  AccordionContent as BaseAccordionContent,
  AccordionItem as BaseAccordionItem,
  AccordionTrigger as BaseAccordionTrigger,
} from "@/components/ui/accordion"
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert"
import { Stepper, StepperItem } from "@/components/ui/stepper"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BellIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  ShieldAlertIcon,
} from "lucide-react"
import { CodeBlock, CodeInline, parseCodeProps } from "renoun/components"
import { createSlug } from "renoun/mdx"

import { Image } from "./components/image"
import Link from "./components/link-component"
import {
  DescriptionList,
  DescriptionListItem,
} from "./components/mdx/description-list"
import { Preview } from "./components/mdx/preview"

type AnchorProps = ComponentPropsWithoutRef<"a">

export function useMDXComponents() {
  return {
    Heading: ({ Tag, id, children, ...rest }) => (
      <Tag id={id as string} {...rest}>
        <a href={`#${id}`} className="not-prose">
          {children}
        </a>
      </Tag>
    ),

    // links ( relative, absolute, remote, mails )
    a: ({ href, children, ...props }: AnchorProps) => {
      return (
        <Link href={href} {...props} className="font-medium">
          {children}
        </Link>
      )
    },
    // markdown image handler
    img: (props) => (
      <section>
        <div className="mb-4 flex items-center justify-center">
          <div className="rounded-md border bg-background p-4 md:w-3/4">
            <Image
              {...props}
              width={0}
              height={0}
              style={{ width: "100%", height: "auto" }}
              className="not-prose object-contain"
            />
          </div>
        </div>
      </section>
    ),
    Image: (props) => (
      <section>
        <div className="mb-4 flex items-center justify-center">
          <div className="rounded-md border bg-background p-4 md:w-3/4">
            <Image
              width={0}
              height={0}
              style={{ width: "100%", height: "auto" }}
              className="not-prose object-contain"
              {...props}
            />
          </div>
        </div>
      </section>
    ),

    // Inline code
    code: (props: CodeInlineProps) => {
      return (
        <CodeInline
          {...parseCodeProps(props)}
          shouldAnalyze={false}
          allowErrors
          css={{
            backgroundColor: "hsl(var(--secondary))",
            color: "auto",
            boxShadow: "none",
            display: "inline",
          }}
          paddingX="auto"
          paddingY="auto"
          className="border px-2 py-0.5 text-xs"
        />
      )
    },
    CodeInline: (props: CodeInlineProps) => {
      return (
        <CodeInline
          {...parseCodeProps(props)}
          shouldAnalyze={false}
          allowErrors
          css={{
            backgroundColor: "hsl(var(--secondary))",
            color: "auto",
            boxShadow: "none",
            display: "inline",
          }}
          paddingX="auto"
          paddingY="auto"
          className="border px-2 py-0.5 text-xs"
        />
      )
    },
    // Code block
    pre: (props: CodeBlockProps) => {
      if (props.language === "mermaid") {
        return <MermaidWrapper chart={props.children as string} />
      }

      // @ts-expect-error railroad is not a valid language
      if (props.language === "railroad") {
        return <RailroadWrapper content={props.children as string} />
      }

      return (
        <CodeBlock
          {...props}
          className={{ container: "my-4!" }}
          shouldAnalyze={false}
          shouldFormat={false}
        />
      )
    },
    CodeBlock: (props: CodeBlockProps) => {
      if (props.language === "mermaid") {
        return <MermaidWrapper chart={props.children as string} />
      }

      // @ts-expect-error railroad is not a valid language
      if (props.language === "railroad") {
        return <RailroadWrapper content={props.children as string} />
      }

      return (
        <CodeBlock
          {...props}
          className={{ container: "my-4!" }}
          shouldAnalyze={false}
          shouldFormat={false}
          allowErrors={true}
        />
      )
    },

    // stepper
    Stepper: ({ children }: { children: ReactNode }) => {
      return <Stepper>{children}</Stepper>
    },
    StepperItem: ({
      title,
      children,
    }: {
      title?: string
      children: ReactNode
    }) => {
      return <StepperItem title={title}>{children}</StepperItem>
    },

    // tabs
    Tabs: ({
      defaultValue,
      children,
    }: {
      defaultValue?: string
      children: ReactNode
    }) => <Tabs defaultValue={defaultValue}>{children}</Tabs>,
    TabsTrigger: ({
      value,
      children,
    }: {
      value: string
      children: ReactNode
    }) => <TabsTrigger value={value}>{children}</TabsTrigger>,
    TabsList: ({ children }: { children: ReactNode }) => (
      <TabsList>{children}</TabsList>
    ),
    TabsContent: ({
      value,
      children,
    }: {
      value: string
      children: ReactNode
    }) => <TabsContent value={value}>{children}</TabsContent>,

    // table & data table
    table: ({ children }: { children?: ReactNode }) => {
      return (
        <div className="my-4">
          <div className="rounded-md border bg-white dark:border-gray-700 dark:bg-transparent">
            <div className="w-full overflow-auto">
              <Table>{children}</Table>
            </div>
          </div>
        </div>
      )
    },
    thead: ({ children }: { children?: ReactNode }) => {
      return <TableHeader>{children}</TableHeader>
    },
    tbody: ({ children }: { children?: ReactNode }) => {
      return <TableBody>{children}</TableBody>
    },
    th: ({
      style,
      children,
    }: {
      style?: { textAlign?: React.ComponentProps<"th">["align"] }
      children: ReactNode
    }) => {
      return <TableHead align={style?.textAlign}>{children}</TableHead>
    },
    tr: ({ children }: { children?: ReactNode }) => {
      return <TableRow>{children}</TableRow>
    },
    td: ({
      style,
      children,
    }: {
      style?: { textAlign?: React.ComponentProps<"td">["align"] }
      children: ReactNode
    }) => {
      return (
        <TableCell
          className="whitespace-nowrap"
          align={style?.textAlign ?? "left"}
        >
          {children}
        </TableCell>
      )
    },
    Table: Table,
    TableBody: TableBody,
    TableCell: TableCell,
    TableHead: TableHead,
    TableHeader: TableHeader,
    TableRow: TableRow,
    TableBuilder: ({
      columns,
      data,
    }: React.ComponentProps<typeof DataTableBuilder>) => {
      return (
        <DataTableBuilder
          columns={columns}
          data={data}
          options={{ sorting: false, pagination: false }}
        />
      )
    },
    DataTableBuilder: ({
      columns,
      data,
      options,
    }: React.ComponentProps<typeof DataTableBuilder>) => {
      return (
        <DataTableBuilder columns={columns} data={data} options={options} />
      )
    },

    // description list
    dl: ({ children }: { children?: ReactNode }) => {
      return (
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            {children}
          </div>
        </dl>
      )
    },
    dt: ({ children }: { children?: ReactNode }) => {
      return (
        <dt className="text-sm leading-6 font-medium text-primary">
          {children}
        </dt>
      )
    },
    dd: ({ children }: { children?: ReactNode }) => {
      return (
        <dd className="mt-1 text-sm leading-6 text-primary sm:col-span-2 sm:mt-0">
          {children}
        </dd>
      )
    },
    DescriptionList,
    DescriptionListItem,
    // accordion / collapible
    Accordion: ({
      children,
      collapsible,
      orientation,
      type = "single",
    }: {
      children: ReactNode
      collapsible?: boolean
      orientation?: "horizontal" | "vertical"
      type?: "single" | "multiple"
    }) => {
      return (
        <BaseAccordion
          type={type}
          collapsible={collapsible}
          orientation={orientation}
        >
          {children}
        </BaseAccordion>
      )
    },
    AccordionItem: ({
      children,
      title,
    }: {
      children: ReactNode
      title: string
    }) => {
      return (
        <BaseAccordionItem value={createSlug(title)}>
          <BaseAccordionTrigger>{title}</BaseAccordionTrigger>
          <BaseAccordionContent>{children}</BaseAccordionContent>
        </BaseAccordionItem>
      )
    },

    // custom components
    Preview: ({ children }: { children: ReactNode }) => {
      return <Preview>{children}</Preview>
    },
    Railroad: ({
      content,
      wrapped,
    }: {
      content: string
      wrapped?: boolean
    }) => {
      return <RailroadWrapper content={content} wrapped={wrapped} />
    },
    Mermaid: ({ chart, wrapped }: { chart: string; wrapped?: boolean }) => {
      return <MermaidWrapper chart={chart} wrapped={wrapped} />
    },
    Video: ({ src }: { src: string }) => {
      return <Video src={src} />
    },

    // alerts
    Alert: ({
      title,
      icon,
      appearance = "light",
      variant,
      children,
    }: {
      title?: string
      variant?: VariantProps<typeof Alert>["variant"]
      appearance?: VariantProps<typeof Alert>["appearance"]
      icon?: "alert" | "info" | "error" | "warning" | "success" | "callout"
      children: ReactNode
    }) => {
      let IconComponent: LucideIcon | null = null

      switch (icon) {
        case "alert":
          IconComponent = CircleAlertIcon
          break
        case "info":
          IconComponent = InfoIcon
          break
        case "callout":
          IconComponent = BellIcon
          break
        case "error":
          IconComponent = CircleAlertIcon
          break
        case "warning":
          IconComponent = ShieldAlertIcon
          break
        case "success":
          IconComponent = CircleCheckIcon
          break
        default:
          IconComponent = null
      }

      return (
        <Alert appearance={appearance} variant={variant} className="my-4">
          {IconComponent && (
            <AlertIcon>
              <IconComponent />
            </AlertIcon>
          )}
          <AlertContent>
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>{children}</AlertDescription>
          </AlertContent>
        </Alert>
      )
    },
    Success: ({ title, children }: { title?: string; children: ReactNode }) => {
      return (
        <Alert appearance={"light"} variant={"success"} className="my-4">
          <AlertIcon>
            <CircleCheckIcon />
          </AlertIcon>

          <AlertContent>
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>{children}</AlertDescription>
          </AlertContent>
        </Alert>
      )
    },
    Info: ({ title, children }: { title?: string; children: ReactNode }) => {
      return (
        <Alert appearance={"light"} variant={"primary"} className="my-4">
          <AlertIcon>
            <InfoIcon />
          </AlertIcon>

          <AlertContent>
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>{children}</AlertDescription>
          </AlertContent>
        </Alert>
      )
    },
    Warning: ({ title, children }: { title?: string; children: ReactNode }) => {
      return (
        <Alert appearance={"light"} variant={"warning"} className="my-4">
          <AlertIcon>
            <ShieldAlertIcon />
          </AlertIcon>

          <AlertContent>
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>{children}</AlertDescription>
          </AlertContent>
        </Alert>
      )
    },
    Error: ({ title, children }: { title?: string; children: ReactNode }) => {
      return (
        <Alert appearance={"light"} variant={"destructive"} className="my-4">
          <AlertIcon>
            <CircleAlertIcon />
          </AlertIcon>

          <AlertContent>
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>{children}</AlertDescription>
          </AlertContent>
        </Alert>
      )
    },
    Callout: ({ title, children }: { title?: string; children: ReactNode }) => {
      return (
        <Alert appearance={"light"} variant={"info"} className="my-4">
          <AlertIcon>
            <BellIcon />
          </AlertIcon>

          <AlertContent>
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>{children}</AlertDescription>
          </AlertContent>
        </Alert>
      )
    },
  } satisfies MDXComponents
}
