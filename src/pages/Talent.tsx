
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Users, Building2 } from 'lucide-react';

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

const Talent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('states');

  const filteredStates = statesData.filter(state =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Talent Management</h1>
              <p className="text-slate-400 mt-1">Manage adjusters and partners across all territories</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <Input
                  placeholder="Search states and territories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mt-6">
            <Button
              variant={activeTab === 'states' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('states')}
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
              onClick={() => setActiveTab('adjusters')}
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
              onClick={() => setActiveTab('partners')}
              className={`${
                activeTab === 'partners' 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Building2 size={16} className="mr-2" />
              Partners
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-slate-900 overflow-auto">
          {activeTab === 'states' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStates.map((state) => (
                <Card key={state.name} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">{state.name}</h3>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Adjusters</span>
                        <span className="text-white font-medium">{state.adjusters}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Partners</span>
                        <span className="text-white font-medium">{state.partners}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'adjusters' && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Adjusters View</h3>
              <p className="text-slate-400">Placeholder for adjusters management interface</p>
            </div>
          )}

          {activeTab === 'partners' && (
            <div className="text-center py-12">
              <Building2 size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Partners View</h3>
              <p className="text-slate-400">Placeholder for partners management interface</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Talent;
