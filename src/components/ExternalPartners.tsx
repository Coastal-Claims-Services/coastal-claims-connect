
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Phone, Mail, Star, Building2 } from 'lucide-react';

interface ExternalPartner {
  id: number;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  subcategory?: string;
  specializations: string[];
  coverageStates: string[];
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  licenseNumber?: string;
}

const partnerCategories = [
  { value: 'all', label: 'All Partners' },
  { value: 'attorney', label: 'Attorney' },
  { value: 'appraiser', label: 'Appraiser' },
  { value: 'umpire', label: 'Umpire' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'inspector', label: 'Inspector' },
  { value: 'mold-remediator', label: 'Mold Remediator' },
  { value: 'water-mitigation', label: 'Water Mitigation' }
];

const contractorSubcategories = [
  { value: 'all-contractors', label: 'All Contractors' },
  { value: 'roofing', label: 'Roofing Contractor' },
  { value: 'drywall', label: 'Drywall Contractor' },
  { value: 'plumbing', label: 'Plumbing Contractor' },
  { value: 'hvac', label: 'HVAC Contractor' },
  { value: 'electrical', label: 'Electrical Contractor' },
  { value: 'flooring', label: 'Flooring Contractor' },
  { value: 'general', label: 'General Contractor' }
];

const placeholderPartners: ExternalPartner[] = [
  {
    id: 1,
    companyName: 'Smith & Associates Law Firm',
    contactPerson: 'John Smith',
    phone: '(205) 555-0123',
    email: 'jsmith@smithlaw.com',
    category: 'attorney',
    specializations: ['Insurance Defense', 'Property Law'],
    coverageStates: ['Alabama', 'Georgia', 'Florida'],
    status: 'active',
    rating: 4.8,
    licenseNumber: 'AL-LAW-12345'
  },
  {
    id: 2,
    companyName: 'Premier Property Appraisals',
    contactPerson: 'Sarah Johnson',
    phone: '(256) 555-0184',
    email: 'sarah@premierappraisals.com',
    category: 'appraiser',
    specializations: ['Residential', 'Commercial', 'Insurance Claims'],
    coverageStates: ['Alabama', 'Tennessee'],
    status: 'active',
    rating: 4.6,
    licenseNumber: 'AL-APP-67890'
  },
  {
    id: 3,
    companyName: 'Elite Roofing Solutions',
    contactPerson: 'Mike Wilson',
    phone: '(334) 555-0195',
    email: 'mike@eliteroofing.com',
    category: 'contractor',
    subcategory: 'roofing',
    specializations: ['Storm Damage', 'Commercial Roofing', 'Residential Repair'],
    coverageStates: ['Alabama', 'Mississippi'],
    status: 'active',
    rating: 4.9,
    licenseNumber: 'AL-CONT-11111'
  },
  {
    id: 4,
    companyName: 'Coastal Umpire Services',
    contactPerson: 'Robert Davis',
    phone: '(251) 555-0167',
    email: 'rdavis@coastalumpire.com',
    category: 'umpire',
    specializations: ['Property Claims', 'Commercial Disputes'],
    coverageStates: ['Alabama', 'Florida', 'Louisiana'],
    status: 'active',
    rating: 4.7
  },
  {
    id: 5,
    companyName: 'Rapid Water Restoration',
    contactPerson: 'Lisa Martinez',
    phone: '(205) 555-0198',
    email: 'lisa@rapidwater.com',
    category: 'water-mitigation',
    specializations: ['Emergency Water Extraction', '24/7 Service', 'Mold Prevention'],
    coverageStates: ['Alabama'],
    status: 'active',
    rating: 4.5,
    licenseNumber: 'AL-WM-33333'
  },
  {
    id: 6,
    companyName: 'Precision Electrical Contractors',
    contactPerson: 'David Thompson',
    phone: '(256) 555-0172',
    email: 'david@precisionelectric.com',
    category: 'contractor',
    subcategory: 'electrical',
    specializations: ['Storm Damage Repair', 'Commercial Electrical', 'Emergency Service'],
    coverageStates: ['Alabama', 'Georgia'],
    status: 'active',
    rating: 4.8,
    licenseNumber: 'AL-ELEC-44444'
  },
  {
    id: 7,
    companyName: 'Professional Mold Solutions',
    contactPerson: 'Jennifer Brown',
    phone: '(334) 555-0189',
    email: 'jennifer@moldpro.com',
    category: 'mold-remediator',
    specializations: ['Mold Inspection', 'Remediation', 'Air Quality Testing'],
    coverageStates: ['Alabama', 'Georgia', 'Florida'],
    status: 'active',
    rating: 4.6,
    licenseNumber: 'AL-MOLD-55555'
  },
  {
    id: 8,
    companyName: 'Expert Property Inspectors',
    contactPerson: 'Tom Anderson',
    phone: '(251) 555-0156',
    email: 'tom@expertinspectors.com',
    category: 'inspector',
    specializations: ['Property Damage Assessment', 'Pre-Loss Inspections', 'Code Compliance'],
    coverageStates: ['Alabama', 'Mississippi', 'Florida'],
    status: 'active',
    rating: 4.7,
    licenseNumber: 'AL-INSP-66666'
  },
  {
    id: 9,
    companyName: 'Quality Drywall Repair',
    contactPerson: 'Mark Johnson',
    phone: '(205) 555-0143',
    email: 'mark@qualitydrywall.com',
    category: 'contractor',
    subcategory: 'drywall',
    specializations: ['Water Damage Repair', 'Texture Matching', 'Commercial Projects'],
    coverageStates: ['Alabama'],
    status: 'pending',
    rating: 4.4,
    licenseNumber: 'AL-CONT-77777'
  }
];

