"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function Spinner({ size = "md", className, text }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        {text && (
          <p className="text-sm text-foreground-muted animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

// Inline spinner for buttons
export function ButtonSpinner({ className }: { className?: string }) {
  return (
    <Loader2 className={cn("w-4 h-4 animate-spin", className)} />
  )
}

// Page-level loading overlay
export function LoadingOverlay({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Spinner size="lg" text={text} />
    </div>
  )
}
