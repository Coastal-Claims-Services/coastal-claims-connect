import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Users, Building2, ArrowLeft, Phone, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExternalPartners } from '@/components/ExternalPartners';

// Placeholder data for states and territories
const statesData = [
  { name: 'Alabama', adjusters: 12, partners: 8, active: true },
  { name: 'Alaska', adjusters: 3, partners: 2, active: true },
  { name: 'Arizona', adjusters: 15, partners: 11, active: true },
  { name: 'Arkansas', adjusters: 8, partners: 5, active: true },
  { name: 'California', adjusters: 45, partners: 32, active: true },
  { name: 'Colorado', adjusters: 18, partners: 13, active: true },
  { name: 'Connecticut', adjusters: 9, partners: 7, active: true },
  { name: 'Delaware', adjusters: 4, partners: 3, active: true },
  { name: 'Florida', adjusters: 38, partners: 28, active: true },
  { name: 'Georgia', adjusters: 22, partners: 16, active: true },
  { name: 'Hawaii', adjusters: 5, partners: 4, active: true },
  { name: 'Idaho', adjusters: 7, partners: 5, active: true },
  { name: 'Illinois', adjusters: 25, partners: 18, active: true },
  { name: 'Indiana', adjusters: 16, partners: 12, active: true },
  { name: 'Iowa', adjusters: 11, partners: 8, active: true },
  { name: 'Kansas', adjusters: 10, partners: 7, active: true },
  { name: 'Kentucky', adjusters: 13, partners: 9, active: true },
  { name: 'Louisiana', adjusters: 14, partners: 10, active: true },
  { name: 'Maine', adjusters: 6, partners: 4, active: true },
  { name: 'Maryland', adjusters: 17, partners: 12, active: true },
  { name: 'Massachusetts', adjusters: 19, partners: 14, active: true },
  { name: 'Michigan', adjusters: 21, partners: 15, active: true },
  { name: 'Minnesota', adjusters: 16, partners: 11, active: true },
  { name: 'Mississippi', adjusters: 9, partners: 6, active: true },
  { name: 'Missouri', adjusters: 18, partners: 13, active: true },
  { name: 'Montana', adjusters: 5, partners: 3, active: true },
  { name: 'Nebraska', adjusters: 8, partners: 6, active: true },
  { name: 'Nevada', adjusters: 12, partners: 9, active: true },
  { name: 'New Hampshire', adjusters: 7, partners: 5, active: true },
  { name: 'New Jersey', adjusters: 23, partners: 17, active: true },
  { name: 'New Mexico', adjusters: 9, partners: 6, active: true },
  { name: 'New York', adjusters: 35, partners: 26, active: true },
  { name: 'North Carolina', adjusters: 24, partners: 18, active: true },
  { name: 'North Dakota', adjusters: 4, partners: 3, active: true },
  { name: 'Ohio', adjusters: 26, partners: 19, active: true },
  { name: 'Oklahoma', adjusters: 13, partners: 9, active: true },
  { name: 'Oregon', adjusters: 14, partners: 10, active: true },
  { name: 'Pennsylvania', adjusters: 28, partners: 21, active: true },
  { name: 'Rhode Island', adjusters: 4, partners: 3, active: true },
  { name: 'South Carolina', adjusters: 15, partners: 11, active: true },
  { name: 'South Dakota', adjusters: 5, partners: 4, active: true },
  { name: 'Tennessee', adjusters: 19, partners: 14, active: true },
  { name: 'Texas', adjusters: 52, partners: 39, active: true },
  { name: 'Utah', adjusters: 11, partners: 8, active: true },
  { name: 'Vermont', adjusters: 3, partners: 2, active: true },
  { name: 'Virginia', adjusters: 20, partners: 15, active: true },
  { name: 'Washington', adjusters: 17, partners: 12, active: true },
  { name: 'West Virginia', adjusters: 6, partners: 4, active: true },
  { name: 'Wisconsin', adjusters: 16, partners: 12, active: true },
  { name: 'Wyoming', adjusters: 3, partners: 2, active: true },
];

