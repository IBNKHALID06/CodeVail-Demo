'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { WebRTCService } from '../services/WebRTCService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Separator } from '../../components/ui/separator'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Users, 
  Share, 
  MessageSquare, 
  Settings,
  ArrowLeft,
  Monitor,
  Camera,
  Volume2,
  VolumeX,
  Code,
  FileText,
  Calendar,
  Clock,
  User
} from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'

interface CallParticipant {
  id: string
  name: string
  role: 'interviewer' | 'candidate'
  videoEnabled: boolean
  audioEnabled: boolean
  isPresenting: boolean
  connectionStatus: 'connected' | 'connecting' | 'disconnected'
}

interface CallSettings {
  video: boolean
  audio: boolean
  speaker: boolean
  screenShare: boolean
}

export default function CallPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [callState, setCallState] = useState<'lobby' | 'in-call' | 'ended'>('lobby')
  const [roomId, setRoomId] = useState('')
  const [participants, setParticipants] = useState<CallParticipant[]>([])
  const [localSettings, setLocalSettings] = useState<CallSettings>({
    video: true,
    audio: true,
    speaker: true,
    screenShare: false
  })
  
  const [messages, setMessages] = useState<{id: string, sender: string, message: string, timestamp: string}[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [activeTab, setActiveTab] = useState('video')
  const [callDuration, setCallDuration] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [connectionState, setConnectionState] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected')
  const [sidebarTab, setSidebarTab] = useState<'chat' | 'participants'>('chat')
  const [viewMode, setViewMode] = useState<'gallery' | 'speaker'>('gallery')
  const [pinned, setPinned] = useState<'local' | 'remote' | null>(null)
  const [localSpeaking, setLocalSpeaking] = useState(false)
  const [remoteSpeaking, setRemoteSpeaking] = useState(false)
  const [remoteReady, setRemoteReady] = useState(false)
  
  // Central media streams kept in state so they can be attached to multiple <video> elements
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const callStartTime = useRef<number | null>(null)
  const webrtcRef = useRef<WebRTCService | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const localAnalyserRef = useRef<AnalyserNode | null>(null)
  const remoteAnalyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const searchParams = useSearchParams()

  // Helper function to format role display
  const formatRole = (role: string) => {
    return role === 'interviewer' ? 'Interviewer' : 'Candidate'
  }

  // Helper function to get other participant
  const getOtherParticipant = () => {
    return participants.find(p => p.id !== '1')
  }

  useEffect(() => {
    // Pre-fill room from URL if present
    const rid = searchParams?.get?.('room')
    if (rid && !roomId) setRoomId(rid)
  }, [searchParams, roomId])

  useEffect(() => {
    // Initialize demo participants
    const demoParticipants: CallParticipant[] = [
      {
        id: '1',
        name: user?.name || 'You',
        role: user?.role as 'interviewer' | 'candidate' || 'interviewer',
        videoEnabled: localSettings.video,
        audioEnabled: localSettings.audio,
        isPresenting: false,
        connectionStatus: 'connected'
      }
    ]
    
    if (callState === 'in-call') {
      demoParticipants.push({
        id: '2',
        name: user?.role === 'interviewer' ? 'Alex Johnson' : 'Sarah Miller',
        role: (user?.role as any) === 'interviewer' ? 'candidate' : 'interviewer',
        videoEnabled: true,
        audioEnabled: true,
        isPresenting: false,
        connectionStatus: 'connected'
      })
    }
    
    setParticipants(demoParticipants)
  }, [callState, user, localSettings.video, localSettings.audio])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (callState === 'in-call' && callStartTime.current) {
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime.current!) / 1000))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [callState])

  const handleStartCall = () => {
    const id = roomId.trim() || Math.random().toString(36).substring(2, 15)
    if (!roomId.trim()) setRoomId(id)
    callStartTime.current = Date.now()
    setCallState('in-call')
    initializeMedia(id)
  }

  const handleJoinCall = () => {
    const id = roomId.trim()
    if (!id) {
      alert('Please enter a room ID to join a call')
      return
    }
    callStartTime.current = Date.now()
    setCallState('in-call')
    initializeMedia(id)
  }

  const handleEndCall = () => {
  // Close WebRTC connection and media
  webrtcRef.current?.disconnect()
    setCallState('ended')
    // Cleanup media streams
    localStream?.getTracks().forEach((t) => t.stop())
    remoteStream?.getTracks().forEach((t) => t.stop())
    setTimeout(() => {
      if (user?.role === 'candidate') {
        router.push('/candidate-dashboard')
      } else {
        router.push('/interviewer-dashboard')
      }
    }, 2000)
  }

  const initializeMedia = async (effectiveRoomId?: string) => {
    try {
      let stream = localStream
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: localSettings.video,
          audio: localSettings.audio,
        })
        setLocalStream(stream)
      }

      // Initialize WebRTC when entering call
      const rid = effectiveRoomId || roomId
      if (!webrtcRef.current && rid) {
        const svc = new WebRTCService(rid, user)
        webrtcRef.current = svc
        svc.on('streamReceived', (peerId: string, mediaStream: MediaStream) => {
          if (peerId === 'local-user') return
          setRemoteStream(mediaStream)
          setRemoteReady(true)
        })
        svc.on('connectionStateChanged', (state: 'connected' | 'connecting' | 'disconnected') => {
          setConnectionState(state)
        })
        svc.on('peerLeft', () => {
          setRemoteReady(false)
        })
        svc.on('chat', (msg: any) => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: msg?.user?.name || 'Peer',
              message: msg?.message || '',
              timestamp: new Date().toLocaleTimeString(),
            },
          ])
        })

        await svc.joinCall(stream)
        await svc.updateMediaState({
          video: localSettings.video,
          audio: localSettings.audio,
          screenSharing: localSettings.screenShare,
        })
      }

      // Setup active speaker detection (non-blocking)
      setupAudioAnalysis()
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  // Acquire preview stream in lobby so camera shows before joining
  useEffect(() => {
    if (callState !== 'lobby') return
    let cancelled = false
    const ensurePreview = async () => {
      try {
        if (!localStream) {
          const preview = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          if (!cancelled) setLocalStream(preview)
        }
      } catch (e) {
        console.warn('Preview media not available', e)
      }
    }
    ensurePreview()
    return () => {
      cancelled = true
    }
  }, [callState, localStream])

  const setupAudioAnalysis = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      if (!ctx) return

      // Local analyser
  const ls = localStream || undefined
      if (ls && ls.getAudioTracks().length > 0) {
        const source = ctx.createMediaStreamSource(ls)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        source.connect(analyser)
        localAnalyserRef.current = analyser
      }

      // Remote analyser
  const rs = remoteStream || undefined
      if (rs && rs.getAudioTracks().length > 0) {
        const source = ctx.createMediaStreamSource(rs)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        source.connect(analyser)
        remoteAnalyserRef.current = analyser
      }

      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      const loop = () => {
        const threshold = 20
        if (localAnalyserRef.current) {
          const arr = new Uint8Array(localAnalyserRef.current.frequencyBinCount)
          localAnalyserRef.current.getByteFrequencyData(arr)
          setLocalSpeaking(arr.reduce((a, b) => a + b, 0) / arr.length > threshold)
        }
        if (remoteAnalyserRef.current) {
          const arr = new Uint8Array(remoteAnalyserRef.current.frequencyBinCount)
          remoteAnalyserRef.current.getByteFrequencyData(arr)
          setRemoteSpeaking(arr.reduce((a, b) => a + b, 0) / arr.length > threshold)
        }
        rafRef.current = requestAnimationFrame(loop)
      }
      rafRef.current = requestAnimationFrame(loop)
    } catch {}
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      audioCtxRef.current?.close().catch(() => {})
    }
  }, [])

  const toggleSetting = async (setting: keyof CallSettings) => {
    const next = { ...localSettings, [setting]: !localSettings[setting] }
    setLocalSettings(next)

    // Update local tracks immediately
    if (localStream) {
      if (setting === 'video') {
        const track = localStream.getVideoTracks()[0]
        if (track) track.enabled = next.video
      }
      if (setting === 'audio') {
        const track = localStream.getAudioTracks()[0]
        if (track) track.enabled = next.audio
      }
    }

    // Screen share handling
    if (setting === 'screenShare') {
      if (next.screenShare) {
        try {
          // @ts-ignore: getDisplayMedia exists on mediaDevices
          const screenStream: MediaStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true })
          await webrtcRef.current?.startScreenShare(screenStream)
        } catch (e) {
          console.warn('Screen share failed', e)
        }
      } else {
        await webrtcRef.current?.stopScreenShare()
      }
    }

    await webrtcRef.current?.updateMediaState({
      video: next.video,
      audio: next.audio,
      screenSharing: next.screenShare,
    })
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return
    
    const message = {
      id: Date.now().toString(),
      sender: user?.name || 'You',
      message: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString()
    }
    
    setMessages(prev => [...prev, message])
    webrtcRef.current?.sendChat(newMessage.trim())
    setNewMessage('')
  }

  const copyInviteLink = async () => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : ''
      const id = roomId || Math.random().toString(36).substring(2, 15)
      if (!roomId) {
        setRoomId(id)
        router.replace(`/call?room=${id}`)
      }
      const link = `${base}/call?room=${id}`
      await navigator.clipboard.writeText(link)
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: 'System', message: 'Invite link copied to clipboard', timestamp: new Date().toLocaleTimeString() },
      ])
    } catch {}
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Recompute analysers when streams change
  useEffect(() => {
    if (!audioCtxRef.current) return
    // Reset analysers and rebuild
    localAnalyserRef.current = null
    remoteAnalyserRef.current = null
    setupAudioAnalysis()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStream, remoteStream])

  // Simple reusable video element that attaches a MediaStream
  function MediaVideo({ stream, muted, className }: { stream: MediaStream | null; muted?: boolean; className?: string }) {
    const ref = useRef<HTMLVideoElement>(null)
    useEffect(() => {
      if (ref.current && stream && ref.current.srcObject !== stream) {
        ref.current.srcObject = stream
      }
    }, [stream])
    return (
      <video ref={ref} autoPlay playsInline muted={muted} className={className} />
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  if (callState === 'ended') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Phone className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Call Ended</h2>
            <p className="text-muted-foreground mb-4">
              Call duration: {formatDuration(callDuration)}
            </p>
            <Button onClick={() => {
              if (user?.role === 'candidate') {
                router.push('/candidate-dashboard')
              } else {
                router.push('/interviewer-dashboard')
              }
            }}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (callState === 'lobby') {
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
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Video Interview</h1>
                  <p className="text-muted-foreground">Start or join a video call</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video Preview */}
            <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  Camera Preview
                </CardTitle>
                <CardDescription>Test your camera and microphone before joining the interview</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden aspect-video mb-6 shadow-lg">
                  <MediaVideo stream={localStream} muted className="w-full h-full object-cover" />
                  {!localSettings.video && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <div className="text-center text-gray-300">
                        <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Camera is off</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 flex gap-3">
                    <Button
                      size="sm"
                      variant={localSettings.video ? "default" : "destructive"}
                      onClick={() => toggleSetting('video')}
                      className="shadow-lg"
                    >
                      {localSettings.video ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant={localSettings.audio ? "default" : "destructive"}
                      onClick={() => toggleSetting('audio')}
                      className="shadow-lg"
                    >
                      {localSettings.audio ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="text-white text-sm font-medium">{user?.name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${localSettings.video ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <Camera className={`w-4 h-4 ${localSettings.video ? 'text-green-600' : 'text-red-600'}`} />
                    <div>
                      <div className="text-sm font-medium">Camera</div>
                      <div className={`text-xs ${localSettings.video ? 'text-green-600' : 'text-red-600'}`}>
                        {localSettings.video ? "Ready" : "Disabled"}
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${localSettings.audio ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <Mic className={`w-4 h-4 ${localSettings.audio ? 'text-green-600' : 'text-red-600'}`} />
                    <div>
                      <div className="text-sm font-medium">Microphone</div>
                      <div className={`text-xs ${localSettings.audio ? 'text-green-600' : 'text-red-600'}`}>
                        {localSettings.audio ? "Ready" : "Disabled"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Join/Start Call */}
            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Join Interview
                </CardTitle>
                <CardDescription>Enter room details to start or join the video interview</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="roomId" className="text-sm font-medium">Room ID (Optional)</Label>
                  <Input
                    id="roomId"
                    placeholder="Enter room ID to join existing interview"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="h-12 text-lg"
                  />
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Leave empty to create a new room automatically
                  </p>
                </div>

                <Separator />

                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <Button 
                      onClick={handleStartCall} 
                      className="h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                    >
                      <Video className="w-5 h-5 mr-3" />
                      {roomId.trim() ? 'Join Interview Room' : 'Start New Interview'}
                    </Button>
                    {roomId.trim() && (
                      <Button 
                        onClick={handleJoinCall} 
                        variant="outline" 
                        className="h-12 text-base border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Join as Participant
                      </Button>
                    )}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Interview Ready Checklist
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                      <li>✓ Camera and microphone are working</li>
                      <li>✓ Stable internet connection</li>
                      <li>✓ Quiet, well-lit environment</li>
                      <li>✓ Close unnecessary applications</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // In-call interface
  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Call Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">Live Interview</span>
            </div>
            <Badge variant="secondary">Room: {roomId}</Badge>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(callDuration)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-xs px-2 py-1 rounded bg-gray-700">{connectionState}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => copyInviteLink()}>Share Link</Button>
            <Button variant="outline" size="sm" onClick={() => setSidebarTab('participants')}>
              <Users className="w-4 h-4 mr-2" />Participants
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'gallery' ? 'speaker' : 'gallery')}>
              {viewMode === 'gallery' ? 'Speaker View' : 'Gallery View'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                Recording
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Call Interface */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="screen">Screen Share</TabsTrigger>
              <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="h-full space-y-4">
              {viewMode === 'gallery' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                  {/* Local Video */}
                  <div className={`relative bg-gray-800 rounded-lg overflow-hidden border-2 ${localSpeaking ? 'border-green-500' : 'border-transparent'}`}>
                    <MediaVideo stream={localStream} muted className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="secondary">
                        {user?.name || 'You'} ({formatRole(user?.role || 'interviewer')})
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      {!localSettings.video && (
                        <div className="bg-red-500 rounded p-1">
                          <VideoOff className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {!localSettings.audio && (
                        <div className="bg-red-500 rounded p-1">
                          <MicOff className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remote Video */}
                  <div className={`relative bg-gray-800 rounded-lg overflow-hidden border-2 ${remoteSpeaking ? 'border-green-500' : 'border-transparent'}`}>
                    <MediaVideo stream={remoteStream} className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="secondary">
                        {getOtherParticipant()?.name || 'Participant'} ({formatRole(getOtherParticipant()?.role || 'candidate')})
                      </Badge>
                    </div>
                    {!remoteReady && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-gray-300">
                          <User className="w-24 h-24 mx-auto mb-4 opacity-50" />
                          <p>Waiting for participant...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative h-full">
                  {/* Speaker view */}
                  {(() => {
                    const active = pinned || (localSpeaking ? 'local' : remoteSpeaking ? 'remote' : 'remote')
                    const isLocalActive = active === 'local'
                    return (
                      <div className="h-full">
                        <div className="relative w-full h-[calc(100%-120px)] bg-gray-800 rounded-lg overflow-hidden mb-4">
                          <MediaVideo
                            stream={isLocalActive ? localStream : remoteStream}
                            muted={isLocalActive}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 left-4">
                            <Badge variant="secondary">{isLocalActive ? (user?.name || 'You') : (getOtherParticipant()?.name || 'Participant')}</Badge>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
                          <div className="flex gap-3">
                            <div className="relative w-40 h-24 bg-gray-800 rounded overflow-hidden cursor-pointer" onClick={() => setPinned('local')}>
                              <MediaVideo stream={localStream} muted className="w-full h-full object-cover" />
                              <div className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 py-0.5 rounded">You</div>
                            </div>
                            <div className="relative w-40 h-24 bg-gray-800 rounded overflow-hidden cursor-pointer" onClick={() => setPinned('remote')}>
                              <MediaVideo stream={remoteStream} className="w-full h-full object-cover" />
                              <div className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 py-0.5 rounded">Participant</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </TabsContent>

            <TabsContent value="screen" className="h-full">
              <div className="h-full bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-300">
                  <Monitor className="w-24 h-24 mx-auto mb-4 opacity-50" />
                  <p className="mb-4">Screen sharing is not active</p>
                  <Button onClick={() => toggleSetting('screenShare')}>
                    <Share className="w-4 h-4 mr-2" />
                    Start Screen Share
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="whiteboard" className="h-full">
              <div className="h-full bg-white rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <FileText className="w-24 h-24 mx-auto mb-4 opacity-50" />
                  <p className="mb-4">Collaborative whiteboard</p>
                  <Button>
                    <Code className="w-4 h-4 mr-2" />
                    Open Code Editor
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar: Participants / Chat */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center gap-2">
            <button
              className={`px-3 py-1 rounded text-sm ${sidebarTab === 'participants' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
              onClick={() => setSidebarTab('participants')}
            >
              Participants
            </button>
            <button
              className={`px-3 py-1 rounded text-sm ${sidebarTab === 'chat' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
              onClick={() => setSidebarTab('chat')}
            >
              Chat
            </button>
          </div>

          {sidebarTab === 'participants' ? (
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="text-xs text-gray-400 mb-2">{participants.length} in meeting</div>
              {participants.map((p) => (
                <div key={p.id} className="bg-gray-700/60 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white font-medium">{p.name}</div>
                    <div className="text-xs text-gray-300">{formatRole(p.role)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.audioEnabled ? <Mic className="w-4 h-4 text-green-400" /> : <MicOff className="w-4 h-4 text-red-400" />}
                    {p.videoEnabled ? <Video className="w-4 h-4 text-green-400" /> : <VideoOff className="w-4 h-4 text-red-400" />}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{msg.sender}</span>
                      <span className="text-xs text-gray-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300">{msg.message}</p>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No messages yet</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button onClick={sendMessage}>Send</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={localSettings.video ? "default" : "destructive"}
            size="lg"
            onClick={() => toggleSetting('video')}
          >
            {localSettings.video ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>
          
          <Button
            variant={localSettings.audio ? "default" : "destructive"}
            size="lg"
            onClick={() => toggleSetting('audio')}
          >
            {localSettings.audio ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>
          
          <Button
            variant={localSettings.speaker ? "default" : "secondary"}
            size="lg"
            onClick={() => toggleSetting('speaker')}
          >
            {localSettings.speaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => toggleSetting('screenShare')}
          >
            <Share className="w-5 h-5" />
          </Button>
          
          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndCall}
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
