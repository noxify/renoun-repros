import multimatch from "multimatch"

import type { TreeItem } from "./navigation"
import { resolveHref } from "./resolve-href"

export function isActive(
  currentPath: string | string[],
  checkPath: string | string[],
) {
  return multimatch(currentPath, checkPath).length > 0
}

export const current = ({
  pathname,
  item,
}: {
  pathname: string
  item: TreeItem
}) => {
  const active = isActive(
    pathname,
    [item.path, ...(item.children ?? []).map((ele) => ele.path)]
      .map((ele) => {
        const resolvedUrl = resolveHref(ele)
        return [resolvedUrl, `${resolvedUrl}/**`]
      })
      .flat(),
  )

  // console.dir({ pathname, active, item }, { depth: null });

  return active
}
