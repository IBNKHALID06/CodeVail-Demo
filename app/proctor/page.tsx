'use client'

import { useState, useEffect } from 'react'
import { ProctorDashboard } from '@/components/proctor/proctor-dashboard'
import { SessionDetail } from '@/components/proctor/session-detail'
import { WindowTitleBar } from '@/components/window-title-bar'

export type CandidateSession = {
  id: string
  candidateName: string
  candidateEmail: string
  title: string
  codeSnippet: string
  solution: string
  language: string
  startTime: string
  duration: number
  status: 'active' | 'completed' | 'flagged' | 'paused'
  securityAlerts: SecurityAlert[]
  screenRecording: boolean
  lastActivity: string
  progress: number
  testsPassed: number
  totalTests: number
}

export type SecurityAlert = {
  id: string
  type: 'process' | 'network' | 'screen' | 'behavior'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: string
  resolved: boolean
}

export default function ProctorApp() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [sessions, setSessions] = useState<CandidateSession[]>([])
  const [isMaximized, setIsMaximized] = useState(true)

  useEffect(() => {
    // Simulate live session data
    const mockSessions: CandidateSession[] = [
      {
        id: '1',
        candidateName: 'Alice Johnson',
        candidateEmail: 'alice.johnson@email.com',
        title: 'Two Sum Algorithm Challenge',
        codeSnippet: 'function twoSum(nums, target) { /* TODO */ }',
        solution: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n}',
        language: 'javascript',
        startTime: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        duration: 1800,
        status: 'active',
        securityAlerts: [
          {
            id: '1',
            type: 'process',
            severity: 'medium',
            message: 'Suspicious process detected: chrome.exe accessing stackoverflow.com',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            resolved: false
          }
        ],
        screenRecording: true,
        lastActivity: new Date(Date.now() - 30000).toISOString(),
        progress: 75,
        testsPassed: 2,
        totalTests: 3
      },
      {
        id: '2',
        candidateName: 'Bob Smith',
        candidateEmail: 'bob.smith@email.com',
        title: 'Binary Tree Traversal',
        codeSnippet: 'class TreeNode { /* implementation */ }',
        solution: 'function inorderTraversal(root) {\n  // Implementation in progress\n}',
        language: 'javascript',
        startTime: new Date(Date.now() - 2700000).toISOString(), // 45 minutes ago
        duration: 2700,
        status: 'flagged',
        securityAlerts: [
          {
            id: '2',
            type: 'network',
            severity: 'high',
            message: 'Unauthorized network access to chatgpt.com',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            resolved: false
          },
          {
            id: '3',
            type: 'process',
            severity: 'critical',
            message: 'Cluely.exe process detected and terminated',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            resolved: true
          }
        ],
        screenRecording: true,
        lastActivity: new Date(Date.now() - 120000).toISOString(),
        progress: 45,
        testsPassed: 1,
        totalTests: 4
      },
      {
        id: '3',
        candidateName: 'Carol Davis',
        candidateEmail: 'carol.davis@email.com',
        title: 'Array Sorting Challenge',
        codeSnippet: 'def quicksort(arr): # TODO',
        solution: 'def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)',
        language: 'python',
        startTime: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
        duration: 900,
        status: 'active',
        securityAlerts: [],
        screenRecording: true,
        lastActivity: new Date(Date.now() - 10000).toISOString(),
        progress: 90,
        testsPassed: 3,
        totalTests: 3
      }
    ]

    setSessions(mockSessions)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setSessions(prev => prev.map(session => {
        if (session.status === 'active') {
          return {
            ...session,
            duration: session.duration + 1,
            lastActivity: Math.random() > 0.7 ? new Date().toISOString() : session.lastActivity,
            progress: Math.min(100, session.progress + (Math.random() > 0.8 ? 1 : 0))
          }
        }
        return session
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId)
  }

  const handleBackToDashboard = () => {
    setSelectedSession(null)
  }

  const selectedSessionData = sessions.find(s => s.id === selectedSession)

  return (
    <div className={`h-screen w-full bg-background text-foreground overflow-hidden transition-all duration-300 ${
      isMaximized ? '' : 'rounded-lg border border-border shadow-2xl'
    }`}>
      <WindowTitleBar 
        isMaximized={isMaximized}
        onMaximize={() => setIsMaximized(!isMaximized)}
        onMinimize={() => {}}
        onClose={() => {}}
        title="CodeVail Proctor Dashboard"
      />

  <div className="h-[calc(100vh-32px)]">
        {!selectedSession ? (
          <ProctorDashboard 
            sessions={sessions}
            onSessionSelect={handleSessionSelect}
          />
        ) : selectedSessionData ? (
          <SessionDetail 
            session={selectedSessionData}
            onBack={handleBackToDashboard}
          />
        ) : null}
      </div>
    </div>
  )
}
