
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

6. This registration does not create an employment relationship, partnership, or exclusive arrangement with Coastal Claims Services.`;

const billingMethods = [
  { id: 'contingency', label: 'Contingency Fee (%)', description: 'Common for attorneys - percentage of settlement/award' },
  { id: 'hourly', label: 'Hourly Rate', description: 'Fixed rate per hour of work' },
  { id: 'project', label: 'Per Project/Fixed Fee', description: 'Set price for entire project scope' },
  { id: 'retainer', label: 'Retainer + Hourly', description: 'Upfront retainer plus hourly billing' },
  { id: 'day-rate', label: 'Daily Rate', description: 'Fixed rate per day' },
  { id: 'square-footage', label: 'Per Square Foot', description: 'Common for contractors - rate per sq ft' },
  { id: 'unit-pricing', label: 'Unit Pricing', description: 'Price per unit/item (e.g., per claim, per inspection)' },
  { id: 'hybrid', label: 'Hybrid/Multiple Methods', description: 'Combination of billing methods' }
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
      {/* Disclosure Section */}
      <div className="space-y-4 p-6 bg-slate-750 border border-slate-600 rounded-lg">
        <div className="flex items-start justify-between">
          <Label className="text-white text-lg font-semibold">
            Legal Disclosure & Acknowledgment
          </Label>
          <span className="text-xs text-slate-400 bg-slate-600 px-2 py-1 rounded">
            Editable
          </span>
        </div>
        <Textarea
          value={formData.billingDisclosure || defaultDisclosure}
          onChange={(e) => updateFormData({ billingDisclosure: e.target.value })}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[300px] resize-y text-sm leading-relaxed"
        />
        <div className="flex items-center space-x-3 pt-4 border-t border-slate-600">
          <Checkbox
            id="acknowledge-disclosure"
            checked={formData.acknowledgesDisclosure || false}
            onCheckedChange={(checked) => updateFormData({ acknowledgesDisclosure: !!checked })}
            className="border-slate-400"
          />
          <Label htmlFor="acknowledge-disclosure" className="text-slate-200 font-medium cursor-pointer">
            I acknowledge and agree to the terms outlined in this disclosure
          </Label>
        </div>
      </div>

      {/* Billing Methods */}
      <div className="space-y-6">
        <div>
          <Label className="text-white text-lg font-semibold">
            Billing Methods * (Select all that apply)
          </Label>
          <p className="text-slate-400 text-sm mt-1">
            Choose all billing methods you typically use for different types of work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {billingMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-start space-x-3 p-4 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-650 transition-colors"
            >
              <Checkbox
                id={method.id}
                checked={(formData.billingMethods || []).includes(method.id)}
                onCheckedChange={(checked) => handleBillingMethodToggle(method.id, !!checked)}
                className="border-slate-400 mt-1"
              />
              <div className="flex-1">
                <Label htmlFor={method.id} className="text-slate-200 font-medium cursor-pointer block">
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
        <Label className="text-white text-lg font-semibold">
          Rate Information (Optional)
        </Label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="hourlyRate" className="text-slate-200">
              Standard Hourly Rate (if applicable)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
              <Input
                id="hourlyRate"
                type="number"
                placeholder="250"
                value={formData.hourlyRate || ''}
                onChange={(e) => updateFormData({ hourlyRate: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pl-8"
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
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-8"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumFee" className="text-slate-200">
              Minimum Fee/Retainer (if applicable)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
              <Input
                id="minimumFee"
                type="number"
                placeholder="5000"
                value={formData.minimumFee || ''}
                onChange={(e) => updateFormData({ minimumFee: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelRate" className="text-slate-200">
              Travel/Mileage Rate (if applicable)
            </Label>
            <Select 
              value={formData.travelRate || ''} 
              onValueChange={(value) => updateFormData({ travelRate: value })}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select travel billing method" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="standard-mileage" className="text-white hover:bg-slate-600 focus:bg-slate-600">
                  Standard IRS Mileage Rate
                </SelectItem>
                <SelectItem value="actual-costs" className="text-white hover:bg-slate-600 focus:bg-slate-600">
                  Actual Travel Costs
                </SelectItem>
                <SelectItem value="daily-per-diem" className="text-white hover:bg-slate-600 focus:bg-slate-600">
                  Daily Per Diem
                </SelectItem>
                <SelectItem value="included" className="text-white hover:bg-slate-600 focus:bg-slate-600">
                  Included in Base Rate
                </SelectItem>
                <SelectItem value="not-applicable" className="text-white hover:bg-slate-600 focus:bg-slate-600">
                  Not Applicable
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="space-y-4">
        <Label className="text-white text-lg font-semibold">
          Payment Terms & Preferences
        </Label>
        
        <div className="space-y-4">
          <div>
            <Label className="text-slate-200 text-md font-medium mb-3 block">
              Preferred Payment Schedule
            </Label>
            <RadioGroup
              value={formData.paymentSchedule || ''}
              onValueChange={(value) => updateFormData({ paymentSchedule: value })}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upon-completion" id="upon-completion" className="border-slate-400 text-blue-500" />
                <Label htmlFor="upon-completion" className="text-slate-200 font-medium cursor-pointer">
                  Upon completion of work
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="net-30" id="net-30" className="border-slate-400 text-blue-500" />
                <Label htmlFor="net-30" className="text-slate-200 font-medium cursor-pointer">
                  Net 30 days
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="milestone-based" id="milestone-based" className="border-slate-400 text-blue-500" />
                <Label htmlFor="milestone-based" className="text-slate-200 font-medium cursor-pointer">
                  Milestone-based payments
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="retainer-then-completion" id="retainer-then-completion" className="border-slate-400 text-blue-500" />
                <Label htmlFor="retainer-then-completion" className="text-slate-200 font-medium cursor-pointer">
                  Retainer upfront, balance upon completion
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalBillingInfo" className="text-slate-200 text-md font-medium">
              Additional Billing Information or Special Terms
            </Label>
            <Textarea
              id="additionalBillingInfo"
              value={formData.additionalBillingInfo || ''}
              onChange={(e) => updateFormData({ additionalBillingInfo: e.target.value })}
              placeholder="e.g., Express payment terms, volume discounts, specialty rates for certain claim types, etc."
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px] resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
