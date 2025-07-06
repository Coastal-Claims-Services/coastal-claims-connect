import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Building, 
  User, 
  FileText, 
  Calendar,
  TrendingUp,
  MapPin,
  Bell,
  Download,
  Plus,
  Search,
  Filter
} from 'lucide-react';

// Mock data for compliance dashboard
const complianceStats = {
  totalLicenses: 247,
  activeLicenses: 221,
  expiringIn30Days: 12,
  expiredLicenses: 14,
  complianceScore: 89,
  totalEntities: 45,
  activeEntities: 42
};

const criticalAlerts = [
  { id: 1, type: 'license', message: 'FL Adjuster License expires in 7 days - John Smith', priority: 'high', date: '2024-01-15' },
  { id: 2, type: 'bond', message: 'Surety Bond renewal required - ABC Adjusting LLC', priority: 'high', date: '2024-01-10' },
  { id: 3, type: 'ce', message: '12 CE credits due by month end - Multiple adjusters', priority: 'medium', date: '2024-01-20' },
  { id: 4, type: 'entity', message: 'Business registration renewal - Texas', priority: 'medium', date: '2024-01-18' }
];

const recentActivity = [
  { id: 1, action: 'License Renewed', detail: 'CA Public Adjuster - Jane Doe', timestamp: '2 hours ago' },
  { id: 2, action: 'CE Credits Added', detail: '6 credits - Ethics Course', timestamp: '4 hours ago' },
  { id: 3, action: 'Bond Updated', detail: 'Surety Bond - $50,000', timestamp: '1 day ago' },
  { id: 4, action: 'Entity Registered', detail: 'New Entity - Nevada', timestamp: '2 days ago' }
];

const stateCompliance = [
  { state: 'FL', status: 'compliant', licenses: 45, expiring: 3 },
  { state: 'TX', status: 'warning', licenses: 38, expiring: 5 },
  { state: 'CA', status: 'compliant', licenses: 32, expiring: 1 },
  { state: 'NY', status: 'critical', licenses: 28, expiring: 8 },
  { state: 'GA', status: 'compliant', licenses: 25, expiring: 2 }
];

const Compliance = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-400 bg-green-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      case 'critical': return 'text-red-400 bg-red-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  return (
    <div className="h-screen flex bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Compliance Management</h1>
              <p className="text-slate-400">Monitor licensing, renewals, and regulatory compliance</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-slate-300 border-slate-600">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add License
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-700">
                <Shield className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="entities" className="data-[state=active]:bg-slate-700">
                <Building className="h-4 w-4 mr-2" />
                Entity Management
              </TabsTrigger>
              <TabsTrigger value="adjusters" className="data-[state=active]:bg-slate-700">
                <User className="h-4 w-4 mr-2" />
                Adjuster Management
              </TabsTrigger>
              <TabsTrigger value="requirements" className="data-[state=active]:bg-slate-700">
                <FileText className="h-4 w-4 mr-2" />
                State Requirements
              </TabsTrigger>
              <TabsTrigger value="renewals" className="data-[state=active]:bg-slate-700">
                <Calendar className="h-4 w-4 mr-2" />
                Renewal Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Status Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Total Licenses</CardTitle>
                    <Shield className="h-4 w-4 text-slate-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{complianceStats.totalLicenses}</div>
                    <div className="flex items-center mt-2">
                      <Badge className="text-green-400 bg-green-400/20">
                        {complianceStats.activeLicenses} Active
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Expiring Soon</CardTitle>
                    <Clock className="h-4 w-4 text-slate-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-400">{complianceStats.expiringIn30Days}</div>
                    <p className="text-xs text-slate-400 mt-2">Next 30 days</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Compliance Score</CardTitle>
                    <TrendingUp className="h-4 w-4 text-slate-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">{complianceStats.complianceScore}%</div>
                    <Progress value={complianceStats.complianceScore} className="mt-2" />
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Active Entities</CardTitle>
                    <Building className="h-4 w-4 text-slate-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{complianceStats.activeEntities}</div>
                    <p className="text-xs text-slate-400 mt-2">of {complianceStats.totalEntities} total</p>
                  </CardContent>
                </Card>
              </div>

              {/* Critical Alerts & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                      Critical Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {criticalAlerts.map((alert) => (
                      <Alert key={alert.id} className="bg-slate-700/50 border-slate-600">
                        <AlertDescription className="text-slate-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{alert.message}</span>
                            <Badge className={getPriorityColor(alert.priority)}>
                              {alert.priority}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">{alert.date}</div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-blue-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-slate-200 font-medium">{activity.action}</p>
                          <p className="text-xs text-slate-400">{activity.detail}</p>
                          <p className="text-xs text-slate-500 mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* State Compliance Summary */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-400" />
                    State-by-State Compliance
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    License status and renewal tracking by state
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {stateCompliance.map((state) => (
                      <div key={state.state} className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white">{state.state}</h3>
                          <Badge className={getStatusColor(state.status)}>
                            {state.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-300">
                          <p>{state.licenses} licenses</p>
                          <p className="text-yellow-400">{state.expiring} expiring</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="entities" className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Entity Management</CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage business entities, registrations, and firm-level compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Building className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Entity Management Module</h3>
                    <p className="text-slate-400 mb-6">
                      Comprehensive entity tracking, business registrations, and firm license management coming soon.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Entity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="adjusters" className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Individual Adjuster Management</CardTitle>
                  <CardDescription className="text-slate-400">
                    Track individual adjuster licenses, bonds, and continuing education
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <User className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Adjuster Management Module</h3>
                    <p className="text-slate-400 mb-6">
                      Individual adjuster profiles, license tracking, bond management, and CE credit monitoring.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Adjuster
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">State Requirements Hub</CardTitle>
                  <CardDescription className="text-slate-400">
                    Dynamic state requirement templates and regulatory information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">State Requirements Module</h3>
                    <p className="text-slate-400 mb-6">
                      State-specific requirements, CE tracking, forms, fee schedules, and reciprocity agreements.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add State Requirement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="renewals" className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Renewal Management System</CardTitle>
                  <CardDescription className="text-slate-400">
                    Automated renewal tracking, notifications, and bulk processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Renewal Management Module</h3>
                    <p className="text-slate-400 mb-6">
                      Automated renewal calendar, configurable alerts, bulk processing, and payment tracking.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Renewal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Compliance;