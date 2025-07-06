import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Filter,
  ArrowLeft,
  Upload,
  Edit,
  AlertCircle
} from 'lucide-react';
import { FileUploadZone } from '@/components/FileUploadZone';

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

// Entity management state data
const entityStatesData = [
  { name: 'Alabama', registrations: 8, licenses: 12, active: true, complianceStatus: 'restricted' },
  { name: 'Alaska', registrations: 2, licenses: 3, active: true, complianceStatus: 'compliant' },
  { name: 'Arizona', registrations: 11, licenses: 15, active: true, complianceStatus: 'compliant' },
  { name: 'Arkansas', registrations: 5, licenses: 8, active: true, complianceStatus: 'compliant' },
  { name: 'California', registrations: 32, licenses: 45, active: true, complianceStatus: 'compliant' },
  { name: 'Colorado', registrations: 13, licenses: 18, active: true, complianceStatus: 'compliant' },
  { name: 'Connecticut', registrations: 7, licenses: 9, active: true, complianceStatus: 'compliant' },
  { name: 'Delaware', registrations: 3, licenses: 4, active: true, complianceStatus: 'compliant' },
  { name: 'Florida', registrations: 28, licenses: 38, active: true, complianceStatus: 'compliant' },
  { name: 'Georgia', registrations: 16, licenses: 22, active: true, complianceStatus: 'compliant' },
  { name: 'Hawaii', registrations: 4, licenses: 5, active: true, complianceStatus: 'compliant' },
  { name: 'Idaho', registrations: 5, licenses: 7, active: true, complianceStatus: 'compliant' },
  { name: 'Illinois', registrations: 18, licenses: 25, active: true, complianceStatus: 'compliant' },
  { name: 'Indiana', registrations: 12, licenses: 16, active: true, complianceStatus: 'compliant' },
  { name: 'Iowa', registrations: 8, licenses: 11, active: true, complianceStatus: 'compliant' },
  { name: 'Kansas', registrations: 7, licenses: 10, active: true, complianceStatus: 'compliant' },
  { name: 'Kentucky', registrations: 9, licenses: 13, active: true, complianceStatus: 'compliant' },
  { name: 'Louisiana', registrations: 10, licenses: 14, active: true, complianceStatus: 'warning' },
  { name: 'Maine', registrations: 4, licenses: 6, active: true, complianceStatus: 'compliant' },
  { name: 'Maryland', registrations: 12, licenses: 17, active: true, complianceStatus: 'compliant' },
  { name: 'Massachusetts', registrations: 14, licenses: 19, active: true, complianceStatus: 'compliant' },
  { name: 'Michigan', registrations: 15, licenses: 21, active: true, complianceStatus: 'compliant' },
  { name: 'Minnesota', registrations: 11, licenses: 16, active: true, complianceStatus: 'compliant' },
  { name: 'Mississippi', registrations: 6, licenses: 9, active: true, complianceStatus: 'compliant' },
  { name: 'Missouri', registrations: 13, licenses: 18, active: true, complianceStatus: 'compliant' },
  { name: 'Montana', registrations: 3, licenses: 5, active: true, complianceStatus: 'compliant' },
  { name: 'Nebraska', registrations: 6, licenses: 8, active: true, complianceStatus: 'compliant' },
  { name: 'Nevada', registrations: 9, licenses: 12, active: true, complianceStatus: 'warning' },
  { name: 'New Hampshire', registrations: 5, licenses: 7, active: true, complianceStatus: 'compliant' },
  { name: 'New Jersey', registrations: 17, licenses: 23, active: true, complianceStatus: 'compliant' },
  { name: 'New Mexico', registrations: 6, licenses: 9, active: true, complianceStatus: 'compliant' },
  { name: 'New York', registrations: 26, licenses: 35, active: true, complianceStatus: 'compliant' },
  { name: 'North Carolina', registrations: 18, licenses: 24, active: true, complianceStatus: 'restricted' },
  { name: 'North Dakota', registrations: 3, licenses: 4, active: true, complianceStatus: 'compliant' },
  { name: 'Ohio', registrations: 19, licenses: 26, active: true, complianceStatus: 'compliant' },
  { name: 'Oklahoma', registrations: 9, licenses: 13, active: true, complianceStatus: 'compliant' },
  { name: 'Oregon', registrations: 10, licenses: 14, active: true, complianceStatus: 'compliant' },
  { name: 'Pennsylvania', registrations: 21, licenses: 28, active: true, complianceStatus: 'compliant' },
  { name: 'Rhode Island', registrations: 3, licenses: 4, active: true, complianceStatus: 'compliant' },
  { name: 'South Carolina', registrations: 11, licenses: 15, active: true, complianceStatus: 'compliant' },
  { name: 'South Dakota', registrations: 4, licenses: 5, active: true, complianceStatus: 'compliant' },
  { name: 'Tennessee', registrations: 14, licenses: 19, active: true, complianceStatus: 'compliant' },
  { name: 'Texas', registrations: 39, licenses: 52, active: true, complianceStatus: 'compliant' },
  { name: 'Utah', registrations: 8, licenses: 11, active: true, complianceStatus: 'compliant' },
  { name: 'Vermont', registrations: 2, licenses: 3, active: true, complianceStatus: 'compliant' },
  { name: 'Virginia', registrations: 15, licenses: 20, active: true, complianceStatus: 'compliant' },
  { name: 'Washington', registrations: 12, licenses: 17, active: true, complianceStatus: 'restricted' },
  { name: 'West Virginia', registrations: 4, licenses: 6, active: true, complianceStatus: 'compliant' },
  { name: 'Wisconsin', registrations: 12, licenses: 16, active: true, complianceStatus: 'compliant' },
  { name: 'Wyoming', registrations: 2, licenses: 3, active: true, complianceStatus: 'compliant' },
  { name: 'Puerto Rico', registrations: 5, licenses: 8, active: true, complianceStatus: 'compliant' },
  { name: 'US Virgin Islands', registrations: 2, licenses: 3, active: true, complianceStatus: 'compliant' }
];

