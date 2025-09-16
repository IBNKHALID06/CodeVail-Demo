"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Eye, Clock, Calendar, Code2 } from "lucide-react"
import type { InterviewSession } from "@/app/main-app/page"

interface HistoryWindowProps {
  sessions: InterviewSession[]
  onBack: () => void
  onViewSession: (session: InterviewSession) => void
}

export function HistoryWindow({ sessions, onBack, onViewSession }: HistoryWindowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${secs}s`
  }

  const getLanguageColor = (language: string) => {
    const colors = {
      javascript: "bg-yellow-900 text-yellow-300",
      python: "bg-blue-900 text-blue-300",
      java: "bg-orange-900 text-orange-300",
      cpp: "bg-purple-900 text-purple-300",
      csharp: "bg-green-900 text-green-300",
    }
    return colors[language as keyof typeof colors] || "bg-gray-900 text-gray-300"
  }

  return (
    <div className="h-full flex flex-col p-6 bg-gradient-surface">
  <div className="flex items-center mb-6 border-b border-border pb-4">
        <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-gray-700/50">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <Clock className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Session History</h1>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full">
        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <Code2 className="h-16 w-16 text-foreground-muted mx-auto mb-4" />
            <div className="text-foreground-secondary text-lg mb-4">No coding sessions found</div>
            <p className="text-foreground-muted">Complete your first coding challenge to see session history</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className="bg-surface/30 border-border p-6 backdrop-blur-sm hover:bg-surface/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold mr-3">{session.title}</h3>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(session.language)}`}
                      >
                        {session.language.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-foreground-secondary mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(session.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(session.duration)}
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
                          session.status === "completed"
                            ? "bg-green-900 text-green-300"
                            : "bg-yellow-900 text-yellow-300"
                        }`}
                      >
                        {session.status === "completed" ? "Completed" : "In Progress"}
                      </div>
                    </div>
                    <div className="text-sm text-foreground line-clamp-2 font-mono bg-background-tertiary/30 p-2 rounded">
                      Interview Code: {session.interviewCode}
                    </div>
                  </div>
                  <Button
                    onClick={() => onViewSession(session)}
                    className="ml-4 bg-primary hover:bg-primary-dark text-white"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Review
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
