// Global type declarations for Electron API
declare global {
  interface Window {
    electronAPI?: {
      platform?: string;
      versions?: any;
      
      // Process scanning
      scanProcesses?: () => Promise<string[]>;
      scanForViolations?: () => Promise<{
        banned: string[];
        criticalViolations: string[];
        threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
        shouldTerminate: boolean;
        timestamp: number;
      }>;
      
      // Anti-cheat session management
      startAntiCheatSession?: (candidateName: string, interviewId: string) => void;
      startAntiCheatSessionWith?: (candidateName: string, interviewId: string, options?: { role?: string; testStarted?: boolean }) => void;
      setUserRole?: (role: string) => void;
      markTestStarted?: () => void;
      endAntiCheatSession?: () => void;
      getAntiCheatStatus?: () => AntiCheatStatus;
      getRecentEvents?: (limit: number) => AntiCheatEvent[];
      
      // Real-time monitoring
      onAntiCheatEvent?: (callback: (event: AntiCheatEvent) => void) => void;
      onAntiCheatViolation?: (callback: (data: { processes: string[]; criticalViolations: string[]; threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical'; shouldTerminate: boolean }) => void) => void;
      onInterviewTerminated?: (callback: (data: any) => void) => void;
      removeAntiCheatListener?: () => void;
      
      // Screen sharing
      startScreenShare?: () => Promise<string | null>;
    };
  }
}

export interface AntiCheatEvent {
  type: string;
  timestamp: string;
  sessionId: string;
  [key: string]: any;
}

export interface AntiCheatStatus {
  isActive: boolean;
  sessionId: string;
  eventCount: number;
  suspiciousActivityCount?: number;
  suspiciousActivity: {
    windowSwitches: number;
    suspiciousProcesses: string[];
    clipboardEvents: number;
    pasteAttempts: number;
  };
  riskLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  score: number;
  lastEvent?: AntiCheatEvent;
}

export {};
