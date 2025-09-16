"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { useNotification } from "../contexts/NotificationContext"
import { usePageTransition } from "../../hooks/use-page-transition"
import { Logo } from "../components/Logo"
import { User, Lock, Eye, EyeOff, Mail } from "lucide-react"

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<"candidate" | "interviewer" | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const router = useRouter()
  const { login } = useAuth()
  const { addNotification } = useNotification()
  const { navigateWithLoading } = usePageTransition()

  const handleRoleSelect = (role: "candidate" | "interviewer") => {
    setSelectedRole(role)
    // Pre-fill demo credentials
    if (role === "candidate") {
      setEmail("candidate@codevail.com")
      setPassword("password123")
    } else {
      setEmail("admin@codevail.com")
      setPassword("Admin123")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("LOGIN: Form submitted", { email, password, selectedRole })
    
    if (!selectedRole) {
      console.log("LOGIN: No role selected")
      addNotification({ type: "error", message: "Please select a role first" })
      return
    }

    setIsLoading(true)
    console.log("LOGIN: Calling AuthContext login()")

    try {
      const success = await login({ email, password, role: selectedRole })
      console.log("LOGIN: AuthContext login() returned:", success)
      
      if (success) {
        console.log("LOGIN: Login successful, redirecting...")
        addNotification({ type: "success", message: "Login successful!" })
        
        if (selectedRole === "candidate") {
          console.log("LOGIN: Redirecting to candidate dashboard")
          navigateWithLoading("/candidate-dashboard")
        } else {
          console.log("LOGIN: Redirecting to interviewer dashboard")
          navigateWithLoading("/interviewer-dashboard")
        }
      } else {
        console.log("LOGIN: Invalid credentials")
        addNotification({ type: "error", message: "Invalid credentials" })
      }
    } catch (error) {
      console.error("LOGIN: Error during login", error)
      addNotification({ type: "error", message: "Login failed" })
    } finally {
      console.log("LOGIN: Setting loading to false")
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setSelectedRole(null)
    setEmail("")
    setPassword("")
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {!selectedRole ? (
          // Role Selection
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Logo size="lg" className="justify-center mb-6" />
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to CodeVail</h1>
              <p className="text-purple-200">Choose your role to continue</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelect("candidate")}
                className="w-full p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="text-white" size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg text-white">I'm a Candidate</h3>
                    <p className="text-sm text-purple-200">Take coding tests and join interviews</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect("interviewer")}
                className="w-full p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="text-white" size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg text-white">I'm an Interviewer</h3>
                    <p className="text-sm text-purple-200">Create tests and conduct interviews</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-8 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              <p className="text-xs text-center text-purple-200">
                Demo credentials will be auto-filled after role selection
              </p>
            </div>
          </div>
        ) : (
          // Login Form
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Sign in as {selectedRole}</h2>
                <button onClick={handleBack} className="text-sm text-purple-300 hover:text-white transition-colors">
                  ← Change role
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-purple-300" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md"
                    placeholder="Email ID"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-300 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-purple-200">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-purple-300 hover:text-white transition-colors">
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing in...
                    </div>
                  ) : (
                    "LOGIN"
                  )}
                </button>

                {/* Debug button to test without form */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 text-sm"
                >
                  DEBUG: Direct Login Test
                </button>
              </form>

              <div className="mt-6 p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                <p className="text-xs text-purple-200">
                  <strong>Demo Account:</strong>
                  <br />
                  Email: {selectedRole}@codevail.com
                  <br />
                  Password: password
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
