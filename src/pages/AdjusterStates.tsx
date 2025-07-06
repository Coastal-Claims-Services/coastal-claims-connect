import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Calendar, FileText, Building, Award, Plus, Edit, Upload } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { employees } from '@/data/employees';

// All 52 jurisdictions
const jurisdictions = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
  'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'Puerto Rico', 'US Virgin Islands'
];

// Mock license data structure for each jurisdiction
const getJurisdictionLicenseData = (adjusterName: string, jurisdiction: string, userHomeState: string, updates: Record<string, any> = {}) => {
  const employee = employees.find(emp => emp.name === adjusterName);
  const existingLicense = employee?.licenses.find(license => 
    license.state === jurisdiction.substring(0, 2).toUpperCase() || 
    (jurisdiction === 'Puerto Rico' && license.state === 'PR') ||
    (jurisdiction === 'US Virgin Islands' && license.state === 'VI')
  );

  // Check if there are any updates for this jurisdiction
  const jurisdictionUpdates = updates[jurisdiction];
  const hasUpdates = jurisdictionUpdates && Object.keys(jurisdictionUpdates).length > 0;

  return {
    jurisdiction,
    isLicensed: hasUpdates ? true : !!existingLicense,
    license: hasUpdates ? {
      number: jurisdictionUpdates.licenseNumber || 'Updated License',
      expires: jurisdictionUpdates.expirationDate || '2025-12-31',
      status: jurisdictionUpdates.status || 'active',
      type: jurisdictionUpdates.licenseType === 'public-adjuster' ? 'Public Adjuster License' : 'Adjuster License'
    } : existingLicense ? {
      number: existingLicense.licenseNumber,
      expires: existingLicense.expires,
      status: existingLicense.status,
      type: 'Public Adjuster License'
    } : null,
    bond: (hasUpdates || existingLicense) ? {
      type: jurisdictionUpdates?.bondType === 'surety-bond' ? 'Surety Bond' : 'Surety Bond',
      amount: jurisdictionUpdates?.bondAmount || '$50,000',
      expires: jurisdictionUpdates?.bondExpiration || '2025-06-30',
      status: 'active',
      carrier: jurisdictionUpdates?.bondCarrier || 'ABC Surety Co.',
      useENO: jurisdictionUpdates?.useENO || false
    } : null,
    contract: (hasUpdates || existingLicense) ? {
      hasStateContract: jurisdictionUpdates?.hasStateContract || false,
      contractType: jurisdictionUpdates?.contractType || '',
      approved: jurisdictionUpdates?.contractApproved || false,
      expires: ''
    } : null,
    continuingEducation: (hasUpdates || existingLicense) ? {
      required: parseInt(jurisdictionUpdates?.requiredCredits || '24'),
      completed: parseInt(jurisdictionUpdates?.completedCredits || '0'),
      deadline: jurisdictionUpdates?.ceDeadline || '2024-12-31',
      reciprocityWithHome: jurisdictionUpdates?.reciprocity || (jurisdiction !== userHomeState ? Math.random() > 0.5 : false),
      homeState: userHomeState
    } : null
  };
};

