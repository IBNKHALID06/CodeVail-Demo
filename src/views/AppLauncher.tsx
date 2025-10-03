"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { Logo } from "../components/Logo"
import { ThemeToggle } from "../components/ThemeToggle"
import {
  Video,
  Code,
  FileText,
  BarChart3,
  Settings,
  Calendar,
  MessageSquare,
  Monitor,
  Zap,
  CheckCircle,
} from "lucide-react"

interface AppTile {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  route: string
  category: "primary" | "secondary"
}

export default function AppLauncher() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")

  const apps: AppTile[] = [
    {
      id: "video-call",
      name: "Video Call",
      description: "Start or join video interviews",
      icon: Video,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      route: "/call/new",
      category: "primary",
    },
    {
      id: "code-test",
      name: "Code Test",
      description: "Take coding assessments",
      icon: Code,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      route: "/tech-test/new",
      category: "primary",
    },
    {
      id: "results",
      name: "Test Results",
      description: "View assessment results",
      icon: FileText,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
  route: "/results",
      category: "primary",
    },
    {
      id: "analytics",
      name: "Analytics",
      description: "Performance insights",
      icon: BarChart3,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      route: "/analytics",
      category: "primary",
    },
    {
      id: "calendar",
      name: "Calendar",
      description: "Schedule management",
      icon: Calendar,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      route: "/calendar",
      category: "secondary",
    },
    {
      id: "chat",
      name: "Messages",
      description: "Team communication",
      icon: MessageSquare,
      color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      route: "/messages",
      category: "secondary",
    },
    {
      id: "screen-share",
      name: "Screen Share",
      description: "Share your screen",
      icon: Monitor,
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      route: "/screen-share",
      category: "secondary",
    },
    {
      id: "settings",
      name: "Settings",
      description: "App preferences",
      icon: Settings,
      color: "bg-gradient-to-br from-gray-500 to-gray-600",
      route: "/settings",
      category: "secondary",
    },
  ]

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const primaryApps = filteredApps.filter((app) => app.category === "primary")
  const secondaryApps = filteredApps.filter((app) => app.category === "secondary")

  const handleAppClick = (route: string) => {
    router.push(route)
  }

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* Header */}
      <header
        className={`border-b backdrop-blur-md ${
          theme === "dark" ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />

            <div className="flex items-center gap-4">
              <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{currentTime}</div>
              <ThemeToggle />
              <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{user?.name}</div>
              <button
                onClick={logout}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            What would you like to do today?
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div
          className={`max-w-md mx-auto mb-8 p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm"
              : "bg-white/50 border-gray-200 backdrop-blur-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>System Status</p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  All systems operational
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{currentTime}</p>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Apps Grid */}
        <div className="mb-8">
          <h2
            className={`text-2xl font-semibold mb-6 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            Main Applications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {primaryApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.route)}
                className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  theme === "dark"
                    ? "bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700"
                    : "bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-gray-200"
                }`}
              >
                <div
                  className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <app.icon className="text-white" size={28} />
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {app.name}
                </h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{app.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Apps Grid */}
        {secondaryApps.length > 0 && (
          <div>
            <h2
              className={`text-xl font-semibold mb-6 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              Additional Tools
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {secondaryApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app.route)}
                  className={`group p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                    theme === "dark"
                      ? "bg-gray-800/30 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700"
                      : "bg-white/30 hover:bg-white/60 backdrop-blur-sm border border-gray-200"
                  }`}
                >
                  <div
                    className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <app.icon className="text-white" size={20} />
                  </div>
                  <h3 className={`font-medium text-sm mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {app.name}
                  </h3>
                  <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{app.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredApps.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <Zap className={`${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} size={24} />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              No apps found
            </h3>
            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
