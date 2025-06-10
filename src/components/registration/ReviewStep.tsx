
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Edit, CheckCircle, AlertCircle } from 'lucide-react';
import { PartnerFormData } from '@/pages/PartnerRegistration';

interface ReviewStepProps {
  formData: PartnerFormData;
  onEditStep: (stepIndex: number) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  onEditStep
}) => {
  const isBasicInfoComplete = !!(
    formData.companyName &&
    formData.contactName &&
    formData.title &&
    formData.businessEmail &&
    formData.directPhone &&
    formData.mainOfficeAddress
  );

  const isServicesComplete = formData.serviceCategories.length > 0;

  const isCoverageComplete = !!(
    formData.licensedStates.length > 0 &&
    formData.primaryState
  );

  const isExpertiseComplete = !!(
    formData.fieldOfPractice &&
    formData.clientTypes &&
    formData.maxClaimSize
  );

  const isCredentialsComplete = !!(
    formData.isLicensed &&
    formData.providesReferences
  );

  const isBillingComplete = !!(
    formData.acknowledgesDisclosure &&
    formData.billingMethods &&
    formData.billingMethods.length > 0
  );

  const isCommunicationComplete = !!(
    formData.preferredContact &&
    formData.responseTime &&
    formData.urgentAssignments
  );

  const allComplete = isBasicInfoComplete && isServicesComplete && isCoverageComplete && 
                     isExpertiseComplete && isCredentialsComplete && isBillingComplete && 
                     isCommunicationComplete;

  const CompletionIcon = ({ completed }: { completed: boolean }) => (
    completed ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <AlertCircle className="w-5 h-5 text-yellow-500" />
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold text-white">
          Review Your Registration
        </h3>
        <p className="text-slate-400">
          Please review all information below before submitting your partner registration.
        </p>
        {allComplete ? (
          <div className="flex items-center justify-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">All sections completed</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Some sections need attention</span>
          </div>
        )}
      </div>

      {/* Basic Information */}
      <Card className="bg-slate-700 border-slate-600 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CompletionIcon completed={isBasicInfoComplete} />
            <Label className="text-white text-lg font-semibold">Basic Information</Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditStep(0)}
            className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Company:</span>
            <p className="text-white">{formData.companyName || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-slate-400">Contact:</span>
            <p className="text-white">{formData.contactName || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-slate-400">Title:</span>
            <p className="text-white">{formData.title || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-slate-400">Email:</span>
            <p className="text-white">{formData.businessEmail || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-slate-400">Phone:</span>
            <p className="text-white">{formData.directPhone || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-slate-400">Website:</span>
            <p className="text-white">{formData.companyWebsite || 'Not provided'}</p>
          </div>
        </div>
      </Card>

      {/* Services */}
      <Card className="bg-slate-700 border-slate-600 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CompletionIcon completed={isServicesComplete} />
            <Label className="text-white text-lg font-semibold">Services</Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditStep(1)}
            className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-3">
          <div>
            <span className="text-slate-400">Service Categories:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.serviceCategories.length > 0 ? (
                formData.serviceCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="bg-slate-600 text-white">
                    {category}
                  </Badge>
                ))
              ) : (
                <p className="text-white">None selected</p>
              )}
            </div>
          </div>
          {formData.contractorSpecialty && (
            <div>
              <span className="text-slate-400">Specialty:</span>
              <p className="text-white">{formData.contractorSpecialty}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Coverage */}
      <Card className="bg-slate-700 border-slate-600 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CompletionIcon completed={isCoverageComplete} />
            <Label className="text-white text-lg font-semibold">Coverage Area</Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditStep(2)}
            className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-3">
          <div>
            <span className="text-slate-400">Primary State:</span>
            <p className="text-white">{formData.primaryState || 'Not selected'}</p>
          </div>
          <div>
            <span className="text-slate-400">Licensed States ({formData.licensedStates.length}):</span>
            <div className="flex flex-wrap gap-1 mt-2">
              {formData.licensedStates.length > 0 ? (
                formData.licensedStates.map((state) => (
                  <Badge key={state} variant="outline" className="border-slate-500 text-slate-300 text-xs">
                    {state}
                  </Badge>
                ))
              ) : (
                <p className="text-white">None selected</p>
              )}
            </div>
          </div>
          <div>
            <span className="text-slate-400">Willing to Travel:</span>
            <p className="text-white capitalize">{formData.willingToTravel}</p>
          </div>
        </div>
      </Card>

      {/* Expertise */}
      <Card className="bg-slate-700 border-slate-600 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CompletionIcon completed={isExpertiseComplete} />
            <Label className="text-white text-lg font-semibold">Expertise</Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditStep(3)}
            className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-slate-400">Field of Practice:</span>
            <p className="text-white">{formData.fieldOfPractice || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-slate-400">Client Types:</span>
            <p className="text-white">{formData.clientTypes || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-slate-400">Max Claim Size:</span>
            <p className="text-white">{formData.maxClaimSize || 'Not selected'}</p>
          </div>
        </div>
      </Card>

      {/* Billing */}
      <Card className="bg-slate-700 border-slate-600 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CompletionIcon completed={isBillingComplete} />
            <Label className="text-white text-lg font-semibold">Billing Information</Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditStep(4)}
            className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-3">
          <div>
            <span className="text-slate-400">Disclosure Acknowledged:</span>
            <p className="text-white">{formData.acknowledgesDisclosure ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <span className="text-slate-400">Billing Methods:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.billingMethods && formData.billingMethods.length > 0 ? (
                formData.billingMethods.map((method) => (
                  <Badge key={method} variant="secondary" className="bg-slate-600 text-white text-xs">
                    {method.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                ))
              ) : (
                <p className="text-white">None selected</p>
              )}
            </div>
          </div>
          {formData.paymentSchedule && (
            <div>
              <span className="text-slate-400">Payment Schedule:</span>
              <p className="text-white capitalize">{formData.paymentSchedule.replace('-', ' ')}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Credentials */}
      <Card className="bg-slate-700 border-slate-600 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CompletionIcon completed={isCredentialsComplete} />
            <Label className="text-white text-lg font-semibold">Credentials</Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditStep(5)}
            className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-slate-400">Licensed/Certified:</span>
            <p className="text-white capitalize">{formData.isLicensed}</p>
          </div>
          <div>
            <span className="text-slate-400">Business License:</span>
            <p className="text-white">{formData.businessLicenseFile ? formData.businessLicenseFile.name : 'Not uploaded'}</p>
          </div>
          <div>
            <span className="text-slate-400">Insurance Certificate:</span>
            <p className="text-white">{formData.insuranceCertificateFile ? formData.insuranceCertificateFile.name : 'Not uploaded'}</p>
          </div>
          <div>
            <span className="text-slate-400">Provides References:</span>
            <p className="text-white capitalize">{formData.providesReferences}</p>
          </div>
        </div>
      </Card>

      {/* Communication */}
      <Card className="bg-slate-700 border-slate-600 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CompletionIcon completed={isCommunicationComplete} />
            <Label className="text-white text-lg font-semibold">Communication Preferences</Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditStep(6)}
            className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-slate-400">Preferred Contact:</span>
            <p className="text-white capitalize">{formData.preferredContact || 'Not selected'}</p>
          </div>
          <div>
            <span className="text-slate-400">Response Time:</span>
            <p className="text-white">{formData.responseTime?.replace('-', ' ') || 'Not selected'}</p>
          </div>
          <div>
            <span className="text-slate-400">Urgent Assignments:</span>
            <p className="text-white capitalize">{formData.urgentAssignments || 'Not selected'}</p>
          </div>
          {formData.additionalNotes && (
            <div>
              <span className="text-slate-400">Additional Notes:</span>
              <p className="text-white">{formData.additionalNotes}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Submit Button */}
      <div className="text-center pt-6">
        {allComplete ? (
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Submit Registration
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-yellow-400 text-sm">
              Please complete all required sections before submitting
            </p>
            <Button 
              size="lg" 
              disabled
              className="bg-slate-600 text-slate-400 px-8 cursor-not-allowed"
            >
              Submit Registration
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
