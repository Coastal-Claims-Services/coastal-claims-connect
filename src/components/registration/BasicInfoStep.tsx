
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PartnerFormData } from '@/pages/PartnerRegistration';

interface BasicInfoStepProps {
  formData: PartnerFormData;
  updateFormData: (updates: Partial<PartnerFormData>) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-slate-200">
            Company / Firm Name *
          </Label>
          <Input
            id="companyName"
            placeholder="Enter company or firm name"
            value={formData.companyName}
            onChange={(e) => updateFormData({ companyName: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactName" className="text-slate-200">
            Primary Contact Name *
          </Label>
          <Input
            id="contactName"
            placeholder="Enter contact person name"
            value={formData.contactName}
            onChange={(e) => updateFormData({ contactName: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-slate-200">
            Title / Role *
          </Label>
          <Input
            id="title"
            placeholder="e.g., Managing Partner, Lead Engineer"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessEmail" className="text-slate-200">
            Business Email *
          </Label>
          <Input
            id="businessEmail"
            type="email"
            placeholder="contact@company.com"
            value={formData.businessEmail}
            onChange={(e) => updateFormData({ businessEmail: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="directPhone" className="text-slate-200">
            Direct Phone *
          </Label>
          <Input
            id="directPhone"
            placeholder="(555) 123-4567"
            value={formData.directPhone}
            onChange={(e) => updateFormData({ directPhone: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyWebsite" className="text-slate-200">
            Company Website
          </Label>
          <Input
            id="companyWebsite"
            placeholder="https://www.company.com"
            value={formData.companyWebsite}
            onChange={(e) => updateFormData({ companyWebsite: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mainOfficeAddress" className="text-slate-200">
            Main Office Address *
          </Label>
          <textarea
            id="mainOfficeAddress"
            placeholder="Enter complete office address"
            value={formData.mainOfficeAddress}
            onChange={(e) => updateFormData({ mainOfficeAddress: e.target.value })}
            className="w-full h-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mailingAddress" className="text-slate-200">
            Mailing Address (if different)
          </Label>
          <textarea
            id="mailingAddress"
            placeholder="Enter mailing address if different from office"
            value={formData.mailingAddress}
            onChange={(e) => updateFormData({ mailingAddress: e.target.value })}
            className="w-full h-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>
    </div>
  );
};
