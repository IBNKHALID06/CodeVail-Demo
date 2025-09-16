"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { ArrowLeft } from "lucide-react"

export default function MyResultsPage() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">My Results</h1>
      <p>Results for {user?.name}</p>
    </div>
  )
}
