"use client"

import { useState, useEffect } from "react"
import { Shield, AlertTriangle, Eye, Activity, Clock, User, Wifi, Monitor } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface AntiCheatEvent {
  type: string
  timestamp: string
  sessionId: string
  [key: string]: any
}

interface AntiCheatStatus {
  isActive: boolean
  sessionId: string
  eventCount: number
  suspiciousActivity: {
    windowSwitches: number
    suspiciousProcesses: string[]
    clipboardEvents: number
    pasteAttempts: number
  }
  riskLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'
  score: number
}

export function AntiCheatDashboard() {
  const [status, setStatus] = useState<AntiCheatStatus | null>(null)
  const [recentEvents, setRecentEvents] = useState<AntiCheatEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Check if we're in Electron environment
    if (typeof window !== 'undefined' && window.electronAPI) {
      setIsConnected(true)
      
      // Set up real-time event listener
      const handleAntiCheatEvent = (event: AntiCheatEvent) => {
        setRecentEvents(prev => [event, ...prev.slice(0, 9)]) // Keep last 10 events
        updateStatus()
      }
      
      if (window.electronAPI?.onAntiCheatEvent) {
        window.electronAPI.onAntiCheatEvent(handleAntiCheatEvent)
      }

      // Initial status fetch
      updateStatus()

      // Periodic status updates
      const interval = setInterval(updateStatus, 5000)

      return () => {
        clearInterval(interval)
        if (window.electronAPI?.removeAntiCheatListener) {
          window.electronAPI.removeAntiCheatListener()
        }
      }
    }
  }, [])

  const updateStatus = async () => {
    try {
      if (window.electronAPI?.getAntiCheatStatus) {
        const status = await window.electronAPI.getAntiCheatStatus()
        setStatus(status)
      }
      
      if (window.electronAPI?.getRecentEvents) {
        const events = await window.electronAPI.getRecentEvents(10)
        setRecentEvents(events?.slice(0, 10) || [])
      }
    } catch (error) {
      console.error('Failed to fetch anti-cheat status:', error)
    }
  }

  const startSession = async (candidateName: string, interviewId: string) => {
    try {
      if (window.electronAPI?.startAntiCheatSession) {
        await window.electronAPI.startAntiCheatSession(candidateName, interviewId)
        updateStatus()
      }
    } catch (error) {
      console.error('Failed to start anti-cheat session:', error)
    }
  }

  const endSession = async () => {
    try {
      if (window.electronAPI?.endAntiCheatSession) {
        await window.electronAPI.endAntiCheatSession()
        updateStatus()
      }
    } catch (error) {
      console.error('Failed to end anti-cheat session:', error)
    }
  }

  const startScreenShare = async () => {
    try {
      if (window.electronAPI?.startScreenShare) {
        await window.electronAPI.startScreenShare()
      }
    } catch (error) {
      console.error('Failed to start screen share:', error)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'bg-red-500'
      case 'MEDIUM': return 'bg-yellow-500'
      case 'LOW': return 'bg-blue-500'
      default: return 'bg-green-500'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'WINDOW_LOST_FOCUS': return <Eye className="h-4 w-4" />
      case 'WINDOW_REGAINED_FOCUS': return <Eye className="h-4 w-4" />
      case 'SUSPICIOUS_PROCESS': return <AlertTriangle className="h-4 w-4" />
      case 'CLIPBOARD_CHANGE': return <Activity className="h-4 w-4" />
      case 'LARGE_PASTE_DETECTED': return <AlertTriangle className="h-4 w-4" />
      case 'SCREEN_SHARE_STARTED': return <Monitor className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'SUSPICIOUS_PROCESS': return 'text-red-500'
      case 'LARGE_PASTE_DETECTED': return 'text-orange-500'
      case 'WINDOW_LOST_FOCUS': return 'text-yellow-500'
      default: return 'text-blue-500'
    }
  }

  if (!isConnected) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Anti-Cheat Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Wifi className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Anti-cheat monitoring requires Electron environment
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Session Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Anti-Cheat Monitoring
            </div>
            <div className="flex gap-2">
              {!status?.isActive && (
                <button
                  onClick={() => startSession("Test Candidate", `interview_${Date.now()}`)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                >
                  Start Session
                </button>
              )}
              {status?.isActive && (
                <button
                  onClick={endSession}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  End Session
                </button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {status?.isActive ? 'ACTIVE' : 'INACTIVE'}
              </div>
              <p className="text-sm text-muted-foreground">Session Status</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{status?.eventCount || 0}</div>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{status?.score || 0}</div>
              <p className="text-sm text-muted-foreground">Risk Score</p>
            </div>
            <div className="text-center">
              <Badge className={`${getRiskColor(status?.riskLevel || 'NONE')} text-white`}>
                {status?.riskLevel || 'NONE'}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">Risk Level</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suspicious Activity Summary */}
      {status?.suspiciousActivity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Suspicious Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-600">
                  {status.suspiciousActivity.windowSwitches}
                </div>
                <p className="text-sm text-muted-foreground">Window Switches</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">
                  {status.suspiciousActivity.suspiciousProcesses.length}
                </div>
                <p className="text-sm text-muted-foreground">Banned Apps</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {status.suspiciousActivity.clipboardEvents}
                </div>
                <p className="text-sm text-muted-foreground">Clipboard Events</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">
                  {status.suspiciousActivity.pasteAttempts}
                </div>
                <p className="text-sm text-muted-foreground">Large Pastes</p>
              </div>
            </div>
            
            {status.suspiciousActivity.suspiciousProcesses.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Detected Banned Applications:</p>
                <div className="flex flex-wrap gap-2">
                  {status.suspiciousActivity.suspiciousProcesses.map((process, index) => (
                    <Badge key={index} variant="destructive">
                      {process}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No events recorded yet
              </p>
            ) : (
              recentEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className={getEventColor(event.type)}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{event.type.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {event.processes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Processes: {event.processes.join(', ')}
                      </p>
                    )}
                    {event.duration && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Duration: {Math.round(event.duration / 1000)}s
                      </p>
                    )}
                    {event.contentLength && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Content length: {event.contentLength} characters
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
