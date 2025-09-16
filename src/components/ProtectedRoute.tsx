"use client"

import type React from "react"
import { redirect } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    redirect("/login")
  }

  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard")
  }

  return <>{children}</>
}
