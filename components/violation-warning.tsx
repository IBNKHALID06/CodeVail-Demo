'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X, Shield, Clock } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ViolationData {
  processes: string[]
  criticalViolations: string[]
  highSeverityViolations: string[]
  threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical'
  shouldTerminate: boolean
}

interface ViolationWarningProps {
  onDismiss?: () => void
}

export function ViolationWarning({ onDismiss }: ViolationWarningProps) {
  const [violations, setViolations] = useState<ViolationData[]>([])
  const [currentViolation, setCurrentViolation] = useState<ViolationData | null>(null)
  const [showTerminationScreen, setShowTerminationScreen] = useState(false)
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Listen for violation events from Electron
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.onAntiCheatViolation((data: ViolationData) => {
        console.log('[ViolationWarning] Received violation:', data)
        setViolations(prev => [...prev, data])
        setCurrentViolation(data)

        // Show termination screen for critical violations
        if (data.shouldTerminate) {
          setShowTerminationScreen(true)
          setCountdown(10)
        }
      })

      // Listen for interview termination events
      (window as any).electronAPI.onInterviewTerminated((data: any) => {
        console.log('[ViolationWarning] Interview terminated:', data)
        setShowTerminationScreen(true)
        setCountdown(3) // Shorter countdown for immediate termination
      })

      return () => {
        (window as any).electronAPI.removeAntiCheatListener()
      }
    }
  }, [])

  useEffect(() => {
    // Countdown timer for termination screen
    if (showTerminationScreen && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (showTerminationScreen && countdown === 0) {
      // Force close interview
      window.location.href = '/interview-terminated'
    }
  }, [showTerminationScreen, countdown])

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'warning'
      default: return 'secondary'
    }
  }

  const getThreatIcon = (level: string) => {
    switch (level) {
      case 'critical': return <Shield className="h-4 w-4" />
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'medium': return <AlertTriangle className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  if (showTerminationScreen) {
    return (
      <div className="fixed inset-0 bg-red-600 z-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 text-center">
          <div className="text-red-600 mb-4">
            <Shield className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Interview Session Terminated
          </h1>
          <p className="text-gray-700 mb-4">
            Your interview session has been terminated due to critical security violations. 
            The interviewer has been automatically notified.
          </p>
          
          {currentViolation && (
            <div className="bg-red-50 p-3 rounded-lg mb-4 text-left">
              <h3 className="font-semibold text-red-800 mb-2">Violations Detected:</h3>
              <div className="space-y-3">
                {currentViolation.criticalViolations.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-red-700 mb-1">Critical Applications:</p>
                    <div className="flex flex-wrap gap-1">
                      {currentViolation.criticalViolations.map((process, idx) => (
                        <Badge key={idx} variant="destructive" className="text-xs">
                          {process}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {currentViolation.highSeverityViolations.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-red-700 mb-1">High Severity:</p>
                    <div className="flex flex-wrap gap-1">
                      {currentViolation.highSeverityViolations.map((process, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-red-300">
                          {process}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {currentViolation.processes.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-red-700 mb-1">All Detected Prohibited Processes:</p>
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                      {currentViolation.processes.map((p, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px]">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center mb-4 text-red-600">
            <Clock className="h-5 w-5 mr-2" />
            <span className="text-lg font-mono">{countdown}s</span>
          </div>
          
          <p className="text-sm text-gray-600">
            Redirecting in {countdown} seconds...
          </p>
        </div>
      </div>
    )
  }

  if (!currentViolation || violations.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-40 max-w-md">
      <Alert variant={getThreatColor(currentViolation.threatLevel) as any} className="border-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2 flex-1">
            {getThreatIcon(currentViolation.threatLevel)}
            <div className="flex-1">
              <AlertDescription>
                <div className="font-semibold mb-2">
                  {currentViolation.threatLevel === 'critical' && 'Critical Security Violation'}
                  {currentViolation.threatLevel === 'high' && 'High Severity Violation'}
                  {currentViolation.threatLevel === 'medium' && 'Security Warning'}
                </div>
                
                <div className="space-y-2">
                  {currentViolation.criticalViolations.length > 0 && (
                    <div>
                      <p className="text-sm font-medium">Critical violations:</p>
                      <div className="flex flex-wrap gap-1">
                        {currentViolation.criticalViolations.map((process, idx) => (
                          <Badge key={idx} variant="destructive" className="text-xs">
                            {process}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentViolation.highSeverityViolations.length > 0 && (
                    <div>
                      <p className="text-sm font-medium">High severity:</p>
                      <div className="flex flex-wrap gap-1">
                        {currentViolation.highSeverityViolations.map((process, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {process}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentViolation.shouldTerminate && (
                    <p className="text-sm font-bold">
                      Interview session will be terminated and interviewer notified due to critical violations.
                    </p>
                  )}
                </div>
              </AlertDescription>
            </div>
          </div>
          
          {onDismiss && !currentViolation.shouldTerminate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDismiss()
                setCurrentViolation(null)
              }}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Alert>
    </div>
  )
}
