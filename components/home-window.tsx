"use client"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Code2, History, Shield, Monitor, ArrowRight, Zap, Users, Award } from "lucide-react"

interface HomeWindowProps {
  onEnterCode: () => void
  onViewHistory: () => void
}

export function HomeWindow({ onEnterCode, onViewHistory }: HomeWindowProps) {
  return (
    <div className="h-full bg-gradient-to-br from-background via-background-secondary to-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgb(var(--codevail-primary)) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgb(var(--codevail-accent)) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative h-full flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-8 glass-light rounded-b-2xl mx-6 mt-6">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-foreground-secondary">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Secure Environment</span>
            </div>
            <div className="text-xs text-foreground-muted">v1.0.0</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-4xl w-full">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="mb-8">
                <Logo size="xl" showText={false} className="justify-center mb-6" />
                <h1 className="text-6xl font-bold text-foreground mb-4 tracking-tight">
                  Code<span className="text-primary">Vail</span>
                </h1>
                <p className="text-xl text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
                  Professional coding interview platform with advanced security monitoring and real-time assessment
                  capabilities
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full border border-border-light">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Secure</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full border border-border-light">
                  <Monitor className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Monitored</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full border border-border-light">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Professional</span>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Enter Code Card */}
              <div className="group relative animate-slide-up">
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative glass rounded-2xl p-8 hover-lift">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Start Interview</h3>
                      <p className="text-sm text-foreground-secondary">Enter your interview code</p>
                    </div>
                  </div>

                  <p className="text-foreground-secondary mb-6 leading-relaxed">
                    Begin your coding assessment with advanced IDE features, real-time monitoring, and professional
                    evaluation tools.
                  </p>

                  <Button
                    onClick={onEnterCode}
                    className="w-full bg-gradient-primary hover:shadow-xl transition-all duration-300 group"
                  >
                    <span>Enter Interview Code</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* History Card */}
              <div className="group relative animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="absolute inset-0 bg-gradient-accent rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative glass rounded-2xl p-8 hover-lift">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center">
                      <History className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Session History</h3>
                      <p className="text-sm text-foreground-secondary">Review past interviews</p>
                    </div>
                  </div>

                  <p className="text-foreground-secondary mb-6 leading-relaxed">
                    Access detailed reports, code solutions, and performance analytics from your previous coding
                    sessions.
                  </p>

                  <Button
                    onClick={onViewHistory}
                    variant="outline"
                    className="w-full border-border-light hover:border-accent hover:bg-surface-hover transition-all duration-300 group bg-transparent"
                  >
                    <span>View History</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl mx-auto mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">99.9%</div>
                  <div className="text-sm text-foreground-secondary">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-accent rounded-xl mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">10K+</div>
                  <div className="text-sm text-foreground-secondary">Interviews</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl mx-auto mb-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">100%</div>
                  <div className="text-sm text-foreground-secondary">Secure</div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6">
          <div className="flex items-center justify-between glass-light rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-green-500">
                <Monitor className="w-4 h-4" />
                <span className="text-sm font-medium">Anti-Cheat: Active</span>
              </div>
              <div className="w-1 h-4 bg-border-light rounded-full" />
              <div className="text-sm text-foreground-secondary">Secure Environment Verified</div>
            </div>
            <div className="text-xs text-foreground-muted">© 2024 CodeVail. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
