"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function CandidateResults() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header with back button */}
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Candidate Results
          </h1>
          <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
            This page will show candidate performance data.
          </p>
        </div>
      </div>
    </div>
  )
}
