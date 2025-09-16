"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "../src/contexts/ThemeContext"
import { ThemeToggle } from "../src/components/ThemeToggle"
import { ArrowLeft, Key, Play, Sparkles, CheckCircle, Shield, XCircle } from "lucide-react"

export default function InterviewCode() {
  const router = useRouter()
  const { theme } = useTheme()
  const [interviewCode, setInterviewCode] = useState("")
  const [validationError, setValidationError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCodeInput = (value: string) => {
    const cleanValue = value.replace(/[^A-Z0-9]/g, '').substring(0, 12)
    setInterviewCode(cleanValue)
    setValidationError("")
  }

  const validateAndStart = async () => {
    if (!interviewCode.trim()) {
      setValidationError("Please enter an interview code")
      return
    }

    if (interviewCode.length < 6) {
      setValidationError("Interview code must be at least 6 characters")
      return
    }

    setIsLoading(true)
    
    // Simulate validation
    setTimeout(() => {
      setIsLoading(false)
      // Navigate to interview screen - you can customize this route
      router.push(`/tech-interview/${interviewCode}`)
    }, 1500)
  }

  const setDemoCode = (code: string) => {
    setInterviewCode(code)
    setValidationError("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && interviewCode.trim() && !isLoading) {
      validateAndStart()
    }
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Header */}
      <header className={`relative z-10 border-b ${theme === "dark" ? "bg-gray-800/95 border-gray-700" : "bg-white/95 border-gray-200"} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <ArrowLeft size={20} className={theme === "dark" ? "text-white" : "text-gray-900"} />
              </button>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-blue-500/20" : "bg-blue-500/10"}`}>
                  <Key size={20} className="text-blue-500" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Interview Access
                  </h1>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    Secure authentication required
                  </p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`rounded-2xl border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"} backdrop-blur-sm shadow-xl`}>
          
          {/* Hero Section */}
          <div className="text-center p-8 pb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${theme === "dark" ? "bg-blue-500/20" : "bg-blue-500/10"}`}>
              <Key size={32} className="text-blue-500" />
            </div>
            <h2 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Enter Interview Code
            </h2>
            <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"} max-w-md mx-auto`}>
              Please enter the unique access code provided by your interviewer to begin your secure coding assessment.
            </p>
          </div>

          {/* Input Section */}
          <div className="px-8 pb-8">
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  value={interviewCode}
                  onChange={(e) => handleCodeInput(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  className={`w-full px-6 py-4 text-xl font-mono text-center rounded-xl border-2 transition-all ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } focus:outline-none focus:ring-4 focus:ring-blue-500/20`}
                  placeholder="ENTER CODE HERE"
                  maxLength={12}
                />
                
                {validationError && (
                  <div className="mt-3 flex items-center space-x-2 text-red-500">
                    <XCircle size={16} />
                    <span className="text-sm">{validationError}</span>
                  </div>
                )}
              </div>

              <button
                onClick={validateAndStart}
                disabled={!interviewCode.trim() || isLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center space-x-3 ${
                  !interviewCode.trim() || isLoading
                    ? theme === "dark" 
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Validating Code...</span>
                  </>
                ) : (
                  <>
                    <span>Start Interview</span>
                    <Play size={20} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Demo Section */}
          <div className={`mx-8 mb-8 p-6 rounded-xl ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"}`}>
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles size={16} className="text-amber-500" />
              <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Demo Codes
              </span>
            </div>
            <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              For demonstration purposes, try one of these codes:
            </p>
            <div className="flex flex-wrap gap-2">
              {['TECH2024', 'INTERVIEW123', 'CODING456'].map((code) => (
                <button
                  key={code}
                  onClick={() => setDemoCode(code)}
                  className={`px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                    theme === "dark"
                      ? "bg-gray-600 hover:bg-gray-500 text-white"
                      : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-200"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Security Badge */}
          <div className={`mx-8 mb-8 flex items-center justify-center space-x-3 p-4 rounded-xl ${theme === "dark" ? "bg-green-500/10" : "bg-green-50"}`}>
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} className="text-green-500" />
              <Shield size={16} className="text-green-500" />
            </div>
            <span className={`text-sm font-medium ${theme === "dark" ? "text-green-400" : "text-green-700"}`}>
              Secure connection established
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