const AdjusterStates = () => {
  const { adjusterId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string | null>(null);
  const [editingLicense, setEditingLicense] = useState(false);
  const [editingBond, setEditingBond] = useState(false);
  const [editingContract, setEditingContract] = useState(false);
  const [editingCE, setEditingCE] = useState(false);
  
  // State to track license data changes for each jurisdiction
  const [licenseUpdates, setLicenseUpdates] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    licenseNumber: '',
    licenseType: 'public-adjuster',
    expirationDate: '',
    status: 'active',
    bondType: 'surety-bond',
    bondAmount: '',
    bondCarrier: '',
    bondExpiration: '',
    useENO: false,
    hasStateContract: false,
    contractType: '',
    contractApproved: false,
    requiredCredits: '',
    completedCredits: '',
    ceDeadline: '',
    reciprocity: false
  });

  // Find the adjuster
  const adjuster = employees.find(emp => emp.id === adjusterId);
  
  if (!adjuster) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Adjuster Not Found</h1>
          <Button onClick={() => navigate('/compliance')} className="bg-blue-600 hover:bg-blue-700">
            Back to Compliance
          </Button>
        </div>
      </div>
    );
  }

  const getComplianceStatus = (jurisdiction: string) => {
    const data = getJurisdictionLicenseData(adjuster.name, jurisdiction, user.homeState, licenseUpdates);
    if (!data.isLicensed) return 'not-licensed';
    
    // Check various compliance factors
    const hasActiveLicense = data.license?.status === 'active';
    const hasActiveBond = data.bond?.status === 'active';
    const ceCompliant = data.continuingEducation && data.continuingEducation.completed >= data.continuingEducation.required * 0.8;
    
    if (hasActiveLicense && hasActiveBond && ceCompliant) return 'compliant';
    if (hasActiveLicense && (hasActiveBond || ceCompliant)) return 'warning';
    return 'critical';
  };

  const saveLicenseData = () => {
    if (!selectedJurisdiction) return;
    
    setLicenseUpdates(prev => ({
      ...prev,
      [selectedJurisdiction]: {
        ...prev[selectedJurisdiction] || {},
        licenseNumber: formData.licenseNumber,
        licenseType: formData.licenseType,
        expirationDate: formData.expirationDate,
        status: formData.status,
        bondType: formData.bondType,
        bondAmount: formData.bondAmount,
        bondCarrier: formData.bondCarrier,
        bondExpiration: formData.bondExpiration,
        useENO: formData.useENO,
        hasStateContract: formData.hasStateContract,
        contractType: formData.contractType,
        contractApproved: formData.contractApproved,
        requiredCredits: formData.requiredCredits,
        completedCredits: formData.completedCredits,
        ceDeadline: formData.ceDeadline,
        reciprocity: formData.reciprocity
      }
    }));
  };

  const openEditDialog = (jurisdiction: string) => {
    setSelectedJurisdiction(jurisdiction);
    const existing = licenseUpdates[jurisdiction] || {};
    setFormData({
      licenseNumber: existing.licenseNumber || '',
      licenseType: existing.licenseType || 'public-adjuster',
      expirationDate: existing.expirationDate || '',
      status: existing.status || 'active',
      bondType: existing.bondType || 'surety-bond',
      bondAmount: existing.bondAmount || '',
      bondCarrier: existing.bondCarrier || '',
      bondExpiration: existing.bondExpiration || '',
      useENO: existing.useENO || false,
      hasStateContract: existing.hasStateContract || false,
      contractType: existing.contractType || '',
      contractApproved: existing.contractApproved || false,
      requiredCredits: existing.requiredCredits || '24',
      completedCredits: existing.completedCredits || '0',
      ceDeadline: existing.ceDeadline || '',
      reciprocity: existing.reciprocity || false
    });
    setEditingLicense(true);
  };

  const handleSaveLicense = () => {
    saveLicenseData();
    setEditingLicense(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-600 text-white';
      case 'warning': return 'bg-yellow-600 text-white';
      case 'critical': return 'bg-red-600 text-white';
      case 'not-licensed': return 'bg-red-600 text-white';
      default: return 'bg-red-600 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'compliant': return 'Compliant';
      case 'warning': return 'Warning';
      case 'critical': return 'Critical';
      case 'not-licensed': return 'Not Licensed';
      default: return 'Unknown';
    }
  };

  const handleJurisdictionClick = (jurisdiction: string) => {
    setSelectedJurisdiction(jurisdiction);
  };

  const handleBackToJurisdictions = () => {
    setSelectedJurisdiction(null);
  };

  if (selectedJurisdiction) {
    const licenseData = getJurisdictionLicenseData(adjuster.name, selectedJurisdiction, user.homeState, licenseUpdates);
    
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={handleBackToJurisdictions}
              className="text-slate-300 hover:text-slate-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to States
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{selectedJurisdiction}</h1>
              <p className="text-slate-400">License management for {adjuster.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${getStatusColor(getComplianceStatus(selectedJurisdiction))}`}></div>
                <Badge className={`${getStatusColor(getComplianceStatus(selectedJurisdiction))} text-white`}>
                  {getStatusText(getComplianceStatus(selectedJurisdiction))}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openEditDialog(selectedJurisdiction)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Status
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* License Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100">License Information</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingLicense(true)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {licenseData.isLicensed && licenseData.license ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">License Number</Label>
                      <p className="text-slate-100 font-mono">{licenseData.license.number}</p>
                    </div>
                    <div>
                      <Label className="text-slate-300">License Type</Label>
                      <p className="text-slate-100">{licenseData.license.type}</p>
                    </div>
                    <div>
                      <Label className="text-slate-300">Expires</Label>
                      <p className="text-slate-100">{licenseData.license.expires}</p>
                    </div>
                    <div>
                      <Label className="text-slate-300">Status</Label>
                      <Badge className={`${getStatusColor(licenseData.license.status)} text-white`}>
                        {licenseData.license.status}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">No license on file for {selectedJurisdiction}</p>
                    <Button 
                      onClick={() => setEditingLicense(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add License
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bond Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100">Bond Information</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingBond(true)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {licenseData.isLicensed && licenseData.bond ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Bond Type</Label>
                        <p className="text-slate-100">{licenseData.bond.type}</p>
                      </div>
                      <div>
                        <Label className="text-slate-300">Amount</Label>
                        <p className="text-slate-100 font-bold">{licenseData.bond.amount}</p>
                      </div>
                      <div>
                        <Label className="text-slate-300">Carrier</Label>
                        <p className="text-slate-100">{licenseData.bond.carrier}</p>
                      </div>
                      <div>
                        <Label className="text-slate-300">Expires</Label>
                        <p className="text-slate-100">{licenseData.bond.expires}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={licenseData.bond.useENO} readOnly />
                      <Label className="text-slate-300">Using ENO Insurance instead of bond</Label>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">No bond information available</p>
                    <Button 
                      onClick={() => setEditingBond(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bond
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contract Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100">State Contract Requirements</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingContract(true)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {licenseData.isLicensed && licenseData.contract ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={licenseData.contract.hasStateContract} readOnly />
                      <Label className="text-slate-300">State requires specific contract</Label>
                    </div>
                    {licenseData.contract.hasStateContract && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                        <div>
                          <Label className="text-slate-300">Contract Type</Label>
                          <p className="text-slate-100">{licenseData.contract.contractType || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-slate-300">Status</Label>
                          <Badge className={licenseData.contract.approved ? 'bg-green-600' : 'bg-red-600'}>
                            {licenseData.contract.approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">Contract information not available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Continuing Education */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100">Continuing Education</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingCE(true)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {licenseData.isLicensed && licenseData.continuingEducation ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-slate-300">Required Credits</Label>
                        <p className="text-slate-100 font-bold">{licenseData.continuingEducation.required}</p>
                      </div>
                      <div>
                        <Label className="text-slate-300">Completed Credits</Label>
                        <p className="text-slate-100 font-bold">{licenseData.continuingEducation.completed}</p>
                      </div>
                      <div>
                        <Label className="text-slate-300">Deadline</Label>
                        <p className="text-slate-100">{licenseData.continuingEducation.deadline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={licenseData.continuingEducation.reciprocityWithHome} readOnly />
                      <Label className="text-slate-300">
                        Reciprocity with home state ({licenseData.continuingEducation.homeState})
                      </Label>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">CE information not available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Warnings & Alerts and Compliance Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Warnings & Alerts */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Warnings & Alerts
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {(() => {
                  const warnings = [];
                  const status = getComplianceStatus(selectedJurisdiction);
                  
                  if (status === 'warning' || status === 'critical') {
                    if (licenseData.license && new Date(licenseData.license.expires) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)) {
                      warnings.push({
                        type: 'warning',
                        message: `License expires on ${licenseData.license.expires}`,
                        severity: 'medium'
                      });
                    }
                    
                    if (licenseData.bond && new Date(licenseData.bond.expires) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)) {
                      warnings.push({
                        type: 'warning',
                        message: `Bond expires on ${licenseData.bond.expires}`,
                        severity: 'medium'
                      });
                    }
                    
                    if (licenseData.continuingEducation && licenseData.continuingEducation.completed < licenseData.continuingEducation.required) {
                      const remaining = licenseData.continuingEducation.required - licenseData.continuingEducation.completed;
                      warnings.push({
                        type: 'critical',
                        message: `CE incomplete: ${remaining} credits needed by ${licenseData.continuingEducation.deadline}`,
                        severity: 'high'
                      });
                    }
                    
                    if (licenseData.contract?.hasStateContract && !licenseData.contract.approved) {
                      warnings.push({
                        type: 'warning',
                        message: 'State contract pending approval',
                        severity: 'medium'
                      });
                    }
                  }
                  
                  if (warnings.length === 0) {
                    return (
                      <div className="text-center py-6">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-slate-400">No active warnings or alerts</p>
                      </div>
                    );
                  }
                  
                  return warnings.map((warning, index) => (
                    <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                      warning.severity === 'high' ? 'bg-red-900/20 border border-red-800' : 'bg-yellow-900/20 border border-yellow-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        warning.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1">
                        <Badge className={`text-xs mb-1 ${
                          warning.severity === 'high' ? 'bg-red-600' : 'bg-yellow-600'
                        }`}>
                          {warning.type.toUpperCase()}
                        </Badge>
                        <p className="text-slate-200 text-sm">{warning.message}</p>
                      </div>
                    </div>
                  ));
                })()}
              </CardContent>
            </Card>

            {/* Compliance Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Compliance Actions
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-slate-200 text-sm font-medium">License Renewal Alerts</p>
                        <p className="text-slate-400 text-xs">Email notifications: 30, 14, 2 days before expiry</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white text-xs">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-slate-200 text-sm font-medium">Bond Renewal Alerts</p>
                        <p className="text-slate-400 text-xs">Email notifications: 30, 14, 2 days before expiry</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white text-xs">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-slate-200 text-sm font-medium">CE Deadline Reminders</p>
                        <p className="text-slate-400 text-xs">Monthly progress updates, final 60-day alert</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500 text-white text-xs">Pending</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                      <div>
                        <p className="text-slate-200 text-sm font-medium">Document Upload Reminders</p>
                        <p className="text-slate-400 text-xs">Weekly reminders for missing documents</p>
                      </div>
                    </div>
                    <Badge className="bg-slate-600 text-white text-xs">Inactive</Badge>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Action
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Dialogs */}
          <Dialog open={editingLicense} onOpenChange={setEditingLicense}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Edit License Information - {selectedJurisdiction}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input 
                    id="licenseNumber" 
                    placeholder="Enter license number" 
                    className="bg-slate-700 border-slate-600"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="licenseType">License Type</Label>
                  <Select value={formData.licenseType} onValueChange={(value) => setFormData({...formData, licenseType: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select license type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="public-adjuster">Public Adjuster License</SelectItem>
                      <SelectItem value="resident-adjuster">Resident Adjuster License</SelectItem>
                      <SelectItem value="non-resident-adjuster">Non-Resident Adjuster License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input 
                    id="expirationDate" 
                    type="date" 
                    className="bg-slate-700 border-slate-600"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingLicense(false)} className="border-slate-600">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveLicense} className="bg-green-600 hover:bg-green-700">
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={editingBond} onOpenChange={setEditingBond}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Edit Bond Information - {selectedJurisdiction}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bondType">Bond Type</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select bond type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="surety-bond">Surety Bond</SelectItem>
                      <SelectItem value="cash-bond">Cash Bond</SelectItem>
                      <SelectItem value="eno-insurance">ENO Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bondAmount">Bond Amount</Label>
                  <Input id="bondAmount" placeholder="e.g., $50,000" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="bondCarrier">Bond Carrier</Label>
                  <Input id="bondCarrier" placeholder="Enter carrier name" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="bondExpiration">Expiration Date</Label>
                  <Input id="bondExpiration" type="date" className="bg-slate-700 border-slate-600" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="useENO" className="rounded" />
                  <Label htmlFor="useENO">Using ENO Insurance instead of bond</Label>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingBond(false)} className="border-slate-600">
                    Cancel
                  </Button>
                  <Button onClick={() => setEditingBond(false)} className="bg-green-600 hover:bg-green-700">
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={editingContract} onOpenChange={setEditingContract}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Edit Contract Requirements - {selectedJurisdiction}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="hasStateContract" className="rounded" />
                  <Label htmlFor="hasStateContract">State requires specific contract</Label>
                </div>
                <div>
                  <Label htmlFor="contractType">Contract Type</Label>
                  <Input id="contractType" placeholder="Enter contract type" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="contractStatus">Approval Status</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingContract(false)} className="border-slate-600">
                    Cancel
                  </Button>
                  <Button onClick={() => setEditingContract(false)} className="bg-green-600 hover:bg-green-700">
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={editingCE} onOpenChange={setEditingCE}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Edit Continuing Education - {selectedJurisdiction}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="requiredCredits">Required Credits</Label>
                  <Input id="requiredCredits" type="number" placeholder="24" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="completedCredits">Completed Credits</Label>
                  <Input id="completedCredits" type="number" placeholder="0" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="ceDeadline">Deadline</Label>
                  <Input id="ceDeadline" type="date" className="bg-slate-700 border-slate-600" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="reciprocity" className="rounded" />
                  <Label htmlFor="reciprocity">Reciprocity with home state ({user.homeState})</Label>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingCE(false)} className="border-slate-600">
                    Cancel
                  </Button>
                  <Button onClick={() => setEditingCE(false)} className="bg-green-600 hover:bg-green-700">
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/compliance')}
            className="text-slate-300 hover:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Compliance
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">License Management</h1>
            <p className="text-slate-400">Manage licenses and compliance for {adjuster.name} across all jurisdictions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jurisdictions.map((jurisdiction) => {
            const status = getComplianceStatus(jurisdiction);
            const licenseData = getJurisdictionLicenseData(adjuster.name, jurisdiction, user.homeState, licenseUpdates);
            
            return (
              <Card 
                key={jurisdiction}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                onClick={() => handleJurisdictionClick(jurisdiction)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-slate-100">{jurisdiction}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Status</span>
                    <Badge className={`${getStatusColor(status)} text-white text-xs`}>
                      {getStatusText(status)}
                    </Badge>
                  </div>
                  {licenseData.isLicensed && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">License</span>
                        <span className="text-slate-200">Active</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Expires</span>
                        <span className="text-slate-200">{licenseData.license?.expires}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdjusterStates;