"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ViteAsset {
  src: string
  width?: number
  height?: number
}

interface ImageProps {
  src: string | ViteAsset
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  sizes?: string
  className?: string
  style?: React.CSSProperties
  loading?: "lazy" | "eager"
  decoding?: "async" | "sync" | "auto"
  onLoad?: () => void
  onError?: () => void
}

export function Image({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  placeholder = "empty",
  blurDataURL,
  sizes,
  className,
  style,
  ...props
}: ImageProps) {
  // Helper to check if src is a Vite asset object
  const isViteAsset = (value: string | ViteAsset): value is ViteAsset => {
    return typeof value === "object" && "src" in value
  }

  const [isLoaded, setIsLoaded] = React.useState(false)
  const [error, setError] = React.useState(false)

  const imgRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true)
    }
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setError(true)
  }

  // Resolve Vite asset path
  const resolvedSrc = React.useMemo(() => {
    // Handle Vite imported assets (object with src property)
    if (isViteAsset(src)) {
      return src.src
    }

    // String path - external URL or local path
    if (
      src.startsWith("http") ||
      src.startsWith("data:") ||
      src.startsWith("//")
    ) {
      return src
    }

    // For relative paths starting with /, they should be in public folder
    // Vite serves public folder assets at root
    return src
  }, [src])

  // Extract dimensions from imported asset if available
  const resolvedWidth = React.useMemo(() => {
    if (width) return width
    if (isViteAsset(src)) {
      return src.width
    }
    return undefined
  }, [src, width])

  const resolvedHeight = React.useMemo(() => {
    if (height) return height
    if (isViteAsset(src)) {
      return src.height
    }
    return undefined
  }, [src, height])

  const imgStyles: React.CSSProperties = fill
    ? {
        position: "absolute",
        height: "100%",
        width: "100%",
        inset: 0,
        objectFit: "cover",
      }
    : {
        width: width ? `${width}px` : "auto",
        height: height ? `${height}px` : "auto",
        maxWidth: "100%",
      }

  const containerStyles: React.CSSProperties = fill
    ? {
        position: "relative",
        overflow: "hidden",
      }
    : {}

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className,
        )}
        style={fill ? { ...containerStyles, ...imgStyles } : imgStyles}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    )
  }

  const imageElement = (
    <img
      ref={imgRef}
      src={resolvedSrc}
      alt={alt}
      width={!fill ? resolvedWidth : undefined}
      height={!fill ? resolvedHeight : undefined}
      sizes={sizes}
      loading={props.loading ?? (priority ? "eager" : "lazy")}
      decoding={props.decoding ?? (priority ? "sync" : "async")}
      onLoad={props.onLoad ?? handleLoad}
      onError={props.onError ?? handleError}
      className={cn(
        "transition-opacity duration-300",
        {
          "opacity-0": !isLoaded && placeholder === "blur",
          "opacity-100": isLoaded || placeholder === "empty",
        },
        className,
      )}
      style={{ ...imgStyles, ...style }}
    />
  )

  if (placeholder === "blur" && blurDataURL && !isLoaded) {
    return (
      <div style={containerStyles} className={fill ? className : undefined}>
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className={cn("absolute inset-0 blur-xl", className)}
          style={imgStyles}
        />
        {imageElement}
      </div>
    )
  }

  if (fill) {
    return (
      <div style={containerStyles} className={className}>
        {imageElement}
      </div>
    )
  }

  return imageElement
}
