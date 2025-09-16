// Application State
let currentScreen = "home"
let interviewTimer = null
let interviewStartTime = null
let currentInterviewCode = ""
let isValidating = false

// Mock data for problems
const PROBLEMS = {
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
      {
        input: 's = "()"',
        expected: "true",
        description: "Simple valid parentheses",
      },
      {
        input: 's = "()[]{}"',
        expected: "true",
        description: "Multiple types of brackets",
      },
      {
        input: 's = "(]"',
        expected: "false",
        description: "Mismatched brackets",
      },
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
• -5000 ≤ Node.val ≤ 5000`,
    starterCode: {
      javascript: `// Definition for singly-linked list
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function reverseList(head) {
    // Write your solution here
    
}`,
      python: `# Definition for singly-linked list
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    # Write your solution here
    pass`,
    },
    testCases: [
      {
        input: "head = [1,2,3,4,5]",
        expected: "[5,4,3,2,1]",
        description: "Standard linked list reversal",
      },
      {
        input: "head = [1,2]",
        expected: "[2,1]",
        description: "Two node list",
      },
      {
        input: "head = []",
        expected: "[]",
        description: "Empty list",
      },
    ],
  },
}

// Mock session history
let sessionHistory = [
  {
    id: "1",
    interviewCode: "TECH2024",
    title: "Two Sum Algorithm Challenge",
    language: "javascript",
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    duration: 1800, // 30 minutes
    status: "completed",
    score: 85,
  },
  {
    id: "2",
    interviewCode: "INTERVIEW123",
    title: "Valid Parentheses Challenge",
    language: "python",
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    duration: 1200, // 20 minutes
    status: "completed",
    score: 92,
  },
]

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  loadSessionHistory()
  startSecurityMonitoring()
})

// Application initialization
function initializeApp() {
  showScreen("home")

  // Load saved sessions from localStorage
  const saved = localStorage.getItem("codevail-sessions")
  if (saved) {
    try {
      sessionHistory = JSON.parse(saved)
    } catch (e) {
      console.warn("Failed to load session history:", e)
    }
  }
}

// Screen management
function showScreen(screenName) {
  // Hide all screens
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active")
  })

  // Show target screen
  const targetScreen = document.getElementById(screenName + "-screen")
  if (targetScreen) {
    targetScreen.classList.add("active")
    currentScreen = screenName

    // Screen-specific initialization
    if (screenName === "history") {
      loadSessionHistory()
    }
  }
}

function showHomeScreen() {
  showScreen("home")
}

function showInterviewCodeScreen() {
  showScreen("interview-code")
  // Focus on input
  setTimeout(() => {
    const input = document.getElementById("interview-code-input")
    if (input) input.focus()
  }, 100)
}

function showHistoryScreen() {
  showScreen("history")
}

function showInterviewScreen(code) {
  currentInterviewCode = code
  showScreen("interview")
  initializeInterview(code)
}

// Window controls
function minimizeWindow() {
  console.log("Minimize window")
  // In a real desktop app, this would minimize the window
}

function toggleMaximize() {
  console.log("Toggle maximize")
  // In a real desktop app, this would toggle maximize/restore
}

function closeWindow() {
  if (confirm("Are you sure you want to close CodeVail?")) {
    console.log("Close window")
    // In a real desktop app, this would close the window
  }
}

// Interview code validation
function handleCodeInput(input) {
  const value = input.value.toUpperCase()
  input.value = value

  // Clear any existing errors
  hideValidationError()

  // Enable/disable submit button
  const submitBtn = document.getElementById("start-interview-btn")
  submitBtn.disabled = value.length < 6

  // Remove error styling
  input.classList.remove("error")
}

function handleCodeKeyPress(event) {
  if (event.key === "Enter" && !isValidating) {
    validateAndStart()
  }
}

function setDemoCode(code) {
  const input = document.getElementById("interview-code-input")
  input.value = code
  handleCodeInput(input)
}

function validateAndStart() {
  if (isValidating) return

  const input = document.getElementById("interview-code-input")
  const code = input.value.trim()

  if (!code) {
    showValidationError("Please enter an interview code")
    return
  }

  if (code.length < 6) {
    showValidationError("Interview code must be at least 6 characters")
    return
  }

  // Start validation
  isValidating = true
  showLoadingState(true)

  // Simulate API validation
  setTimeout(() => {
    const validCodes = ["TECH2024", "INTERVIEW123", "CODING456", "ASSESS789"]
    const isValid = validCodes.includes(code)

    if (isValid) {
      showInterviewScreen(code)
    } else {
      showValidationError("Invalid interview code. Please check and try again.")
      input.classList.add("error")
    }

    isValidating = false
    showLoadingState(false)
  }, 1500)
}

function showValidationError(message) {
  const errorElement = document.getElementById("validation-error")
  const errorText = errorElement.querySelector("span")
  errorText.textContent = message
  errorElement.classList.remove("hidden")
}

function hideValidationError() {
  const errorElement = document.getElementById("validation-error")
  errorElement.classList.add("hidden")
}

function showLoadingState(loading) {
  const btn = document.getElementById("start-interview-btn")
  const btnText = btn.querySelector(".btn-text")
  const btnLoading = btn.querySelector(".btn-loading")
  const btnIcon = btn.querySelector(".btn-icon")

  if (loading) {
    btnText.style.display = "none"
    btnIcon.style.display = "none"
    btnLoading.classList.remove("hidden")
    btn.disabled = true
  } else {
    btnText.style.display = "inline"
    btnIcon.style.display = "inline"
    btnLoading.classList.add("hidden")
    btn.disabled = false
  }
}

// Session history management
function loadSessionHistory() {
  const historyContent = document.getElementById("history-content")

  if (sessionHistory.length === 0) {
    historyContent.innerHTML = `
            <div class="history-empty">
                <i class="fas fa-code"></i>
                <h3>No coding sessions found</h3>
                <p>Complete your first coding challenge to see session history</p>
            </div>
        `
    return
  }

  const historyHTML = sessionHistory
    .map(
      (session) => `
        <div class="history-item" onclick="viewSession('${session.id}')">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--foreground); margin-bottom: 4px;">
                        ${session.title}
                    </h3>
                    <div class="flex items-center gap-4" style="font-size: 14px; color: var(--foreground-secondary);">
                        <span><i class="fas fa-calendar"></i> ${formatDate(session.date)}</span>
                        <span><i class="fas fa-clock"></i> ${formatDuration(session.duration)}</span>
                        <span class="difficulty ${session.status === "completed" ? "easy" : "warning"}" style="padding: 2px 8px;">
                            ${session.status}
                        </span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 24px; font-weight: 700; color: var(--success); margin-bottom: 4px;">
                        ${session.score || 0}%
                    </div>
                    <div style="font-size: 12px; color: var(--foreground-muted);">
                        ${session.language.toUpperCase()}
                    </div>
                </div>
            </div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--foreground-secondary); background: rgba(15, 23, 42, 0.3); padding: 12px; border-radius: 8px;">
                Interview Code: ${session.interviewCode}
            </div>
        </div>
    `,
    )
    .join("")

  historyContent.innerHTML = historyHTML
}

function viewSession(sessionId) {
  const session = sessionHistory.find((s) => s.id === sessionId)
  if (session) {
    // For now, just show an alert. In a real app, this would open the session details
    alert(`Viewing session: ${session.title}\nScore: ${session.score}%\nDuration: ${formatDuration(session.duration)}`)
  }
}

// Interview functionality
function initializeInterview(code) {
  const problem = PROBLEMS[code]
  if (!problem) {
    alert("Problem not found for code: " + code)
    showHomeScreen()
    return
  }

  // Set problem details
  document.getElementById("problem-title").textContent = problem.title
  document.getElementById("current-code").textContent = code
  document.getElementById("problem-description").textContent = problem.description

  // Set initial code
  const editor = document.getElementById("code-editor")
  const languageSelect = document.getElementById("language-select")
  const currentLanguage = languageSelect.value
  editor.value = problem.starterCode[currentLanguage] || ""

  // Start timer
  startInterviewTimer()

  // Initialize security monitoring
  initializeSecurityPanel()

  // Clear output
  document.getElementById("output-display").textContent =
    '// Click "Run Code" to execute your solution or "Run Tests" to test against all cases'

  // Hide test summary
  document.getElementById("test-summary").classList.add("hidden")
}

function startInterviewTimer() {
  interviewStartTime = Date.now()

  if (interviewTimer) {
    clearInterval(interviewTimer)
  }

  interviewTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - interviewStartTime) / 1000)
    document.getElementById("timer-value").textContent = formatTime(elapsed)
  }, 1000)
}

function endInterview() {
  if (confirm("Are you sure you want to end the interview?")) {
    if (interviewTimer) {
      clearInterval(interviewTimer)
      interviewTimer = null
    }

    // Save session to history
    const elapsed = Math.floor((Date.now() - interviewStartTime) / 1000)
    const newSession = {
      id: Date.now().toString(),
      interviewCode: currentInterviewCode,
      title: PROBLEMS[currentInterviewCode]?.title || "Unknown Problem",
      language: document.getElementById("language-select").value,
      date: new Date().toISOString(),
      duration: elapsed,
      status: "completed",
      score: Math.floor(Math.random() * 40) + 60, // Mock score
    }

    sessionHistory.unshift(newSession)
    localStorage.setItem("codevail-sessions", JSON.stringify(sessionHistory))

    showHomeScreen()
  }
}

function changeLanguage(language) {
  const problem = PROBLEMS[currentInterviewCode]
  if (problem && problem.starterCode[language]) {
    const editor = document.getElementById("code-editor")
    editor.value = problem.starterCode[language]
  }
}

function resetCode() {
  const problem = PROBLEMS[currentInterviewCode]
  const language = document.getElementById("language-select").value
  if (problem && problem.starterCode[language]) {
    const editor = document.getElementById("code-editor")
    editor.value = problem.starterCode[language]
  }
}

function runCode() {
  const output = document.getElementById("output-display")
  output.textContent = "🔄 Running code...\n"

  setTimeout(() => {
    output.textContent = `✅ Code executed successfully!

