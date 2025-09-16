"use client"

import type React from "react"

import { useRef, useEffect } from "react"

interface Participant {
  id: string
  name: string
  role: "candidate" | "interviewer"
  stream?: MediaStream
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  isScreenSharing: boolean
}

interface ParticipantGridProps {
  participants: Participant[]
  localStream: MediaStream | null
  screenStream: MediaStream | null
  currentUser: any
  isLocalVideoEnabled: boolean
  isLocalAudioEnabled: boolean
  isLocalScreenSharing: boolean
}

export function ParticipantGrid({
  participants,
  localStream,
  screenStream,
  currentUser,
  isLocalVideoEnabled,
  isLocalAudioEnabled,
  isLocalScreenSharing,
}: ParticipantGridProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const screenShareRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (screenShareRef.current && screenStream) {
      screenShareRef.current.srcObject = screenStream
    }
  }, [screenStream])

  const getGridClass = () => {
    const totalParticipants = participants.length + 1 // +1 for local user

    if (totalParticipants === 1) return "grid-cols-1"
    if (totalParticipants === 2) return "grid-cols-2"
    if (totalParticipants <= 4) return "grid-cols-2 grid-rows-2"
    if (totalParticipants <= 6) return "grid-cols-3 grid-rows-2"
    return "grid-cols-4 grid-rows-2"
  }

  return (
    <div className="flex-1 p-4">
      {/* Screen Share Display */}
      {(isLocalScreenSharing || participants.some((p) => p.isScreenSharing)) && (
        <div className="mb-4 bg-black rounded-lg overflow-hidden aspect-video">
          {isLocalScreenSharing ? (
            <>
              <video ref={screenShareRef} autoPlay playsInline className="w-full h-full object-contain" />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                Screen Share - {currentUser?.name} (You)
              </div>
            </>
          ) : (
            participants
              .filter((p) => p.isScreenSharing)
              .map((participant) => <RemoteScreenShare key={participant.id} participant={participant} />)
          )}
        </div>
      )}

      {/* Video Grid */}
      <div className={`grid gap-4 h-full ${getGridClass()}`}>
        {/* Local Video */}
        <VideoTile
          ref={localVideoRef}
          name={`${currentUser?.name} (You)`}
          role={currentUser?.role}
          isVideoEnabled={isLocalVideoEnabled}
          isAudioEnabled={isLocalAudioEnabled}
          isScreenSharing={isLocalScreenSharing}
          isLocal={true}
        />

        {/* Remote Videos */}
        {participants.map((participant) => (
          <RemoteVideoTile key={participant.id} participant={participant} />
        ))}
      </div>
    </div>
  )
}

// Video Tile Component
const VideoTile = ({
  name,
  role,
  isVideoEnabled,
  isAudioEnabled,
  isScreenSharing,
  isLocal = false,
  children,
}: {
  name: string
  role: string
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  isScreenSharing: boolean
  isLocal?: boolean
  children?: React.ReactNode
}) => {
  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden">
      {isVideoEnabled ? (
        children
      ) : (
        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">{name.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Name Label */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
        {name}
        {role === "interviewer" && <span className="ml-1 text-yellow-400">👑</span>}
      </div>

      {/* Status Indicators */}
      <div className="absolute bottom-2 right-2 flex gap-1">
        {!isAudioEnabled && (
          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {isScreenSharing && (
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1h-5v2h3a1 1 0 110 2H6a1 1 0 110-2h3v-2H4a1 1 0 01-1-1V4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}

// Remote Video Tile Component
function RemoteVideoTile({ participant }: { participant: Participant }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream
    }
  }, [participant.stream])

  return (
    <VideoTile
      name={participant.name}
      role={participant.role}
      isVideoEnabled={participant.isVideoEnabled}
      isAudioEnabled={participant.isAudioEnabled}
      isScreenSharing={participant.isScreenSharing}
    >
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
    </VideoTile>
  )
}

// Remote Screen Share Component
function RemoteScreenShare({ participant }: { participant: Participant }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream
    }
  }, [participant.stream])

  return (
    <div className="relative w-full h-full">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
        Screen Share - {participant.name}
      </div>
    </div>
  )
}
