"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import { useNotification } from "../../contexts/NotificationContext"
import { ParticipantGrid } from "./ParticipantGrid"
import { CallControls } from "./CallControls"
import { WebRTCService } from "../../services/WebRTCService"

interface Participant {
  id: string
  name: string
  role: "candidate" | "interviewer"
  stream?: MediaStream
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  isScreenSharing: boolean
  avatar?: string
}

interface VideoCallInterfaceProps {
  roomId?: string
  onCallEnd?: () => void
}

export function VideoCallInterface({ roomId: propRoomId, onCallEnd }: VideoCallInterfaceProps) {
  const params = useParams<{ roomId: string }>()
  const roomId = propRoomId || params?.roomId
  const router = useRouter()
  const { user } = useAuth()
  const { addNotification } = useNotification()

  // WebRTC and Media States
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [callDuration, setCallDuration] = useState(0)

  // Refs
  const webRTCService = useRef<WebRTCService | null>(null)
  const callStartTime = useRef<Date | null>(null)
  const durationInterval = useRef<number | null>(null)

  // Initialize WebRTC service
  useEffect(() => {
    if (!roomId || !user) return

    webRTCService.current = new WebRTCService(roomId, user)

    // Set up event listeners
    webRTCService.current.on("participantJoined", handleParticipantJoined)
    webRTCService.current.on("participantLeft", handleParticipantLeft)
    webRTCService.current.on("streamReceived", handleStreamReceived)
    webRTCService.current.on("connectionStateChanged", handleConnectionStateChanged)

    return () => {
      webRTCService.current?.disconnect()
      if (durationInterval.current) {
        clearInterval(durationInterval.current)
      }
    }
  }, [roomId, user])

  // Initialize media and join call
  useEffect(() => {
    const initializeCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: { echoCancellation: true, noiseSuppression: true },
        })

        setLocalStream(stream)
        await webRTCService.current?.joinCall(stream)

        callStartTime.current = new Date()
        startDurationTimer()
        setConnectionStatus("connected")

        addNotification({
          type: "success",
          message: "Successfully joined the call",
        })
      } catch (error) {
        console.error("Failed to initialize call:", error)
        addNotification({
          type: "error",
          message: "Failed to access camera/microphone",
        })
        setConnectionStatus("disconnected")
      }
    }

    if (webRTCService.current) {
      initializeCall()
    }
  }, [webRTCService.current])

  const startDurationTimer = () => {
    durationInterval.current = setInterval(() => {
      if (callStartTime.current) {
        const now = new Date()
        const duration = Math.floor((now.getTime() - callStartTime.current.getTime()) / 1000)
        setCallDuration(duration)
      }
    }, 1000)
  }

  const handleParticipantJoined = useCallback(
    (participant: Participant) => {
      setParticipants((prev) => [...prev, participant])
      addNotification({
        type: "info",
        message: `${participant.name} joined the call`,
      })
    },
    [addNotification],
  )

  const handleParticipantLeft = useCallback(
    (participantId: string) => {
      setParticipants((prev) => {
        const participant = prev.find((p) => p.id === participantId)
        if (participant) {
          addNotification({
            type: "info",
            message: `${participant.name} left the call`,
          })
        }
        return prev.filter((p) => p.id !== participantId)
      })
    },
    [addNotification],
  )

  const handleStreamReceived = useCallback((participantId: string, stream: MediaStream) => {
    setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, stream } : p)))
  }, [])

  const handleConnectionStateChanged = useCallback(
    (state: string) => {
      if (state === "connected") {
        setConnectionStatus("connected")
      } else if (state === "disconnected") {
        setConnectionStatus("disconnected")
        addNotification({
          type: "error",
          message: "Connection lost. Attempting to reconnect...",
        })
      }
    },
    [addNotification],
  )

  const toggleVideo = async () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
        await webRTCService.current?.updateMediaState({
          video: videoTrack.enabled,
          audio: isAudioEnabled,
          screenSharing: isScreenSharing,
        })
      }
    }
  }

  const toggleAudio = async () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
        await webRTCService.current?.updateMediaState({
          video: isVideoEnabled,
          audio: audioTrack.enabled,
          screenSharing: isScreenSharing,
        })
      }
    }
  }

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        })

        setScreenStream(screenStream)
        setIsScreenSharing(true)
        await webRTCService.current?.startScreenShare(screenStream)

        // Handle screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          setScreenStream(null)
          setIsScreenSharing(false)
          webRTCService.current?.stopScreenShare()
        }
      } else {
        screenStream?.getTracks().forEach((track) => track.stop())
        setScreenStream(null)
        setIsScreenSharing(false)
        await webRTCService.current?.stopScreenShare()
      }

      await webRTCService.current?.updateMediaState({
        video: isVideoEnabled,
        audio: isAudioEnabled,
        screenSharing: !isScreenSharing,
      })
    } catch (error) {
      console.error("Screen share error:", error)
      addNotification({
        type: "error",
        message: "Failed to start screen sharing",
      })
    }
  }

  const endCall = () => {
    webRTCService.current?.disconnect()
    localStream?.getTracks().forEach((track) => track.stop())
    screenStream?.getTracks().forEach((track) => track.stop())
    if (onCallEnd) {
      onCallEnd()
    } else {
      router.back()
    }
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

  if (!user || !roomId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading call...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-white text-xl font-semibold">CodeVail Interview</h1>
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

      {/* Video Grid */}
      <ParticipantGrid
        participants={participants}
        localStream={localStream}
        screenStream={screenStream}
        currentUser={user}
        isLocalVideoEnabled={isVideoEnabled}
        isLocalAudioEnabled={isAudioEnabled}
        isLocalScreenSharing={isScreenSharing}
      />

      {/* Controls */}
      <CallControls
        isVideoEnabled={isVideoEnabled}
        isAudioEnabled={isAudioEnabled}
        isScreenSharing={isScreenSharing}
        onToggleVideo={toggleVideo}
        onToggleAudio={toggleAudio}
        onToggleScreenShare={toggleScreenShare}
        onEndCall={endCall}
        participantCount={participants.length + 1}
        callDuration={formatDuration(callDuration)}
      />
    </div>
  )
}
