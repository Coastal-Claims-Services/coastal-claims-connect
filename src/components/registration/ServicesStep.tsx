
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PartnerFormData } from '@/pages/PartnerRegistration';

interface ServicesStepProps {
  formData: PartnerFormData;
  updateFormData: (updates: Partial<PartnerFormData>) => void;
}

const serviceCategories = [
  { id: 'attorney', label: 'Attorney' },
  { id: 'engineer', label: 'Engineer' },
  { id: 'appraiser', label: 'Appraiser' },
  { id: 'umpire', label: 'Umpire' },
  { id: 'contractor', label: 'Contractor' },
  { id: 'other', label: 'Other' }
];

const contractorSpecialties = [
  'Roofing Contractor',
  'Window Contractor', 
  'Interior Contractor',
  'Drywall Contractor',
  'Flooring Contractor',
  'Electrical Contractor',
  'Plumbing Contractor',
  'HVAC Contractor',
  'Painting Contractor',
  'Siding Contractor'
];

export const ServicesStep: React.FC<ServicesStepProps> = ({
  formData,
  updateFormData
}) => {
  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    const updatedServices = checked
      ? [...formData.serviceCategories, serviceId]
      : formData.serviceCategories.filter(id => id !== serviceId);
    
    updateFormData({ serviceCategories: updatedServices });
  };

  const isContractorSelected = formData.serviceCategories.includes('contractor');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Service Categories * (Check all that apply)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {serviceCategories.map((service) => (
            <div
              key={service.id}
              className="flex items-center space-x-3 p-4 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-650 transition-colors"
            >
              <Checkbox
                id={service.id}
                checked={formData.serviceCategories.includes(service.id)}
                onCheckedChange={(checked) => handleServiceToggle(service.id, !!checked)}
                className="border-slate-400"
              />
              <Label htmlFor={service.id} className="text-slate-200 font-medium cursor-pointer">
                {service.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {isContractorSelected && (
        <div className="space-y-4 p-4 bg-slate-750 border border-slate-600 rounded-lg">
          <h4 className="text-md font-semibold text-white">
            Contractor Specialty
          </h4>
          <p className="text-sm text-slate-400">
            Please specify your primary contractor specialty:
          </p>
          <Select 
            value={formData.contractorSpecialty || ''} 
            onValueChange={(value) => updateFormData({ contractorSpecialty: value })}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select contractor specialty" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {contractorSpecialties.map((specialty) => (
                <SelectItem 
                  key={specialty} 
                  value={specialty}
                  className="text-white hover:bg-slate-600 focus:bg-slate-600"
                >
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
