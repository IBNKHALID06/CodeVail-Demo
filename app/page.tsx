"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePageTransition } from "@/hooks/use-page-transition"

export default function HomePage() {
  const router = useRouter()
  const { navigateWithLoading } = usePageTransition()

  useEffect(() => {
    // Redirect to login page with loading transition
    const timer = setTimeout(() => {
      navigateWithLoading('/login')
    }, 1000) // Brief delay to show the initial loading

    return () => clearTimeout(timer)
  }, [navigateWithLoading])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-foreground-muted">Initializing CodeVail...</p>
      </div>
    </div>
  )
}
