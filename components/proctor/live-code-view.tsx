"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RefreshCw, Copy } from "lucide-react"
import type { CandidateSession } from "@/app/proctor/page"
import { MonacoCodeEditor } from "@/components/monaco-code-editor"

interface LiveCodeViewProps {
  session: CandidateSession
}

export function LiveCodeView({ session }: LiveCodeViewProps) {
  const [isSnippetCollapsed, setIsSnippetCollapsed] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const handleRefresh = () => {
    setLastUpdate(new Date())
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(session.solution)
  }

  return (
    <div className="h-full flex">
      {/* Original Code Snippet */}
      <div className={`${isSnippetCollapsed ? "w-8" : "w-1/3"} border-r border-gray-700 transition-all duration-300`}>
        {isSnippetCollapsed ? (
          <div className="h-full flex items-center justify-center">
            <Button variant="ghost" size="sm" onClick={() => setIsSnippetCollapsed(false)} className="rotate-90">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800/20">
              <h3 className="font-medium">Original Challenge</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsSnippetCollapsed(true)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-mono">
                {session.codeSnippet}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Live Code Editor View */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800/20">
          <div className="flex items-center">
            <h3 className="font-medium mr-4">Candidate's Solution</h3>
            <div className="text-xs text-gray-400">Last updated: {lastUpdate.toLocaleTimeString()}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleRefresh} className="text-gray-400 hover:text-white">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopyCode} className="text-gray-400 hover:text-white">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 relative">
          <MonacoCodeEditor
            value={session.solution}
            onChange={() => {}} // Read-only for proctor
            language={session.language}
            readOnly={true}
            theme="vs-dark"
          />

          {/* Live Typing Indicator */}
          <div className="absolute bottom-4 right-4 bg-green-900/20 border border-green-700 rounded-lg px-3 py-1">
            <div className="flex items-center text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span>Candidate is typing...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