interface ExternalPartnersProps {
  searchQuery: string;
}

export const ExternalPartners: React.FC<ExternalPartnersProps> = ({ searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all-contractors');

  const filteredPartners = placeholderPartners.filter(partner => {
    const matchesSearch = partner.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || partner.category === selectedCategory;
    
    const matchesSubcategory = selectedCategory !== 'contractor' || 
      selectedSubcategory === 'all-contractors' || 
      partner.subcategory === selectedSubcategory;
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-slate-400'}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            {partnerCategories.map((category) => (
              <SelectItem 
                key={category.value} 
                value={category.value}
                className="text-white hover:bg-slate-600 focus:bg-slate-600"
              >
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedCategory === 'contractor' && (
          <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
            <SelectTrigger className="w-56 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {contractorSubcategories.map((subcategory) => (
                <SelectItem 
                  key={subcategory.value} 
                  value={subcategory.value}
                  className="text-white hover:bg-slate-600 focus:bg-slate-600"
                >
                  {subcategory.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{partner.companyName}</h3>
                  <p className="text-sm text-slate-400">{partner.contactPerson}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(partner.status)}`}></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 size={14} className="text-slate-400" />
                  <span className="text-slate-300 capitalize">
                    {partner.subcategory ? `${partner.subcategory} contractor` : partner.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-slate-400" />
                  <span className="text-slate-300">{partner.phone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-slate-400" />
                  <span className="text-slate-300 truncate">{partner.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-slate-400" />
                  <span className="text-slate-300">{partner.coverageStates.join(', ')}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {renderStars(partner.rating)}
                  </div>
                  <span className="text-sm text-slate-300">{partner.rating}</span>
                </div>
                
                {/* Specializations */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {partner.specializations.slice(0, 2).map((spec, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                  {partner.specializations.length > 2 && (
                    <span className="px-2 py-1 text-xs bg-slate-600 text-slate-300 rounded-full">
                      +{partner.specializations.length - 2} more
                    </span>
                  )}
                </div>

                {/* License Number */}
                {partner.licenseNumber && (
                  <div className="text-xs text-slate-400 mt-2">
                    License: {partner.licenseNumber}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Partners Found</h3>
          <p className="text-slate-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};
