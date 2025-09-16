"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Square, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react"
import type { InterviewSession } from "@/app/main-app/page"
import { MonacoCodeEditor } from "@/components/monaco-code-editor"
import { Timer } from "@/components/timer"
import { AntiCheatMonitor } from "@/components/anti-cheat-monitor"
import { FullScreenLoader } from "@/components/full-screen-loader"
import { addResult } from "@/lib/results-store"

interface CodingEnvironmentProps {
  session: InterviewSession
  onUpdateSession: (session: InterviewSession) => void
  onEndInterview: (session: InterviewSession) => void
  isReadOnly?: boolean
}

export function CodingEnvironment({
  session,
  onUpdateSession,
  onEndInterview,
  isReadOnly = false,
}: CodingEnvironmentProps) {
  const [isSnippetCollapsed, setIsSnippetCollapsed] = useState(false)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [startTime] = useState(Date.now())
  const [showMonitor, setShowMonitor] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    // Simulate page-level loading like startup splash
    const t = setTimeout(() => setPageLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!isReadOnly) {
      intervalRef.current = window.setInterval(() => {
        const duration = Math.floor((Date.now() - startTime) / 1000)
        onUpdateSession({ ...session, duration })
      }, 1000)
    }

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [session, onUpdateSession, startTime, isReadOnly])

  const handleCodeChange = (code: string) => {
    if (!isReadOnly) {
      onUpdateSession({ ...session, solution: code })
    }
  }

  const handleRunCode = () => {
    setIsRunning(true)
  setOutput("🔄 Compiling and running code...\n")

    // Simulate code execution with more realistic output
  setTimeout(() => {
      setOutput(`> Running ${session.language} code...
> Compilation successful
> 
> Test Case 1: PASSED
> Input: [2,7,11,15], target: 9
> Output: [0,1]
> Expected: [0,1] ✓
> 
> Test Case 2: PASSED  
> Input: [3,2,4], target: 6
> Output: [1,2]
> Expected: [1,2] ✓
> 
> Test Case 3: PASSED
> Input: [3,3], target: 6  
> Output: [0,1]
> Expected: [0,1] ✓
> 
> All tests passed! ✅
> Execution time: 0.045s
> Memory usage: 2.1MB`)
      setIsRunning(false)
    }, 1200)
  }

  const handleEndInterview = () => {
    const finalDuration = Math.floor((Date.now() - startTime) / 1000)
    onEndInterview({ ...session, duration: finalDuration })
  }

  const handleViolation = (info: { reason: string; processes?: string[] }) => {
  if ((window as any).__cvTerminated) return
  ;(window as any).__cvTerminated = true
    // Record terminated result; then end session
    try {
      const now = new Date().toISOString()
      addResult({
        id: `${session.id}-${now}`,
        version: "1.0 (1)",
        duration: Math.max(1, Math.round(session.duration / 60)) || 1,
        status: "TERMINATED",
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        timestamp: now,
        details: { language: session.language, difficulty: "", category: "Coding" },
        isFlagged: true,
        cheatReason: info.reason,
      })
    } catch {}
    handleEndInterview()
  }

  return (
    <div className="h-full flex flex-col bg-gradient-surface">
  {/* Background anti-cheat scanning (UI hidden) */}
  <div className="sr-only">
    <AntiCheatMonitor onViolation={handleViolation} />
  </div>
  {pageLoading && <FullScreenLoader message="Preparing coding environment..." />}
      {/* Header */}
  <div className="flex items-center justify-between p-4 border-b border-border bg-surface/30 backdrop-blur-sm">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => onEndInterview(session)} className="mr-4 hover:bg-gray-700/50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{session.title}</h1>
            <p className="text-sm text-foreground-muted capitalize">{session.language} Challenge</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Timer duration={session.duration} />
          {/* Monitor toggle removed in test-taking to reduce camera issues */}
          {!isReadOnly && (
            <Button
              onClick={handleEndInterview}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10 bg-transparent"
            >
              <Square className="mr-2 h-4 w-4" />
              End Session
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Code Snippet Panel */}
  <div className={`${isSnippetCollapsed ? "w-8" : "w-1/3"} border-r border-border transition-all duration-300`}>
          {isSnippetCollapsed ? (
            <div className="h-full flex items-center justify-center">
              <Button variant="ghost" size="sm" onClick={() => setIsSnippetCollapsed(false)} className="rotate-90">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-border bg-surface/20">
                <h3 className="font-medium">Challenge Code</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsSnippetCollapsed(true)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-foreground-secondary leading-relaxed font-mono">
                  {session.codeSnippet}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Main Coding Area */}
        <div className="flex-1 flex flex-col">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-border bg-surface/20">
              <h3 className="font-medium">Your Solution</h3>
              <Button
                onClick={handleRunCode}
                disabled={isRunning || isReadOnly}
                className="bg-primary hover:bg-primary-dark disabled:opacity-50"
                data-testid="run-code-button"
              >
                <Play className="mr-2 h-4 w-4" />
                {isRunning ? "Running..." : "Run Code"}
              </Button>
            </div>
            <div className="flex-1 relative">
              {isRunning && <FullScreenLoader message="Compiling and running your code..." />}
              <MonacoCodeEditor
                value={session.solution}
                onChange={handleCodeChange}
                readOnly={isReadOnly}
                language={session.language}
                theme="vs-dark"
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="h-48 border-t border-border">
            <div className="p-3 border-b border-border bg-surface/20">
              <h3 className="font-medium">Console Output</h3>
            </div>
            <div className="h-full p-4 bg-background-tertiary/50 overflow-y-auto">
              <pre className="text-sm text-foreground font-mono whitespace-pre-wrap">
                {output ||
                  "// Console output will appear here when you run your code\n// Use Ctrl+Enter to run code quickly"}
              </pre>
            </div>
          </div>
        </div>

        {/* Anti-Cheat Monitor */}
  {/* Camera monitor UI hidden during test-taking to avoid interference */}
      </div>
    </div>
  )
}
