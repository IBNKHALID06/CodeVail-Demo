"use client"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg`}
      >
        <span className="text-white font-bold font-mono">{"<>"}</span>
      </div>
      <div>
        <h1
          className={`font-bold text-gray-900 dark:text-white ${size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-lg"}`}
        >
          CodeVail
        </h1>
        {size === "lg" && <p className="text-sm text-gray-600 dark:text-gray-400">Interview Platform</p>}
      </div>
    </div>
  )
}
