"use client"

import { cn } from "@/lib/utils"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Play, Key, AlertCircle, CheckCircle, Shield, Sparkles } from "lucide-react"

interface InterviewCodeWindowProps {
  onBack: () => void
  onStartInterview: (code: string) => void
}

export function InterviewCodeWindow({ onBack, onStartInterview }: InterviewCodeWindowProps) {
  const [interviewCode, setInterviewCode] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState("")

  const validateCode = (code: string) => {
    const validCodes = ["TECH2024", "INTERVIEW123", "CODING456", "ASSESS789"]
    return validCodes.includes(code.toUpperCase())
  }

  const handleSubmit = async () => {
    if (!interviewCode.trim()) {
      setValidationError("Please enter an interview code")
      return
    }

    setIsValidating(true)
    setValidationError("")

    setTimeout(() => {
      const isValid = validateCode(interviewCode)

      if (isValid) {
        onStartInterview(interviewCode.toUpperCase())
      } else {
        setValidationError("Invalid interview code. Please check and try again.")
      }

      setIsValidating(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isValidating) {
      handleSubmit()
    }
  }

  const demoCode = ["TECH2024", "INTERVIEW123", "CODING456"]

  return (
    <div className="h-full bg-gradient-to-br from-background via-background-secondary to-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgb(var(--codevail-primary)) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgb(var(--codevail-accent)) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative h-full flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-6 p-6 glass-light rounded-b-2xl mx-6 mt-6">
          <Button variant="ghost" onClick={onBack} className="hover:bg-surface-hover transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Key className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Interview Access</h1>
              <p className="text-sm text-foreground-secondary">Secure authentication required</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-lg">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Key className="h-10 w-10 text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 bg-gradient-primary rounded-2xl mx-auto opacity-20 blur-xl" />
              </div>

              <h2 className="text-3xl font-bold text-foreground mb-4">Enter Interview Code</h2>
              <p className="text-foreground-secondary leading-relaxed">
                Please enter the unique access code provided by your interviewer to begin your secure coding assessment.
              </p>
            </div>

            {/* Input Section */}
            <div className="space-y-6 animate-slide-up">
              <div className="relative">
                <Input
                  value={interviewCode}
                  onChange={(e) => {
                    setInterviewCode(e.target.value.toUpperCase())
                    setValidationError("")
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter interview code"
                  className={cn(
                    "h-14 text-center text-lg font-mono tracking-widest",
                    "bg-surface border-border-light focus:border-primary",
                    "transition-all duration-200",
                    validationError && "border-red-500 focus:border-red-500",
                  )}
                  maxLength={12}
                  disabled={isValidating}
                />

                {validationError && (
                  <div className="flex items-center gap-2 mt-3 text-red-400 text-sm animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    {validationError}
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!interviewCode.trim() || isValidating}
                className="w-full h-14 text-lg bg-gradient-primary hover:shadow-xl transition-all duration-300 group"
              >
                {isValidating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Validating Code...
                  </>
                ) : (
                  <>
                    <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Start Interview
                  </>
                )}
              </Button>
            </div>

            {/* Demo Section */}
            <div className="mt-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">Demo Codes</span>
                </div>
                <p className="text-sm text-foreground-secondary mb-4">
                  For demonstration purposes, try one of these codes:
                </p>
                <div className="flex flex-wrap gap-2">
                  {demoCode.map((code) => (
                    <button
                      key={code}
                      onClick={() => setInterviewCode(code)}
                      className="px-3 py-2 bg-surface hover:bg-surface-hover rounded-lg text-sm font-mono transition-colors border border-border-light hover:border-primary"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center justify-center gap-3 glass-light rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <Shield className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground">Secure connection established</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
