import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Calendar, FileText, Building, Award, Plus, Edit, Upload } from 'lucide-react';
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
const getJurisdictionLicenseData = (adjusterName: string, jurisdiction: string) => {
  const employee = employees.find(emp => emp.name === adjusterName);
  const existingLicense = employee?.licenses.find(license => 
    license.state === jurisdiction.substring(0, 2).toUpperCase() || 
    (jurisdiction === 'Puerto Rico' && license.state === 'PR') ||
    (jurisdiction === 'US Virgin Islands' && license.state === 'VI')
  );

  return {
    jurisdiction,
    isLicensed: !!existingLicense,
    license: existingLicense ? {
      number: existingLicense.licenseNumber,
      expires: existingLicense.expires,
      status: existingLicense.status,
      type: 'Public Adjuster License'
    } : null,
    bond: existingLicense ? {
      type: 'Surety Bond',
      amount: '$50,000',
      expires: '2025-06-30',
      status: 'active',
      carrier: 'ABC Surety Co.',
      useENO: false
    } : null,
    contract: existingLicense ? {
      hasStateContract: false,
      contractType: '',
      approved: false,
      expires: ''
    } : null,
    continuingEducation: existingLicense ? {
      required: 24,
      completed: Math.floor(Math.random() * 24),
      deadline: '2024-12-31',
      reciprocityWithHome: jurisdiction !== 'Florida' ? Math.random() > 0.5 : false,
      homeState: 'Florida'
    } : null
  };
};

const AdjusterStates = () => {
  const { adjusterId } = useParams();
  const navigate = useNavigate();
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string | null>(null);
  const [editingLicense, setEditingLicense] = useState(false);
  const [editingBond, setEditingBond] = useState(false);
  const [editingContract, setEditingContract] = useState(false);
  const [editingCE, setEditingCE] = useState(false);

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
    const data = getJurisdictionLicenseData(adjuster.name, jurisdiction);
    if (!data.isLicensed) return 'not-licensed';
    
    // Check various compliance factors
    const hasActiveLicense = data.license?.status === 'active';
    const hasActiveBond = data.bond?.status === 'active';
    const ceCompliant = data.continuingEducation && data.continuingEducation.completed >= data.continuingEducation.required * 0.8;
    
    if (hasActiveLicense && hasActiveBond && ceCompliant) return 'compliant';
    if (hasActiveLicense && (hasActiveBond || ceCompliant)) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'not-licensed': return 'bg-slate-500';
      default: return 'bg-slate-500';
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
    const licenseData = getJurisdictionLicenseData(adjuster.name, selectedJurisdiction);
    
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
            </div>
          </div>

          <Tabs defaultValue="license" className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="license" className="data-[state=active]:bg-slate-700">License</TabsTrigger>
              <TabsTrigger value="bond" className="data-[state=active]:bg-slate-700">Bond</TabsTrigger>
              <TabsTrigger value="contract" className="data-[state=active]:bg-slate-700">Contract</TabsTrigger>
              <TabsTrigger value="ce" className="data-[state=active]:bg-slate-700">Continuing Education</TabsTrigger>
            </TabsList>

            <TabsContent value="license">
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
            </TabsContent>

            <TabsContent value="bond">
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
            </TabsContent>

            <TabsContent value="contract">
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
            </TabsContent>

            <TabsContent value="ce">
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
            </TabsContent>
          </Tabs>
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
            const licenseData = getJurisdictionLicenseData(adjuster.name, jurisdiction);
            
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