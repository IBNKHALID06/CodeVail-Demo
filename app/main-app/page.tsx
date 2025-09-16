"use client"

import { useState, useEffect } from "react"
import { HomeWindow } from "@/components/home-window"
import { InterviewCodeWindow } from "@/components/interview-code-window"
import { LeetCodeInterview } from "@/components/leetcode-interview"
import { HistoryWindow } from "@/components/history-window"
import { WindowTitleBar } from "@/components/window-title-bar"

export type InterviewSession = {
  id: string
  interviewCode: string
  title: string
  codeSnippet: string
  solution: string
  language: string
  date: string
  duration: number
  status: "completed" | "in-progress"
}

export type AppView = "home" | "interview-code" | "coding" | "history"

export default function MainAppPage() {
  const [currentView, setCurrentView] = useState<AppView>("home")
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null)
  const [sessions, setSessions] = useState<InterviewSession[]>([])
  const [isMaximized, setIsMaximized] = useState(true)

  useEffect(() => {
    // Load sessions from localStorage on mount
    const savedSessions = localStorage.getItem("codevail-sessions")
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions))
    }
  }, [])

  const saveSession = (session: InterviewSession) => {
    const updatedSessions = [...sessions.filter((s) => s.id !== session.id), session]
    setSessions(updatedSessions)
    localStorage.setItem("codevail-sessions", JSON.stringify(updatedSessions))
  }

  const startInterview = (interviewCode: string) => {
    const newSession: InterviewSession = {
      id: Date.now().toString(),
      interviewCode,
      title: "LeetCode Interview",
      codeSnippet: "",
      solution: "",
      language: "javascript",
      date: new Date().toISOString(),
      duration: 0,
      status: "in-progress",
    }
    setCurrentSession(newSession)
    setCurrentView("coding")
  }

  const endInterview = (session: InterviewSession) => {
    const completedSession = { ...session, status: "completed" as const }
    try { saveSession(completedSession) } catch {}
    setCurrentSession(null)
    setCurrentView("home")
  }

  const viewSession = (session: InterviewSession) => {
    setCurrentSession(session)
    setCurrentView("coding")
  }

  return (
    <div
      className={`h-screen w-full bg-[#1a1f2e] text-white overflow-hidden transition-all duration-300 ${
        isMaximized ? "" : "rounded-lg border border-gray-700 shadow-2xl"
      }`}
    >
      <WindowTitleBar
        isMaximized={isMaximized}
        onMaximize={() => setIsMaximized(!isMaximized)}
        onMinimize={() => {}}
        onClose={() => {}}
      />

      <div className="h-[calc(100vh-32px)]">
        {currentView === "home" && (
          <HomeWindow
            onEnterCode={() => setCurrentView("interview-code")}
            onViewHistory={() => setCurrentView("history")}
          />
        )}

        {currentView === "interview-code" && (
          <InterviewCodeWindow onBack={() => setCurrentView("home")} onStartInterview={startInterview} />
        )}

        {currentView === "coding" && currentSession && (
          <LeetCodeInterview
            interviewCode={currentSession.interviewCode}
            onBack={() => setCurrentView("home")}
            onEndInterview={() => endInterview(currentSession)}
          />
        )}

        {currentView === "history" && (
          <HistoryWindow sessions={sessions} onBack={() => setCurrentView("home")} onViewSession={viewSession} />
        )}
      </div>
    </div>
  )
}
