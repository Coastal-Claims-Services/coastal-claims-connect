
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { PartnerFormData } from '@/pages/PartnerRegistration';

interface BillingStepProps {
  formData: PartnerFormData;
  updateFormData: (updates: Partial<PartnerFormData>) => void;
}

const defaultDisclosure = `BILLING & ENGAGEMENT DISCLOSURE

By submitting this registration, you acknowledge and agree that:

1. Your relationship with Coastal Claims Services is an arms-length business arrangement solely for referral purposes.

2. You consent to Coastal Claims Services inquiring about and reviewing any documentation, credentials, licenses, or other materials you submit as part of this registration process.

3. All billing arrangements and fee structures will be negotiated directly between you and the referred clients.

4. Coastal Claims Services does not guarantee work volume, specific assignments, or minimum compensation.

5. You maintain full professional responsibility and liability for all services you provide to referred clients.

6. This registration does not create an employment relationship, partnership, or exclusive arrangement with Coastal Claims Services.

7. Coastal Claims Services is not responsible for payment disputes, collection issues, or any billing matters between you and referred clients.

8. All professional liability, errors and omissions, and general liability insurance requirements are your sole responsibility.`;

const billingMethods = [
  { id: 'hourly', label: 'Hourly Rate', description: 'Fixed rate per hour of work' },
  { id: 'contingency', label: 'Contingency Fee (%)', description: 'Percentage of settlement/award (common for attorneys)' },
  { id: 'per-job', label: 'Per Job/Project', description: 'Fixed price for entire project scope' }
];

export const BillingStep: React.FC<BillingStepProps> = ({
  formData,
  updateFormData
}) => {
  const handleBillingMethodToggle = (methodId: string, checked: boolean) => {
    const currentMethods = formData.billingMethods || [];
    const updatedMethods = checked
      ? [...currentMethods, methodId]
      : currentMethods.filter(id => id !== methodId);
    
    updateFormData({ billingMethods: updatedMethods });
  };

  return (
    <div className="space-y-8">
      {/* Legal Disclaimer Header */}
      <div className="space-y-4 p-6 bg-slate-750 border border-slate-600 rounded-lg">
        <div className="flex items-start justify-between">
          <Label className="text-white text-lg font-normal">
            Legal Disclosure & Acknowledgment
          </Label>
          <span className="text-xs text-slate-400 bg-slate-600 px-2 py-1 rounded">
            Editable
          </span>
        </div>
        <Textarea
          value={formData.billingDisclosure || defaultDisclosure}
          onChange={(e) => updateFormData({ billingDisclosure: e.target.value })}
          className="bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 min-h-[300px] resize-y text-sm leading-relaxed rounded-lg p-4"
        />
        <div className="flex items-center space-x-3 pt-4 border-t border-slate-600">
          <Checkbox
            id="acknowledge-disclosure"
            checked={formData.acknowledgesDisclosure || false}
            onCheckedChange={(checked) => updateFormData({ acknowledgesDisclosure: !!checked })}
            className="border-slate-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <Label htmlFor="acknowledge-disclosure" className="text-slate-200 cursor-pointer">
            I acknowledge and agree to the terms outlined in this disclosure
          </Label>
        </div>
      </div>

      {/* Billing Methods */}
      <div className="space-y-6">
        <div>
          <Label className="text-white text-lg font-normal block">
            Billing Methods * (Select all that apply)
          </Label>
          <p className="text-slate-400 text-sm mt-1">
            Choose all billing methods you typically use for different types of work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {billingMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-start space-x-3 p-4 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-650 transition-colors cursor-pointer"
              onClick={() => handleBillingMethodToggle(method.id, !(formData.billingMethods || []).includes(method.id))}
            >
              <Checkbox
                id={method.id}
                checked={(formData.billingMethods || []).includes(method.id)}
                onCheckedChange={(checked) => handleBillingMethodToggle(method.id, !!checked)}
                className="border-slate-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-1"
              />
              <div className="flex-1">
                <Label htmlFor={method.id} className="text-slate-200 cursor-pointer block text-base">
                  {method.label}
                </Label>
                <p className="text-slate-400 text-xs mt-1">
                  {method.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rate Information */}
      <div className="space-y-6">
        <Label className="text-white text-lg font-normal block">
          Rate Information (Optional)
        </Label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="hourlyRate" className="text-slate-200">
              Hourly Rate (if applicable)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
              <Input
                id="hourlyRate"
                type="number"
                placeholder="250"
                value={formData.hourlyRate || ''}
                onChange={(e) => updateFormData({ hourlyRate: e.target.value })}
                className="bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 pl-8 h-12 text-base rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contingencyRate" className="text-slate-200">
              Contingency Rate (if applicable)
            </Label>
            <div className="relative">
              <Input
                id="contingencyRate"
                type="number"
                placeholder="33"
                value={formData.contingencyRate || ''}
                onChange={(e) => updateFormData({ contingencyRate: e.target.value })}
                className="bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 pr-8 h-12 text-base rounded-lg"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="perJobRate" className="text-slate-200">
              Per Job Rate Range (if applicable)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
              <Input
                id="perJobRate"
                type="text"
                placeholder="5,000 - 25,000"
                value={formData.perJobRate || ''}
                onChange={(e) => updateFormData({ perJobRate: e.target.value })}
                className="bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 pl-8 h-12 text-base rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <Label htmlFor="additionalBillingInfo" className="text-white text-lg font-normal block">
          Additional Billing Information or Special Terms
        </Label>
        <Textarea
          id="additionalBillingInfo"
          value={formData.additionalBillingInfo || ''}
          onChange={(e) => updateFormData({ additionalBillingInfo: e.target.value })}
          placeholder="e.g., Payment terms, minimum fees, travel expenses, volume discounts, etc."
          className="bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 min-h-[100px] resize-none rounded-lg p-4 text-base"
        />
      </div>
    </div>
  );
};
