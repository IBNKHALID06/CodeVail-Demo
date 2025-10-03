import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { 
  Award, 
  TrendingUp, 
  Clock, 
  Target, 
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Star
} from 'lucide-react'
import { getResults } from '@/lib/results-store'

export default function ResultsPage() {
  const { user } = useAuth()

  // Mock results data for candidates
  const personalStats = [
    {
      title: 'Overall Score',
      value: '78',
      subtitle: 'out of 100',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Interviews Taken',
      value: '12',
      subtitle: 'total attempts',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Success Rate',
      value: '67%',
      subtitle: 'pass rate',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Avg Duration',
      value: '42m',
      subtitle: 'per interview',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ]

  const interviewHistory = [
    {
      id: '1',
      company: 'TechCorp Inc.',
      position: 'Frontend Developer',
      date: '2024-01-15',
      score: 85,
      status: 'passed',
      duration: '45m',
      feedback: 'Strong React skills, good problem-solving approach'
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      date: '2024-01-10',
      score: 72,
      status: 'passed',
      duration: '40m',
      feedback: 'Good technical knowledge, could improve system design'
    },
    {
      id: '3',
      company: 'BigTech Solutions',
      position: 'Software Engineer',
      date: '2024-01-05',
      score: 45,
      status: 'failed',
      duration: '35m',
      feedback: 'Need to strengthen algorithms and data structures'
    },
    {
      id: '4',
      company: 'InnovateLab',
      position: 'Backend Developer',
      date: '2023-12-28',
      score: 89,
      status: 'passed',
      duration: '48m',
      feedback: 'Excellent performance, strong technical foundation'
    }
  ]

  const skillsBreakdown = [
    { skill: 'JavaScript/TypeScript', score: 85, level: 'Advanced' },
    { skill: 'React/Frontend', score: 80, level: 'Advanced' },
    { skill: 'Node.js/Backend', score: 72, level: 'Intermediate' },
    { skill: 'System Design', score: 65, level: 'Intermediate' },
    { skill: 'Algorithms & DS', score: 58, level: 'Beginner' },
    { skill: 'Database Design', score: 70, level: 'Intermediate' }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Advanced': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'Beginner': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const flagged = getResults().filter(r => r.status === 'TERMINATED')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Interview Results
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your progress and performance across all interviews
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>

        {flagged.length > 0 && (
          <div className="mb-4 p-4 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800">
            ⚠️ {flagged.length} session{flagged.length>1?'s':''} terminated due to suspected cheating.
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Interview History</TabsTrigger>
            <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
            <TabsTrigger value="improvement">Improvement Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Personal Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {personalStats.map((stat, index) => (
                <Card key={index} className={`relative overflow-hidden ${stat.bgColor}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                  <CardDescription>Your scores over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Performance chart coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Latest Achievement</CardTitle>
                  <CardDescription>Your most recent interview result</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">TechCorp Inc.</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Frontend Developer</p>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Passed
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Score</span>
                      <span className="font-semibold text-green-600">85/100</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    "Strong React skills, good problem-solving approach"
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interview History</CardTitle>
                <CardDescription>Complete record of all your interview attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interviewHistory.map((interview) => (
                    <div key={interview.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{interview.company}</h4>
                            <Badge variant={interview.status === 'passed' ? 'default' : 'destructive'}>
                              {interview.status === 'passed' ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {interview.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{interview.position}</p>
                          <p className="text-xs text-gray-500">{interview.date} • {interview.duration}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">
                            "{interview.feedback}"
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={`text-xl font-bold ${getScoreColor(interview.score)}`}>
                              {interview.score}%
                            </div>
                            <div className="text-xs text-gray-500">score</div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills Breakdown</CardTitle>
                <CardDescription>Your performance across different technical areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skillsBreakdown.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{skill.skill}</h4>
                          <Badge 
                            variant="secondary" 
                            className={getLevelColor(skill.level)}
                          >
                            {skill.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${getScoreColor(skill.score)}`}>
                            {skill.score}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={skill.score} className="flex-1 h-3" />
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.floor(skill.score / 20) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="improvement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Improvement Plan</CardTitle>
                <CardDescription>Recommendations based on your interview performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-red-700 dark:text-red-400">Priority Areas</h4>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Focus on algorithms and data structures (58% → target: 75%)</li>
                      <li>• Practice system design concepts (65% → target: 80%)</li>
                      <li>• Improve problem-solving speed and efficiency</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-400">Areas to Strengthen</h4>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Enhance backend development skills (72% → target: 85%)</li>
                      <li>• Deepen database design knowledge (70% → target: 80%)</li>
                      <li>• Practice explaining technical concepts clearly</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-green-700 dark:text-green-400">Your Strengths</h4>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Excellent JavaScript/TypeScript skills (85%)</li>
                      <li>• Strong React and frontend development (80%)</li>
                      <li>• Good communication and problem-solving approach</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                      Recommended Next Steps
                    </h4>
                    <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                      <li>1. Complete algorithm practice on LeetCode (focus on medium problems)</li>
                      <li>2. Study system design fundamentals (scaling, databases, caching)</li>
                      <li>3. Practice mock interviews to improve timing and clarity</li>
                      <li>4. Build a project demonstrating backend architecture skills</li>
                    </ol>
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
