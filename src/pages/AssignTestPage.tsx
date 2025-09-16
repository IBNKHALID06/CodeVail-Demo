'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Separator } from '../../components/ui/separator'
import { Textarea } from '../../components/ui/textarea'
import { Checkbox } from '../../components/ui/checkbox'
import { 
  Clock, 
  Users, 
  Send, 
  Calendar, 
  ArrowLeft, 
  Search, 
  UserPlus, 
  Mail, 
  FileText,
  Target,
  Settings
} from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'

interface Test {
  id: string
  title: string
  description: string
  duration: number
  questions: any[]
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  passingScore: number
}

interface Candidate {
  id: string
  name: string
  email: string
  skills: string[]
  experience: string
  status: 'invited' | 'pending' | 'completed' | 'in-progress'
  score?: number
  assignedAt?: string
  completedAt?: string
}

interface Assignment {
  id: string
  testId: string
  candidateIds: string[]
  dueDate: string
  instructions: string
  allowRetake: boolean
  timeLimit?: number
  status: 'draft' | 'sent' | 'active' | 'completed'
  createdAt: string
}

export default function AssignTestPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [tests, setTests] = useState<Test[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [assignment, setAssignment] = useState<Partial<Assignment>>({
    dueDate: '',
    instructions: '',
    allowRetake: false,
    status: 'draft'
  })

  const [activeTab, setActiveTab] = useState('select-test')
  const [searchTerm, setSearchTerm] = useState('')
  const [newCandidateEmail, setNewCandidateEmail] = useState('')

  useEffect(() => {
    // Load tests from localStorage
    const savedTests = JSON.parse(localStorage.getItem('tests') || '[]')
    setTests(savedTests)

    // Load demo candidates
    const demoCandidates: Candidate[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: '3 years',
        status: 'pending'
      },
      {
        id: '2',
        name: 'Bob Smith',
        email: 'bob.smith@email.com',
        skills: ['Python', 'Django', 'PostgreSQL'],
        experience: '5 years',
        status: 'pending'
      },
      {
        id: '3',
        name: 'Carol Davis',
        email: 'carol.davis@email.com',
        skills: ['Java', 'Spring Boot', 'AWS'],
        experience: '4 years',
        status: 'completed',
        score: 85
      },
      {
        id: '4',
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        skills: ['TypeScript', 'Angular', 'MongoDB'],
        experience: '2 years',
        status: 'in-progress'
      }
    ]

    const savedCandidates = JSON.parse(localStorage.getItem('candidates') || JSON.stringify(demoCandidates))
    setCandidates(savedCandidates)
  }, [])

  const handleTestSelect = (test: Test) => {
    setSelectedTest(test)
    setActiveTab('select-candidates')
  }

  const handleCandidateToggle = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    )
  }

  const handleAddCandidate = () => {
    if (!newCandidateEmail) return

    const newCandidate: Candidate = {
      id: Date.now().toString(),
      name: newCandidateEmail.split('@')[0].replace(/[._]/g, ' '),
      email: newCandidateEmail,
      skills: [],
      experience: 'Not specified',
      status: 'pending'
    }

    const updatedCandidates = [...candidates, newCandidate]
    setCandidates(updatedCandidates)
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates))
    setNewCandidateEmail('')
  }

  const handleSendAssignment = () => {
    if (!selectedTest || selectedCandidates.length === 0) {
      alert('Please select a test and at least one candidate')
      return
    }

    if (!assignment.dueDate) {
      alert('Please set a due date')
      return
    }

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      testId: selectedTest.id,
      candidateIds: selectedCandidates,
      dueDate: assignment.dueDate || '',
      instructions: assignment.instructions || '',
      allowRetake: assignment.allowRetake || false,
      status: 'sent',
      createdAt: new Date().toISOString()
    }

    // Save assignment
    const existingAssignments = JSON.parse(localStorage.getItem('assignments') || '[]')
    localStorage.setItem('assignments', JSON.stringify([...existingAssignments, newAssignment]))

    // Update candidate statuses
    const updatedCandidates = candidates.map(candidate => 
      selectedCandidates.includes(candidate.id)
        ? { ...candidate, status: 'invited' as const, assignedAt: new Date().toISOString() }
        : candidate
    )
    setCandidates(updatedCandidates)
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates))

    alert(`Test assigned to ${selectedCandidates.length} candidate(s) successfully!`)
    router.push('/interviewer-dashboard')
  }

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'invited': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assign Test</h1>
                <p className="text-muted-foreground">Send coding assessments to candidates</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSendAssignment} disabled={!selectedTest || selectedCandidates.length === 0}>
                <Send className="w-4 h-4 mr-2" />
                Send Assignment
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
            <TabsTrigger value="select-test" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Select Test
            </TabsTrigger>
            <TabsTrigger value="select-candidates" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Select Candidates ({selectedCandidates.length})
            </TabsTrigger>
            <TabsTrigger value="configure" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configure
            </TabsTrigger>
          </TabsList>

          <TabsContent value="select-test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Tests</CardTitle>
                <CardDescription>Choose a test to assign to candidates</CardDescription>
              </CardHeader>
              <CardContent>
                {tests.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Tests Available</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first test to start assigning it to candidates
                    </p>
                    <Button onClick={() => router.push('/create-test')}>
                      Create Test
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tests.map((test) => (
                      <Card
                        key={test.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTest?.id === test.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => handleTestSelect(test)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold line-clamp-1">{test.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {test.description}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Badge className={getDifficultyColor(test.difficulty)}>
                                {test.difficulty}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {test.duration}m
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">
                                {test.questions.length} question(s)
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {test.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {test.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{test.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="select-candidates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Candidates</CardTitle>
                <CardDescription>Choose who will receive this test assignment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Add Candidate */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search candidates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="candidate@email.com"
                      value={newCandidateEmail}
                      onChange={(e) => setNewCandidateEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCandidate()}
                    />
                    <Button onClick={handleAddCandidate}>
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Candidates List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={selectedCandidates.includes(candidate.id)}
                        onCheckedChange={() => handleCandidateToggle(candidate.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium truncate">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {candidate.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(candidate.status)}>
                              {candidate.status}
                            </Badge>
                            {candidate.score && (
                              <Badge variant="outline">
                                {candidate.score}%
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {candidate.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{candidate.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedCandidates.length > 0 && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm font-medium">
                      {selectedCandidates.length} candidate(s) selected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configure" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Settings</CardTitle>
                  <CardDescription>Configure test assignment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="datetime-local"
                      value={assignment.dueDate}
                      onChange={(e) => setAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions for Candidates</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Additional instructions or notes for candidates..."
                      rows={4}
                      value={assignment.instructions}
                      onChange={(e) => setAssignment(prev => ({ ...prev, instructions: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowRetake"
                      checked={assignment.allowRetake}
                      onCheckedChange={(checked) => setAssignment(prev => ({ ...prev, allowRetake: checked as boolean }))}
                    />
                    <Label htmlFor="allowRetake">Allow retake if failed</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assignment Summary</CardTitle>
                  <CardDescription>Review before sending</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTest && (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium">Test</h4>
                        <p className="text-sm text-muted-foreground">{selectedTest.title}</p>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium">Recipients</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedCandidates.length} candidate(s) selected
                        </p>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Duration:</span>
                          <p className="text-muted-foreground">{selectedTest.duration} minutes</p>
                        </div>
                        <div>
                          <span className="font-medium">Questions:</span>
                          <p className="text-muted-foreground">{selectedTest.questions.length}</p>
                        </div>
                        <div>
                          <span className="font-medium">Difficulty:</span>
                          <Badge className={getDifficultyColor(selectedTest.difficulty)}>
                            {selectedTest.difficulty}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">Passing Score:</span>
                          <p className="text-muted-foreground">{selectedTest.passingScore}%</p>
                        </div>
                      </div>

                      {assignment.dueDate && (
                        <>
                          <Separator />
                          <div>
                            <span className="font-medium">Due Date:</span>
                            <p className="text-sm text-muted-foreground">
                              {new Date(assignment.dueDate).toLocaleString()}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
