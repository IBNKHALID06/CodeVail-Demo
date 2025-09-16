"use client"

import { useLoading } from '@/src/contexts/LoadingContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function usePageTransition() {
  const { showLoading, hideLoading } = useLoading()
  const router = useRouter()

  const navigateWithLoading = (path: string) => {
    showLoading()
    
    // Simulate page compilation/loading time - shorter for better UX
    setTimeout(() => {
      router.push(path)
      // Hide loading after navigation
      setTimeout(() => {
        hideLoading()
      }, 800) // Reduced from 1000ms
    }, 200) // Reduced from 300ms
  }

  return { navigateWithLoading }
}

// Hook for automatic loading on component mount
export function useComponentLoading(loadingTime: number = 1500) {
  const { showLoading, hideLoading } = useLoading()

  useEffect(() => {
    showLoading()
    const timer = setTimeout(() => {
      hideLoading()
    }, loadingTime)

    return () => {
      clearTimeout(timer)
      hideLoading()
    }
  }, [showLoading, hideLoading, loadingTime])
}
