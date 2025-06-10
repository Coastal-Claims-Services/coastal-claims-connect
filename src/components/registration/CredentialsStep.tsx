
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { PartnerFormData } from '@/pages/PartnerRegistration';

interface CredentialsStepProps {
  formData: PartnerFormData;
  updateFormData: (updates: Partial<PartnerFormData>) => void;
}

export const CredentialsStep: React.FC<CredentialsStepProps> = ({
  formData,
  updateFormData
}) => {
  const handleLicenseUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Business license uploaded:', file.name);
      updateFormData({ businessLicenseFile: file });
    }
  };

  const handleInsuranceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Insurance certificate uploaded:', file.name);
      updateFormData({ insuranceCertificateFile: file });
    }
  };

  return (
    <div className="space-y-8">
      {/* Licensed/Certified Question */}
      <div className="space-y-6">
        <Label className="text-white text-xl font-medium block">
          Are you currently licensed/certified in your claimed field?
        </Label>
        <RadioGroup
          value={formData.isLicensed}
          onValueChange={(value) => updateFormData({ isLicensed: value as 'yes' | 'no' | 'pending' })}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem 
              value="yes" 
              id="licensed-yes"
              className="border-slate-400 text-blue-500 w-5 h-5"
            />
            <Label htmlFor="licensed-yes" className="text-slate-200 text-lg cursor-pointer">
              Yes
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem 
              value="no" 
              id="licensed-no"
              className="border-slate-400 text-blue-500 w-5 h-5"
            />
            <Label htmlFor="licensed-no" className="text-slate-200 text-lg cursor-pointer">
              No
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem 
              value="pending" 
              id="licensed-pending"
              className="border-slate-400 text-blue-500 w-5 h-5"
            />
            <Label htmlFor="licensed-pending" className="text-slate-200 text-lg cursor-pointer">
              Pending
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Business License Upload */}
      <div className="space-y-4">
        <Label className="text-white text-xl font-medium block">
          Business License or State Certification
        </Label>
        <div className="border-2 border-dashed border-slate-500 rounded-lg p-12 text-center bg-slate-800/50 hover:border-slate-400 transition-colors">
          <div className="flex flex-col items-center space-y-4">
            <Upload className="w-12 h-12 text-slate-400" />
            <div>
              <p className="text-slate-300 text-lg mb-2">Upload your business license or certification</p>
              <p className="text-slate-400 text-sm">Supported formats: PDF, JPEG, PNG (Max 10MB)</p>
            </div>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleLicenseUpload}
              className="hidden"
              id="license-upload"
            />
            <label htmlFor="license-upload">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base">
                <span>Choose File</span>
              </Button>
            </label>
            {formData.businessLicenseFile && (
              <p className="text-green-400 text-sm mt-2">
                Uploaded: {formData.businessLicenseFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Certificate of Insurance Upload */}
      <div className="space-y-4">
        <Label className="text-white text-xl font-medium block">
          Certificate of Insurance
        </Label>
        <div className="border-2 border-dashed border-slate-500 rounded-lg p-12 text-center bg-slate-800/50 hover:border-slate-400 transition-colors">
          <div className="flex flex-col items-center space-y-4">
            <Upload className="w-12 h-12 text-slate-400" />
            <div>
              <p className="text-slate-300 text-lg mb-2">Upload your certificate of insurance</p>
              <p className="text-slate-400 text-sm">Supported formats: PDF, JPEG, PNG (Max 10MB)</p>
            </div>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleInsuranceUpload}
              className="hidden"
              id="insurance-upload"
            />
            <label htmlFor="insurance-upload">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base">
                <span>Choose File</span>
              </Button>
            </label>
            {formData.insuranceCertificateFile && (
              <p className="text-green-400 text-sm mt-2">
                Uploaded: {formData.insuranceCertificateFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* References Question */}
      <div className="space-y-6">
        <Label className="text-white text-xl font-medium block">
          Are you willing to provide client or industry references upon request?
        </Label>
        <RadioGroup
          value={formData.providesReferences}
          onValueChange={(value) => updateFormData({ providesReferences: value as 'yes' | 'no' })}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem 
              value="yes" 
              id="references-yes"
              className="border-slate-400 text-blue-500 w-5 h-5"
            />
            <Label htmlFor="references-yes" className="text-slate-200 text-lg cursor-pointer">
              Yes
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem 
              value="no" 
              id="references-no"
              className="border-slate-400 text-blue-500 w-5 h-5"
            />
            <Label htmlFor="references-no" className="text-slate-200 text-lg cursor-pointer">
              No
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
