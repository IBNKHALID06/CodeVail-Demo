import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Calendar,
  Download,
  Filter,
  Eye,
  Award
} from 'lucide-react'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  // Mock analytics data for interviewers
  const overviewStats = [
    {
      title: 'Total Interviews',
      value: '247',
      change: '+12%',
      trend: 'up',
      icon: Users,
      description: 'Interviews conducted this month'
    },
    {
      title: 'Average Score',
      value: '78.5',
      change: '+3.2%',
      trend: 'up',
      icon: Target,
      description: 'Average candidate performance'
    },
    {
      title: 'Pass Rate',
      value: '64%',
      change: '+8%',
      trend: 'up',
      icon: Award,
      description: 'Candidates meeting requirements'
    },
    {
      title: 'Avg Duration',
      value: '45m',
      change: '-2m',
      trend: 'down',
      icon: Clock,
      description: 'Average interview length'
    }
  ]

  const recentInterviews = [
    {
      id: '1',
      candidate: 'Sarah Johnson',
      position: 'Frontend Developer',
      date: '2024-01-15',
      score: 85,
      status: 'passed',
      duration: '42m'
    },
    {
      id: '2',
      candidate: 'Mike Chen',
      position: 'Full Stack Developer',
      date: '2024-01-14',
      score: 72,
      status: 'passed',
      duration: '38m'
    },
    {
      id: '3',
      candidate: 'Emma Wilson',
      position: 'Backend Developer',
      date: '2024-01-14',
      score: 45,
      status: 'failed',
      duration: '35m'
    },
    {
      id: '4',
      candidate: 'David Kumar',
      position: 'DevOps Engineer',
      date: '2024-01-13',
      score: 89,
      status: 'passed',
      duration: '52m'
    }
  ]

  const skillsAnalytics = [
    { skill: 'JavaScript', avgScore: 82, interviews: 45 },
    { skill: 'React', avgScore: 78, interviews: 38 },
    { skill: 'Node.js', avgScore: 75, interviews: 32 },
    { skill: 'Python', avgScore: 80, interviews: 28 },
    { skill: 'System Design', avgScore: 65, interviews: 25 }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Interview Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Comprehensive insights into your interview performance and candidate metrics
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewStats.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className={`flex items-center text-xs ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-3 w-3 mr-1 ${
                        stat.trend === 'down' ? 'rotate-180' : ''
                      }`} />
                      {stat.change}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Success Rate</CardTitle>
                  <CardDescription>Monthly pass/fail ratio</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chart visualization coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>Candidate performance distribution</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chart visualization coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Interviews</CardTitle>
                <CardDescription>Latest interview sessions and results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInterviews.map((interview) => (
                    <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{interview.candidate}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{interview.position}</p>
                        <p className="text-xs text-gray-500">{interview.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">{interview.score}%</div>
                          <div className="text-xs text-gray-500">{interview.duration}</div>
                        </div>
                        <Badge variant={interview.status === 'passed' ? 'default' : 'destructive'}>
                          {interview.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
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
                <CardTitle>Skills Performance Analysis</CardTitle>
                <CardDescription>Average scores by technical skill area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillsAnalytics.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{skill.skill}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {skill.interviews} interviews conducted
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${skill.avgScore}%` }}
                          ></div>
                        </div>
                        <div className="text-right min-w-16">
                          <div className="font-semibold">{skill.avgScore}%</div>
                          <div className="text-xs text-gray-500">avg score</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Interview metrics over time</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Trend analysis coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
