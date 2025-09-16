"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "../contexts/ThemeContext"
import { ThemeToggle } from "../components/ThemeToggle"
import { ArrowLeft, Video, Phone, Settings } from "lucide-react"

export default function CallPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [roomId, setRoomId] = useState("")

  const handleStartCall = () => {
    if (roomId.trim()) {
      router.push(`/call/${roomId}`)
    }
  }

  const handleJoinCall = () => {
    if (roomId.trim()) {
      router.push(`/call/${roomId}`)
    }
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div className={`border-b ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <ArrowLeft size={20} className={theme === "dark" ? "text-white" : "text-gray-900"} />
              </button>
              <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Video Call
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Video size={64} className={`mx-auto mb-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
          <h2 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Start or Join a Video Call
          </h2>
          <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Enter a room ID to start a new call or join an existing one
          </p>
        </div>

        <div className={`max-w-md mx-auto p-8 rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg`}>
          <form className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Room ID
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter room ID"
              />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleStartCall}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Video size={20} />
                <span>Start New Call</span>
              </button>

              <button
                type="button"
                onClick={handleJoinCall}
                className={`w-full font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                } border ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}
              >
                <Phone size={20} />
                <span>Join Existing Call</span>
              </button>
            </div>
          </form>

          <div className={`mt-6 pt-6 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex items-center justify-center space-x-4">
              <Settings size={16} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
              <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Check your camera and microphone settings
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
