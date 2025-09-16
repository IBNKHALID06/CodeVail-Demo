"use client"

import { Minus, Square, X } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

interface WindowTitleBarProps {
  isMaximized: boolean
  onMaximize: () => void
  onMinimize: () => void
  onClose: () => void
  title?: string
}

export function WindowTitleBar({ isMaximized, onMaximize, onMinimize, onClose, title }: WindowTitleBarProps) {
  return (
    <div className="flex items-center justify-between h-12 px-4 bg-gradient-to-r from-background-secondary to-surface border-b border-border select-none">
      {/* Left: Logo and Title */}
      <div className="flex items-center gap-3">
        <Logo size="sm" showText={false} />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground leading-none">{title || "CodeVail"}</span>
          <span className="text-xs text-foreground-muted leading-none">Secure Coding Interview Platform</span>
        </div>
      </div>

      {/* Right: Window Controls */}
      <div className="flex items-center">
        <button
          onClick={onMinimize}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg",
            "hover:bg-surface-hover transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
          )}
          title="Minimize"
        >
          <Minus className="w-4 h-4 text-foreground-secondary" />
        </button>

        <button
          onClick={onMaximize}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg ml-1",
            "hover:bg-surface-hover transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
          )}
          title={isMaximized ? "Restore" : "Maximize"}
        >
          <Square className="w-4 h-4 text-foreground-secondary" />
        </button>

        <button
          onClick={onClose}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg ml-1",
            "hover:bg-red-500 hover:text-white transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-background",
          )}
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