Output:
[0, 1]

⚡ Execution time: 23.45ms
💾 Memory usage: ~1MB`
  }, 1000)
}

function runTests() {
  const problem = PROBLEMS[currentInterviewCode]
  if (!problem) return

  const output = document.getElementById("output-display")
  output.textContent = "🔄 Executing code...\n"

  setTimeout(() => {
    // Mock test results
    const testResults = problem.testCases.map((testCase, index) => {
      const passed = Math.random() > 0.3 // 70% pass rate for demo
      return {
        index: index + 1,
        passed,
        description: testCase.description,
        input: testCase.input,
        expected: testCase.expected,
        actual: passed ? testCase.expected : "undefined",
        executionTime: Math.random() * 50 + 10,
      }
    })

    const passedCount = testResults.filter((r) => r.passed).length
    const totalCount = testResults.length
    const score = Math.round((passedCount / totalCount) * 100)

    // Update test summary
    document.getElementById("tests-passed").textContent = passedCount
    document.getElementById("tests-failed").textContent = totalCount - passedCount
    document.getElementById("test-score").textContent = score
    document.getElementById("test-summary").classList.remove("hidden")

    // Generate output
    let outputText = "📊 Test Results:\n\n"

    testResults.forEach((result) => {
      const status = result.passed ? "✅ PASSED" : "❌ FAILED"
      outputText += `Test Case ${result.index}: ${status}\n`
      outputText += `  Description: ${result.description}\n`
      outputText += `  Input: ${result.input}\n`
      outputText += `  Expected: ${result.expected}\n`
      outputText += `  Actual: ${result.actual}\n`
      outputText += `  Execution Time: ${result.executionTime.toFixed(2)}ms\n\n`
    })

    outputText += `📈 Summary: ${passedCount}/${totalCount} test cases passed\n`

    if (passedCount === totalCount) {
      outputText += "🎉 Congratulations! All tests passed!\n"
      outputText += "💡 Consider edge cases and optimization opportunities.\n"
    } else {
      outputText += "⚠️ Some tests failed. Review your logic and try again.\n"
      outputText += "💭 Debug tip: Check the failed test cases above.\n"
    }

    const avgTime = testResults.reduce((sum, r) => sum + r.executionTime, 0) / testResults.length
    outputText += `\n⚡ Average execution time: ${avgTime.toFixed(2)}ms`

    output.textContent = outputText
  }, 2000)
}

function submitSolution() {
  const output = document.getElementById("output-display")
  const testSummary = document.getElementById("test-summary")

  let score = 0
  if (!testSummary.classList.contains("hidden")) {
    score = Number.parseInt(document.getElementById("test-score").textContent) || 0
  }

  output.textContent = `🎯 Solution submitted successfully!

