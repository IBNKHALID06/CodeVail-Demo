import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, AlertTriangle, Eye, Clock, Search, Filter, Shield, Activity, CheckCircle, XCircle, Pause, Play } from 'lucide-react'
import { CandidateSession } from '@/app/proctor/page'

interface ProctorDashboardProps {
  sessions: CandidateSession[]
  onSessionSelect: (sessionId: string) => void
}

export function ProctorDashboard({ sessions, onSessionSelect }: ProctorDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900/20 border-green-700'
      case 'flagged': return 'text-red-400 bg-red-900/20 border-red-700'
      case 'paused': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700'
      case 'completed': return 'text-blue-400 bg-blue-900/20 border-blue-700'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />
      case 'flagged': return <AlertTriangle className="h-4 w-4" />
      case 'paused': return <Pause className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <XCircle className="h-4 w-4" />
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    return `${minutes}m ${secs}s`
  }

  const formatLastActivity = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const activeSessions = sessions.filter(s => s.status === 'active').length
  const flaggedSessions = sessions.filter(s => s.status === 'flagged').length
  const totalAlerts = sessions.reduce((sum, s) => sum + s.securityAlerts.filter(a => !a.resolved).length, 0)

  return (
    <div className="h-full flex flex-col p-6 bg-gradient-surface">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Shield className="h-8 w-8 mr-3 text-primary" />
              Proctor Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Monitor and manage active interview sessions</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Live Monitoring</div>
            <div className="flex items-center text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="font-mono">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
    <div className="grid grid-cols-4 gap-4 mb-6">
      <Card className="bg-surface/50 border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Sessions</p>
        <p className="text-2xl font-bold text-green-400">{activeSessions}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </Card>
      <Card className="bg-surface/50 border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Flagged Sessions</p>
                <p className="text-2xl font-bold text-red-400">{flaggedSessions}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </Card>
      <Card className="bg-surface/50 border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Security Alerts</p>
                <p className="text-2xl font-bold text-yellow-400">{totalAlerts}</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-400" />
            </div>
          </Card>
      <Card className="bg-surface/50 border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Sessions</p>
                <p className="text-2xl font-bold text-blue-400">{sessions.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-surface/50 border-border focus:border-primary"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-surface/50 border-border">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface border-border">
              <SelectItem value="all">All Sessions</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-4">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="bg-surface/50 border-border p-6 hover:bg-surface-hover transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold mr-3">{session.candidateName}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center ${getStatusColor(session.status)}`}>
                      {getStatusIcon(session.status)}
                      <span className="ml-1 capitalize">{session.status}</span>
                    </div>
                    {session.securityAlerts.filter(a => !a.resolved).length > 0 && (
                      <div className="ml-2 px-2 py-1 bg-red-900/20 text-red-400 rounded-full text-xs">
                        {session.securityAlerts.filter(a => !a.resolved).length} alerts
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-3">
                    <div>
                      <span className="font-medium">Email:</span> {session.candidateEmail}
                    </div>
                    <div>
                      <span className="font-medium">Challenge:</span> {session.title}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Duration: {formatDuration(session.duration)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Last Activity:</span> {formatLastActivity(session.lastActivity)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{session.progress}%</span>
                      </div>
                      <div className="w-full bg-background-tertiary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${session.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-green-400">{session.testsPassed}</span>
                      <span className="text-gray-400">/{session.totalTests} tests</span>
                    </div>
                  </div>
                </div>

                <div className="ml-6 flex flex-col gap-2">
                  <Button 
                    onClick={() => onSessionSelect(session.id)}
                    className="bg-primary hover:bg-primary-dark text-white"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Monitor
                  </Button>
                  {session.status === 'active' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                    >
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
