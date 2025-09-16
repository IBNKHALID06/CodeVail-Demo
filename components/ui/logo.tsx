"use client"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: {
      container: "gap-2",
      shield: "w-6 h-6",
      brackets: "text-sm",
      text: "text-lg font-bold",
    },
    md: {
      container: "gap-3",
      shield: "w-8 h-8",
      brackets: "text-base",
      text: "text-2xl font-bold",
    },
    lg: {
      container: "gap-4",
      shield: "w-12 h-12",
      brackets: "text-xl",
      text: "text-4xl font-bold",
    },
    xl: {
      container: "gap-5",
      shield: "w-16 h-16",
      brackets: "text-2xl",
      text: "text-6xl font-bold",
    },
  }

  const classes = sizeClasses[size]

  return (
    <div className={cn("flex items-center", classes.container, className)}>
      {/* Shield Icon with Code Brackets */}
      <div className="relative">
        <div
          className={cn("flex items-center justify-center rounded-lg bg-gradient-primary shadow-lg", classes.shield)}
        >
          <div className={cn("text-white font-mono font-bold", classes.brackets)}>{"<>"}</div>
        </div>
        {/* Subtle glow effect */}
        <div
          className={cn("absolute inset-0 rounded-lg bg-gradient-primary opacity-20 blur-sm -z-10", classes.shield)}
        />
      </div>

      {/* CodeVail Text */}
      {showText && <span className={cn("text-primary font-inter tracking-tight", classes.text)}>CodeVail</span>}
    </div>
  )
}