// Updated sample data for Alabama with different role types
const alabamaProfessionals = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Senior Claims Adjuster',
    type: 'adjuster',
    primaryState: 'Alabama',
    experience: 8,
    phone: '(205) 555-0123',
    specializations: ['Hurricane', 'Commercial'],
    status: 'available'
  },
  {
    id: 2,
    name: 'Michael Roberts',
    role: 'Property Inspector',
    type: 'inspector',
    primaryState: 'Alabama',
    experience: 5,
    phone: '(256) 555-0184',
    specializations: ['Residential', 'Flood'],
    status: 'busy'
  },
  {
    id: 3,
    name: 'Jennifer Adams',
    role: 'Field Representative',
    type: 'field-representative',
    primaryState: 'Alabama',
    experience: 3,
    phone: '(334) 555-0195',
    specializations: ['Auto', 'Property'],
    status: 'available'
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Senior Claims Adjuster',
    type: 'adjuster',
    primaryState: 'Alabama',
    experience: 12,
    phone: '(251) 555-0167',
    specializations: ['Commercial', 'Marine'],
    status: 'available'
  },
  {
    id: 5,
    name: 'Lisa Johnson',
    role: 'Field Investigator',
    type: 'field-investigator',
    primaryState: 'Alabama',
    experience: 6,
    phone: '(205) 555-0198',
    specializations: ['Residential', 'Hurricane'],
    status: 'unavailable'
  },
  {
    id: 6,
    name: 'Robert Wilson',
    role: 'Property Inspector',
    type: 'inspector',
    primaryState: 'Alabama',
    experience: 4,
    phone: '(256) 555-0172',
    specializations: ['Property', 'Hail'],
    status: 'available'
  },
  {
    id: 7,
    name: 'Emily Davis',
    role: 'Auto Appraiser',
    type: 'appraiser',
    primaryState: 'Alabama',
    experience: 7,
    phone: '(334) 555-0189',
    specializations: ['Auto', 'Collision'],
    status: 'available'
  },
  {
    id: 8,
    name: 'James Martinez',
    role: 'Property Appraiser',
    type: 'appraiser',
    primaryState: 'Alabama',
    experience: 9,
    phone: '(251) 555-0156',
    specializations: ['Commercial', 'Residential'],
    status: 'busy'
  }
];

const professionalTypes = [
  { value: 'all', label: 'All Professionals' },
  { value: 'adjuster', label: 'Adjusters' },
  { value: 'inspector', label: 'Inspectors' },
  { value: 'field-representative', label: 'Field Representatives' },
  { value: 'field-investigator', label: 'Field Investigators' },
  { value: 'appraiser', label: 'Appraisers' }
];

