"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { useNotification } from "../contexts/NotificationContext"
import { useTheme } from "../contexts/ThemeContext"
import { useComponentLoading } from "../../hooks/use-page-transition"
import { MonacoCodeEditor } from "../../components/monaco-code-editor"
import { ThemeToggle } from "../components/ThemeToggle"
import { addResult } from "../../lib/results-store"
import { 
  ArrowLeft, 
  Play, 
  Square, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  RotateCcw,
  Send,
  Eye,
  Wifi,
  Activity
} from "lucide-react"

// Use global types from types/global.d.ts

interface TestCase {
  input: string
  expected: string
  description?: string
}

interface TestResult {
  testCase: TestCase
  passed: boolean
  actualOutput: string
  executionTime: number
  error?: string
}

interface Problem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  starterCode: { [key: string]: string }
  testCases: TestCase[]
}

export default function TechInterviewPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const { theme } = useTheme()

  // Add loading for component initialization
  useComponentLoading(2000)

  const testId = params?.testId as string

  const [problem, setProblem] = useState<Problem | null>(null)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [output, setOutput] = useState("")
  const [duration, setDuration] = useState(0)
  const [isExamActive, setIsExamActive] = useState(true)
  const [isProblemCollapsed, setIsProblemCollapsed] = useState(false)

  // Mock problem data - replace with actual API call
  useEffect(() => {
    const mockProblem: Problem = {
      id: "two-sum",
      title: "Two Sum",
      difficulty: "Easy",
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
• 2 ≤ nums.length ≤ 10⁴
• -10⁹ ≤ nums[i] ≤ 10⁹
• -10⁹ ≤ target ≤ 10⁹
• Only one valid answer exists.`,
      starterCode: {
        javascript: `function twoSum(nums, target) {
    // Write your solution here
    
}

// Test the function
console.log(twoSum([2,7,11,15], 9)); // Expected: [0,1]`,
        python: `def two_sum(nums, target):
    # Write your solution here
    pass

# Test the function
print(two_sum([2,7,11,15], 9))  # Expected: [0,1]`,
      },
      testCases: [
        {
          input: "nums = [2,7,11,15], target = 9",
          expected: "[0,1]",
          description: "Basic case"
        },
        {
          input: "nums = [3,2,4], target = 6",
          expected: "[1,2]",
          description: "Different order"
        }
      ]
    }

    setProblem(mockProblem)
    setCode(mockProblem.starterCode[language] || "")
  }, [])

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[language] || "")
    }
  }, [language, problem])

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Enhanced Python-based anti-cheat monitoring with session management
  useEffect(() => {
    if (!isExamActive) return

    // Start anti-cheat session when exam begins (as candidate role) and mark test started for termination gating
    if (typeof window !== 'undefined' && window.electronAPI?.startAntiCheatSession) {
      const candidateName = user?.name || 'Unknown Candidate'
      const interviewId = testId || `interview_${Date.now()}`
      try {
        // Ensure role is set BEFORE starting so logger records it
        console.log('[AntiCheat][Renderer] Setting role=candidate and starting session', { candidateName, interviewId })
        window.electronAPI.setUserRole?.('candidate')
        window.electronAPI.startAntiCheatSession(candidateName, interviewId)
        window.electronAPI.markTestStarted?.()
        console.log('[AntiCheat][Renderer] markTestStarted sent')
        // Safety: re-confirm after 2s (in case first IPC missed)
        setTimeout(() => {
          window.electronAPI?.getAntiCheatStatus && Promise.resolve(window.electronAPI.getAntiCheatStatus())
            .then(status => {
              const s: any = status;
              if (s && !s.testStarted) {
                console.warn('[AntiCheat][Renderer] testStarted still false after 2s; re-sending role & markTestStarted')
                window.electronAPI?.setUserRole?.('candidate')
                window.electronAPI?.markTestStarted?.()
              }
            }).catch(()=>{})
        }, 2000)
      } catch (e) {
        console.warn('Failed to initialize anti-cheat session with role/start flags', e)
      }
    }

    let intervalId: number | null = null
    let hasTerminated = false

    const scanForViolations = async () => {
      if (hasTerminated) return
      
      try {
        // Use enhanced violation scan if available
        if (typeof window !== 'undefined' && window.electronAPI?.scanForViolations) {
          const result = await window.electronAPI.scanForViolations()
          
          if (result.banned.length > 0) {
            // Determine violation message based on severity
            let violationMessage = ''
            let shouldTerminate = result.shouldTerminate
            
            if (result.criticalViolations.length > 0) {
              violationMessage = `Critical security violation: ${result.criticalViolations.join(', ')} detected`
              shouldTerminate = true
            } else if (result.threatLevel === 'high') {
              violationMessage = `High-risk applications detected: ${result.banned.join(', ')}`
              shouldTerminate = true
            } else {
              violationMessage = `Unauthorized applications detected: ${result.banned.join(', ')}`
            }
            
            // Log the violation for debugging
            console.warn('[Anti-Cheat]', {
              banned: result.banned,
              critical: result.criticalViolations,
              threatLevel: result.threatLevel,
              shouldTerminate: shouldTerminate
            })
            
            if (shouldTerminate) {
              hasTerminated = true
              handleAntiCheatViolation({
                reason: violationMessage,
                processes: result.banned,
                threatLevel: result.threatLevel,
                critical: result.criticalViolations.length > 0
              })
              return
            }
          }
        } else {
          // Fallback to basic process scan
          if (typeof window !== 'undefined' && window.electronAPI?.scanProcesses) {
            const processes: string[] = await window.electronAPI.scanProcesses()
            const CRITICAL_PROCESSES = ['cluely', 'chatgpt', 'copilot', 'stackoverflow']
            const HIGH_RISK_PROCESSES = ['discord', 'slack', 'teams', 'zoom', 'anydesk', 'teamviewer']
            
            const criticalFound = CRITICAL_PROCESSES.filter(critical => 
              processes.some(proc => proc.includes(critical))
            )
            const highRiskFound = HIGH_RISK_PROCESSES.filter(high => 
              processes.some(proc => proc.includes(high))
            )
            
            if (criticalFound.length > 0) {
              hasTerminated = true
              handleAntiCheatViolation({
                reason: `Critical violation: ${criticalFound.join(', ')} detected`,
                processes: criticalFound,
                threatLevel: 'critical',
                critical: true
              })
              return
            } else if (highRiskFound.length >= 2) {
              hasTerminated = true
              handleAntiCheatViolation({
                reason: `Multiple high-risk applications: ${highRiskFound.join(', ')}`,
                processes: highRiskFound,
                threatLevel: 'high',
                critical: false
              })
              return
            }
          }
        }
      } catch (error) {
        console.warn('Enhanced anti-cheat scan failed:', error)
      }
    }

    // Immediate scan after 1 second to catch already running processes
    const initialTimeout = setTimeout(scanForViolations, 1000)
    
    // Then scan every 5 seconds (more frequent for better detection)
    intervalId = window.setInterval(scanForViolations, 5000)

    return () => {
      if (initialTimeout) clearTimeout(initialTimeout)
      if (intervalId) clearInterval(intervalId)
      
      // End anti-cheat session when component unmounts or exam ends
      if (typeof window !== 'undefined' && window.electronAPI?.endAntiCheatSession) {
        window.electronAPI.endAntiCheatSession()
      }
    }
  }, [isExamActive])

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  const handleRunCode = async () => {
    setIsRunning(true)
    setOutput("Running code...")
    
    // Simulate code execution
    setTimeout(() => {
      setOutput("Code executed successfully!\n\nOutput:\n[0, 1]")
      setIsRunning(false)
    }, 1500)
  }

  const handleRunTests = async () => {
    setIsRunning(true)
    setTestResults([])
    setOutput("Running tests...")
    
    // Simulate test execution
    setTimeout(() => {
      const mockResults: TestResult[] = [
        {
          testCase: problem!.testCases[0],
          passed: true,
          actualOutput: "[0,1]",
          executionTime: 2
        },
        {
          testCase: problem!.testCases[1],
          passed: false,
          actualOutput: "[2,1]",
          executionTime: 3,
          error: "Expected [1,2] but got [2,1]"
        }
      ]
      
      setTestResults(mockResults)
      setOutput(`Test Results:
      
Test 1: ✓ PASSED
Input: nums = [2,7,11,15], target = 9
Expected: [0,1]
Actual: [0,1]
Time: 2ms

Test 2: ✗ FAILED
Input: nums = [3,2,4], target = 6
Expected: [1,2]
Actual: [2,1]
Time: 3ms
Error: Expected [1,2] but got [2,1]

Score: 50% (1/2 tests passed)`)
      setIsRunning(false)
    }, 2000)
  }

  const handleResetCode = () => {
    if (problem) {
      setCode(problem.starterCode[language] || "")
      setOutput("")
      setTestResults([])
    }
  }

  const handleSubmit = () => {
    addNotification({ type: "success", message: "Solution submitted successfully!" })
  router.push("/results")
  }

  const handleEndInterview = () => {
    setIsExamActive(false)
    addNotification({ type: "info", message: "Interview ended" })
    router.push("/candidate-dashboard")
  }

  const handleAntiCheatViolation = (violation: any) => {
    // Record termination result and end exam immediately
    try {
      const now = new Date().toISOString()
      addResult({
        id: `tech-${testId}-${now}`,
        version: "1.0 (1)",
        duration: Math.max(1, Math.round(duration / 60)) || 1,
        status: "TERMINATED",
        totalTests: testResults.length || 0,
        passedTests: testResults.filter((r) => r.passed).length || 0,
        failedTests: testResults.filter((r) => !r.passed).length || 0,
        timestamp: now,
        details: { language, difficulty: problem?.difficulty || "", category: "Tech Interview" },
        isFlagged: true,
        cheatReason: violation.message || violation.reason || "Anti-cheat violation detected",
      })
    } catch {}
    
    addNotification({ type: "error", message: `Session terminated: ${violation.message || violation.reason}` })
    setIsExamActive(false)
  // Redirect to dedicated termination summary page (handled also by main process redirect)
  router.push('/interview-terminated')
  }

  const handleSystemReady = () => {
    console.log("Anti-cheat system ready")
  }

  // Listen for termination event from main (authoritative)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).electronAPI?.onInterviewTerminated) {
      (window as any).electronAPI.onInterviewTerminated((data: any) => {
        console.log('[AntiCheat][Renderer] Received interview-terminated event', data)
        setIsExamActive(false)
        router.push('/interview-terminated')
      })
    }
  }, [router])

  const handleForceEndExam = () => {
    addNotification({ type: "error", message: "Exam forcefully ended due to security violations" })
    setIsExamActive(false)
    router.push("/candidate-dashboard")
  }

  if (!problem) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={`h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Interview Header */}
      <div className={`border-b ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left Side - Problem Info */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <ArrowLeft size={20} className={theme === "dark" ? "text-white" : "text-gray-900"} />
            </button>
            <div>
              <h1 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {problem?.title || "Loading..."}
              </h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  problem?.difficulty === "Easy" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : problem?.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" 
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}>
                  {problem?.difficulty}
                </span>
                <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Interview Code: <span className="font-mono">{testId}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Controls */}
          <div className="flex items-center space-x-4">
            {/* Timer */}
            <div className={`flex items-center px-4 py-2 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3" />
              <div className="text-center">
                <div className={`font-mono text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {formatTime(duration)}
                </div>
                <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Session Time
                </div>
              </div>
            </div>

            {/* Security Status */}
            <div className={`flex items-center px-3 py-2 rounded-lg ${
              isExamActive 
                ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
            }`}>
              <Shield size={16} className="mr-2" />
              <span className="text-sm font-medium">
                Monitoring: {isExamActive ? "Active" : "Paused"}
              </span>
            </div>

            {/* End Interview Button */}
            <button
              onClick={handleEndInterview}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Square size={16} />
              <span>End Interview</span>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Interview Body */}
      <div className="flex flex-1 h-[calc(100vh-73px)]">
        {/* Problem Panel */}
        <div className={`${isProblemCollapsed ? "w-12" : "w-2/5"} border-r ${theme === "dark" ? "border-gray-700" : "border-gray-200"} transition-all duration-300`}>
          {isProblemCollapsed ? (
            <div className="h-full flex items-center justify-center">
              <button
                onClick={() => setIsProblemCollapsed(false)}
                className={`p-2 rounded-lg rotate-180 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <ChevronLeft size={20} className={theme === "dark" ? "text-white" : "text-gray-900"} />
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Problem Header */}
              <div className={`flex items-center justify-between p-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Problem Description
                </h3>
                <button
                  onClick={() => setIsProblemCollapsed(true)}
                  className={`p-1 rounded ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  <ChevronLeft size={16} className={theme === "dark" ? "text-white" : "text-gray-900"} />
                </button>
              </div>

              {/* Problem Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className={`prose max-w-none ${theme === "dark" ? "prose-invert" : ""}`}>
                  <pre className={`whitespace-pre-wrap text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {problem?.description || "Loading problem description..."}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Code Editor Panel */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className={`flex items-center justify-between p-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex items-center space-x-4">
              <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Code Editor
              </h3>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-3 py-1 rounded border text-sm ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            {/* Editor Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetCode}
                disabled={!isExamActive}
                className={`px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1 ${
                  !isExamActive
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                    : theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
              
              <button
                onClick={handleRunCode}
                disabled={isRunning || !isExamActive}
                className={`px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1 ${
                  isRunning || !isExamActive
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Play size={14} />
                <span>{isRunning ? "Running..." : "Run Code"}</span>
              </button>

              <button
                onClick={handleRunTests}
                disabled={isRunning || !isExamActive}
                className={`px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1 ${
                  isRunning || !isExamActive
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <Play size={14} />
                <span>Run Tests</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={!isExamActive}
                className={`px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1 ${
                  !isExamActive
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                <Send size={14} />
                <span>Submit</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <MonacoCodeEditor
              value={code}
              onChange={setCode}
              language={language}
              theme={theme === "dark" ? "vs-dark" : "light"}
            />
          </div>

          {/* Output Panel */}
          <div className={`h-1/3 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
            <div className={`flex items-center justify-between p-3 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
              <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Execution Results
              </h3>
              
              {testResults.length > 0 && (
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                    <CheckCircle size={16} />
                    <span>{testResults.filter(r => r.passed).length} passed</span>
                  </div>
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                    <XCircle size={16} />
                    <span>{testResults.filter(r => !r.passed).length} failed</span>
                  </div>
                  <div className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Score: {Math.round((testResults.filter(r => r.passed).length / testResults.length) * 100)}%
                  </div>
                </div>
              )}
            </div>

            <div className="h-[calc(100%-49px)] overflow-y-auto p-4">
              <pre className={`text-sm font-mono whitespace-pre-wrap ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                {output || "// Click \"Run Code\" to execute your solution or \"Run Tests\" to test against all cases"}
              </pre>
            </div>
          </div>
        </div>

        {/* Webcam monitor removed - using background Python anti-cheat instead */}
      </div>

  {/* Anti-Cheat System is now embedded in the right panel */}
    </div>
  )
}