📊 Final Score: ${score}% 
⏱️ Total Time: ${document.getElementById("timer-value").textContent}
💻 Language: ${document.getElementById("language-select").value.charAt(0).toUpperCase() + document.getElementById("language-select").value.slice(1)}

Your solution has been saved and will be reviewed by the interviewer.

${
  score === 100
    ? "🏆 Perfect score! Excellent work!"
    : score >= 70
      ? "👍 Good job! Consider optimizing further."
      : "📚 Keep practicing! Review the failed test cases."
}

Thank you for completing the coding challenge!`
}

function toggleProblemPanel() {
  const panel = document.getElementById("problem-panel")
  const btn = panel.querySelector(".collapse-btn i")

  if (panel.classList.contains("collapsed")) {
    panel.classList.remove("collapsed")
    btn.className = "fas fa-chevron-left"
  } else {
    panel.classList.add("collapsed")
    btn.className = "fas fa-chevron-right"
  }
}

// Security monitoring
function initializeSecurityPanel() {
  const processList = document.getElementById("process-list")
  const mockProcesses = [
    { name: "chrome.exe", status: "safe" },
    { name: "code.exe", status: "safe" },
    { name: "explorer.exe", status: "safe" },
    { name: "system.exe", status: "safe" },
  ]

  processList.innerHTML = mockProcesses
    .map(
      (process) => `
        <div class="process-item">
            <span>${process.name}</span>
            <div class="process-status"></div>
        </div>
    `,
    )
    .join("")
}

function startSecurityMonitoring() {
  // Update uptime every minute
  setInterval(() => {
    const uptimeElement = document.getElementById("uptime")
    if (uptimeElement) {
      const uptime = Math.floor(Date.now() / 60000) % 1440 // Mock uptime in minutes
      const hours = Math.floor(uptime / 60)
      const minutes = uptime % 60
      uptimeElement.textContent = `${hours}h ${minutes}m`
    }
  }, 60000)
}

// Utility functions
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}m ${secs}s`
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Keyboard shortcuts
document.addEventListener("keydown", (event) => {
  // Ctrl/Cmd + Enter to run code in interview screen
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && currentScreen === "interview") {
    event.preventDefault()
    runCode()
  }

  // Escape to go back
  if (event.key === "Escape" && currentScreen !== "home") {
    event.preventDefault()
    if (currentScreen === "interview") {
      if (confirm("Are you sure you want to end the interview?")) {
        endInterview()
      }
    } else {
      showHomeScreen()
    }
  }
})

// Prevent context menu and selection in production
document.addEventListener("contextmenu", (event) => {
  event.preventDefault()
})

document.addEventListener("selectstart", (event) => {
  if (event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA") {
    event.preventDefault()
  }
})
