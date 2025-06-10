
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">
          States Licensed or Operating In * (Select all that apply)
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-6 bg-slate-750 border border-slate-600 rounded-lg">
          {states.map((state) => (
            <div key={state} className="flex items-center space-x-3">
              <Checkbox
                id={state}
                checked={formData.licensedStates.includes(state)}
                onCheckedChange={(checked) => handleStateToggle(state, !!checked)}
                className="border-slate-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label htmlFor={state} className="text-slate-200 text-sm cursor-pointer">
                {state}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-white text-lg font-semibold block mb-3">
            Primary State or HQ Location *
          </Label>
          <Select 
            value={formData.primaryState} 
            onValueChange={(value) => updateFormData({ primaryState: value })}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-12 text-base">
              <SelectValue placeholder="Select primary state" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 max-h-64 z-50">
              {states.map((state) => (
                <SelectItem 
                  key={state} 
                  value={state}
                  className="text-white hover:bg-slate-600 focus:bg-slate-600 cursor-pointer"
                >
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white text-lg font-semibold block mb-4">
            Are you willing to travel outside your licensed states under supervision or co-counsel?
          </Label>
          <RadioGroup 
            value={formData.willingToTravel} 
            onValueChange={(value: 'yes' | 'no' | 'case-by-case') => updateFormData({ willingToTravel: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="yes" 
                id="yes" 
                className="border-slate-400 text-blue-600 focus:ring-blue-600"
              />
              <Label htmlFor="yes" className="text-slate-200 cursor-pointer text-base">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="no" 
                id="no" 
                className="border-slate-400 text-blue-600 focus:ring-blue-600"
              />
              <Label htmlFor="no" className="text-slate-200 cursor-pointer text-base">
                No
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="case-by-case" 
                id="case-by-case" 
                className="border-slate-400 text-blue-600 focus:ring-blue-600"
              />
              <Label htmlFor="case-by-case" className="text-slate-200 cursor-pointer text-base">
                Case-by-case
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
