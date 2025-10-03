"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { VideoCallInterface } from "../components/VideoCall/VideoCallInterface"
import { ThemeToggle } from "../components/ThemeToggle"

export default function CallRoom() {
  const params = useParams<{ roomId: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const { theme } = useTheme()
  const [isJoining, setIsJoining] = useState(true)
  const [roomInfo, setRoomInfo] = useState<any>(null)

  const roomId = params?.roomId

  useEffect(() => {
    // Simulate room validation and info fetching
    const validateRoom = async () => {
      try {
        // In a real app, this would validate the room exists and user has permission
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setRoomInfo({
          id: roomId,
          name: `Interview Room ${roomId}`,
          type: user?.role === "interviewer" ? "interview" : "assessment",
          participants: [],
        })

        setIsJoining(false)
      } catch (error) {
        console.error("Failed to join room:", error)
        router.push("/candidate-dashboard")
      }
    }

    if (roomId) {
      validateRoom()
    }
  }, [roomId, router, user])

  const handleCallEnd = () => {
    router.push("/candidate-dashboard")
  }

  if (isJoining) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Joining Room...
          </h2>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Setting up your connection</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`call-room ${theme === "dark" ? "dark" : ""}`}>
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Video Call Interface */}
      <VideoCallInterface roomId={roomId!} onCallEnd={handleCallEnd} />
    </div>
  )
}
