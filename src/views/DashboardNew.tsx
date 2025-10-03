"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { ThemeToggle } from "../components/ThemeToggle"
import { Calendar, Clock, Code, Trophy, Play, History, User, LogOut, Shield, ChevronRight } from "lucide-react"

interface Interview {
  id: string
  title: string
  company: string
  scheduledAt: Date
  duration: number
  difficulty: "Easy" | "Medium" | "Hard"
  status: "upcoming" | "in-progress" | "completed"
}

export default function DashboardNew() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [interviews, setInterviews] = useState<Interview[]>([])

  useEffect(() => {
    // Mock data
    const mockInterviews: Interview[] = [
      {
        id: "1",
        title: "Frontend Developer Assessment",
        company: "TechCorp Inc.",
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: 90,
        difficulty: "Medium",
        status: "upcoming",
      },
      {
        id: "2",
        title: "Algorithm Challenge",
        company: "StartupXYZ",
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        duration: 60,
        difficulty: "Hard",
        status: "upcoming",
      },
      {
        id: "3",
        title: "System Design Interview",
        company: "BigTech Corp",
        scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        duration: 120,
        difficulty: "Easy",
        status: "completed",
      },
    ]
    setInterviews(mockInterviews)
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-success bg-success"
      case "medium":
        return "text-warning bg-warning"
      case "hard":
        return "text-error bg-error"
      default:
        return "text-secondary bg-glass"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "text-accent-primary bg-glass border-accent"
      case "in-progress":
        return "text-warning bg-warning border-warning"
      case "completed":
        return "text-success bg-success border-success"
      default:
        return "text-secondary bg-glass border-primary"
    }
  }

  const formatTimeUntil = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()

    if (diff < 0) return "Past"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }

    return `${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-secondary border-b border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={16} />
              </div>
              <h1 className="text-xl font-bold">CodeVail</h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-glass rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-secondary">{user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-glass-hover rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(" ")[0]}!</h2>
          <p className="text-secondary">Ready for your next coding challenge?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-primary/20 rounded-lg flex items-center justify-center">
                <Calendar className="text-accent-primary" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{interviews.filter((i) => i.status === "upcoming").length}</p>
                <p className="text-sm text-secondary">Upcoming</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <Trophy className="text-success" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{interviews.filter((i) => i.status === "completed").length}</p>
                <p className="text-sm text-secondary">Completed</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <Clock className="text-warning" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{interviews.reduce((acc, i) => acc + i.duration, 0)}</p>
                <p className="text-sm text-secondary">Total Minutes</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-secondary/20 rounded-lg flex items-center justify-center">
                <Code className="text-accent-secondary" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-secondary">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Interviews */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Upcoming Interviews</h3>
                <button onClick={() => router.push("/results")} className="btn-secondary text-sm">
                  <History size={16} />
                  View History
                </button>
              </div>

              <div className="space-y-4">
                {interviews
                  .filter((interview) => interview.status === "upcoming")
                  .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
                  .map((interview) => (
                    <div
                      key={interview.id}
                      className="p-4 bg-glass border border-primary rounded-lg hover:border-accent transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{interview.title}</h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(interview.difficulty)}`}
                            >
                              {interview.difficulty}
                            </span>
                          </div>

                          <p className="text-sm text-secondary mb-2">{interview.company}</p>

                          <div className="flex items-center gap-4 text-sm text-secondary">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{interview.scheduledAt.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{interview.duration} minutes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-accent-primary font-medium">
                                Starts in {formatTimeUntil(interview.scheduledAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button onClick={() => router.push(`/interview/${interview.id}`)} className="btn-primary ml-4">
                          <Play size={16} />
                          Start
                        </button>
                      </div>
                    </div>
                  ))}

                {interviews.filter((i) => i.status === "upcoming").length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto mb-4 text-muted" size={48} />
                    <h4 className="text-lg font-medium mb-2">No upcoming interviews</h4>
                    <p className="text-secondary">Check back later for new interview assignments.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {interviews
                  .filter((i) => i.status === "completed")
                  .slice(0, 3)
                  .map((interview) => (
                    <div key={interview.id} className="flex items-center gap-3 p-3 bg-glass rounded-lg">
                      <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                        <Trophy className="text-success" size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{interview.title}</p>
                        <p className="text-xs text-secondary">{interview.company}</p>
                      </div>
                      <ChevronRight size={16} className="text-muted" />
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/results")}
                  className="w-full p-3 bg-glass hover:bg-glass-hover border border-primary rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <History size={20} />
                    <div>
                      <p className="font-medium">View Results</p>
                      <p className="text-xs text-secondary">Check your interview history</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/call/demo")}
                  className="w-full p-3 bg-glass hover:bg-glass-hover border border-primary rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Code size={20} />
                    <div>
                      <p className="font-medium">Practice Session</p>
                      <p className="text-xs text-secondary">Test your setup</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Camera Access</span>
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Microphone Access</span>
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Network Connection</span>
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
