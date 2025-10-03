"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useNotification } from "../contexts/NotificationContext"
import { Logo } from "../components/Logo"
import { ThemeToggle } from "../components/ThemeToggle"
import { Plus, Trash2, Save, Eye, Code, Clock, Settings, ArrowLeft, FileText, CheckCircle, X } from "lucide-react"

interface TestQuestion {
  id: string
  type: "coding" | "multiple-choice" | "short-answer"
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  points: number
  timeLimit?: number
  code?: {
    language: string
    template: string
    testCases: Array<{ input: string; expectedOutput: string }>
  }
  options?: Array<{ id: string; text: string; isCorrect: boolean }>
}

interface Test {
  id: string
  title: string
  description: string
  duration: number
  totalPoints: number
  difficulty: "easy" | "medium" | "hard"
  category: string
  questions: TestQuestion[]
  settings: {
    allowCodeExecution: boolean
    showResults: boolean
    randomizeQuestions: boolean
    preventCheating: boolean
  }
}

export default function TestBuilderPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addNotification } = useNotification()

  const [test, setTest] = useState<Test>({
    id: "",
    title: "",
    description: "",
    duration: 60,
    totalPoints: 0,
    difficulty: "medium",
    category: "Frontend",
    questions: [],
    settings: {
      allowCodeExecution: true,
      showResults: true,
      randomizeQuestions: false,
      preventCheating: true,
    },
  })

  const [activeTab, setActiveTab] = useState<"details" | "questions" | "settings">("details")
  const [selectedQuestion, setSelectedQuestion] = useState<TestQuestion | null>(null)
  const [showQuestionModal, setShowQuestionModal] = useState(false)

  const categories = ["Frontend", "Backend", "Full Stack", "Data Science", "DevOps", "Mobile", "AI/ML"]
  const languages = ["JavaScript", "Python", "Java", "C++", "TypeScript", "Go", "Rust", "PHP"]

  const addQuestion = (type: TestQuestion["type"]) => {
    const newQuestion: TestQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: "",
      description: "",
      difficulty: "medium",
      points: type === "coding" ? 50 : 10,
      ...(type === "coding" && {
        code: {
          language: "JavaScript",
          template: "// Write your solution here\nfunction solution() {\n  \n}",
          testCases: [{ input: "", expectedOutput: "" }],
        },
      }),
      ...(type === "multiple-choice" && {
        options: [
          { id: "1", text: "", isCorrect: false },
          { id: "2", text: "", isCorrect: false },
        ],
      }),
    }

    setSelectedQuestion(newQuestion)
    setShowQuestionModal(true)
  }

  const saveQuestion = (question: TestQuestion) => {
    if (test.questions.find((q) => q.id === question.id)) {
      setTest((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => (q.id === question.id ? question : q)),
      }))
    } else {
      setTest((prev) => ({
        ...prev,
        questions: [...prev.questions, question],
        totalPoints: prev.totalPoints + question.points,
      }))
    }
    setShowQuestionModal(false)
    setSelectedQuestion(null)
  }

  const deleteQuestion = (questionId: string) => {
    const question = test.questions.find((q) => q.id === questionId)
    if (question) {
      setTest((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.id !== questionId),
        totalPoints: prev.totalPoints - question.points,
      }))
    }
  }

  const saveTest = () => {
    if (!test.title || test.questions.length === 0) {
      addNotification({
        type: "error",
        message: "Please add a title and at least one question",
      })
      return
    }

    // Save test logic here
    addNotification({
      type: "success",
      message: "Test saved successfully!",
    })

    navigate("/dashboard")
  }

  const previewTest = () => {
    // Preview test logic here
    addNotification({
      type: "info",
      message: "Test preview opened",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <Logo />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={previewTest}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Eye size={16} />
                Preview
              </button>
              <button
                onClick={saveTest}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save size={16} />
                Save Test
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Overview</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Questions</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{test.questions.length} added</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{test.duration} minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle className="text-purple-600" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Total Points</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{test.totalPoints} points</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "details"
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FileText size={16} />
                    Test Details
                  </button>
                  <button
                    onClick={() => setActiveTab("questions")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "questions"
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Code size={16} />
                    Questions
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "settings"
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Test Details Tab */}
              {activeTab === "details" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Test Details</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Test Title
                      </label>
                      <input
                        type="text"
                        value={test.title}
                        onChange={(e) => setTest((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter test title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={test.description}
                        onChange={(e) => setTest((prev) => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe what this test covers"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          value={test.duration}
                          onChange={(e) =>
                            setTest((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) || 0 }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Difficulty
                        </label>
                        <select
                          value={test.difficulty}
                          onChange={(e) => setTest((prev) => ({ ...prev, difficulty: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          value={test.category}
                          onChange={(e) => setTest((prev) => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions Tab */}
              {activeTab === "questions" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Questions</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addQuestion("coding")}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Plus size={16} />
                        Coding
                      </button>
                      <button
                        onClick={() => addQuestion("multiple-choice")}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Plus size={16} />
                        Multiple Choice
                      </button>
                      <button
                        onClick={() => addQuestion("short-answer")}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                      >
                        <Plus size={16} />
                        Short Answer
                      </button>
                    </div>
                  </div>

                  {test.questions.length === 0 ? (
                    <div className="text-center py-12">
                      <Code className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No questions yet</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Get started by adding your first question.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {test.questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Question {index + 1}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    question.type === "coding"
                                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                                      : question.type === "multiple-choice"
                                        ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                                        : "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400"
                                  }`}
                                >
                                  {question.type.replace("-", " ")}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    question.difficulty === "easy"
                                      ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                                      : question.difficulty === "medium"
                                        ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
                                        : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                                  }`}
                                >
                                  {question.difficulty}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {question.points} points
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                {question.title || "Untitled Question"}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {question.description || "No description"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => {
                                  setSelectedQuestion(question)
                                  setShowQuestionModal(true)
                                }}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit question"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => deleteQuestion(question.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete question"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Test Settings</h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Allow Code Execution</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enable candidates to run and test their code
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={test.settings.allowCodeExecution}
                          onChange={(e) =>
                            setTest((prev) => ({
                              ...prev,
                              settings: { ...prev.settings, allowCodeExecution: e.target.checked },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Show Results</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Display results immediately after test completion
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={test.settings.showResults}
                          onChange={(e) =>
                            setTest((prev) => ({
                              ...prev,
                              settings: { ...prev.settings, showResults: e.target.checked },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Randomize Questions</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Present questions in random order for each candidate
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={test.settings.randomizeQuestions}
                          onChange={(e) =>
                            setTest((prev) => ({
                              ...prev,
                              settings: { ...prev.settings, randomizeQuestions: e.target.checked },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Prevent Cheating</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enable anti-cheat monitoring and restrictions
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={test.settings.preventCheating}
                          onChange={(e) =>
                            setTest((prev) => ({
                              ...prev,
                              settings: { ...prev.settings, preventCheating: e.target.checked },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Question Modal */}
      {showQuestionModal && selectedQuestion && (
        <QuestionModal
          question={selectedQuestion}
          onSave={saveQuestion}
          onClose={() => {
            setShowQuestionModal(false)
            setSelectedQuestion(null)
          }}
          languages={languages}
        />
      )}
    </div>
  )
}

// Question Modal Component
function QuestionModal({
  question,
  onSave,
  onClose,
  languages,
}: {
  question: TestQuestion
  onSave: (question: TestQuestion) => void
  onClose: () => void
  languages: string[]
}) {
  const [editedQuestion, setEditedQuestion] = useState<TestQuestion>(question)

  const addTestCase = () => {
    if (editedQuestion.code) {
      setEditedQuestion((prev) => ({
        ...prev,
        code: {
          ...prev.code!,
          testCases: [...prev.code!.testCases, { input: "", expectedOutput: "" }],
        },
      }))
    }
  }

  const removeTestCase = (index: number) => {
    if (editedQuestion.code) {
      setEditedQuestion((prev) => ({
        ...prev,
        code: {
          ...prev.code!,
          testCases: prev.code!.testCases.filter((_, i) => i !== index),
        },
      }))
    }
  }

  const addOption = () => {
    if (editedQuestion.options) {
      const newId = (editedQuestion.options.length + 1).toString()
      setEditedQuestion((prev) => ({
        ...prev,
        options: [...prev.options!, { id: newId, text: "", isCorrect: false }],
      }))
    }
  }

  const removeOption = (optionId: string) => {
    if (editedQuestion.options) {
      setEditedQuestion((prev) => ({
        ...prev,
        options: prev.options!.filter((opt) => opt.id !== optionId),
      }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {question.id ? "Edit Question" : "Add Question"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question Title</label>
              <input
                type="text"
                value={editedQuestion.title}
                onChange={(e) => setEditedQuestion((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter question title"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                <select
                  value={editedQuestion.difficulty}
                  onChange={(e) => setEditedQuestion((prev) => ({ ...prev, difficulty: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Points</label>
                <input
                  type="number"
                  value={editedQuestion.points}
                  onChange={(e) =>
                    setEditedQuestion((prev) => ({ ...prev, points: Number.parseInt(e.target.value) || 0 }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              value={editedQuestion.description}
              onChange={(e) => setEditedQuestion((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the question and requirements"
            />
          </div>

          {/* Coding Question Specific */}
          {editedQuestion.type === "coding" && editedQuestion.code && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Programming Language
                </label>
                <select
                  value={editedQuestion.code.language}
                  onChange={(e) =>
                    setEditedQuestion((prev) => ({
                      ...prev,
                      code: { ...prev.code!, language: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code Template</label>
                <textarea
                  value={editedQuestion.code.template}
                  onChange={(e) =>
                    setEditedQuestion((prev) => ({
                      ...prev,
                      code: { ...prev.code!, template: e.target.value },
                    }))
                  }
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Enter starter code template"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Test Cases</label>
                  <button
                    onClick={addTestCase}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <Plus size={14} />
                    Add Test Case
                  </button>
                </div>
                <div className="space-y-3">
                  {editedQuestion.code.testCases.map((testCase, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Input</label>
                        <input
                          type="text"
                          value={testCase.input}
                          onChange={(e) => {
                            const newTestCases = [...editedQuestion.code!.testCases]
                            newTestCases[index].input = e.target.value
                            setEditedQuestion((prev) => ({
                              ...prev,
                              code: { ...prev.code!, testCases: newTestCases },
                            }))
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Input value"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Expected Output
                          </label>
                          <input
                            type="text"
                            value={testCase.expectedOutput}
                            onChange={(e) => {
                              const newTestCases = [...editedQuestion.code!.testCases]
                              newTestCases[index].expectedOutput = e.target.value
                              setEditedQuestion((prev) => ({
                                ...prev,
                                code: { ...prev.code!, testCases: newTestCases },
                              }))
                            }}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Expected output"
                          />
                        </div>
                        <button
                          onClick={() => removeTestCase(index)}
                          className="mt-5 p-1 text-red-600 hover:text-red-700 transition-colors"
                          title="Remove test case"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Multiple Choice Question Specific */}
          {editedQuestion.type === "multiple-choice" && editedQuestion.options && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Answer Options</label>
                <button
                  onClick={addOption}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                >
                  <Plus size={14} />
                  Add Option
                </button>
              </div>
              <div className="space-y-3">
                {editedQuestion.options.map((option, index) => (
                  <div
                    key={option.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <input
                      type="radio"
                      name="correct-answer"
                      checked={option.isCorrect}
                      onChange={() => {
                        const newOptions = editedQuestion.options!.map((opt) => ({
                          ...opt,
                          isCorrect: opt.id === option.id,
                        }))
                        setEditedQuestion((prev) => ({ ...prev, options: newOptions }))
                      }}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = editedQuestion.options!.map((opt) =>
                          opt.id === option.id ? { ...opt, text: e.target.value } : opt,
                        )
                        setEditedQuestion((prev) => ({ ...prev, options: newOptions }))
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${index + 1}`}
                    />
                    <button
                      onClick={() => removeOption(option.id)}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      title="Remove option"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editedQuestion)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save Question
          </button>
        </div>
      </div>
    </div>
  )
}
