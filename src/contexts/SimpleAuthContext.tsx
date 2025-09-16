"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"

interface User {
  id: string
  email: string
  role: string
  name: string
}

interface SimpleAuthContextType {
  user: User | null
  logout: () => void
  loading: boolean
}

const SimpleAuthContext = createContext<SimpleAuthContextType | null>(null)

export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("simpleAuth")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        console.log("SimpleAuth: Restored user from localStorage:", userData)
        setUser(userData)
      } catch (error) {
        console.error("SimpleAuth: Error parsing saved user:", error)
        localStorage.removeItem("simpleAuth")
      }
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("simpleAuth")
    setUser(null)
    console.log("SimpleAuth: User logged out")
  }

  return (
    <SimpleAuthContext.Provider value={{ user, logout, loading }}>
      {children}
    </SimpleAuthContext.Provider>
  )
}

export function useSimpleAuth() {
  const context = useContext(SimpleAuthContext)
  if (!context) {
    throw new Error("useSimpleAuth must be used within SimpleAuthProvider")
  }
  return context
}
