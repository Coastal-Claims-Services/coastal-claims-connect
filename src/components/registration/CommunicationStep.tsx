
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PartnerFormData } from '@/pages/PartnerRegistration';

interface CommunicationStepProps {
  formData: PartnerFormData;
  updateFormData: (updates: Partial<PartnerFormData>) => void;
}

export const CommunicationStep: React.FC<CommunicationStepProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <div className="space-y-8">
      {/* Best Way to Reach You */}
      <div className="space-y-4">
        <Label className="text-white text-lg font-semibold">
          Best Way to Reach You
        </Label>
        <RadioGroup
          value={formData.preferredContact || ''}
          onValueChange={(value) => updateFormData({ preferredContact: value as 'email' | 'phone' | 'text' | 'any' })}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="contact-email" className="border-slate-400 text-blue-500" />
            <Label htmlFor="contact-email" className="text-slate-200 font-medium cursor-pointer">
              Email
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="contact-phone" className="border-slate-400 text-blue-500" />
            <Label htmlFor="contact-phone" className="text-slate-200 font-medium cursor-pointer">
              Phone
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="contact-text" className="border-slate-400 text-blue-500" />
            <Label htmlFor="contact-text" className="text-slate-200 font-medium cursor-pointer">
              Text
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="any" id="contact-any" className="border-slate-400 text-blue-500" />
            <Label htmlFor="contact-any" className="text-slate-200 font-medium cursor-pointer">
              Any
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Response Time */}
      <div className="space-y-4">
        <Label className="text-white text-lg font-semibold">
          Typical Response Time for New Referrals
        </Label>
        <Select 
          value={formData.responseTime || ''} 
          onValueChange={(value) => updateFormData({ responseTime: value })}
        >
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Select response time" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="within-hour" className="text-white hover:bg-slate-600 focus:bg-slate-600">
              Within 1 hour
            </SelectItem>
            <SelectItem value="within-2-hours" className="text-white hover:bg-slate-600 focus:bg-slate-600">
              Within 2 hours
            </SelectItem>
            <SelectItem value="within-4-hours" className="text-white hover:bg-slate-600 focus:bg-slate-600">
              Within 4 hours
            </SelectItem>
            <SelectItem value="same-day" className="text-white hover:bg-slate-600 focus:bg-slate-600">
              Same business day
            </SelectItem>
            <SelectItem value="next-day" className="text-white hover:bg-slate-600 focus:bg-slate-600">
              Next business day
            </SelectItem>
            <SelectItem value="within-48-hours" className="text-white hover:bg-slate-600 focus:bg-slate-600">
              Within 48 hours
            </SelectItem>
            <SelectItem value="within-week" className="text-white hover:bg-slate-600 focus:bg-slate-600">
              Within a week
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Urgent Assignments */}
      <div className="space-y-4">
        <Label className="text-white text-lg font-semibold">
          Are you open to urgent assignments with little notice?
        </Label>
        <RadioGroup
          value={formData.urgentAssignments || ''}
          onValueChange={(value) => updateFormData({ urgentAssignments: value as 'yes' | 'no' | 'depends' })}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="urgent-yes" className="border-slate-400 text-blue-500" />
            <Label htmlFor="urgent-yes" className="text-slate-200 font-medium cursor-pointer">
              Yes
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="urgent-no" className="border-slate-400 text-blue-500" />
            <Label htmlFor="urgent-no" className="text-slate-200 font-medium cursor-pointer">
              No
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="depends" id="urgent-depends" className="border-slate-400 text-blue-500" />
            <Label htmlFor="urgent-depends" className="text-slate-200 font-medium cursor-pointer">
              Depends
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Additional Notes */}
      <div className="space-y-4">
        <Label className="text-white text-lg font-semibold">
          Additional Notes / Unique Capabilities
        </Label>
        <Textarea
          value={formData.additionalNotes || ''}
          onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
          placeholder="Tell us about any unique capabilities, prior work with PAs, or additional information that would be helpful..."
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[120px] resize-none"
        />
      </div>
    </div>
  );
};
