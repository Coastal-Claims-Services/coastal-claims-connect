import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
  'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'Puerto Rico', 'US Virgin Islands'
];

interface HomeStateSelectorProps {
  triggerClassName?: string;
}

export const HomeStateSelector: React.FC<HomeStateSelectorProps> = ({ triggerClassName }) => {
  const { user, updateHomeState } = useUser();
  const [selectedState, setSelectedState] = useState(user.homeState);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    updateHomeState(selectedState);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={triggerClassName}>
          <MapPin className="h-4 w-4 mr-2" />
          Home State: {user.homeState}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Set Home State</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">
              Select your home state (this affects reciprocity calculations)
            </Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                <SelectValue placeholder="Select your home state" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state} className="text-slate-100">
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-300">
              <strong>Important:</strong> Changing your home state will affect reciprocity 
              calculations for all your licenses. Make sure this is your primary state of residence 
              and where you hold your base adjuster license.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Home State
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};