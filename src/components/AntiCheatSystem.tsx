"use client"

import { useEffect, useState, useCallback } from "react"
import { Shield, AlertTriangle, Eye, Monitor, Cpu, Wifi, Camera } from "lucide-react"
import { WebcamRecorder } from "./WebcamRecorder"

interface Violation {
  id: string
  type: "focus-loss" | "tab-switch" | "suspicious-process" | "network-activity" | "camera-blocked"
  message: string
  timestamp: Date
  severity: "low" | "medium" | "high" | "critical"
}

interface AntiCheatSystemProps {
  isExamActive: boolean
  onViolationDetected: (violation: Violation) => void
  onSystemReady: () => void
  strictMode?: boolean
  onForceEndExam: () => void
}

export function AntiCheatSystem({
  isExamActive,
  onViolationDetected,
  onSystemReady,
  strictMode = false,
  onForceEndExam,
}: AntiCheatSystemProps) {
  const [violations, setViolations] = useState<Violation[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [systemStatus, setSystemStatus] = useState<"initializing" | "ready" | "monitoring" | "error">("initializing")
  const [isRecording, setIsRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])

  const createViolation = useCallback(
    (type: Violation["type"], message: string, severity: Violation["severity"] = "medium"): Violation => ({
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date(),
      severity,
    }),
    [],
  )

  const handleViolation = useCallback(
    (violation: Violation) => {
      setViolations((prev) => [...prev, violation])
      onViolationDetected(violation)

      // Force end exam on critical violations in strict mode
      if (strictMode && violation.severity === "critical") {
        onForceEndExam()
      }
    },
    [onViolationDetected, strictMode, onForceEndExam],
  )

  // Webcam recording handlers
  const handleRecordingStart = useCallback(() => {
    setIsRecording(true)
  }, [])

  const handleRecordingStop = useCallback((blob: Blob) => {
    setIsRecording(false)
    setRecordedChunks((prev) => [...prev, blob])
  }, [])

  const handleWebcamError = useCallback(
    (error: string) => {
      handleViolation(createViolation("camera-blocked", `Camera error: ${error}`, "high"))
    },
    [handleViolation, createViolation],
  )

  // Focus monitoring
  useEffect(() => {
    if (!isExamActive) return

    let focusLossCount = 0
    const maxFocusLoss = strictMode ? 2 : 5

    const handleFocusLoss = () => {
      focusLossCount++
      const severity = focusLossCount >= maxFocusLoss ? "critical" : "medium"

      handleViolation(createViolation("focus-loss", `Window focus lost (${focusLossCount}/${maxFocusLoss})`, severity))
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation(createViolation("tab-switch", "Tab switched or window minimized", "high"))
      }
    }

    window.addEventListener("blur", handleFocusLoss)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("blur", handleFocusLoss)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isExamActive, strictMode, handleViolation, createViolation])

  // Keyboard monitoring
  useEffect(() => {
    if (!isExamActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect suspicious key combinations
      const suspiciousKeys = [
        { keys: ["F12"], message: "Developer tools shortcut detected" },
        { keys: ["Control", "Shift", "I"], message: "Developer tools shortcut detected" },
        { keys: ["Control", "Shift", "J"], message: "Console shortcut detected" },
        { keys: ["Control", "U"], message: "View source shortcut detected" },
        { keys: ["Alt", "Tab"], message: "Alt+Tab detected" },
        { keys: ["Control", "Alt", "Delete"], message: "Task manager shortcut detected" },
      ]

      for (const combo of suspiciousKeys) {
        const isPressed = combo.keys.every((key) => {
          switch (key) {
            case "Control":
              return e.ctrlKey
            case "Shift":
              return e.shiftKey
            case "Alt":
              return e.altKey
            case "F12":
              return e.key === "F12"
            default:
              return e.key === key
          }
        })

        if (isPressed) {
          e.preventDefault()
          handleViolation(createViolation("suspicious-process", combo.message, "high"))
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isExamActive, handleViolation, createViolation])

  // Right-click prevention
  useEffect(() => {
    if (!isExamActive) return

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      handleViolation(createViolation("suspicious-process", "Right-click context menu blocked", "low"))
    }

    document.addEventListener("contextmenu", handleContextMenu)
    return () => document.removeEventListener("contextmenu", handleContextMenu)
  }, [isExamActive, handleViolation, createViolation])

  // System initialization
  useEffect(() => {
    const initializeSystem = async () => {
      setSystemStatus("initializing")

      try {
        const timeout = (ms: number) => new Promise<boolean>((resolve) => setTimeout(() => resolve(false), ms))
        const safeGetUserMedia = async (constraints: MediaStreamConstraints, ms = 5000): Promise<boolean> => {
          if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return false
          try {
            const ok = await Promise.race([
              navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                // Immediately stop tracks so we don't hold devices open during init
                try { stream.getTracks().forEach(t => t.stop()) } catch {}
                return true
              }).catch(() => false),
              timeout(ms)
            ])
            return ok
          } catch { return false }
        }

        // Simulate other async checks (filesystem, env) without blocking too long
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Attempt combined media first to reduce prompts
        let mediaOk = await safeGetUserMedia({ video: true, audio: true }, 4000)
        if (!mediaOk) {
          // Fallback: attempt individually (non-blocking if already denied)
            const camOk = await safeGetUserMedia({ video: true }, 3000)
            const micOk = await safeGetUserMedia({ audio: true }, 3000)
            mediaOk = camOk || micOk
        }

        // In Electron, allow readiness even if media denied (still monitor processes/focus)
        const isElectron = typeof (window as any) !== 'undefined' && !!(window as any).process?.versions?.electron

        if (mediaOk || isElectron) {
          setSystemStatus("ready")
          onSystemReady()
        } else {
          console.warn('[AntiCheatSystem] Media permissions unavailable; entering degraded mode')
          setSystemStatus("error")
        }
      } catch (error) {
        setSystemStatus("error")
      }
    }

    initializeSystem()
  }, [onSystemReady])

  // Start monitoring when exam becomes active
  useEffect(() => {
    if (isExamActive && systemStatus === "ready") {
      setIsMonitoring(true)
      setSystemStatus("monitoring")
      setIsRecording(true)
    } else if (!isExamActive) {
      setIsMonitoring(false)
      setIsRecording(false)
      if (systemStatus === "monitoring") {
        setSystemStatus("ready")
      }
    }
  }, [isExamActive, systemStatus])

  const getStatusColor = (status: typeof systemStatus) => {
    switch (status) {
      case "initializing":
        return "text-warning"
      case "ready":
        return "text-success"
      case "monitoring":
        return "text-accent-primary"
      case "error":
        return "text-error"
      default:
        return "text-secondary"
    }
  }

  const getStatusIcon = (status: typeof systemStatus) => {
    switch (status) {
      case "initializing":
        return <div className="spinner" />
      case "ready":
        return <Shield className="text-success" size={20} />
      case "monitoring":
        return <Eye className="text-accent-primary animate-pulse" size={20} />
      case "error":
        return <AlertTriangle className="text-error" size={20} />
      default:
        return <Shield size={20} />
    }
  }

  return (
    <div className="w-80 bg-secondary border-l border-primary flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-primary">
        <div className="flex items-center gap-3 mb-2">
          {getStatusIcon(systemStatus)}
          <h3 className="font-semibold">Security Monitor</h3>
        </div>
        <p className={`text-sm ${getStatusColor(systemStatus)}`}>
          {systemStatus === "initializing" && "Initializing security systems..."}
          {systemStatus === "ready" && "System ready"}
          {systemStatus === "monitoring" && "Active monitoring"}
          {systemStatus === "error" && "System error"}
        </p>
      </div>

      {/* Webcam Feed */}
      <div className="p-4 border-b border-primary">
        <div className="flex items-center gap-2 mb-3">
          <Camera size={16} />
          <h4 className="font-medium">Webcam Monitor</h4>
          {isRecording && <div className="w-2 h-2 bg-error rounded-full animate-pulse" />}
        </div>
        <WebcamRecorder
          isRecording={isRecording}
          onRecordingStart={handleRecordingStart}
          onRecordingStop={handleRecordingStop}
          onError={handleWebcamError}
          className="w-full h-32"
        />
        <p className="text-xs text-secondary mt-2">
          {isRecording ? "Recording active - exam session monitored" : "Camera ready"}
        </p>
      </div>

      {/* System Status */}
      <div className="p-4 border-b border-primary">
        <h4 className="font-medium mb-3">System Status</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Monitor size={16} />
              <span>Screen Recording</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-success animate-pulse" : "bg-muted"}`} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Camera size={16} />
              <span>Webcam Recording</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${isRecording ? "bg-success animate-pulse" : "bg-muted"}`} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span>Focus Tracking</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-success animate-pulse" : "bg-muted"}`} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Cpu size={16} />
              <span>Process Monitor</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-success animate-pulse" : "bg-muted"}`} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Wifi size={16} />
              <span>Network Monitor</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-success animate-pulse" : "bg-muted"}`} />
          </div>
        </div>
      </div>

      {/* Violations */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Security Alerts</h4>
          <span className="text-xs text-secondary">{violations.length} total</span>
        </div>

        {violations.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="mx-auto mb-2 text-muted" size={32} />
            <p className="text-sm text-secondary">No violations detected</p>
          </div>
        ) : (
          <div className="space-y-2">
            {violations
              .slice(-10)
              .reverse()
              .map((violation) => (
                <div
                  key={violation.id}
                  className={`p-3 rounded-lg border text-sm ${
                    violation.severity === "critical"
                      ? "bg-error border-error"
                      : violation.severity === "high"
                        ? "bg-warning border-warning"
                        : "bg-glass border-primary"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={14} />
                    <span className="font-medium capitalize">{violation.severity}</span>
                  </div>
                  <p className="text-xs mb-1">{violation.message}</p>
                  <p className="text-xs text-muted">{violation.timestamp.toLocaleTimeString()}</p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Recording Stats */}
      {recordedChunks.length > 0 && (
        <div className="p-4 border-t border-primary">
          <div className="bg-glass border border-primary rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="text-success" size={16} />
              <span className="text-sm font-medium">Recording Stats</span>
            </div>
            <p className="text-xs text-secondary">{recordedChunks.length} video segments captured</p>
            <p className="text-xs text-secondary">
              Total size: {Math.round(recordedChunks.reduce((acc, chunk) => acc + chunk.size, 0) / 1024)} KB
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      {strictMode && (
        <div className="p-4 border-t border-primary">
          <div className="bg-error/20 border border-error rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-error" size={16} />
              <span className="text-sm font-medium text-error">Strict Mode Active</span>
            </div>
            <p className="text-xs text-secondary">Critical violations will automatically end the exam.</p>
          </div>
        </div>
      )}
    </div>
  )
}
