
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileUploadZone } from '@/components/FileUploadZone';
import { PartnerFormData } from '@/pages/PartnerRegistration';

interface CredentialsStepProps {
  formData: PartnerFormData;
  updateFormData: (updates: Partial<PartnerFormData>) => void;
}

export const CredentialsStep: React.FC<CredentialsStepProps> = ({
  formData,
  updateFormData
}) => {
  const handleLicenseUpload = (file: File) => {
    console.log('Business license uploaded:', file.name);
    updateFormData({ businessLicenseFile: file });
  };

  const handleInsuranceUpload = (file: File) => {
    console.log('Insurance certificate uploaded:', file.name);
    updateFormData({ insuranceCertificateFile: file });
  };

  return (
    <div className="space-y-8">
      {/* Licensed/Certified Question */}
      <div className="space-y-4">
        <Label className="text-white text-lg font-semibold">
          Are you currently licensed/certified in your claimed field?
        </Label>
        <RadioGroup
          value={formData.isLicensed}
          onValueChange={(value) => updateFormData({ isLicensed: value as 'yes' | 'no' | 'pending' })}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="yes" 
              id="licensed-yes"
              className="border-slate-400 text-blue-500"
            />
            <Label htmlFor="licensed-yes" className="text-slate-200 font-medium cursor-pointer">
              Yes
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="no" 
              id="licensed-no"
              className="border-slate-400 text-blue-500"
            />
            <Label htmlFor="licensed-no" className="text-slate-200 font-medium cursor-pointer">
              No
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="pending" 
              id="licensed-pending"
              className="border-slate-400 text-blue-500"
            />
            <Label htmlFor="licensed-pending" className="text-slate-200 font-medium cursor-pointer">
              Pending
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Business License Upload */}
      <div className="space-y-4">
        <Label className="text-white text-lg font-semibold">
          Business License or State Certification
        </Label>
        <FileUploadZone onFileUpload={handleLicenseUpload} />
      </div>

      {/* Certificate of Insurance Upload */}
      <div className="space-y-4">
        <Label className="text-white text-lg font-semibold">
          Certificate of Insurance
        </Label>
        <FileUploadZone onFileUpload={handleInsuranceUpload} />
      </div>

      {/* References Question */}
      <div className="space-y-4">
        <Label className="text-white text-lg font-semibold">
          Are you willing to provide client or industry references upon request?
        </Label>
        <RadioGroup
          value={formData.providesReferences}
          onValueChange={(value) => updateFormData({ providesReferences: value as 'yes' | 'no' })}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="yes" 
              id="references-yes"
              className="border-slate-400 text-blue-500"
            />
            <Label htmlFor="references-yes" className="text-slate-200 font-medium cursor-pointer">
              Yes
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="no" 
              id="references-no"
              className="border-slate-400 text-blue-500"
            />
            <Label htmlFor="references-no" className="text-slate-200 font-medium cursor-pointer">
              No
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
