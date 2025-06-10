
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PartnerFormData } from '@/pages/PartnerRegistration';

interface ReviewStepProps {
  formData: PartnerFormData;
  onEditStep: (stepIndex: number) => void;
  onSubmit: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  onEditStep,
  onSubmit
}) => {
  const sections = [
    {
      title: 'Basic Information',
      stepIndex: 0,
      data: [
        { label: 'Company Name', value: formData.companyName },
        { label: 'Contact Name', value: formData.contactName },
        { label: 'Title', value: formData.title },
        { label: 'Business Email', value: formData.businessEmail },
        { label: 'Direct Phone', value: formData.directPhone },
        { label: 'Company Website', value: formData.companyWebsite },
        { label: 'Main Office Address', value: formData.mainOfficeAddress },
        { label: 'Mailing Address', value: formData.mailingAddress }
      ]
    },
    {
      title: 'Services',
      stepIndex: 1,
      data: [
        { label: 'Service Categories', value: formData.serviceCategories?.join(', ') },
        { label: 'Contractor Specialty', value: formData.contractorSpecialty }
      ]
    },
    {
      title: 'Coverage Area',
      stepIndex: 2,
      data: [
        { label: 'Licensed States', value: formData.licensedStates?.join(', ') },
        { label: 'Primary State', value: formData.primaryState },
        { label: 'Willing to Travel', value: formData.willingToTravel }
      ]
    },
    {
      title: 'Expertise',
      stepIndex: 3,
      data: [
        { label: 'Field of Practice', value: formData.fieldOfPractice },
        { label: 'Client Types', value: formData.clientTypes },
        { label: 'Maximum Claim Size', value: formData.maxClaimSize }
      ]
    },
    {
      title: 'Billing Information',
      stepIndex: 4,
      data: [
        { label: 'Billing Methods', value: formData.billingMethods?.join(', ') },
        { label: 'Hourly Rate', value: formData.hourlyRate ? `$${formData.hourlyRate}` : undefined },
        { label: 'Contingency Rate', value: formData.contingencyRate ? `${formData.contingencyRate}%` : undefined },
        { label: 'Per Job Rate', value: formData.perJobRate ? `$${formData.perJobRate}` : undefined },
        { label: 'Additional Billing Info', value: formData.additionalBillingInfo }
      ]
    },
    {
      title: 'Credentials',
      stepIndex: 5,
      data: [
        { label: 'Licensed/Certified', value: formData.isLicensed },
        { label: 'Business License File', value: formData.businessLicenseFile?.name },
        { label: 'Insurance Certificate File', value: formData.insuranceCertificateFile?.name },
        { label: 'Provides References', value: formData.providesReferences }
      ]
    },
    {
      title: 'Communication Preferences',
      stepIndex: 6,
      data: [
        { label: 'Preferred Contact Method', value: formData.preferredContact },
        { label: 'Response Time', value: formData.responseTime },
        { label: 'Urgent Assignments', value: formData.urgentAssignments },
        { label: 'Additional Notes', value: formData.additionalNotes }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-white mb-2">Review Your Information</h2>
        <p className="text-slate-400">Please review all information before submitting your registration</p>
      </div>

      {sections.map((section) => (
        <Card key={section.title} className="bg-slate-700 border-slate-600">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditStep(section.stepIndex)}
                className="bg-slate-600 border-slate-500 text-slate-200 hover:bg-slate-500"
              >
                Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.data.map((item) => (
                item.value && (
                  <div key={item.label}>
                    <Label className="text-slate-300 text-sm">{item.label}</Label>
                    <p className="text-white mt-1">{item.value}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        </Card>
      ))}

      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Ready to Submit?</h3>
        <p className="text-blue-200 mb-4">
          By submitting this registration, you confirm that all information provided is accurate and complete.
        </p>
        <Button 
          onClick={onSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Submit Registration
        </Button>
      </div>
    </div>
  );
};
