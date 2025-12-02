"use client"

import React from "react"

interface RouterContextValue {
  pathname: string
  search: string
  hash: string
  href: string
}

const RouterContext = React.createContext<RouterContextValue | null>(null)

export function RouterProvider({ children }: { children: React.ReactNode }) {
  // Always start with default values to avoid hydration mismatch
  const [router, setRouter] = React.useState<RouterContextValue>({
    pathname: "/",
    search: "",
    hash: "",
    href: "/",
  })

  React.useEffect(() => {
    // Set initial real values on client mount
    setRouter({
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      href: window.location.href,
    })

    const updateRouter = () => {
      setRouter({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        href: window.location.href,
      })
    }

    // Listen to popstate (back/forward)
    window.addEventListener("popstate", updateRouter)

    // Listen to pushState/replaceState
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalPushState = window.history.pushState
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function (...args) {
      const result = originalPushState.apply(this, args)
      updateRouter()
      return result
    }

    window.history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args)
      updateRouter()
      return result
    }

    return () => {
      window.removeEventListener("popstate", updateRouter)
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [])

  return (
    <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
  )
}

export function useRouter() {
  const context = React.useContext(RouterContext)
  if (!context) {
    throw new Error("useRouter must be used within RouterProvider")
  }
  return context
}
