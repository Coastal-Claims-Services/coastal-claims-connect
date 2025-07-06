import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SystemAlert, ComplianceStats } from '@/types/compliance';
import { AlertTriangle, CheckCircle, Clock, Search, Filter } from 'lucide-react';

interface AlertDashboardProps {
  alerts: SystemAlert[];
  stats: ComplianceStats;
  onDismissAlert: (alertId: string) => void;
  onSnoozeAlert: (alertId: string, hours: number) => void;
}

export const AlertDashboard: React.FC<AlertDashboardProps> = ({
  alerts,
  stats,
  onDismissAlert,
  onSnoozeAlert
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.adjusterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesType = filterType === 'all' || alert.type === filterType;
    return matchesSearch && matchesSeverity && matchesType && !alert.dismissed;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'license_expiry': return '📋';
      case 'ce_credits': return '🎓';
      case 'bond_expiry': return '🛡️';
      default: return '⚠️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Alerts</p>
                <p className="text-2xl font-bold text-white">{stats.totalAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Critical</p>
                <p className="text-2xl font-bold text-red-400">{stats.criticalAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Resolved</p>
                <p className="text-2xl font-bold text-green-400">{stats.dismissedAlerts}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Response Rate</p>
                <p className="text-2xl font-bold text-blue-400">
                  {stats.totalAlerts > 0 ? Math.round((stats.dismissedAlerts / stats.totalAlerts) * 100) : 0}%
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>Manage and respond to compliance alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600"
              />
            </div>
            
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="license_expiry">License Expiry</SelectItem>
                <SelectItem value="ce_credits">CE Credits</SelectItem>
                <SelectItem value="bond_expiry">Bond Expiry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No active alerts found
              </div>
            ) : (
              filteredAlerts.map(alert => (
                <div key={alert.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">{getTypeIcon(alert.type)}</span>
                        <div>
                          <h4 className="font-medium text-white">{alert.title}</h4>
                          <p className="text-sm text-slate-300">{alert.adjusterName}</p>
                        </div>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-400 mb-3">{alert.message}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
                        {alert.dueDate && (
                          <span>• Due: {new Date(alert.dueDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSnoozeAlert(alert.id, 24)}
                      >
                        Snooze 24h
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onDismissAlert(alert.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};