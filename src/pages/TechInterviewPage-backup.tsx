"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { useNotification } from "../contexts/NotificationContext"
import { useTheme } from "../contexts/ThemeContext"
import { MonacoCodeEditor } from "../../components/monaco-code-editor"
import { AntiCheatSystem } from "../components/AntiCheatSystem"
import { ThemeToggle } from "../components/ThemeToggle"
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

  const testId = params?.testId as string

  const [problem, setProblem] = useState<Problem | null>(null)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [output, setOutput] = useState("")
  const [startTime] = useState(Date.now())
  const [duration, setDuration] = useState(0)
  const [isExamActive, setIsExamActive] = useState(false)
  const [systemReady, setSystemReady] = useState(false)
  const [isProblemCollapsed, setIsProblemCollapsed] = useState(false)
  const [violations, setViolations] = useState<any[]>([])

  // Mock problem data
  useEffect(() => {
    const mockProblem: Problem = {
      id: testId || "1",
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
          description: "Basic case with solution at beginning",
        },
        {
          input: "nums = [3,2,4], target = 6",
          expected: "[1,2]",
          description: "Solution in middle of array",
        },
        {
          input: "nums = [3,3], target = 6",
          expected: "[0,1]",
          description: "Duplicate numbers",
        },
      ],
    }

    setProblem(mockProblem)
    setCode(mockProblem.starterCode[language])
  }, [testId, language])

  // Timer
  useEffect(() => {
    if (!isExamActive) return

    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [isExamActive, startTime])

  const handleSystemReady = useCallback(() => {
    setSystemReady(true)
    addNotification({ type: "success", message: "Security system initialized" })
  }, [addNotification])

  const handleSubmit = useCallback(async () => {
    setIsExamActive(false)

    try {
      // Mock API call to grade submission
      const response = await fetch("/api/grading/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId,
          code,
          language,
          duration,
          testResults,
        }),
      })

      // Mock response
      const score =
        testResults.length > 0 ? Math.round((testResults.filter((r) => r.passed).length / testResults.length) * 100) : 0

      addNotification({ type: "success", message: `Exam submitted! Score: ${score}%` })
      router.push("/results")
    } catch (error) {
      addNotification({ type: "error", message: "Failed to submit exam" })
    }
  }, [testId, code, language, duration, testResults, addNotification, router])

  const handleViolationDetected = useCallback(
    (violation: any) => {
      setViolations((prev) => [...prev, violation])
      addNotification({
        type: violation.severity === "critical" ? "error" : "warning",
        message: violation.message,
      })
    },
    [addNotification],
  )

  const handleForceEndExam = useCallback(() => {
    setIsExamActive(false)
    addNotification({ type: "error", message: "Exam terminated due to security violation" })
    handleSubmit()
  }, [addNotification, handleSubmit])

  const startExam = () => {
    if (!systemReady) {
      addNotification({ type: "error", message: "Security system not ready" })
      return
    }
    setIsExamActive(true)
    addNotification({ type: "info", message: "Exam started - monitoring active" })
  }

  const handleRunCode = async () => {
    if (!problem) return

    setIsRunning(true)
    setOutput("🔄 Executing code...\n")
    setTestResults([])

    try {
      // Mock code execution
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResults: TestResult[] = problem.testCases.map((testCase, index) => {
        const passed = Math.random() > 0.3 // 70% pass rate for demo
        return {
          testCase,
          passed,
          actualOutput: passed ? testCase.expected : "undefined",
          executionTime: Math.random() * 100 + 20,
          error: passed ? undefined : "Test case failed",
        }
      })

      setTestResults(mockResults)

      const passedCount = mockResults.filter((r) => r.passed).length
      const totalCount = mockResults.length

      let outputText = `📊 Test Results:\n\n`

      mockResults.forEach((result, index) => {
        const status = result.passed ? "✅ PASSED" : "❌ FAILED"
        outputText += `Test Case ${index + 1}: ${status}\n`
        outputText += `  Description: ${result.testCase.description || "N/A"}\n`
        outputText += `  Input: ${result.testCase.input}\n`
        outputText += `  Expected: ${result.testCase.expected}\n`
        outputText += `  Actual: ${result.actualOutput}\n`
        outputText += `  Execution Time: ${result.executionTime.toFixed(2)}ms\n`
        if (result.error) {
          outputText += `  Error: ${result.error}\n`
        }
        outputText += `\n`
      })

      outputText += `📈 Summary: ${passedCount}/${totalCount} test cases passed\n`

      if (passedCount === totalCount) {
        outputText += `🎉 Congratulations! All tests passed!\n`
      } else {
        outputText += `⚠️ Some tests failed. Review your logic and try again.\n`
      }

      setOutput(outputText)
    } catch (error) {
      setOutput(`❌ Execution Error:\n${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsRunning(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-success bg-success"
      case "medium":
        return "text-warning bg-warning"
      case "hard":
        return "text-error bg-error"
      default:
        return "text-secondary bg-glass"
    }
  }

  if (!problem) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={`h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>      {/* Interview Header */}      <div className={`border-b ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>        <div className="flex items-center justify-between px-6 py-4">          {/* Left Side - Problem Info */}          <div className="flex items-center space-x-4">            <button              onClick={() => router.back()}              className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>              <ArrowLeft size={20} className={theme === "dark" ? "text-white" : "text-gray-900"} />            </button>            <div>              <h1 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>                {problem?.title || "Loading..."}              </h1>              <div className="flex items-center space-x-3 mt-1">                <span className={`px-2 py-1 text-xs font-medium rounded ${                  problem?.difficulty === "Easy"                   ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"                   : problem?.difficulty === "Medium"                   ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"                   : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"                }`}>                  {problem?.difficulty}                </span>                <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>                  Interview Code: <span className="font-mono">{testId}</span>                </span>              </div>            </div>          </div>          {/* Right Side - Controls */}          <div className="flex items-center space-x-4">            {/* Timer */}            <div className={`flex items-center px-4 py-2 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}>              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3" />              <div className="text-center">                <div className={`font-mono text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>                  {formatTime(duration)}                </div>                <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>                  Session Time                </div>              </div>            </div>            {/* Security Status */}            <div className={`flex items-center px-3 py-2 rounded-lg ${              isExamActive               ? "bg-green-500/10 text-green-600 dark:text-green-400"               : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"            }`}>              <Shield size={16} className="mr-2" />              <span className="text-sm font-medium">                Monitoring: {isExamActive ? "Active" : "Paused"}              </span>            </div>            {/* End Interview Button */}            <button              onClick={handleEndInterview}              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2">              <Square size={16} />              <span>End Interview</span>            </button>            <ThemeToggle />          </div>        </div>      </div>      {/* Main Interview Body */}      <div className="flex flex-1 h-[calc(100vh-73px)]">        {/* Problem Panel */}        <div className={`${isProblemCollapsed ? "w-12" : "w-2/5"} border-r ${theme === "dark" ? "border-gray-700" : "border-gray-200"} transition-all duration-300`}>          {isProblemCollapsed ? (            <div className="h-full flex items-center justify-center">              <button                onClick={() => setIsProblemCollapsed(false)}                className={`p-2 rounded-lg rotate-180 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>                <ChevronLeft size={20} className={theme === "dark" ? "text-white" : "text-gray-900"} />              </button>            </div>          ) : (            <div className="h-full flex flex-col">              {/* Problem Header */}              <div className={`flex items-center justify-between p-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>                <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>                  Problem Description                </h3>                <button                  onClick={() => setIsProblemCollapsed(true)}                  className={`p-1 rounded ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>                  <ChevronLeft size={16} className={theme === "dark" ? "text-white" : "text-gray-900"} />                </button>              </div>              {/* Problem Content */}              <div className="flex-1 overflow-y-auto p-4">                <div className={`prose max-w-none ${theme === "dark" ? "prose-invert" : ""}`}>                  <pre className={`whitespace-pre-wrap text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>                    {problem?.description || "Loading problem description..."}                  </pre>                </div>              </div>            </div>          )}        </div>        {/* Code Editor Panel */}        <div className="flex-1 flex flex-col">          {/* Editor Header */}          <div className={`flex items-center justify-between p-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>            <div className="flex items-center space-x-4">              <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>                Code Editor              </h3>              <select                value={language}                onChange={(e) => setLanguage(e.target.value)}                className={`px-3 py-1 rounded border text-sm ${                  theme === "dark"                    ? "bg-gray-700 border-gray-600 text-white"                    : "bg-white border-gray-300 text-gray-900"                }`}>                <option value="javascript">JavaScript</option>                <option value="python">Python</option>              </select>            </div>            {/* Editor Controls */}            <div className="flex items-center space-x-2">              <button                onClick={handleResetCode}                disabled={!isExamActive}                className={`px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1 ${                  !isExamActive                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"                    : theme === "dark"                    ? "bg-gray-700 hover:bg-gray-600 text-white"                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"                }`}>                <RotateCcw size={14} />                <span>Reset</span>              </button>              <button                onClick={handleRunCode}                disabled={isRunning || !isExamActive}                className={`px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1 ${                  isRunning || !isExamActive                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"                    : "bg-blue-600 hover:bg-blue-700 text-white"                }`}>                <Play size={14} />                <span>{isRunning ? "Running..." : "Run Code"}</span>              </button>              <button                onClick={handleRunTests}                disabled={isRunning || !isExamActive}                className={`px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1 ${                  isRunning || !isExamActive                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"                    : "bg-green-600 hover:bg-green-700 text-white"                }`}>                <Play size={14} />                <span>Run Tests</span>              </button>              <button                onClick={handleSubmit}                disabled={!isExamActive}                className={`px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1 ${                  !isExamActive                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"                    : "bg-emerald-600 hover:bg-emerald-700 text-white"                }`}>                <Send size={14} />                <span>Submit</span>              </button>            </div>          </div>          {/* Monaco Editor */}          <div className="flex-1">            <MonacoCodeEditor              value={code}              onChange={setCode}              language={language}              theme={theme === "dark" ? "vs-dark" : "vs-light"}              options={{                readOnly: !isExamActive,                minimap: { enabled: false },                fontSize: 14,                lineNumbers: "on",                wordWrap: "on",                automaticLayout: true,              }}            />          </div>          {/* Output Panel */}          <div className={`h-1/3 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>            <div className={`flex items-center justify-between p-3 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>              <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>                Execution Results              </h3>              {testResults.length > 0 && (                <div className="flex items-center space-x-4 text-sm">                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">                    <CheckCircle size={16} />                    <span>{testResults.filter(r => r.passed).length} passed</span>                  </div>                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">                    <XCircle size={16} />                    <span>{testResults.filter(r => !r.passed).length} failed</span>                  </div>                  <div className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>                    Score: {Math.round((testResults.filter(r => r.passed).length / testResults.length) * 100)}%                  </div>                </div>              )}            </div>            <div className="h-[calc(100%-49px)] overflow-y-auto p-4">              <pre className={`text-sm font-mono whitespace-pre-wrap ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>                {output || "// Click \"Run Code\" to execute your solution or \"Run Tests\" to test against all cases"}              </pre>            </div>          </div>        </div>        {/* Security Monitor Panel */}        <div className={`w-80 border-l ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>          <div className={`flex items-center justify-between p-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>            <div className="flex items-center space-x-2">              <Shield size={16} className="text-blue-500" />              <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>                Security Monitor              </h3>            </div>            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />          </div>          <div className="p-4 space-y-4">            {/* Security Status Overview */}            <div className="space-y-3">              <div className="flex items-center space-x-2 text-sm">                <CheckCircle size={16} className="text-green-500" />                <span className={`${theme === "dark" ? "text-green-400" : "text-green-600"} font-medium`}>                  System Secure                </span>              </div>              <div className="flex items-center space-x-2 text-sm">                <Eye size={16} className={theme === "dark" ? "text-gray-400" : "text-gray-600"} />                <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>                  Screen Recording: Active                </span>              </div>              <div className="flex items-center space-x-2 text-sm">                <Wifi size={16} className={theme === "dark" ? "text-gray-400" : "text-gray-600"} />                <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>                  Network Monitor: Active                </span>              </div>            </div>            {/* System Stats */}            <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}>              <h4 className={`text-sm font-medium mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>                System Stats              </h4>              <div className="space-y-2 text-sm">                <div className="flex justify-between">                  <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>CPU Usage:</span>                  <span className={theme === "dark" ? "text-white" : "text-gray-900"}>12%</span>                </div>                <div className="flex justify-between">                  <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Memory:</span>                  <span className={theme === "dark" ? "text-white" : "text-gray-900"}>4.2GB / 16GB</span>                </div>                <div className="flex justify-between">                  <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Uptime:</span>                  <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{formatTime(duration)}</span>                </div>              </div>            </div>            {/* Security Alerts */}            <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}>              <h4 className={`text-sm font-medium mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>                Security Alerts              </h4>              <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>                No alerts              </div>            </div>          </div>        </div>      </div>      {/* Anti-Cheat System */}      <AntiCheatSystem isActive={isExamActive} onViolation={handleAntiCheatViolation} />    </div>  )
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/candidate-dashboard")}
            className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            <ArrowLeft size={20} className={theme === "dark" ? "text-white" : "text-gray-900"} />
          </button>

          <div>
            <h1 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{problem.title}</h1>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Test ID: {testId}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className={`flex items-center px-4 py-2 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}>
            <Clock size={16} className={`mr-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`} />
            <div className="text-center">
              <div className={`font-mono text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formatTime(duration)}</div>
              <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Session Time</div>
            </div>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Security Status */}
          <div
            className={`flex items-center px-3 py-1 rounded border text-sm ${
              isExamActive 
                ? "text-green-600 border-green-500 bg-green-50 dark:text-green-400 dark:border-green-400 dark:bg-green-900/20" 
                : "text-yellow-600 border-yellow-500 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-400 dark:bg-yellow-900/20"
            }`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${isExamActive ? "bg-green-500 animate-pulse dark:bg-green-400" : "bg-yellow-500 dark:bg-yellow-400"}`} />
            {isExamActive ? "Monitoring Active" : "Monitoring Inactive"}
          </div>

          {/* Controls */}
          {!isExamActive ? (
            <button 
              onClick={startExam} 
              disabled={!systemReady} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                systemReady 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
              }`}
            >
              <Play size={16} />
              Start Exam
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border border-red-500 text-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
            >
              <Square size={16} />
              End Exam
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Problem Description */}
        <div className={`${isProblemCollapsed ? "w-8" : "w-2/5"} border-r ${theme === "dark" ? "border-gray-700" : "border-gray-200"} transition-all duration-300`}>
          {isProblemCollapsed ? (
            <div className="h-full flex items-center justify-center">
              <button
                onClick={() => setIsProblemCollapsed(false)}
                className={`p-2 rounded-lg transition-colors rotate-90 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <ChevronRight size={20} className={theme === "dark" ? "text-white" : "text-gray-900"} />
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className={`flex items-center justify-between p-4 border-b ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Problem Description</h3>
                <button
                  onClick={() => setIsProblemCollapsed(true)}
                  className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  <ChevronLeft size={20} className={theme === "dark" ? "text-white" : "text-gray-900"} />
                </button>
              </div>
              <div className={`flex-1 p-4 overflow-y-auto ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                <pre className={`whitespace-pre-wrap text-sm leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{problem.description}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Code Editor and Output */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between p-3 border-b border-primary bg-secondary">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold">Code Editor</h3>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-tertiary border border-primary rounded px-3 py-1 text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setCode(problem.starterCode[language])} className="btn-secondary text-sm">
                Reset Code
              </button>
              <button
                onClick={handleRunCode}
                disabled={isRunning || !isExamActive}
                className="btn-primary flex items-center gap-2"
                data-testid="run-code-button"
              >
                <Play size={16} />
                {isRunning ? "Running..." : "Run Tests"}
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1">
            <CodeEditor language={language} code={code} onChange={setCode} readOnly={!isExamActive} />
          </div>

          {/* Output Panel */}
          <div className="h-64 border-t border-primary">
            <div className="flex items-center justify-between p-3 border-b border-primary bg-secondary">
              <h3 className="font-semibold">Test Results</h3>
              {testResults.length > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="text-success" size={16} />
                    <span className="text-success">{testResults.filter((r) => r.passed).length} passed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="text-error" size={16} />
                    <span className="text-error">{testResults.filter((r) => !r.passed).length} failed</span>
                  </div>
                  <div className="text-secondary">
                    Score: {Math.round((testResults.filter((r) => r.passed).length / testResults.length) * 100)}%
                  </div>
                </div>
              )}
            </div>
            <div className="h-full p-4 bg-tertiary overflow-y-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap text-success">
                {output || '// Click "Run Tests" to execute your solution and see results'}
              </pre>
            </div>
          </div>
        </div>

        {/* Anti-Cheat System */}
        <AntiCheatSystem
          isExamActive={isExamActive}
          onViolationDetected={handleViolationDetected}
          onSystemReady={handleSystemReady}
          strictMode={true}
          onForceEndExam={handleForceEndExam}
        />
      </div>
    </div>
  )
}
