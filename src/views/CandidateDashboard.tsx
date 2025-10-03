"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { useComponentLoading } from "../../hooks/use-page-transition"
import { Sidebar } from "../components/Sidebar"
import { useTheme } from "../contexts/ThemeContext"
import { FileText, Video, Trophy, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function CandidateDashboard() {
  const { user: authUser, isLoading } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()
  const [simpleUser, setSimpleUser] = useState(null)

  // Add loading for dashboard initialization
  useComponentLoading(1500)

  // Check for simple auth on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("simpleAuth")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        console.log("CandidateDashboard: Found simple auth user:", userData)
        setSimpleUser(userData)
      } catch (error) {
        console.error("Error parsing simple auth user:", error)
      }
    }
  }, [])

  // Use either auth system
  const user = authUser || simpleUser

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      console.log("CandidateDashboard: No user found, redirecting to login")
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Show loading or nothing while checking auth
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  // Ensure only candidates can access this dashboard
  if (user.role !== "candidate") {
    console.log("CandidateDashboard: User role is not candidate, redirecting")
    router.push("/login")
    return null
  }

  const handleStartTest = () => {
    router.push("/interview")
  }

  const handleViewResults = () => {
    router.push("/results")
  }

  const handleJoinCall = () => {
    router.push("/call")
  }

  const stats = [
    { label: "Tests Completed", value: "12", icon: CheckCircle, color: "text-green-600" },
    { label: "Average Score", value: "85%", icon: Trophy, color: "text-yellow-600" },
    { label: "Time Spent", value: "24h", icon: Clock, color: "text-blue-600" },
    { label: "Pending Tests", value: "3", icon: AlertCircle, color: "text-orange-600" },
  ]

  const recentTests = [
    { name: "React Developer Assessment", score: 92, status: "completed", date: "2024-01-15" },
    { name: "JavaScript Fundamentals", score: 78, status: "completed", date: "2024-01-12" },
    { name: "Algorithm Challenge", score: 85, status: "completed", date: "2024-01-10" },
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeItem="dashboard" />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your overview.</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700`}>
                    <stat.icon className={`${stat.color} dark:opacity-80`} size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Take Test Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <FileText size={24} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Take Test</h3>
              <p className="text-blue-100 mb-4">Start a new coding assessment or continue where you left off.</p>
              <button 
                onClick={handleStartTest}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Start Test
              </button>
            </div>

            {/* Call Interviewer Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Video size={24} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Call Interviewer</h3>
              <p className="text-green-100 mb-4">Join a video interview or schedule a new session.</p>
              <button 
                onClick={handleJoinCall}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Join Call
              </button>
            </div>

            {/* View Results Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Trophy size={24} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">View Results</h3>
              <p className="text-purple-100 mb-4">Check your test scores and detailed performance analytics.</p>
              <button 
                onClick={handleViewResults}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                View Results
              </button>
            </div>
          </div>

          {/* Recent Tests */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Tests</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentTests.map((test, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{test.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{test.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{test.score}%</span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs font-medium rounded-full">
                          {test.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
