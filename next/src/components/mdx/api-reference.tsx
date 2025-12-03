import type {
  JavaScriptModuleExport,
  ReferenceComponents,
  ReferenceProps,
} from "renoun"
import { Reference as DefaultReference } from "renoun"
import { Markdown } from "renoun/components/Markdown"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import { Badge } from "../ui/badge"

export function References({
  fileExports,
}: {
  fileExports: JavaScriptModuleExport<any>[]
}) {
  return (
    <div>
      {fileExports.map((fileExport) => (
        <APIReference key={fileExport.getName()} source={fileExport} />
      ))}
    </div>
  )
}

export function APIReference(props: ReferenceProps) {
  const components = {
    Section: ({ kind, ...props }) => (
      <Accordion type="multiple">
        <AccordionItem value={props.id ?? kind} {...props}></AccordionItem>
      </Accordion>
    ),
    SectionHeading: ({ label, title }) => (
      <AccordionTrigger>
        <div className="flex gap-4">
          <Badge>{label}</Badge> <span>{title}</span>
        </div>
      </AccordionTrigger>
    ),

    SectionBody: ({ children }) => (
      <AccordionContent>
        <div>{children}</div>
      </AccordionContent>
    ),
    Column: ({ gap, ...props }) => <div {...props} />,
    Row: ({ gap, ...props }) => <div {...props} />,
    // Detail: ({ kind, ...props }) => <div {...props} />,
    // DetailHeading: (props) => <h4 {...props} />,
    //Signatures: (props) => <div {...props} />,
    // Table: (props) => <table {...props} />,
    // TableRowGroup: ({ hasSubRow, children }) => {
    //   return hasSubRow ? (
    //     <Accordion type="multiple">{children}</Accordion>
    //   ) : (
    //     <>{children}</>
    //   )
    // },
    // TableRow: ({ hasSubRow, ...props }) => <tr {...props} />,
    // TableSubRow: ({ children }) => (
    //   <tr>
    //     <td colSpan={3}>
    //       <AccordionContent>
    //         <div>{children}</div>
    //       </AccordionContent>
    //     </td>
    //   </tr>
    // ),
    // TableHeader: (props) => <th {...props} />,
    // TableData: ({ index, hasSubRow, ...props }) => {
    //   const isFirstWithSubRow = index === 0 && hasSubRow

    //   return (
    //     <td {...props}>
    //       {isFirstWithSubRow ? <AccordionTrigger></AccordionTrigger> : null}
    //       {props.children}
    //     </td>
    //   )
    // },
    Code: (props) => <code {...props} />,
    Description: ({ children }) => (
      <div>
        <Markdown children={children} />
      </div>
    ),
    ...props.components,
  } satisfies Partial<ReferenceComponents>

  return (
    <>
      <DefaultReference {...props} components={components} />
    </>
  )
}
