"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "../contexts/ThemeContext"
import { ThemeToggle } from "../components/ThemeToggle"
import { ArrowLeft, Video } from "lucide-react"

export default function CallPage() {
  const [roomId, setRoomId] = useState("")
  const router = useRouter()
  const { theme } = useTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomId.trim()) {
      router.push(`/call/${roomId}`)
    } else {
      // Generate a random room ID for new calls
      const newRoomId = Math.random().toString(36).substring(2, 15)
      router.push(`/call/${newRoomId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Video Call
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <Video size={64} className="mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Start or Join Video Call
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Connect with candidates or interviewers for live coding sessions
          </p>
        </div>

        <div className="max-w-md mx-auto p-8 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Room ID (optional)
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID to join existing call"
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
              >
                {roomId ? "Join Call" : "Start New Call"}
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-600 dark:text-gray-500 mt-6 text-center">
            Leave room ID empty to create a new call room
          </p>
        </div>
      </div>
    </div>
  )
}
