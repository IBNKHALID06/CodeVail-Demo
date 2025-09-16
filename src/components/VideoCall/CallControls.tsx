"use client"

import { useState } from "react"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  Phone,
  Settings,
  Users,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react"

interface CallControlsProps {
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  isScreenSharing: boolean
  onToggleVideo: () => void
  onToggleAudio: () => void
  onToggleScreenShare: () => void
  onEndCall: () => void
  participantCount: number
  callDuration: string
}

export function CallControls({
  isVideoEnabled,
  isAudioEnabled,
  isScreenSharing,
  onToggleVideo,
  onToggleAudio,
  onToggleScreenShare,
  onEndCall,
  participantCount,
  callDuration,
}: CallControlsProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showChat, setShowChat] = useState(false)

  return (
    <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Call info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Users size={16} />
            <span className="text-sm">{participantCount}</span>
          </div>
          <div className="text-gray-300 text-sm font-mono">{callDuration}</div>
        </div>

        {/* Center - Main controls */}
        <div className="flex items-center gap-3">
          {/* Audio Toggle */}
          <button
            onClick={onToggleAudio}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              isAudioEnabled ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
          >
            {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={onToggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              isVideoEnabled ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
          >
            {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Screen Share Toggle */}
          <button
            onClick={onToggleScreenShare}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              isScreenSharing ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
            title={isScreenSharing ? "Stop sharing" : "Share screen"}
          >
            {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
          </button>

          {/* End Call */}
          <button
            onClick={onEndCall}
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
            onClick={() => setShowChat(!showChat)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
              showChat ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
            title="Toggle chat"
          >
            <MessageSquare size={18} />
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
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
            <button onClick={onToggleScreenShare} className="ml-2 text-blue-200 hover:text-white transition-colors">
              Stop sharing
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
