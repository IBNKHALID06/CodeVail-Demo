"use client"

import React from "react"

export function FullScreenLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-sm text-foreground">{message}</div>
      </div>
    </div>
  )
}
