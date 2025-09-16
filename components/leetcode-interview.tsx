"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Play,
  Square,
  ChevronLeft,
  ChevronRight,
  Shield,
  XCircle,
  RotateCcw,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { CodeEditor } from "@/components/code-editor"
import { Timer } from "@/components/timer"
import { AntiCheatMonitor } from "@/components/anti-cheat-monitor"
import { addResult } from "@/lib/results-store"
import { codeExecutionService, type TestResult } from "@/components/code-execution-service"
import { FullScreenLoader } from "@/components/full-screen-loader"

interface LeetCodeInterviewProps {
  interviewCode: string
  onBack: () => void
  onEndInterview: () => void
}

const LEETCODE_PROBLEMS = {
  TECH2024: {
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
      { input: "nums = [3,2,4], target = 6", expected: "[1,2]", description: "Solution in middle of array" },
      { input: "nums = [3,3], target = 6", expected: "[0,1]", description: "Duplicate numbers" },
    ],
  },
  INTERVIEW123: {
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false

Constraints:
• 1 ≤ s.length ≤ 10⁴
• s consists of parentheses only '()[]{}'.`,
    starterCode: {
      javascript: `function isValid(s) {
    // Write your solution here
    
}

// Test the function
console.log(isValid("()")); // Expected: true`,
      python: `def is_valid(s):
    # Write your solution here
    pass

# Test the function
print(is_valid("()"))  # Expected: True`,
    },
    testCases: [
      { input: 's = "()"', expected: "true", description: "Simple valid parentheses" },
      { input: 's = "()[]{}"', expected: "true", description: "Multiple types of brackets" },
      { input: 's = "(]"', expected: "false", description: "Mismatched brackets" },
    ],
  },
  CODING456: {
    title: "Reverse Linked List",
    difficulty: "Easy",
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

Example 1:
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

Example 2:
Input: head = [1,2]
Output: [2,1]

Example 3:
Input: head = []
Output: []

Constraints:
• The number of nodes in the list is the range [0, 5000].
• -5000 ≤ Node.val ≤ 5000

Follow up: A linked list can be reversed either iteratively or recursively. Could you implement both?`,
    starterCode: {
      javascript: `// Definition for singly-linked list
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function reverseList(head) {
    // Write your solution here
    
}

// Helper function to create linked list from array
function createLinkedList(arr) {
    if (arr.length === 0) return null;
    let head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

// Helper function to convert linked list to array
function linkedListToArray(head) {
    let result = [];
    let current = head;
    while (current) {
        result.push(current.val);
        current = current.next;
    }
    return result;
}

// Test the function
let head = createLinkedList([1,2,3,4,5]);
let reversed = reverseList(head);
console.log(linkedListToArray(reversed)); // Expected: [5,4,3,2,1]`,
      python: `# Definition for singly-linked list
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    # Write your solution here
    pass

# Helper function to create linked list from array
def create_linked_list(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    current = head
    for i in range(1, len(arr)):
        current.next = ListNode(arr[i])
        current = current.next
    return head

# Helper function to convert linked list to array
def linked_list_to_array(head):
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result

# Test the function
head = create_linked_list([1,2,3,4,5])
reversed_head = reverse_list(head)
print(linked_list_to_array(reversed_head))  # Expected: [5,4,3,2,1]`,
    },
    testCases: [
      { input: "head = [1,2,3,4,5]", expected: "[5,4,3,2,1]", description: "Standard linked list reversal" },
      { input: "head = [1,2]", expected: "[2,1]", description: "Two node list" },
      { input: "head = []", expected: "[]", description: "Empty list" },
    ],
  },
}

