
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PartnerFormData } from '@/pages/PartnerRegistration';

interface ExpertiseStepProps {
  formData: PartnerFormData;
  updateFormData: (updates: Partial<PartnerFormData>) => void;
}

const maxClaimSizes = [
  'Up to $50,000',
  '$50,001 - $100,000',
  '$100,001 - $250,000',
  '$250,001 - $500,000',
  '$500,001 - $1,000,000',
  '$1,000,001 - $2,500,000',
  '$2,500,001 - $5,000,000',
  'Over $5,000,000'
];

export const ExpertiseStep: React.FC<ExpertiseStepProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="fieldOfPractice" className="text-white text-lg font-semibold">
            Field of Practice / Trade Specialties
          </Label>
        </div>
        <Textarea
          id="fieldOfPractice"
          value={formData.fieldOfPractice}
          onChange={(e) => updateFormData({ fieldOfPractice: e.target.value })}
          placeholder="e.g., First-Party Property, Roofing, Structural Engineering, Large Loss Appraisal"
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[120px] resize-none"
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="clientTypes" className="text-white text-lg font-semibold">
            Types of Clients You Typically Serve
          </Label>
        </div>
        <Textarea
          id="clientTypes"
          value={formData.clientTypes}
          onChange={(e) => updateFormData({ clientTypes: e.target.value })}
          placeholder="e.g., Residential, Commercial, HOA, Industrial"
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[120px] resize-none"
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="maxClaimSize" className="text-white text-lg font-semibold">
            Maximum Claim Size You're Comfortable Handling
          </Label>
        </div>
        <Select 
          value={formData.maxClaimSize} 
          onValueChange={(value) => updateFormData({ maxClaimSize: value })}
        >
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Select maximum claim size" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            {maxClaimSizes.map((size) => (
              <SelectItem 
                key={size} 
                value={size}
                className="text-white hover:bg-slate-600 focus:bg-slate-600"
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
