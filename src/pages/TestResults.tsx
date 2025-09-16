"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { Logo } from "../components/Logo"
import { ThemeToggle } from "../components/ThemeToggle"
import { CheckCircle, XCircle, Clock, TrendingUp, Filter, Download, ArrowLeft, AlertTriangle } from "lucide-react"
import { getResults, type StoredTestResult } from "@/lib/results-store"

interface TestResult {
  id: string
  version: string
  duration: number
  status: "PASSED" | "FAILED" | "TERMINATED"
  totalTests: number
  passedTests: number
  failedTests: number
  timestamp: string
  details: {
    language: string
    difficulty: string
    category: string
  }
  isFlagged?: boolean
  cheatReason?: string
}

export default function TestResults() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()
  const [results, setResults] = useState<TestResult[]>([])
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all")
  const [sortBy, setSortBy] = useState<"date" | "duration" | "score">("date")

  useEffect(() => {
    // Load stored results (including flagged/terminated) and merge with mock data for demo
    const loadResults = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockResults: TestResult[] = [
        {
          id: "1",
          version: "1.0 (1)",
          duration: 8,
          status: "FAILED",
          totalTests: 26,
          passedTests: 20,
          failedTests: 6,
          timestamp: "2024-01-15T10:30:00Z",
          details: { language: "JavaScript", difficulty: "Medium", category: "Frontend" },
        },
        {
          id: "2",
          version: "1.0 (1)",
          duration: 6,
          status: "PASSED",
          totalTests: 26,
          passedTests: 26,
          failedTests: 0,
          timestamp: "2024-01-14T14:20:00Z",
          details: { language: "Python", difficulty: "Easy", category: "Backend" },
        },
        {
          id: "3",
          version: "1.0 (1)",
          duration: 7,
          status: "FAILED",
          totalTests: 26,
          passedTests: 24,
          failedTests: 2,
          timestamp: "2024-01-13T09:15:00Z",
          details: { language: "React", difficulty: "Hard", category: "Frontend" },
        },
        {
          id: "4",
          version: "1.0 (1)",
          duration: 6,
          status: "PASSED",
          totalTests: 26,
          passedTests: 26,
          failedTests: 0,
          timestamp: "2024-01-12T16:45:00Z",
          details: { language: "Java", difficulty: "Medium", category: "Backend" },
        },
        {
          id: "5",
          version: "1.0 (1)",
          duration: 7,
          status: "PASSED",
          totalTests: 26,
          passedTests: 26,
          failedTests: 0,
          timestamp: "2024-01-11T11:30:00Z",
          details: { language: "TypeScript", difficulty: "Hard", category: "Full Stack" },
        },
        {
          id: "6",
          version: "1.0 (1)",
          duration: 7,
          status: "FAILED",
          totalTests: 26,
          passedTests: 24,
          failedTests: 2,
          timestamp: "2024-01-10T13:20:00Z",
          details: { language: "Node.js", difficulty: "Medium", category: "Backend" },
        },
        {
          id: "7",
          version: "1.0 (1)",
          duration: 8,
          status: "FAILED",
          totalTests: 26,
          passedTests: 21,
          failedTests: 5,
          timestamp: "2024-01-09T15:10:00Z",
          details: { language: "React", difficulty: "Hard", category: "Frontend" },
        },
        {
          id: "8",
          version: "1.0 (1)",
          duration: 7,
          status: "FAILED",
          totalTests: 26,
          passedTests: 22,
          failedTests: 4,
          timestamp: "2024-01-08T10:00:00Z",
          details: { language: "Python", difficulty: "Medium", category: "Data Science" },
        },
        {
          id: "9",
          version: "1.0 (1)",
          duration: 7,
          status: "PASSED",
          totalTests: 26,
          passedTests: 26,
          failedTests: 0,
          timestamp: "2024-01-07T14:30:00Z",
          details: { language: "JavaScript", difficulty: "Easy", category: "Frontend" },
        },
        {
          id: "10",
          version: "1.0 (1)",
          duration: 7,
          status: "PASSED",
          totalTests: 26,
          passedTests: 26,
          failedTests: 0,
          timestamp: "2024-01-06T12:15:00Z",
          details: { language: "Go", difficulty: "Medium", category: "Backend" },
        },
      ]

      const stored: StoredTestResult[] = getResults()
      const mappedStored: TestResult[] = stored.map((r) => ({
        id: r.id,
        version: r.version,
        duration: r.duration,
        status: r.status,
        totalTests: r.totalTests,
        passedTests: r.passedTests,
        failedTests: r.failedTests,
        timestamp: r.timestamp,
        details: {
          language: r.details.language,
          difficulty: r.details.difficulty || "",
          category: r.details.category || "",
        },
        isFlagged: r.isFlagged,
        cheatReason: r.cheatReason,
      }))

      const combined = [...mappedStored, ...mockResults]
      setResults(combined)
      setFilteredResults(combined)
      setIsLoading(false)
    }

    loadResults()
  }, [])

  useEffect(() => {
    let filtered = results

    // Apply filter
    if (filter !== "all") {
      filtered = filtered.filter((result) => result.status.toLowerCase() === filter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        case "duration":
          return b.duration - a.duration
        case "score":
          return b.passedTests / b.totalTests - a.passedTests / a.totalTests
        default:
          return 0
      }
    })

    setFilteredResults(filtered)
  }, [results, filter, sortBy])

  const getProgressBarColor = (status: string, passedTests: number, totalTests: number) => {
    if (status === "PASSED") return "bg-green-500"

    const percentage = (passedTests / totalTests) * 100
    if (percentage >= 80) return "bg-yellow-500"
    if (percentage >= 60) return "bg-orange-500"
    return "bg-red-500"
  }

  const getStatusIcon = (status: string) => {
    return status === "PASSED" ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : status === "FAILED" ? (
      <XCircle className="w-4 h-4 text-red-500" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-yellow-500" />
    )
  }

  const exportResults = () => {
    const csvContent = [
      ["Version", "Duration", "Status", "Passed Tests", "Total Tests", "Success Rate", "Date"],
      ...filteredResults.map((result) => [
        result.version,
        `${result.duration} mins`,
        result.status,
        result.passedTests.toString(),
        result.totalTests.toString(),
        `${Math.round((result.passedTests / result.totalTests) * 100)}%`,
        new Date(result.timestamp).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "test-results.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Loading Test Results...
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <header className={`border-b ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <Logo />
              <div className="hidden sm:block">
                <h1 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Test Results
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={exportResults}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className={`p-6 rounded-xl border ${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={20} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {results.length}
                </p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Total Tests</p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl border ${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {results.filter((r) => r.status === "PASSED").length}
                </p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Passed</p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl border ${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="text-red-600" size={20} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {results.filter((r) => r.status === "FAILED").length}
                </p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Failed</p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl border ${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="text-purple-600" size={20} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {Math.round(results.reduce((acc, r) => acc + r.duration, 0) / results.length)}m
                </p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Avg Duration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter size={16} className={theme === "dark" ? "text-gray-400" : "text-gray-600"} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="all">All Results</option>
              <option value="passed">Passed Only</option>
              <option value="failed">Failed Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="date">Date</option>
              <option value="duration">Duration</option>
              <option value="score">Score</option>
            </select>
          </div>
        </div>

        {/* Results Table */}
        <div
          className={`rounded-xl border overflow-hidden ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                <tr>
                  <th
                    className={`px-6 py-4 text-left text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Version
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Duration
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Status
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Results
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredResults.map((result) => (
                  <tr
                    key={result.id}
                    className={`hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {result.version}
                      </div>
                      <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        {result.details.language} • {result.details.difficulty}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                        {result.duration} mins
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <span
                          className={`text-sm font-medium ${
                            result.status === "PASSED"
                              ? "text-green-600"
                              : result.status === "FAILED"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {result.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                              {result.status === "TERMINATED"
                                ? `Session terminated${result.cheatReason ? `: ${result.cheatReason}` : ""}`
                                : result.failedTests > 0
                                ? `${result.failedTests}/${result.totalTests} tests failed`
                                : `${result.passedTests} tests passed`}
                            </span>
                          </div>
                          {result.status !== "TERMINATED" && (
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getProgressBarColor(
                                  result.status,
                                  result.passedTests,
                                  result.totalTests,
                                )}`}
                                style={{
                                  width: `${(result.passedTests / result.totalTests) * 100}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
