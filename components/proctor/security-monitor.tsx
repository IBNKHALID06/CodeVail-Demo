import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertTriangle, CheckCircle, XCircle, Shield, Eye, Wifi, Cpu, Clock, Monitor } from 'lucide-react'
import { CandidateSession, SecurityAlert } from '@/app/proctor/page'

interface SecurityMonitorProps {
  session: CandidateSession
}

export function SecurityMonitor({ session }: SecurityMonitorProps) {
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-400 bg-blue-900/20 border-blue-700'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700'
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-700'
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-700'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle className="h-4 w-4" />
      case 'medium': return <AlertTriangle className="h-4 w-4" />
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'critical': return <XCircle className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'process': return <Cpu className="h-4 w-4" />
      case 'network': return <Wifi className="h-4 w-4" />
      case 'screen': return <Monitor className="h-4 w-4" />
      case 'behavior': return <Eye className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const unresolvedAlerts = session.securityAlerts.filter(alert => !alert.resolved)
  const resolvedAlerts = session.securityAlerts.filter(alert => alert.resolved)

  return (
    <div className="h-full flex p-6 gap-6">
      {/* Security Overview */}
      <div className="w-1/3 space-y-4">
        <Card className="bg-gray-800/30 border-gray-600 p-4">
          <h3 className="font-medium mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Security Status
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Overall Status:</span>
              <div className={`px-2 py-1 rounded-full text-xs ${
                unresolvedAlerts.length === 0 
                  ? 'bg-green-900/20 text-green-400' 
                  : unresolvedAlerts.some(a => a.severity === 'critical')
                    ? 'bg-red-900/20 text-red-400'
                    : 'bg-yellow-900/20 text-yellow-400'
              }`}>
                {unresolvedAlerts.length === 0 ? 'Secure' : 'At Risk'}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Screen Recording:</span>
              <div className="flex items-center text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-xs">Active</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Process Monitor:</span>
              <div className="flex items-center text-green-400">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">Running</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Network Monitor:</span>
              <div className="flex items-center text-green-400">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">Active</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800/30 border-gray-600 p-4">
          <h3 className="font-medium mb-4">Alert Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Alerts:</span>
              <span>{session.securityAlerts.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Unresolved:</span>
              <span className="text-red-400">{unresolvedAlerts.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Resolved:</span>
              <span className="text-green-400">{resolvedAlerts.length}</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800/30 border-gray-600 p-4">
          <h3 className="font-medium mb-4">System Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>CPU Usage:</span>
              <span>15%</span>
            </div>
            <div className="flex justify-between">
              <span>Memory:</span>
              <span>3.2GB / 8GB</span>
            </div>
            <div className="flex justify-between">
              <span>Network:</span>
              <span>Connected</span>
            </div>
            <div className="flex justify-between">
              <span>Session Time:</span>
              <span>{Math.floor(session.duration / 60)}m</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="font-medium mb-4 text-red-400">Unresolved Alerts ({unresolvedAlerts.length})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {unresolvedAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No unresolved security alerts</p>
              </div>
            ) : (
              unresolvedAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className={`p-4 cursor-pointer transition-colors border ${getSeverityColor(alert.severity)} ${
                    selectedAlert?.id === alert.id ? 'ring-2 ring-[#6C5CE7]' : ''
                  }`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        {getTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          {getSeverityIcon(alert.severity)}
                          <span className="ml-2 font-medium capitalize">{alert.severity}</span>
                          <span className="ml-2 text-xs text-gray-400 capitalize">({alert.type})</span>
                        </div>
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatTimestamp(alert.timestamp)}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-green-500 text-green-400 hover:bg-green-500/10"
                    >
                      Resolve
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {resolvedAlerts.length > 0 && (
          <div>
            <h3 className="font-medium mb-4 text-green-400">Resolved Alerts ({resolvedAlerts.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {resolvedAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className="p-4 bg-gray-800/20 border-gray-700 opacity-75"
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      {getTypeIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="ml-2 font-medium capitalize">{alert.severity}</span>
                        <span className="ml-2 text-xs text-gray-400 capitalize">({alert.type})</span>
                        <span className="ml-2 text-xs text-green-400">RESOLVED</span>
                      </div>
                      <p className="text-sm text-gray-300">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {formatTimestamp(alert.timestamp)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
