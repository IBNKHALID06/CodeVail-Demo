"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import apiService, { User, LoginCredentials } from '../services/ApiService'

interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Storage utilities
  const getStoredUser = (): User | null => {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem('auth_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  const storeAuth = (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user))
    }
  }

  const clearAuth = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user')
    }
  }

  useEffect(() => {
    // Restore user from localStorage on app load
    const initializeAuth = () => {
      const savedUser = getStoredUser()
      if (savedUser) {
        console.log("AuthContext: Restored user from localStorage:", savedUser)
        setUser(savedUser)
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true)

    try {
      console.log("AuthContext: Attempting login with:", credentials)
      
      // For now, let's use simple credential checking while backend is unstable
      const isValidCandidate = credentials.role === "candidate" && 
                               credentials.email === "candidate@codevail.com" && 
                               credentials.password === "password123"
      
      const isValidInterviewer = credentials.role === "interviewer" && 
                                credentials.email === "admin@codevail.com" && 
                                credentials.password === "Admin123"

      if (isValidCandidate || isValidInterviewer) {
        const user: User = {
          id: credentials.role === "candidate" ? "1" : "2",
          name: credentials.role === "candidate" ? "Test Candidate" : "Test Interviewer",
          email: credentials.email,
          role: credentials.role,
          token: "temp-token-" + Date.now()
        }
        
        console.log("AuthContext: Login successful, setting user:", user)
        setUser(user)
        storeAuth(user)
        setIsLoading(false)
        return true
      } else {
        console.log("AuthContext: Invalid credentials")
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error("AuthContext: Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = async () => {
    try {
      clearAuth()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