const Talent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('states');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [adjusterSearchQuery, setAdjusterSearchQuery] = useState('');
  const [selectedProfessionalType, setSelectedProfessionalType] = useState('all');
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');

  const filteredStates = statesData.filter(state =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProfessionals = alabamaProfessionals.filter(professional => {
    const matchesSearch = professional.name.toLowerCase().includes(adjusterSearchQuery.toLowerCase()) ||
      professional.role.toLowerCase().includes(adjusterSearchQuery.toLowerCase()) ||
      professional.specializations.some(spec => spec.toLowerCase().includes(adjusterSearchQuery.toLowerCase()));
    
    const matchesType = selectedProfessionalType === 'all' || professional.type === selectedProfessionalType;
    
    return matchesSearch && matchesType;
  });

  const handleStateClick = (stateName: string) => {
    console.log(`Clicked state: ${stateName} in ${activeTab} context`);
    setSelectedState(stateName);
    // Reset search queries when selecting a new state
    if (activeTab === 'adjusters') {
      setAdjusterSearchQuery('');
    } else if (activeTab === 'partners') {
      setPartnerSearchQuery('');
    }
  };

  const handleBackToStates = () => {
    setSelectedState(null);
    setAdjusterSearchQuery('');
    setPartnerSearchQuery('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'unavailable': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Determine which search query to use and placeholder text
  const getSearchConfig = () => {
    if (selectedState && activeTab === 'adjusters') {
      return {
        value: adjusterSearchQuery,
        onChange: setAdjusterSearchQuery,
        placeholder: "Search by name, role, or specialty..."
      };
    } else if (selectedState && activeTab === 'partners') {
      return {
        value: partnerSearchQuery,
        onChange: setPartnerSearchQuery,
        placeholder: "Search partners by company, contact, or specialty..."
      };
    } else {
      return {
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Search states and territories..."
      };
    }
  };

  const searchConfig = getSearchConfig();

  return (
    <div className="h-screen flex bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Talent Management</h1>
              <p className="text-slate-400 mt-1">Manage adjusters and external partners across all territories</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/partner-registration')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus size={16} className="mr-2" />
                Register Partner
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <Input
                  placeholder={searchConfig.placeholder}
                  value={searchConfig.value}
                  onChange={(e) => searchConfig.onChange(e.target.value)}
                  className="pl-10 w-80 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mt-6">
            <Button
              variant={activeTab === 'states' ? 'default' : 'ghost'}
              onClick={() => {
                setActiveTab('states');
                setSelectedState(null);
              }}
              className={`${
                activeTab === 'states' 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <MapPin size={16} className="mr-2" />
              States
            </Button>
            <Button
              variant={activeTab === 'adjusters' ? 'default' : 'ghost'}
              onClick={() => {
                setActiveTab('adjusters');
                setSelectedState(null);
              }}
              className={`${
                activeTab === 'adjusters' 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Users size={16} className="mr-2" />
              Adjusters
            </Button>
            <Button
              variant={activeTab === 'partners' ? 'default' : 'ghost'}
              onClick={() => {
                setActiveTab('partners');
                setSelectedState(null);
              }}
              className={`${
                activeTab === 'partners' 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Building2 size={16} className="mr-2" />
              External Partners
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-slate-900 overflow-auto">
          {/* Professional Detail View for Selected State (Adjusters) */}
          {selectedState && activeTab === 'adjusters' && (
            <div className="space-y-6">
              {/* Back Button and Header with Filter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={handleBackToStates}
                    className="text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to States
                  </Button>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedState} - Adjusters</h2>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Select value={selectedProfessionalType} onValueChange={setSelectedProfessionalType}>
                    <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {professionalTypes.map((type) => (
                        <SelectItem 
                          key={type.value} 
                          value={type.value}
                          className="text-white hover:bg-slate-600 focus:bg-slate-600"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Professionals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfessionals.map((professional) => (
                  <Card key={professional.id} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">{professional.name}</h3>
                          <p className="text-sm text-slate-400">{professional.role}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(professional.status)}`}></div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={14} className="text-slate-400" />
                          <span className="text-slate-300">{professional.primaryState}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={14} className="text-slate-400" />
                          <span className="text-slate-300">{professional.experience} years experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} className="text-slate-400" />
                          <span className="text-slate-300">{professional.phone}</span>
                        </div>
                        
                        {/* Specializations */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {professional.specializations.map((spec, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* External Partners Detail View for Selected State */}
          {selectedState && activeTab === 'partners' && (
            <div className="space-y-6">
              {/* Back Button and Header */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={handleBackToStates}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to States
                </Button>
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedState} - External Partners</h2>
                </div>
              </div>

              {/* External Partners Component */}
              <ExternalPartners searchQuery={partnerSearchQuery} selectedState={selectedState} />
            </div>
          )}

          {/* States Grid View */}
          {!selectedState && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStates.map((state) => (
                <Card 
                  key={state.name} 
                  className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer"
                  onClick={() => handleStateClick(state.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">{state.name}</h3>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      {(activeTab === 'states' || activeTab === 'adjusters') && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Adjusters</span>
                          <span className="text-white font-medium">{state.adjusters}</span>
                        </div>
                      )}
                      {(activeTab === 'states' || activeTab === 'partners') && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Partners</span>
                          <span className="text-white font-medium">{state.partners}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Talent;