// Mock data for state entity details
const getStateEntityDetails = (stateName: string) => ({
  entityLicenses: [
    { 
      id: 1, 
      type: 'Business Entity License', 
      number: `${stateName.substring(0,2).toUpperCase()}-BE-2024-001`, 
      status: 'compliant', 
      expires: '12/31/2024', 
      documents: ['license-certificate.pdf', 'application-form.pdf'] 
    },
    { 
      id: 2, 
      type: 'Public Adjuster Firm License', 
      number: `${stateName.substring(0,2).toUpperCase()}-PAF-2024-002`, 
      status: 'warning', 
      expires: '03/15/2025', 
      documents: ['firm-license.pdf'] 
    }
  ],
  entityBonds: [
    { 
      id: 1, 
      type: 'Surety Bond', 
      amount: '$50,000', 
      carrier: 'ABC Surety Co.', 
      status: 'compliant', 
      expires: '06/30/2024', 
      documents: ['bond-certificate.pdf'] 
    }
  ],
  registeredAgent: {
    name: 'Corporate Services Inc.',
    address: '123 Main St, Capital City',
    phone: '(555) 123-4567',
    status: 'compliant',
    documents: ['agent-agreement.pdf']
  },
  remoteLocations: [
    { 
      id: 1, 
      address: '456 Branch Ave, City Name', 
      status: 'compliant', 
      permits: ['local-permit.pdf'] 
    },
    { 
      id: 2, 
      address: '789 Regional Blvd, Metro Area', 
      status: 'warning', 
      permits: [] 
    }
  ],
  regulatoryDates: [
    { 
      id: 1, 
      type: 'Hurricane Moratorium', 
      startDate: '2024-06-01', 
      endDate: '2024-11-30', 
      status: 'active' 
    },
    { 
      id: 2, 
      type: 'Statute Tolling Period', 
      startDate: '2024-03-15', 
      endDate: '2024-04-15', 
      status: 'expired' 
    }
  ]
});

