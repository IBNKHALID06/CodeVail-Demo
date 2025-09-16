"use client"

import { useState, useEffect } from "react"
import { Loader2, Code, Shield, Zap } from "lucide-react"

export function LoadingPage() {
  const [loadingText, setLoadingText] = useState("Initializing...")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const loadingSteps = [
      { text: "Initializing application...", duration: 800 },
      { text: "Loading components...", duration: 600 },
      { text: "Setting up security monitor...", duration: 700 },
      { text: "Preparing code environment...", duration: 500 },
      { text: "Almost ready...", duration: 400 }
    ]

    let currentStep = 0
    let currentProgress = 0

    const updateLoading = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep]
        setLoadingText(step.text)
        
        const targetProgress = ((currentStep + 1) / loadingSteps.length) * 100
        const progressIncrement = (targetProgress - currentProgress) / 20
        
        const progressInterval = setInterval(() => {
          currentProgress += progressIncrement
          setProgress(Math.min(currentProgress, targetProgress))
          
          if (currentProgress >= targetProgress) {
            clearInterval(progressInterval)
            currentStep++
            
            setTimeout(() => {
              updateLoading()
            }, step.duration)
          }
        }, 50)
      }
    }

    updateLoading()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Code className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">CodeVail</h1>
          <p className="text-sm text-foreground-muted">Secure Interview Platform</p>
        </div>

        {/* Loading Animation */}
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-foreground-muted mb-2">
            <span>Loading</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center mb-8">
          <p className="text-sm text-foreground-muted animate-pulse">
            {loadingText}
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-card/50 border border-border/50">
            <Shield className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-foreground-muted">Secure</p>
          </div>
          <div className="p-3 rounded-lg bg-card/50 border border-border/50">
            <Code className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-foreground-muted">Code Editor</p>
          </div>
          <div className="p-3 rounded-lg bg-card/50 border border-border/50">
            <Zap className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-foreground-muted">Real-time</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-foreground-muted">
            Powered by Next.js & Electron
          </p>
        </div>
      </div>
    </div>
  )
}
