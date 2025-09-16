'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Separator } from '../../components/ui/separator'
import { Clock, Plus, X, Code, FileText, Save, Eye, ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'

interface Question {
  id: string
  title: string
  description: string
  type: 'coding' | 'multiple-choice' | 'essay'
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit: number
  points: number
  options?: string[]
  correctAnswer?: string | number
  testCases?: { input: string; output: string }[]
  language?: string
  starterCode?: string
}

interface Test {
  id: string
  title: string
  description: string
  duration: number
  questions: Question[]
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  isPublic: boolean
  passingScore: number
}

export default function CreateTestPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [test, setTest] = useState<Test>({
    id: '',
    title: '',
    description: '',
    duration: 60,
    questions: [],
    difficulty: 'medium',
    tags: [],
    isPublic: false,
    passingScore: 70
  })

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    title: '',
    description: '',
    type: 'coding',
    difficulty: 'medium',
    timeLimit: 30,
    points: 10,
    language: 'javascript',
    starterCode: ''
  })

  const [newTag, setNewTag] = useState('')
  const [activeTab, setActiveTab] = useState('details')
  const [previewMode, setPreviewMode] = useState(false)

  const handleAddQuestion = () => {
    if (!currentQuestion.title || !currentQuestion.description) {
      alert('Please fill in question title and description')
      return
    }

    const questionWithId = {
      ...currentQuestion,
      id: Date.now().toString()
    }

    setTest(prev => ({
      ...prev,
      questions: [...prev.questions, questionWithId]
    }))

    // Reset current question
    setCurrentQuestion({
      id: '',
      title: '',
      description: '',
      type: 'coding',
      difficulty: 'medium',
      timeLimit: 30,
      points: 10,
      language: 'javascript',
      starterCode: ''
    })
  }

  const handleRemoveQuestion = (questionId: string) => {
    setTest(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }))
  }

  const handleAddTag = () => {
    if (newTag && !test.tags.includes(newTag)) {
      setTest(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTest(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleSaveTest = () => {
    if (!test.title || !test.description || test.questions.length === 0) {
      alert('Please fill in all required fields and add at least one question')
      return
    }

    const testWithId = {
      ...test,
      id: Date.now().toString()
    }

    // Save to localStorage for demo
    const existingTests = JSON.parse(localStorage.getItem('tests') || '[]')
    localStorage.setItem('tests', JSON.stringify([...existingTests, testWithId]))

    alert('Test created successfully!')
    router.push('/interviewer-dashboard')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'coding': return <Code className="w-4 h-4" />
      case 'multiple-choice': return <FileText className="w-4 h-4" />
      case 'essay': return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Test</h1>
                <p className="text-muted-foreground">Build comprehensive coding assessments</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button onClick={handleSaveTest}>
                <Save className="w-4 h-4 mr-2" />
                Save Test
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Test Details</TabsTrigger>
            <TabsTrigger value="questions">Questions ({test.questions.length})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Set up the fundamental details of your test</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Test Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., JavaScript Developer Assessment"
                      value={test.title}
                      onChange={(e) => setTest(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="60"
                      value={test.duration}
                      onChange={(e) => setTest(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this test evaluates..."
                    rows={3}
                    value={test.description}
                    onChange={(e) => setTest(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Overall Difficulty</Label>
                    <Select value={test.difficulty} onValueChange={(value) => setTest(prev => ({ ...prev, difficulty: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Input
                      id="passingScore"
                      type="number"
                      min="0"
                      max="100"
                      value={test.passingScore}
                      onChange={(e) => setTest(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 70 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {test.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button type="button" onClick={handleAddTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Question Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Question</CardTitle>
                  <CardDescription>Create coding, multiple choice, or essay questions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="questionTitle">Question Title</Label>
                    <Input
                      id="questionTitle"
                      placeholder="e.g., Implement a Binary Search Tree"
                      value={currentQuestion.title}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="questionDescription">Description</Label>
                    <Textarea
                      id="questionDescription"
                      placeholder="Detailed question description..."
                      rows={4}
                      value={currentQuestion.description}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={currentQuestion.type} onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, type: value as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="coding">Coding</SelectItem>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="essay">Essay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select value={currentQuestion.difficulty} onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, difficulty: value as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeLimit">Time Limit (min)</Label>
                      <Input
                        id="timeLimit"
                        type="number"
                        value={currentQuestion.timeLimit}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 30 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="points">Points</Label>
                      <Input
                        id="points"
                        type="number"
                        value={currentQuestion.points}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 10 }))}
                      />
                    </div>
                  </div>

                  {currentQuestion.type === 'coding' && (
                    <>
                      <div className="space-y-2">
                        <Label>Programming Language</Label>
                        <Select value={currentQuestion.language} onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, language: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="cpp">C++</SelectItem>
                            <SelectItem value="csharp">C#</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="starterCode">Starter Code (Optional)</Label>
                        <Textarea
                          id="starterCode"
                          placeholder="// Starter code here..."
                          rows={4}
                          value={currentQuestion.starterCode}
                          onChange={(e) => setCurrentQuestion(prev => ({ ...prev, starterCode: e.target.value }))}
                        />
                      </div>
                    </>
                  )}

                  <Button onClick={handleAddQuestion} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </CardContent>
              </Card>

              {/* Questions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Questions ({test.questions.length})</CardTitle>
                  <CardDescription>Review and manage your test questions</CardDescription>
                </CardHeader>
                <CardContent>
                  {test.questions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No questions added yet. Create your first question to get started.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {test.questions.map((question) => (
                        <div
                          key={question.id}
                          className="border rounded-lg p-4 space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {getTypeIcon(question.type)}
                                <h4 className="font-medium">{question.title}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {question.description}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveQuestion(question.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <Badge className={getDifficultyColor(question.difficulty)}>
                                {question.difficulty}
                              </Badge>
                              <span className="text-muted-foreground capitalize">
                                {question.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {question.timeLimit}m • {question.points}pts
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Settings</CardTitle>
                <CardDescription>Configure advanced test options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isPublic">Make Test Public</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow other interviewers to use this test
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={test.isPublic}
                    onChange={(e) => setTest(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="rounded"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Test Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{test.questions.length}</div>
                      <div className="text-sm text-muted-foreground">Questions</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{test.duration}</div>
                      <div className="text-sm text-muted-foreground">Minutes</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">
                        {test.questions.reduce((sum, q) => sum + q.points, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Points</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{test.passingScore}%</div>
                      <div className="text-sm text-muted-foreground">Passing Score</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
