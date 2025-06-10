
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PartnerFormData } from '@/pages/PartnerRegistration';

interface CoverageStepProps {
  formData: PartnerFormData;
  updateFormData: (updates: Partial<PartnerFormData>) => void;
}

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming', 'Puerto Rico'
];

export const CoverageStep: React.FC<CoverageStepProps> = ({
  formData,
  updateFormData
}) => {
  const handleStateToggle = (state: string, checked: boolean) => {
    const updatedStates = checked
      ? [...formData.licensedStates, state]
      : formData.licensedStates.filter(s => s !== state);
    
    updateFormData({ licensedStates: updatedStates });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          States Licensed or Operating In * (Select all that apply)
        </h3>
        
        <div className="grid grid-cols-3 gap-4 max-h-64 overflow-y-auto p-4 bg-slate-750 border border-slate-600 rounded-lg">
          {states.map((state) => (
            <div key={state} className="flex items-center space-x-2">
              <Checkbox
                id={state}
                checked={formData.licensedStates.includes(state)}
                onCheckedChange={(checked) => handleStateToggle(state, !!checked)}
                className="border-slate-400"
              />
              <Label htmlFor={state} className="text-slate-200 text-sm cursor-pointer">
                {state}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-slate-200 text-md font-semibold">
            Primary State or HQ Location *
          </Label>
          <Select 
            value={formData.primaryState} 
            onValueChange={(value) => updateFormData({ primaryState: value })}
          >
            <SelectTrigger className="mt-2 bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select primary state" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 max-h-64">
              {states.map((state) => (
                <SelectItem 
                  key={state} 
                  value={state}
                  className="text-white hover:bg-slate-600 focus:bg-slate-600"
                >
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-slate-200 text-md font-semibold mb-4 block">
            Are you willing to travel outside your licensed states under supervision or co-counsel?
          </Label>
          <div className="space-y-3">
            {[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
              { value: 'case-by-case', label: 'Case-by-case' }
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={option.value}
                  name="willingToTravel"
                  value={option.value}
                  checked={formData.willingToTravel === option.value}
                  onChange={(e) => updateFormData({ willingToTravel: e.target.value as 'yes' | 'no' | 'case-by-case' })}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-500 focus:ring-blue-500"
                />
                <Label htmlFor={option.value} className="text-slate-200 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
