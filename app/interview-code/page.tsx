"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function InterviewCodeRoute() {
  const router = useRouter()
  useEffect(() => {
    // If you have a web-safe interview setup page, redirect there.
    // Otherwise show a simple placeholder.
    // router.push('/main-app')
  }, [router])
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Interview Code</h1>
        <p className="text-gray-600">This route is available in the desktop build. Configure your interview flow from the dashboard.</p>
      </div>
    </div>
  )
}
