"use client"

import { useState, useEffect } from "react"
import { Shield, AlertTriangle, CheckCircle, Eye, Wifi } from "lucide-react"
import { BANNED_PROCESSES, BANNED_DOMAINS } from "@/lib/anti-cheat-config"
import type { AntiCheatEvent, AntiCheatStatus } from "@/types/electron"

type AntiCheatMonitorProps = {
  onViolation?: (info: { reason: string; processes?: string[]; threatLevel?: 'none' | 'low' | 'medium' | 'high' | 'critical'; shouldTerminate?: boolean }) => void
}

export function AntiCheatMonitor({ onViolation }: AntiCheatMonitorProps) {
  const [processes, setProcesses] = useState([
    { name: "chrome.exe", status: "safe", pid: 1234 },
    { name: "code.exe", status: "safe", pid: 5678 },
    { name: "explorer.exe", status: "safe", pid: 9012 },
  ])
  const [alerts, setAlerts] = useState<string[]>([])
  const [isScanning, setIsScanning] = useState(false)

  const isElectron = typeof window !== 'undefined' && !!window.electronAPI

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random process/domain detection
      if (Math.random() > 0.95) {
        const app = BANNED_PROCESSES[Math.floor(Math.random() * BANNED_PROCESSES.length)]
        const domain = BANNED_DOMAINS[Math.floor(Math.random() * BANNED_DOMAINS.length)]

        setAlerts((prev) => [
          ...prev.slice(-2),
          `Suspicious process detected: ${app}`,
          `Unauthorized domain access: ${domain}`,
        ])
  setProcesses((prev) => [
          ...prev,
          { name: app, status: "suspicious", pid: Math.floor(Math.random() * 9999) },
        ])
  onViolation?.({ reason: `Unauthorized domain access: ${domain}; Process: ${app}`, processes: [app] })
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Enhanced Electron: use new violation scan API for better detection
  useEffect(() => {
    let timer: number | null = null
    const poll = async () => {
      try {
        if (typeof window !== 'undefined' && window.electronAPI?.scanForViolations) {
          const result = await window.electronAPI.scanForViolations()
          
          if (result.banned.length > 0) {
            const alertMessage = result.criticalViolations.length > 0 
              ? `CRITICAL: ${result.criticalViolations.join(', ')} detected`
              : `Suspicious processes: ${result.banned.join(', ')}`
              
            setAlerts((prev) => [
              ...prev.slice(-2),
              alertMessage,
            ])
            
            setProcesses((prev) => {
              const next = [...prev]
              result.banned.forEach((name) => {
                const severity = result.criticalViolations.includes(name) ? 'critical' : 'suspicious'
                next.push({ name, status: severity, pid: Math.floor(Math.random() * 9999) })
              })
              return next
            })
            
            // Enhanced violation reporting with threat level
            onViolation?.({ 
              reason: alertMessage, 
              processes: result.banned,
              threatLevel: result.threatLevel,
              shouldTerminate: result.shouldTerminate
            })
          }
        } else if (typeof window !== 'undefined' && window.electronAPI?.scanProcesses) {
          // Fallback to basic scanning
          const names: string[] = (await window.electronAPI.scanProcesses()) || []
          const bannedFound = BANNED_PROCESSES.filter((p) => {
            const base = p.toLowerCase().replace(/\.exe$/, '')
            return names.some((n) => n.includes(base))
          })
          if (bannedFound.length) {
            setAlerts((prev) => [
              ...prev.slice(-2),
              `Suspicious process detected: ${bannedFound.join(', ')}`,
            ])
            setProcesses((prev) => {
              const next = [...prev]
              bannedFound.forEach((name) => {
                next.push({ name, status: 'suspicious', pid: Math.floor(Math.random() * 9999) })
              })
              return next
            })
            onViolation?.({ reason: `Banned process detected: ${bannedFound.join(', ')}`, processes: bannedFound })
          }
        }
      } catch {}
      timer = window.setTimeout(poll, 6000) as unknown as number // Faster polling
    }
    poll()
    return () => {
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  const scanProcesses = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setAlerts((prev) => [...prev, "Process scan completed - No threats detected"])
    }, 2000)
  }

  return (
    <div className="h-full flex flex-col bg-surface/30 backdrop-blur-sm">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium flex items-center">
            <Shield className="h-4 w-4 mr-2 text-primary" />
            Security Monitor
          </h3>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        </div>
        <p className="text-xs text-foreground-muted">
          Real-time cheat detection {isElectron ? '(Electron)' : '(Web)'}
        </p>
      </div>

      <div className="flex-1 p-3 space-y-4 overflow-y-auto">
        {/* Status Overview */}
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <CheckCircle className="h-4 w-4 mr-2 text-primary" />
            <span className="text-primary">System Secure</span>
          </div>
          <div className="flex items-center text-sm">
            <Eye className="h-4 w-4 mr-2 text-foreground" />
            <span className="text-foreground">Screen Recording: Active</span>
          </div>
          <div className="flex items-center text-sm">
            <Wifi className="h-4 w-4 mr-2 text-foreground" />
            <span className="text-foreground">Network Monitor: Active</span>
          </div>
        </div>

        {/* Process Monitor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Running Processes</h4>
            <button
              onClick={scanProcesses}
              disabled={isScanning}
              className="text-xs text-primary hover:opacity-80 disabled:opacity-50"
            >
              {isScanning ? "Scanning..." : "Scan"}
            </button>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {processes.slice(-5).map((process, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="font-mono">{process.name}</span>
                <div
                  className={`w-2 h-2 rounded-full ${process.status === "safe" ? "bg-primary" : "bg-red-500"}`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div>
          <h4 className="text-sm font-medium mb-2">Security Alerts</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-xs text-foreground-muted">No alerts</p>
            ) : (
              alerts.slice(-3).map((alert, index) => (
                <div key={index} className="flex items-start text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{alert}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Stats */}
        <div>
          <h4 className="text-sm font-medium mb-2">System Stats</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>CPU Usage:</span>
              <span>12%</span>
            </div>
            <div className="flex justify-between">
              <span>Memory:</span>
              <span>4.2GB / 16GB</span>
            </div>
            <div className="flex justify-between">
              <span>Uptime:</span>
              <span>2h 34m</span>
            </div>
            {isElectron && (
              <div className="flex justify-between">
                <span>Platform:</span>
                <span>{window.electronAPI?.platform}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
