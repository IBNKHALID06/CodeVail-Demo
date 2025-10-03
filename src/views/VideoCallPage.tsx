"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useNotification } from "../contexts/NotificationContext"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  Phone,
  MessageSquare,
  Users,
  Settings,
  MoreHorizontal,
  Send,
  StickyNote,
} from "lucide-react"

interface Participant {
  id: string
  name: string
  role: "candidate" | "interviewer"
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  isScreenSharing: boolean
  avatar?: string
}

export default function VideoCallPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addNotification } = useNotification()

  // Video call states
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [callDuration, setCallDuration] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")

  // UI states
  const [showChat, setShowChat] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [notes, setNotes] = useState("")
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: string; message: string; timestamp: Date }>
  >([])

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const screenShareRef = useRef<HTMLVideoElement>(null)
  const callStartTime = useRef<Date>(new Date())

  useEffect(() => {
    // Initialize call
    initializeCall()

    // Start duration timer
    const interval = setInterval(() => {
      const now = new Date()
      const duration = Math.floor((now.getTime() - callStartTime.current.getTime()) / 1000)
      setCallDuration(duration)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: { echoCancellation: true, noiseSuppression: true },
      })

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Simulate connecting to other participants
      setTimeout(() => {
        setConnectionStatus("connected")
        setParticipants([
          {
            id: "remote-1",
            name: user?.role === "candidate" ? "Sarah Johnson (Interviewer)" : "John Doe (Candidate)",
            role: user?.role === "candidate" ? "interviewer" : "candidate",
            isVideoEnabled: true,
            isAudioEnabled: true,
            isScreenSharing: false,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.role === "candidate" ? "sarah" : "john"}`,
          },
        ])

        addNotification({
          type: "success",
          message: "Successfully connected to the call",
        })
      }, 2000)
    } catch (error) {
      console.error("Failed to initialize call:", error)
      setConnectionStatus("disconnected")
      addNotification({
        type: "error",
        message: "Failed to access camera/microphone",
      })
    }
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
    // In real implementation, this would update the video track
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
    // In real implementation, this would update the audio track
  }

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: "screen" },
          audio: true,
        })

        if (screenShareRef.current) {
          screenShareRef.current.srcObject = screenStream
        }

        setIsScreenSharing(true)

        // Handle screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false)
        }

        addNotification({
          type: "info",
          message: "Screen sharing started",
        })
      } catch (error) {
        addNotification({
          type: "error",
          message: "Failed to start screen sharing",
        })
      }
    } else {
      setIsScreenSharing(false)
      if (screenShareRef.current?.srcObject) {
        const stream = screenShareRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: user?.name || "You",
        message: chatMessage,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, newMessage])
      setChatMessage("")
    }
  }

  const endCall = () => {
    // Clean up media streams
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }

    if (screenShareRef.current?.srcObject) {
      const stream = screenShareRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }

    addNotification({
      type: "info",
      message: "Call ended",
    })

    navigate("/dashboard")
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-white text-xl font-semibold">
              Interview with {participants[0]?.name || "Participant"}
            </h1>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-green-500"
                    : connectionStatus === "connecting"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              ></div>
              <span className="text-gray-300 text-sm capitalize">{connectionStatus}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-gray-300 text-sm">
              Room: <span className="font-mono text-blue-400">{roomId}</span>
            </div>
            <div className="text-gray-300 text-sm">
              Duration: <span className="font-mono">{formatDuration(callDuration)}</span>
            </div>
            <div className="text-gray-300 text-sm">
              Participants: <span className="text-white">{participants.length + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Screen Share */}
          {isScreenSharing && (
            <div className="absolute inset-4 bg-black rounded-lg overflow-hidden z-10">
              <video ref={screenShareRef} autoPlay playsInline className="w-full h-full object-contain" />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded text-white text-sm">
                Your Screen Share
              </div>
            </div>
          )}

          {/* Video Grid */}
          <div className={`p-4 h-full ${isScreenSharing ? "opacity-20" : ""}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Local Video */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                {isVideoEnabled ? (
                  <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded text-white text-sm">
                  {user?.name} (You)
                </div>
                <div className="absolute bottom-4 right-4 flex gap-1">
                  {!isAudioEnabled && (
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                      <MicOff className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Remote Video */}
              {participants.map((participant) => (
                <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden">
                  {participant.isVideoEnabled ? (
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded text-white text-sm">
                    {participant.name}
                    {participant.role === "interviewer" && <span className="ml-1 text-yellow-400">👑</span>}
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-1">
                    {!participant.isAudioEnabled && (
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <MicOff className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {(showChat || showNotes) && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowChat(true)
                    setShowNotes(false)
                  }}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    showChat ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Chat
                </button>
                {user?.role === "interviewer" && (
                  <button
                    onClick={() => {
                      setShowChat(false)
                      setShowNotes(true)
                    }}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      showNotes ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Notes
                  </button>
                )}
              </div>
            </div>

            {/* Chat Panel */}
            {showChat && (
              <>
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-3">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white">{message.sender}</span>
                          <span className="text-xs text-gray-400">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{message.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendChatMessage}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Notes Panel */}
            {showNotes && user?.role === "interviewer" && (
              <div className="flex-1 p-4">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take notes during the interview..."
                  className="w-full h-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Call info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Users size={16} />
              <span className="text-sm">{participants.length + 1}</span>
            </div>
            <div className="text-gray-300 text-sm font-mono">{formatDuration(callDuration)}</div>
          </div>

          {/* Center - Main controls */}
          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                isAudioEnabled ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
              }`}
              title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
            >
              {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                isVideoEnabled ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
              }`}
              title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
            >
              {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            {/* Screen Share Toggle */}
            <button
              onClick={toggleScreenShare}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                isScreenSharing
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
              title={isScreenSharing ? "Stop sharing" : "Share screen"}
            >
              {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
            </button>

            {/* End Call */}
            <button
              onClick={endCall}
              className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all duration-200"
              title="End call"
            >
              <Phone size={20} className="rotate-[135deg]" />
            </button>
          </div>

          {/* Right side - Additional controls */}
          <div className="flex items-center gap-3">
            {/* Chat Toggle */}
            <button
              onClick={() => {
                setShowChat(!showChat)
                setShowNotes(false)
              }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                showChat ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
              title="Toggle chat"
            >
              <MessageSquare size={18} />
            </button>

            {/* Notes Toggle (Interviewer only) */}
            {user?.role === "interviewer" && (
              <button
                onClick={() => {
                  setShowNotes(!showNotes)
                  setShowChat(false)
                }}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  showNotes ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
                title="Toggle notes"
              >
                <StickyNote size={18} />
              </button>
            )}

            {/* Settings */}
            <button
              className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-all duration-200"
              title="Settings"
            >
              <Settings size={18} />
            </button>

            {/* More Options */}
            <button
              className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-all duration-200"
              title="More options"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Screen sharing indicator */}
        {isScreenSharing && (
          <div className="mt-3 flex items-center justify-center">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <Monitor size={16} />
              <span>You are sharing your screen</span>
              <button onClick={toggleScreenShare} className="ml-2 text-blue-200 hover:text-white transition-colors">
                Stop sharing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