export function LeetCodeInterview({ interviewCode, onBack, onEndInterview }: LeetCodeInterviewProps) {
  const [isProblemCollapsed, setIsProblemCollapsed] = useState(false)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState<"javascript" | "python">("javascript")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [startTime] = useState(Date.now())
  const [duration, setDuration] = useState(0)
  const intervalRef = useRef<number | null>(null)

  const problem = LEETCODE_PROBLEMS[interviewCode as keyof typeof LEETCODE_PROBLEMS]

  useEffect(() => {
    const t = window.setTimeout(() => setPageLoading(false), 400)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[language])
    }
  }, [problem, language])

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [startTime])

  const handleRunCode = async () => {
    if (!problem) return

    setIsRunning(true)
    setOutput("🔄 Executing code...\n")
    setTestResults([])

    try {
      // Execute code with test cases
      const results = await codeExecutionService.executeCode(code, language, problem.testCases)

      setTestResults(results)

      const passedCount = results.filter((r) => r.passed).length
      const totalCount = results.length

      let outputText = `📊 Test Results:\n\n`

      results.forEach((result, index) => {
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
        outputText += `💡 Consider edge cases and optimization opportunities.\n`
      } else {
        outputText += `⚠️ Some tests failed. Review your logic and try again.\n`
        outputText += `💭 Debug tip: Check the failed test cases above.\n`
      }

      outputText += `\n⚡ Average execution time: ${(results.reduce((sum, r) => sum + r.executionTime, 0) / results.length).toFixed(2)}ms`

      setOutput(outputText)
    } catch (error) {
      setOutput(`❌ Execution Error:\n${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleRunSimple = async () => {
    setIsRunning(true)
    setOutput("🔄 Running code...\n")

    try {
      const result = await codeExecutionService.executeSimpleCode(code, language)

      if (result.success) {
        setOutput(
          `✅ Code executed successfully!\n\nOutput:\n${result.output}\n\n⚡ Execution time: ${result.executionTime.toFixed(2)}ms${result.memoryUsage ? `\n💾 Memory usage: ${result.memoryUsage}` : ""}`,
        )
      } else {
        setOutput(
          `❌ Execution failed!\n\nError:\n${result.error}\n\n⚡ Execution time: ${result.executionTime.toFixed(2)}ms`,
        )
      }
    } catch (error) {
      setOutput(`❌ Execution Error:\n${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = () => {
    const passedCount = testResults.filter((r) => r.passed).length
    const totalCount = testResults.length
    const score = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0

    setOutput(`🎯 Solution submitted successfully!

📊 Final Score: ${score}% (${passedCount}/${totalCount} tests passed)
⏱️ Total Time: ${Math.floor(duration / 60)}m ${duration % 60}s
💻 Language: ${language.charAt(0).toUpperCase() + language.slice(1)}

Your solution has been saved and will be reviewed by the interviewer.

${score === 100 ? "🏆 Perfect score! Excellent work!" : score >= 70 ? "👍 Good job! Consider optimizing further." : "📚 Keep practicing! Review the failed test cases."}

Thank you for completing the coding challenge!`)
  }

  const handleLanguageChange = (newLanguage: "javascript" | "python") => {
    setLanguage(newLanguage)
    if (problem) {
      setCode(problem.starterCode[newLanguage])
    }
    setOutput("")
    setTestResults([])
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-900/20"
      case "medium":
        return "text-yellow-400 bg-yellow-900/20"
      case "hard":
        return "text-red-400 bg-red-900/20"
      default:
        return "text-gray-400 bg-gray-900/20"
    }
  }

  // Anti-cheat: terminate session and record a TERMINATED result
  const hasTerminatedRef = useRef(false)
  const handleViolation = (info: { reason: string; processes?: string[] }) => {
    if (hasTerminatedRef.current) return
    hasTerminatedRef.current = true
    try {
      const now = new Date().toISOString()
      addResult({
        id: `${interviewCode}-${now}`,
        version: "1.0 (1)",
        duration: Math.max(1, Math.round(duration / 60)) || 1,
        status: "TERMINATED",
        totalTests: testResults.length || 0,
        passedTests: testResults.filter((r) => r.passed).length || 0,
        failedTests: testResults.filter((r) => !r.passed).length || 0,
        timestamp: now,
        details: { language, difficulty: problem?.difficulty || "", category: "Coding" },
        isFlagged: true,
        cheatReason: info.reason,
      })
    } catch {}
  onEndInterview()
  }

  if (!problem) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-surface">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Invalid Interview Code</h2>
          <p className="text-gray-400 mb-4">The provided interview code is not valid.</p>
          <Button onClick={onBack} className="bg-primary hover:bg-primary-dark">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-surface">
  {/* Background anti-cheat scanning (UI hidden) */}
  <div className="sr-only">
    <AntiCheatMonitor onViolation={handleViolation} />
  </div>
  {pageLoading && <FullScreenLoader message="Preparing coding environment..." />}
      <div className="flex items-center justify-between p-4 border-b border-border bg-surface/30 backdrop-blur-sm">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-surface-hover">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{problem.title}</h1>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className="text-sm text-foreground-muted">Interview Code: {interviewCode}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Timer duration={duration} />
          <div className="flex items-center text-green-400 text-sm bg-green-900/20 px-3 py-1 rounded border border-green-700">
            <Shield className="mr-1 h-4 w-4" />
            Monitoring: Active
          </div>
          <Button onClick={onEndInterview} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10 bg-transparent">
            <Square className="mr-2 h-4 w-4" />
            End Interview
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className={`${isProblemCollapsed ? "w-8" : "w-2/5"} border-r border-border transition-all duration-300`}>
          {isProblemCollapsed ? (
            <div className="h-full flex items-center justify-center">
              <Button variant="ghost" size="sm" onClick={() => setIsProblemCollapsed(false)} className="rotate-90">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border bg-surface/20">
                <h3 className="font-medium">Problem Description</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsProblemCollapsed(true)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-foreground-secondary leading-relaxed">{problem.description}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-border bg-surface/20">
            <div className="flex items-center gap-4">
              <h3 className="font-medium">Code Editor</h3>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-32 h-8 bg-surface/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setCode(problem.starterCode[language])} variant="ghost" size="sm" className="text-foreground-secondary hover:text-foreground">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button onClick={handleRunSimple} disabled={isRunning} variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500/10 bg-transparent">
                <Play className="mr-2 h-4 w-4" />
                {isRunning ? "Running..." : "Run Code"}
              </Button>
              <Button onClick={handleRunCode} disabled={isRunning} className="bg-primary hover:bg-primary-dark disabled:opacity-50">
                <Play className="mr-2 h-4 w-4" />
                {isRunning ? "Testing..." : "Run Tests"}
              </Button>
              <Button onClick={handleSubmit} variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent">
                Submit
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            {isRunning && <FullScreenLoader message="Running code and tests..." />}
            <CodeEditor value={code} onChange={setCode} language={language} />
          </div>
          <div className="h-64 border-t border-border">
            <div className="flex items-center justify-between p-3 border-b border-border bg-surface/20">
              <h3 className="font-medium">Execution Results</h3>
              {testResults.length > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">{testResults.filter((r) => r.passed).length} passed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span className="text-red-400">{testResults.filter((r) => !r.passed).length} failed</span>
                  </div>
                  <div className="text-foreground-secondary">
                    Score: {Math.round((testResults.filter((r) => r.passed).length / testResults.length) * 100)}%
                  </div>
                </div>
              )}
            </div>
            <div className="h-full p-4 bg-background-tertiary/50 overflow-y-auto">
              <pre className="text-sm text-foreground font-mono whitespace-pre-wrap">
                {output || '// Click "Run Code" to execute your solution or "Run Tests" to test against all cases'}
              </pre>
            </div>
          </div>
        </div>

  {/* Camera monitor UI hidden during test-taking to avoid interference */}
      </div>
    </div>
  )
}
