"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// LoadingPage removed per request to eliminate loading screen

interface LoadingContextType {
  isLoading: boolean
  setLoading: (loading: boolean) => void
  showLoading: () => void
  hideLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  // Simplified: loading screen removed; always render children immediately
  const [isLoading, setIsLoading] = useState(false)

  const setLoading = (loading: boolean) => setIsLoading(loading)
  const showLoading = () => setIsLoading(false) // no-op now
  const hideLoading = () => setIsLoading(false)

  const contextValue: LoadingContextType = {
    isLoading,
    setLoading,
    showLoading,
    hideLoading
  }

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  )
}
