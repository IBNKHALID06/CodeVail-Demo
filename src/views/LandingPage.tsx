"use client"
import { useRouter } from "next/navigation"
import { useTheme } from "../contexts/ThemeContext"
import { Logo } from "../components/Logo"
import { ThemeToggle } from "../components/ThemeToggle"
import { User, Users, ArrowRight, Video, FileText, BarChart3 } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const { theme } = useTheme()

  const handleRoleSelect = (role: "candidate" | "interviewer") => {
    router.push(`/login?role=${role}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <Logo size="lg" />
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Welcome to CodeVail</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-2">
              The modern platform for technical interviews and coding assessments.
            </p>
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
              Choose your role to get started
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Candidate Card */}
            <div
              onClick={() => handleRoleSelect("candidate")}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <User className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">I'm a Candidate</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Take coding tests, join video interviews, and showcase your skills to potential employers.
                </p>
                <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium group-hover:gap-3 gap-2 transition-all duration-300">
                  <span>Get Started</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Interviewer Card */}
            <div
              onClick={() => handleRoleSelect("interviewer")}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">I'm an Interviewer</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create tests, conduct video interviews, and evaluate candidates with powerful analytics tools.
                </p>
                <div className="flex items-center justify-center text-purple-600 dark:text-purple-400 font-medium group-hover:gap-3 gap-2 transition-all duration-300">
                  <span>Get Started</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 text-center">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Video className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Video Interviews</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Conduct face-to-face interviews with HD video quality and screen sharing
                </p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Coding Tests</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Create and take coding assessments with real-time code execution
                </p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Get detailed insights and performance analytics for better decisions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
