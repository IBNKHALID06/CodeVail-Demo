"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { ThemeToggle } from "./ThemeToggle"
import { Logo } from "./Logo"
import { User, BarChart3, Settings, LogOut, Trophy, Home } from "lucide-react"

interface SidebarProps {
  activeItem?: string
  onItemClick?: (item: string) => void
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      console.log("Logging out user...")
      logout()
      console.log("User logged out, redirecting to login...")
      router.replace("/login")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  const candidateItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, route: "/candidate-dashboard" },
    { id: "profile", label: "Profile", icon: User, route: "/profile" },
    { id: "results", label: "Results", icon: Trophy, route: "/results" },
    { id: "settings", label: "Settings", icon: Settings, route: "/settings" },
  ]

  const interviewerItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, route: "/interviewer-dashboard" },
    { id: "profile", label: "Profile", icon: User, route: "/profile" },
    { id: "analytics", label: "Analytics", icon: BarChart3, route: "/analytics" },
    { id: "settings", label: "Settings", icon: Settings, route: "/settings" },
  ]

  const items = user?.role === "candidate" ? candidateItems : interviewerItems

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map(({ id, label, icon: Icon, route }) => (
            <li key={id}>
              <button
                onClick={() => router.push(route)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeItem === id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={user?.avatar || "/placeholder.svg?height=40&width=40"}
            alt={user?.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
