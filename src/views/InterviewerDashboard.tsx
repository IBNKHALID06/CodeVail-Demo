"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { useComponentLoading } from "../../hooks/use-page-transition"
import { AntiCheatDashboard } from "@/components/anti-cheat-dashboard"
import { Sidebar } from "../components/Sidebar"
import { useTheme } from "../contexts/ThemeContext"
import { PlusCircle, Users, Video, BarChart3, TrendingUp, Clock, FileText, Shield } from "lucide-react"

export default function InterviewerDashboard() {
  const { user: authUser, isLoading } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()
  const [simpleUser, setSimpleUser] = useState(null)
  const [activeTab, setActiveTab] = useState<"overview" | "anti-cheat">("overview")

  // Add loading for dashboard initialization
  useComponentLoading(1200)

  // Check for simple auth on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("simpleAuth")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        console.log("InterviewerDashboard: Found simple auth user:", userData)
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
      console.log("InterviewerDashboard: No user found, redirecting to login")
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

  // Ensure only interviewers can access this dashboard
  if (user.role !== "interviewer") {
    console.log("InterviewerDashboard: User role is not interviewer, redirecting")
    router.push("/login")
    return null
  }

  const handleCreateTest = () => {
    router.push("/create-test")
  }

  const handleAssignTest = () => {
    router.push("/assign-test")
  }

  const handleStartInterview = () => {
    router.push("/call/new")
  }

  const handleViewAnalytics = () => {
    router.push("/results")
  }

  const stats = [
    { label: "Active Tests", value: "8", icon: FileText, color: "text-blue-600" },
    { label: "Candidates", value: "24", icon: Users, color: "text-green-600" },
    { label: "Avg Score", value: "78%", icon: TrendingUp, color: "text-purple-600" },
    { label: "This Month", value: "156", icon: Clock, color: "text-orange-600" },
  ]

  const recentActivity = [
    { candidate: "John Doe", test: "React Assessment", score: 92, status: "completed", date: "2024-01-15" },
    { candidate: "Jane Smith", test: "JavaScript Test", score: 78, status: "completed", date: "2024-01-14" },
    { candidate: "Mike Johnson", test: "Algorithm Challenge", score: 85, status: "in-progress", date: "2024-01-14" },
  ]

  // Sample chart data
  const chartData = [
    { month: "Jan", tests: 45, candidates: 32 },
    { month: "Feb", tests: 52, candidates: 41 },
    { month: "Mar", tests: 48, candidates: 38 },
    { month: "Apr", tests: 61, candidates: 47 },
    { month: "May", tests: 55, candidates: 43 },
    { month: "Jun", tests: 67, candidates: 52 },
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeItem="dashboard" />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interviewer Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage tests, candidates, and analytics.</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="mt-4 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("anti-cheat")}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "anti-cheat"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <Shield className="h-4 w-4" />
                Anti-Cheat Monitor
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {activeTab === "overview" && (
            <div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Create Test Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <PlusCircle size={24} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Create Test</h3>
              <p className="text-blue-100 mb-4">Design new coding assessments and technical challenges.</p>
              <button 
                onClick={handleCreateTest}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Create Test
              </button>
            </div>

            {/* Assign Test Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Users size={24} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Assign Test</h3>
              <p className="text-green-100 mb-4">Send tests to candidates and manage assignments.</p>
              <button 
                onClick={handleAssignTest}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Assign Test
              </button>
            </div>

            {/* Make Video Call Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Video size={24} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Make a Video Call</h3>
              <p className="text-purple-100 mb-4">Start video interviews with candidates.</p>
              <button 
                onClick={handleStartInterview}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Start Call
              </button>
            </div>

            {/* View Analytics Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <BarChart3 size={24} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">View Analytics</h3>
              <p className="text-orange-100 mb-4">Analyze performance metrics and insights.</p>
              <button 
                onClick={handleViewAnalytics}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                View Analytics
              </button>
            </div>
          </div>

          {/* Analytics and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Analytics Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Overview</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">{data.month}</span>
                      <div className="flex-1 mx-4">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${(data.tests / 70) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full transition-all duration-300"
                                style={{ width: `${(data.candidates / 55) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-900 dark:text-white font-medium">{data.tests} tests</div>
                        <div className="text-gray-600 dark:text-gray-400">{data.candidates} candidates</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Tests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Candidates</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <Users className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{activity.candidate}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{activity.test}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {activity.status === "completed" ? (
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{activity.score}%</span>
                          ) : (
                            <span className="text-sm text-orange-600 dark:text-orange-400">In Progress</span>
                          )}
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              activity.status === "completed"
                                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                                : "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400"
                            }`}
                          >
                            {activity.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "anti-cheat" && (
        <div className="space-y-6">
          <AntiCheatDashboard />
        </div>
      )}
    </main>
  </div>
</div>
)
}
