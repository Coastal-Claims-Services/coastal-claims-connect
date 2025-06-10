
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Building2, Phone, Mail, CheckCircle, XCircle, Eye } from 'lucide-react';
import { PartnerFormData } from '@/pages/PartnerRegistration';

interface ApplicationReviewCardProps {
  application: PartnerFormData;
  onApprove: () => void;
  onReject: () => void;
  onReview: () => void;
}

export const ApplicationReviewCard: React.FC<ApplicationReviewCardProps> = ({
  application,
  onApprove,
  onReject,
  onReview
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">New Submission</Badge>;
      case 'under-review':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Under Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Unknown</Badge>;
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysAgo = (date: Date | undefined) => {
    if (!date) return '';
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  };

  return (
    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">{application.companyName}</h3>
              {getStatusBadge(application.submissionStatus || 'submitted')}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>Submitted {formatDate(application.submissionDate)}</span>
                <span className="text-slate-500">• {getDaysAgo(application.submissionDate)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReview}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <Eye size={16} className="mr-1" />
              Review
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReject}
              className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
            >
              <XCircle size={16} className="mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={onApprove}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle size={16} className="mr-1" />
              Approve
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Contact Information */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Contact Information</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 size={14} />
                <span>{application.contactName} - {application.title}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail size={14} />
                <span>{application.businessEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone size={14} />
                <span>{application.directPhone}</span>
              </div>
            </div>
          </div>

          {/* Coverage & Services */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Coverage & Services</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={14} />
                <span>Primary: {application.primaryState}</span>
              </div>
              <div className="text-slate-400">
                Licensed in {application.licensedStates.length} state{application.licensedStates.length !== 1 ? 's' : ''}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {application.serviceCategories.slice(0, 2).map((category, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-slate-700 border-slate-600 text-slate-300">
                    {category}
                  </Badge>
                ))}
                {application.serviceCategories.length > 2 && (
                  <Badge variant="outline" className="text-xs bg-slate-700 border-slate-600 text-slate-300">
                    +{application.serviceCategories.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Application Details</h4>
            <div className="space-y-1 text-sm text-slate-400">
              <div>Max Claim: {application.maxClaimSize}</div>
              <div>Licensed: {application.isLicensed === 'yes' ? 'Yes' : application.isLicensed === 'no' ? 'No' : 'Pending'}</div>
              <div>Provides References: {application.providesReferences === 'yes' ? 'Yes' : 'No'}</div>
              <div>Travel: {application.willingToTravel === 'yes' ? 'Yes' : application.willingToTravel === 'no' ? 'No' : 'Case by case'}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
