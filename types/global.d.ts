// Global TypeScript declarations for Electron API

interface AntiCheatEvent {
  type: 'focus_lost' | 'clipboard_paste' | 'suspicious_process' | 'screen_share_requested'
  timestamp: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  data?: any
}

interface AntiCheatStatus {
  isActive: boolean
  sessionId: string | null
  suspiciousActivityCount: number
  riskLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'
  lastEvent?: AntiCheatEvent
}

interface ElectronAPI {
  // Core platform info
  platform?: string
  versions?: Record<string, string>

  // Anti-cheat session management
  startAntiCheatSession: (candidateName: string, interviewId: string) => void
  startAntiCheatSessionWith: (candidateName: string, interviewId: string, options?: { role?: string; testStarted?: boolean }) => void
  markTestStarted: () => void
  setUserRole: (role: string) => void
  endAntiCheatSession: () => void
  getAntiCheatStatus: () => Promise<AntiCheatStatus> | AntiCheatStatus
  getRecentEvents: (limit?: number) => Promise<AntiCheatEvent[]> | AntiCheatEvent[]

  // Scanning
  scanProcesses: () => Promise<string[]>
  scanForViolations: () => Promise<{
    banned: string[]
    criticalViolations: string[]
    threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical'
    shouldTerminate: boolean
    timestamp: number
  }>

  // Realtime events
  onAntiCheatEvent: (callback: (event: AntiCheatEvent) => void) => void
  onAntiCheatViolation: (callback: (data: {
    processes: string[]
    criticalViolations: string[]
    highSeverityViolations?: string[]
    threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical'
    shouldTerminate: boolean
  }) => void) => void
  onInterviewTerminated: (callback: (data: any) => void) => void
  removeAntiCheatListener: () => void

  // Screen share (interviewer side)
  startScreenShare: () => Promise<void>

  // Generic / legacy helpers
  openExternal: (url: string) => void
  getSystemInfo: () => Promise<any>
  on: (channel: string, callback: (...args: any[]) => void) => void
  removeAllListeners: (channel: string) => void
  invoke: (channel: string, ...args: any[]) => Promise<any>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