const Compliance = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEntityState, setSelectedEntityState] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState<'compliant' | 'warning' | 'restricted'>('compliant');
  const [statusNotes, setStatusNotes] = useState('');
  const [editingEntityLicenses, setEditingEntityLicenses] = useState(false);
  const [editingLicenseId, setEditingLicenseId] = useState<number | null>(null);
  const [licenseFormData, setLicenseFormData] = useState({
    type: '',
    number: '',
    expires: '',
    status: 'compliant' as 'compliant' | 'warning' | 'critical'
  });
  const [editingEntityBonds, setEditingEntityBonds] = useState(false);
  const [editingBondId, setEditingBondId] = useState<number | null>(null);
  const [bondFormData, setBondFormData] = useState({
    type: '',
    amount: '',
    carrier: '',
    expires: '',
    status: 'compliant' as 'compliant' | 'warning' | 'critical'
  });
  const [editingRegisteredAgent, setEditingRegisteredAgent] = useState(false);
  const [editingAgent, setEditingAgent] = useState(false);
  const [agentFormData, setAgentFormData] = useState({
    name: '',
    address: '',
    phone: '',
    status: 'compliant' as 'compliant' | 'warning' | 'critical'
  });
  const [editingRemoteLocations, setEditingRemoteLocations] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<number | null>(null);
  const [locationFormData, setLocationFormData] = useState({
    address: '',
    status: 'compliant' as 'compliant' | 'warning' | 'critical'
  });
  const [editingRegulatoryDates, setEditingRegulatoryDates] = useState(false);
  const [editingDateId, setEditingDateId] = useState<number | null>(null);
  const [dateFormData, setDateFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    status: 'active' as 'active' | 'expired'
  });

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

  const handleEntityStateClick = (stateName: string) => {
    setSelectedEntityState(stateName);
  };

  const handleBackToEntityStates = () => {
    setSelectedEntityState(null);
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'restricted': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getCurrentStateStatus = () => {
    if (!selectedEntityState) return 'compliant';
    const state = entityStatesData.find(s => s.name === selectedEntityState);
    return state?.complianceStatus || 'compliant';
  };

  const handleStatusChange = () => {
    // In a real app, this would update the backend
    console.log(`Updated ${selectedEntityState} status to: ${tempStatus}`);
    console.log(`Notes: ${statusNotes}`);
    setEditingStatus(false);
    setStatusNotes('');
  };

  const handleDeleteLicense = (licenseId: number) => {
    // In a real app, this would delete from backend
    console.log(`Delete license ID: ${licenseId} from ${selectedEntityState}`);
    setEditingEntityLicenses(false);
  };

  const handleEditLicense = (license: any) => {
    setLicenseFormData({
      type: license.type,
      number: license.number,
      expires: license.expires,
      status: license.status
    });
    setEditingLicenseId(license.id);
  };

  const handleSaveLicense = () => {
    // In a real app, this would save to backend
    console.log(`Save license ID ${editingLicenseId}:`, licenseFormData);
    setEditingLicenseId(null);
    setLicenseFormData({ type: '', number: '', expires: '', status: 'compliant' });
  };

  const handleDeleteBond = (bondId: number) => {
    console.log(`Delete bond ID: ${bondId} from ${selectedEntityState}`);
    setEditingEntityBonds(false);
  };

  const handleEditBond = (bond: any) => {
    setBondFormData({
      type: bond.type,
      amount: bond.amount,
      carrier: bond.carrier,
      expires: bond.expires,
      status: bond.status
    });
    setEditingBondId(bond.id);
  };

  const handleSaveBond = () => {
    console.log(`Save bond ID ${editingBondId}:`, bondFormData);
    setEditingBondId(null);
    setBondFormData({ type: '', amount: '', carrier: '', expires: '', status: 'compliant' });
  };

  const handleEditAgent = () => {
    const agent = getStateEntityDetails(selectedEntityState).registeredAgent;
    setAgentFormData({
      name: agent.name,
      address: agent.address,
      phone: agent.phone,
      status: agent.status as 'compliant' | 'warning' | 'critical'
    });
    setEditingAgent(true);
  };

  const handleSaveAgent = () => {
    console.log(`Save agent:`, agentFormData);
    setEditingAgent(false);
    setAgentFormData({ name: '', address: '', phone: '', status: 'compliant' });
  };

  const handleDeleteLocation = (locationId: number) => {
    console.log(`Delete location ID: ${locationId} from ${selectedEntityState}`);
    setEditingRemoteLocations(false);
  };

  const handleEditLocation = (location: any) => {
    setLocationFormData({
      address: location.address,
      status: location.status
    });
    setEditingLocationId(location.id);
  };

  const handleSaveLocation = () => {
    console.log(`Save location ID ${editingLocationId}:`, locationFormData);
    setEditingLocationId(null);
    setLocationFormData({ address: '', status: 'compliant' });
  };

  const handleDeleteDate = (dateId: number) => {
    console.log(`Delete regulatory date ID: ${dateId} from ${selectedEntityState}`);
    setEditingRegulatoryDates(false);
  };

  const handleEditDate = (date: any) => {
    setDateFormData({
      type: date.type,
      startDate: date.startDate,
      endDate: date.endDate,
      status: date.status
    });
    setEditingDateId(date.id);
  };

  const handleSaveDate = () => {
    console.log(`Save regulatory date ID ${editingDateId}:`, dateFormData);
    setEditingDateId(null);
    setDateFormData({ type: '', startDate: '', endDate: '', status: 'active' });
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
              {selectedEntityState ? (
                // Expanded State Detail View
                <div className="space-y-6">
                  {/* Back Button and Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        onClick={handleBackToEntityStates}
                        className="text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to States
                      </Button>
                      <div>
                        <h2 className="text-xl font-semibold text-white">{selectedEntityState} - Entity Compliance</h2>
                        <p className="text-slate-400">Manage licenses, bonds, and regulatory compliance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${getStatusDot(getCurrentStateStatus())}`}></div>
                      <Dialog open={editingStatus} onOpenChange={setEditingStatus}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-300 hover:bg-slate-700 hover:text-white"
                            onClick={() => {
                              setTempStatus(getCurrentStateStatus() as 'compliant' | 'warning' | 'restricted');
                              setEditingStatus(true);
                            }}
                          >
                            <Edit size={14} className="mr-1" />
                            Edit Status
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Edit {selectedEntityState} Compliance Status</DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Update the compliance status for this state's public adjusting regulations.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            <RadioGroup value={tempStatus} onValueChange={(value) => setTempStatus(value as 'compliant' | 'warning' | 'restricted')}>
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="compliant" id="compliant" />
                                <Label htmlFor="compliant" className="flex items-center gap-3 text-white">
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                  <div>
                                    <p className="font-medium">Fully Compliant</p>
                                    <p className="text-sm text-slate-400">Public adjusting is allowed with proper licensing</p>
                                  </div>
                                </Label>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="warning" id="warning" />
                                <Label htmlFor="warning" className="flex items-center gap-3 text-white">
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                  <div>
                                    <p className="font-medium">Questions/Warnings</p>
                                    <p className="text-sm text-slate-400">Some compliance questions but likely legal to operate</p>
                                  </div>
                                </Label>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="restricted" id="restricted" />
                                <Label htmlFor="restricted" className="flex items-center gap-3 text-white">
                                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                  <div>
                                    <p className="font-medium">Restricted/Prohibited</p>
                                    <p className="text-sm text-slate-400">Public adjusting is not allowed in this state</p>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                            
                            <div className="space-y-2">
                              <Label htmlFor="notes" className="text-white">Notes (Optional)</Label>
                              <Textarea
                                id="notes"
                                placeholder="Add any additional notes about the compliance status..."
                                value={statusNotes}
                                onChange={(e) => setStatusNotes(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setEditingStatus(false)}
                              className="text-slate-300 border-slate-600"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleStatusChange}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Update Status
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Entity Compliance Sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Entity Licenses */}
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center">
                            <Shield className="h-5 w-5 mr-2 text-blue-400" />
                            Entity Licenses
                          </CardTitle>
                          <Dialog open={editingEntityLicenses} onOpenChange={setEditingEntityLicenses}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-slate-300 hover:bg-slate-700 hover:text-white"
                                onClick={() => setEditingEntityLicenses(true)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-white">Manage Entity Licenses - {selectedEntityState}</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                  Add or remove entity licenses for this state
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                {getStateEntityDetails(selectedEntityState).entityLicenses.map((license) => (
                                  <div key={license.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                    <div>
                                      <h4 className="font-medium text-white">{license.type}</h4>
                                      <p className="text-sm text-slate-400">License #: {license.number}</p>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteLicense(license.id)}
                                      className="text-red-400 border-red-400 hover:bg-red-400/10"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                ))}
                                
                                <div className="p-3 border-2 border-dashed border-slate-600 rounded-lg">
                                  <Button variant="ghost" className="w-full text-slate-400 hover:text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add New License Type
                                  </Button>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingEntityLicenses(false)}
                                  className="text-slate-300 border-slate-600"
                                >
                                  Close
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          {/* Individual Bond Edit Dialog */}
                          <Dialog open={editingBondId !== null} onOpenChange={() => setEditingBondId(null)}>
                            <DialogContent className="bg-slate-800 border-slate-700">
                              <DialogHeader>
                                <DialogTitle className="text-white">Edit Bond Details</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                  Update the bond information below
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="bondType" className="text-white">Bond Type</Label>
                                  <Input
                                    id="bondType"
                                    value={bondFormData.type}
                                    onChange={(e) => setBondFormData({...bondFormData, type: e.target.value})}
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="bondAmount" className="text-white">Bond Amount</Label>
                                  <Input
                                    id="bondAmount"
                                    value={bondFormData.amount}
                                    onChange={(e) => setBondFormData({...bondFormData, amount: e.target.value})}
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="bondCarrier" className="text-white">Bond Carrier</Label>
                                  <Input
                                    id="bondCarrier"
                                    value={bondFormData.carrier}
                                    onChange={(e) => setBondFormData({...bondFormData, carrier: e.target.value})}
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="bondExpiration" className="text-white">Expiration Date</Label>
                                  <Input
                                    id="bondExpiration"
                                    type="date"
                                    value={bondFormData.expires}
                                    onChange={(e) => setBondFormData({...bondFormData, expires: e.target.value})}
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="bondStatus" className="text-white">Status</Label>
                                  <Select value={bondFormData.status} onValueChange={(value) => setBondFormData({...bondFormData, status: value as 'compliant' | 'warning' | 'critical'})}>
                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-700 border-slate-600">
                                      <SelectItem value="compliant" className="text-white hover:bg-slate-600">Compliant</SelectItem>
                                      <SelectItem value="warning" className="text-white hover:bg-slate-600">Warning</SelectItem>
                                      <SelectItem value="critical" className="text-white hover:bg-slate-600">Critical</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingBondId(null)}
                                  className="text-slate-300 border-slate-600"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleSaveBond}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {/* Individual Agent Edit Dialog */}
                          <Dialog open={editingAgent} onOpenChange={() => setEditingAgent(false)}>
                            <DialogContent className="bg-slate-800 border-slate-700">
                              <DialogHeader>
                                <DialogTitle className="text-white">Edit Registered Agent</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                  Update the registered agent information
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="agentName" className="text-white">Agent Name</Label>
                                  <Input
                                    id="agentName"
                                    value={agentFormData.name}
                                    onChange={(e) => setAgentFormData({...agentFormData, name: e.target.value})}
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="agentAddress" className="text-white">Address</Label>
                                  <Textarea
                                    id="agentAddress"
                                    value={agentFormData.address}
                                    onChange={(e) => setAgentFormData({...agentFormData, address: e.target.value})}
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="agentPhone" className="text-white">Phone</Label>
                                  <Input
                                    id="agentPhone"
                                    value={agentFormData.phone}
                                    onChange={(e) => setAgentFormData({...agentFormData, phone: e.target.value})}
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="agentStatus" className="text-white">Status</Label>
                                  <Select value={agentFormData.status} onValueChange={(value) => setAgentFormData({...agentFormData, status: value as 'compliant' | 'warning' | 'critical'})}>
                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-700 border-slate-600">
                                      <SelectItem value="compliant" className="text-white hover:bg-slate-600">Compliant</SelectItem>
                                      <SelectItem value="warning" className="text-white hover:bg-slate-600">Warning</SelectItem>
                                      <SelectItem value="critical" className="text-white hover:bg-slate-600">Critical</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingAgent(false)}
                                  className="text-slate-300 border-slate-600"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleSaveAgent}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {/* Individual Location Edit Dialog */}
                          <Dialog open={editingLocationId !== null} onOpenChange={() => setEditingLocationId(null)}>
                            <DialogContent className="bg-slate-800 border-slate-700">
                              <DialogHeader>
                                <DialogTitle className="text-white">Edit Location Details</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                  Update the location information below
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="locationAddress" className="text-white">Location Address</Label>
                                  <Textarea
                                    id="locationAddress"
                                    value={locationFormData.address}
                                    onChange={(e) => setLocationFormData({...locationFormData, address: e.target.value})}
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="locationStatus" className="text-white">Status</Label>
                                  <Select value={locationFormData.status} onValueChange={(value) => setLocationFormData({...locationFormData, status: value as 'compliant' | 'warning' | 'critical'})}>
                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-700 border-slate-600">
                                      <SelectItem value="compliant" className="text-white hover:bg-slate-600">Compliant</SelectItem>
                                      <SelectItem value="warning" className="text-white hover:bg-slate-600">Warning</SelectItem>
                                      <SelectItem value="critical" className="text-white hover:bg-slate-600">Critical</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingLocationId(null)}
                                  className="text-slate-300 border-slate-600"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleSaveLocation}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {/* Individual Regulatory Date Edit Dialog */}
                          <Dialog open={editingDateId !== null} onOpenChange={() => setEditingDateId(null)}>
                            <DialogContent className="bg-slate-800 border-slate-700">
                              <DialogHeader>
                                <DialogTitle className="text-white">Edit Regulatory Date</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                  Update the regulatory date information below
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="dateType" className="text-white">Date Type</Label>
                                  <Input
                                    id="dateType"
                                    value={dateFormData.type}
                                    onChange={(e) => setDateFormData({...dateFormData, type: e.target.value})}
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="e.g., Hurricane Moratorium, Tolling Period"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="startDate" className="text-white">Start Date</Label>
                                  <Input
                                    id="startDate"
                                    type="date"
                                    value={dateFormData.startDate}
                                    onChange={(e) => setDateFormData({...dateFormData, startDate: e.target.value})}
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="endDate" className="text-white">End Date</Label>
                                  <Input
                                    id="endDate"
                                    type="date"
                                    value={dateFormData.endDate}
                                    onChange={(e) => setDateFormData({...dateFormData, endDate: e.target.value})}
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="dateStatus" className="text-white">Status</Label>
                                  <Select value={dateFormData.status} onValueChange={(value) => setDateFormData({...dateFormData, status: value as 'active' | 'expired'})}>
                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-700 border-slate-600">
                                      <SelectItem value="active" className="text-white hover:bg-slate-600">Active</SelectItem>
                                      <SelectItem value="expired" className="text-white hover:bg-slate-600">Expired</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingDateId(null)}
                                  className="text-slate-300 border-slate-600"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleSaveDate}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          {/* Individual License Edit Dialog */}
                          <Dialog open={editingLicenseId !== null} onOpenChange={() => setEditingLicenseId(null)}>
                            <DialogContent className="bg-slate-800 border-slate-700">
                              <DialogHeader>
                                <DialogTitle className="text-white">Edit License Details</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                  Update the license information below
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="licenseType" className="text-white">License Type</Label>
                                  <Input
                                    id="licenseType"
                                    value={licenseFormData.type}
                                    onChange={(e) => setLicenseFormData({...licenseFormData, type: e.target.value})}
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="licenseNumber" className="text-white">License Number</Label>
                                  <Input
                                    id="licenseNumber"
                                    value={licenseFormData.number}
                                    onChange={(e) => setLicenseFormData({...licenseFormData, number: e.target.value})}
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="expirationDate" className="text-white">Expiration Date</Label>
                                  <Input
                                    id="expirationDate"
                                    type="date"
                                    value={licenseFormData.expires}
                                    onChange={(e) => setLicenseFormData({...licenseFormData, expires: e.target.value})}
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="licenseStatus" className="text-white">Status</Label>
                                  <Select value={licenseFormData.status} onValueChange={(value) => setLicenseFormData({...licenseFormData, status: value as 'compliant' | 'warning' | 'critical'})}>
                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-700 border-slate-600">
                                      <SelectItem value="compliant" className="text-white hover:bg-slate-600">Compliant</SelectItem>
                                      <SelectItem value="warning" className="text-white hover:bg-slate-600">Warning</SelectItem>
                                      <SelectItem value="critical" className="text-white hover:bg-slate-600">Critical</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingLicenseId(null)}
                                  className="text-slate-300 border-slate-600"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleSaveLicense}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {getStateEntityDetails(selectedEntityState).entityLicenses.map((license) => (
                          <div key={license.id} className="p-4 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-white">{license.type}</h4>
                              <div className={`w-2 h-2 rounded-full ${getStatusDot(license.status)}`}></div>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p className="text-slate-300">License #: {license.number}</p>
                              <p className="text-slate-300">Expires: {license.expires}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <FileUploadZone 
                                  title={`Upload Documents - ${license.type}`}
                                  existingFiles={[]}
                                  onFilesUploaded={(files) => console.log(`Files uploaded for license ${license.id}:`, files)}
                                />
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-slate-300 border-slate-600"
                                  onClick={() => handleEditLicense(license)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Entity Bonds */}
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center">
                            <Shield className="h-5 w-5 mr-2 text-green-400" />
                            Entity Bonds
                          </CardTitle>
                          <Dialog open={editingEntityBonds} onOpenChange={setEditingEntityBonds}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-slate-300 hover:bg-slate-700 hover:text-white"
                                onClick={() => setEditingEntityBonds(true)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-white">Manage Entity Bonds - {selectedEntityState}</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                  Add or remove entity bonds for this state
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                {getStateEntityDetails(selectedEntityState).entityBonds.map((bond) => (
                                  <div key={bond.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                    <div>
                                      <h4 className="font-medium text-white">{bond.type}</h4>
                                      <p className="text-sm text-slate-400">Amount: {bond.amount} | Carrier: {bond.carrier}</p>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteBond(bond.id)}
                                      className="text-red-400 border-red-400 hover:bg-red-400/10"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                ))}
                                
                                <div className="p-3 border-2 border-dashed border-slate-600 rounded-lg">
                                  <Button variant="ghost" className="w-full text-slate-400 hover:text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add New Bond Type
                                  </Button>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingEntityBonds(false)}
                                  className="text-slate-300 border-slate-600"
                                >
                                  Close
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {getStateEntityDetails(selectedEntityState).entityBonds.map((bond) => (
                          <div key={bond.id} className="p-4 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-white">{bond.type}</h4>
                              <div className={`w-2 h-2 rounded-full ${getStatusDot(bond.status)}`}></div>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p className="text-slate-300">Amount: {bond.amount}</p>
                              <p className="text-slate-300">Carrier: {bond.carrier}</p>
                              <p className="text-slate-300">Expires: {bond.expires}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <FileUploadZone 
                                  title={`Upload Documents - ${bond.type}`}
                                  existingFiles={[]}
                                  onFilesUploaded={(files) => console.log(`Files uploaded for bond ${bond.id}:`, files)}
                                />
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-slate-300 border-slate-600"
                                  onClick={() => handleEditBond(bond)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Registered Agent */}
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center">
                            <User className="h-5 w-5 mr-2 text-purple-400" />
                            Registered Agent
                          </CardTitle>
                          <Dialog open={editingRegisteredAgent} onOpenChange={setEditingRegisteredAgent}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-slate-300 hover:bg-slate-700 hover:text-white"
                                onClick={() => setEditingRegisteredAgent(true)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800 border-slate-700">
                              <DialogHeader>
                                <DialogTitle className="text-white">Manage Registered Agent - {selectedEntityState}</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                  Update registered agent information for this state
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div className="p-3 bg-slate-700/30 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium text-white">{getStateEntityDetails(selectedEntityState).registeredAgent.name}</h4>
                                      <p className="text-sm text-slate-400">{getStateEntityDetails(selectedEntityState).registeredAgent.address}</p>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={handleEditAgent}
                                      className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                                    >
                                      Edit Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingRegisteredAgent(false)}
                                  className="text-slate-300 border-slate-600"
                                >
                                  Close
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">{getStateEntityDetails(selectedEntityState).registeredAgent.name}</h4>
                            <div className={`w-2 h-2 rounded-full ${getStatusDot(getStateEntityDetails(selectedEntityState).registeredAgent.status)}`}></div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="text-slate-300">{getStateEntityDetails(selectedEntityState).registeredAgent.address}</p>
                            <p className="text-slate-300">{getStateEntityDetails(selectedEntityState).registeredAgent.phone}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                                <Upload className="h-3 w-3 mr-1" />
                                Upload
                              </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-slate-300 border-slate-600"
                                  onClick={() => handleEditLocation(location)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Remote Locations */}
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-orange-400" />
                            Remote Locations
                          </CardTitle>
                        <Dialog open={editingRegulatoryDates} onOpenChange={setEditingRegulatoryDates}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-slate-300 hover:bg-slate-700 hover:text-white"
                              onClick={() => setEditingRegulatoryDates(true)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-white">Manage Regulatory Dates - {selectedEntityState}</DialogTitle>
                              <DialogDescription className="text-slate-400">
                                Add or remove regulatory dates and moratoriums for this state
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              {getStateEntityDetails(selectedEntityState).regulatoryDates.map((date) => (
                                <div key={date.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                  <div>
                                    <h4 className="font-medium text-white">{date.type}</h4>
                                    <p className="text-sm text-slate-400">{date.startDate} to {date.endDate}</p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteDate(date.id)}
                                    className="text-red-400 border-red-400 hover:bg-red-400/10"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              ))}
                              
                              <div className="p-3 border-2 border-dashed border-slate-600 rounded-lg">
                                <Button variant="ghost" className="w-full text-slate-400 hover:text-white">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add New Regulatory Date
                                </Button>
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setEditingRegulatoryDates(false)}
                                className="text-slate-300 border-slate-600"
                              >
                                Close
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {getStateEntityDetails(selectedEntityState).remoteLocations.map((location) => (
                          <div key={location.id} className="p-4 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-white">Location #{location.id}</h4>
                              <div className={`w-2 h-2 rounded-full ${getStatusDot(location.status)}`}></div>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p className="text-slate-300">{location.address}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <FileUploadZone 
                                  title={`Upload Permits - Location #${location.id}`}
                                  existingFiles={[]}
                                  onFilesUploaded={(files) => console.log(`Files uploaded for location ${location.id}:`, files)}
                                  acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']}
                                />
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-slate-300 border-slate-600"
                                  onClick={() => handleEditLocation(location)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Regulatory Dates */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-red-400" />
                          Regulatory Dates & Moratoriums
                        </CardTitle>
                          <Dialog open={editingRemoteLocations} onOpenChange={setEditingRemoteLocations}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-slate-300 hover:bg-slate-700 hover:text-white"
                                onClick={() => setEditingRemoteLocations(true)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-white">Manage Remote Locations - {selectedEntityState}</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                  Add or remove remote locations for this state
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                {getStateEntityDetails(selectedEntityState).remoteLocations.map((location) => (
                                  <div key={location.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                    <div>
                                      <h4 className="font-medium text-white">Location #{location.id}</h4>
                                      <p className="text-sm text-slate-400">{location.address}</p>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteLocation(location.id)}
                                      className="text-red-400 border-red-400 hover:bg-red-400/10"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                ))}
                                
                                <div className="p-3 border-2 border-dashed border-slate-600 rounded-lg">
                                  <Button variant="ghost" className="w-full text-slate-400 hover:text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add New Location
                                  </Button>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingRemoteLocations(false)}
                                  className="text-slate-300 border-slate-600"
                                >
                                  Close
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getStateEntityDetails(selectedEntityState).regulatoryDates.map((date) => (
                          <div key={date.id} className="p-4 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-white">{date.type}</h4>
                              <Badge className={date.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}>
                                {date.status}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p className="text-slate-300">Start: {date.startDate}</p>
                              <p className="text-slate-300">End: {date.endDate}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit Dates
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Add New Date Button */}
                        <div className="p-4 bg-slate-700/20 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center">
                          <Button variant="ghost" className="text-slate-400 hover:text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Regulatory Date
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                // State Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {entityStatesData.map((state) => (
                    <Card 
                      key={state.name} 
                      className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer"
                      onClick={() => handleEntityStateClick(state.name)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-white">{state.name}</h3>
                          <div className={`w-3 h-3 rounded-full ${getStatusDot(state.complianceStatus)}`}></div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Registrations</span>
                            <span className="text-white font-medium">{state.registrations}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Licenses</span>
                            <span className="text-white font-medium">{state.licenses}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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