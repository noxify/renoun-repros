"use client"

import { ClientOnly } from "../client-only"

export default function Video({ src }: { src: string }) {
  return (
    <ClientOnly>
      <div className="rounded-md border px-8 dark:border-gray-700">
        <video controls className="h-full w-full" preload="none" playsInline>
          <source src={src} />
          <p>
            Your browser doesn&apos;t support HTML video. Here is a
            <a href={src} download={src}>
              link to the video
            </a>{" "}
            instead.
          </p>
        </video>
      </div>
    </ClientOnly>
  )
}
