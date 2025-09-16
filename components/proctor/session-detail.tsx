import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Video, MessageSquare, AlertTriangle, Shield, Eye, Pause, Play, Square, Send, Camera, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { CandidateSession, SecurityAlert } from '@/app/proctor/page'
import { LiveCodeView } from '@/components/proctor/live-code-view'
import { SecurityMonitor } from '@/components/proctor/security-monitor'

interface SessionDetailProps {
  session: CandidateSession
  onBack: () => void
}

export function SessionDetail({ session, onBack }: SessionDetailProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'security' | 'communication'>('code')
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to the candidate
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900/20'
      case 'flagged': return 'text-red-400 bg-red-900/20'
      case 'paused': return 'text-yellow-400 bg-yellow-900/20'
      case 'completed': return 'text-blue-400 bg-blue-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const unresolvedAlerts = session.securityAlerts.filter(alert => !alert.resolved)

  return (
    <div className="h-full flex flex-col bg-gradient-surface">
      {/* Header */}
  <div className="flex items-center justify-between p-4 border-b border-border bg-surface/30">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mr-4 hover:bg-gray-700/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{session.candidateName}</h1>
            <p className="text-sm text-gray-400">{session.candidateEmail}</p>
          </div>
          <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
            {session.status.toUpperCase()}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="font-mono text-lg font-bold">{formatDuration(session.duration)}</div>
            <div className="text-xs text-gray-400">Session Time</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
              className={isRecording ? 'text-red-400' : 'text-gray-400'}
            >
              <Camera className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className={isMuted ? 'text-red-400' : 'text-green-400'}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={isAudioEnabled ? 'text-green-400' : 'text-gray-400'}
            >
              {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>

          <Button 
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500/10"
          >
            <Square className="mr-2 h-4 w-4" />
            End Session
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-border bg-surface/20">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'code' 
                  ? 'text-primary border-b-2 border-primary bg-surface/30' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="h-4 w-4 mr-2 inline" />
              Live Code View
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'security' 
                  ? 'text-primary border-b-2 border-primary bg-surface/30' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shield className="h-4 w-4 mr-2 inline" />
              Security Monitor
              {unresolvedAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unresolvedAlerts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('communication')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'communication' 
                  ? 'text-primary border-b-2 border-primary bg-surface/30' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare className="h-4 w-4 mr-2 inline" />
              Communication
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'code' && <LiveCodeView session={session} />}
            {activeTab === 'security' && <SecurityMonitor session={session} />}
            {activeTab === 'communication' && (
              <div className="h-full flex flex-col p-6">
                <div className="flex-1 bg-surface/30 rounded-lg p-4 mb-4 overflow-y-auto">
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm">Send a message to communicate with the candidate</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message to the candidate..."
                    className="flex-1 bg-surface/50 border-border focus:border-primary resize-none"
                    rows={3}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-primary hover:bg-primary-dark text-white self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Screen Recording Panel */}
        <div className="w-80 border-l border-border bg-surface/20">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Screen Recording</h3>
              <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
            </div>
            <p className="text-xs text-gray-400">
              {isRecording ? 'Recording candidate screen' : 'Recording paused'}
            </p>
          </div>
          
          <div className="aspect-video bg-background m-4 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Video className="h-12 w-12 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Live Screen Feed</p>
              <p className="text-xs text-gray-600">Candidate's desktop</p>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Session Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{session.progress}%</span>
                </div>
          <div className="w-full bg-background-tertiary rounded-full h-2">
                  <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${session.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Test Results</h4>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Tests Passed:</span>
                  <span className="text-green-400">{session.testsPassed}/{session.totalTests}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Session
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
