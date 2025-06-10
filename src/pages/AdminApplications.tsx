
import React, { useState } from 'react';
import { ArrowLeft, Search, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApplicationReviewCard } from '@/components/admin/ApplicationReviewCard';
import { PartnerFormData } from '@/pages/PartnerRegistration';

// Sample pending applications data
const sampleApplications: PartnerFormData[] = [
  {
    companyName: 'Gulf Coast Adjusters LLC',
    contactName: 'Sarah Mitchell',
    title: 'Managing Partner',
    businessEmail: 'sarah@gulfcoastadjusters.com',
    directPhone: '(251) 555-0123',
    companyWebsite: 'https://gulfcoastadjusters.com',
    mainOfficeAddress: '123 Harbor Drive, Mobile, AL 36602',
    mailingAddress: '',
    serviceCategories: ['Hurricane Claims', 'Commercial Property'],
    licensedStates: ['Alabama', 'Florida', 'Mississippi'],
    primaryState: 'Alabama',
    willingToTravel: 'yes',
    fieldOfPractice: 'First-Party Property Claims, Hurricane Damage Assessment',
    clientTypes: 'Commercial, Residential, HOA',
    maxClaimSize: '$1,000,001 - $2,500,000',
    isLicensed: 'yes',
    providesReferences: 'yes',
    submissionStatus: 'submitted',
    submissionDate: new Date('2024-06-09'),
    acknowledgesDisclosure: true
  },
  {
    companyName: 'Precision Engineering Solutions',
    contactName: 'Dr. Michael Roberts',
    title: 'Principal Engineer',
    businessEmail: 'mroberts@precisioneng.com',
    directPhone: '(334) 555-0187',
    companyWebsite: 'https://precisioneng.com',
    mainOfficeAddress: '456 Tech Plaza, Montgomery, AL 36104',
    mailingAddress: '',
    serviceCategories: ['Structural Engineering', 'Foundation Analysis'],
    licensedStates: ['Alabama', 'Georgia', 'Tennessee'],
    primaryState: 'Alabama',
    willingToTravel: 'case-by-case',
    fieldOfPractice: 'Structural Engineering, Foundation Analysis, Storm Damage Assessment',
    clientTypes: 'Commercial, Industrial',
    maxClaimSize: 'Over $5,000,000',
    isLicensed: 'yes',
    providesReferences: 'yes',
    submissionStatus: 'under-review',
    submissionDate: new Date('2024-06-08'),
    reviewerId: 'admin-001',
    acknowledgesDisclosure: true
  }
];

const AdminApplications = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('pending');

  const pendingApplications = sampleApplications.filter(app => 
    app.submissionStatus === 'submitted' || app.submissionStatus === 'under-review'
  );

  const filteredApplications = pendingApplications.filter(app =>
    app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.primaryState.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <FileText className="w-4 h-4" />;
      case 'under-review': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-500';
      case 'under-review': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-slate-300 hover:text-white"
              onClick={() => navigate('/talent')}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-white">Partner Applications</h1>
              <p className="text-slate-400">Review and manage partner registration submissions</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending Review</p>
                  <p className="text-2xl font-semibold text-white">2</p>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Under Review</p>
                  <p className="text-2xl font-semibold text-white">1</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Approved Today</p>
                  <p className="text-2xl font-semibold text-white">0</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Active</p>
                  <p className="text-2xl font-semibold text-white">24</p>
                </div>
                <AlertCircle className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="pending" className="data-[state=active]:bg-slate-700">
              Pending Applications
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-slate-700">
              Approved Partners
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-slate-700">
              Rejected Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <div className="space-y-4">
              {filteredApplications.map((application, index) => (
                <ApplicationReviewCard
                  key={index}
                  application={application}
                  onApprove={() => console.log('Approved:', application.companyName)}
                  onReject={() => console.log('Rejected:', application.companyName)}
                  onReview={() => console.log('Reviewing:', application.companyName)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            <div className="text-center py-12">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Approved Partners</h3>
              <p className="text-slate-400">View and manage approved partner profiles</p>
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            <div className="text-center py-12">
              <XCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Rejected Applications</h3>
              <p className="text-slate-400">Review rejected applications and reasoning</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminApplications;
