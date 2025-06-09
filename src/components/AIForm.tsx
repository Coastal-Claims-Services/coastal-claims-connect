
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIAssistant } from '@/data/aiAssistants';

const availableDepartments = [
  'CAN program', 'Claims', 'Operations', 'Policy', 'Underwriting',
  'Legal', 'Compliance', 'Customer Service', 'Support', 'Field Operations'
];

const colorOptions = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500',
  'bg-teal-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500'
];

interface AIFormProps {
  onSubmit: (ai: Omit<AIAssistant, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isDeveloper: boolean;
  initialData?: AIAssistant;
}

export const AIForm: React.FC<AIFormProps> = ({ onSubmit, isDeveloper, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    description: '',
    color: 'bg-blue-500',
    available: true,
    departments: [] as string[],
    systemPrompt: '',
    modelConfig: {
      temperature: 0.3,
      maxTokens: 2000
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        specialty: initialData.specialty,
        description: initialData.description,
        color: initialData.color,
        available: initialData.available,
        departments: initialData.departments,
        systemPrompt: initialData.systemPrompt || '',
        modelConfig: initialData.modelConfig || { temperature: 0.3, maxTokens: 2000 }
      });
    }
  }, [initialData]);

  const handleDepartmentToggle = (dept: string) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">AI Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="bg-slate-700 border-slate-600 text-slate-100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">Specialty</label>
          <Input
            value={formData.specialty}
            onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
            className="bg-slate-700 border-slate-600 text-slate-100"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Color Theme</label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, color }))}
              className={`w-8 h-8 rounded-full ${color} ${
                formData.color === color ? 'ring-2 ring-white' : ''
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Departments</label>
        <div className="flex flex-wrap gap-2">
          {availableDepartments.map((dept) => (
            <Badge
              key={dept}
              className={`cursor-pointer ${
                formData.departments.includes(dept)
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
              }`}
              onClick={() => handleDepartmentToggle(dept)}
            >
              {dept}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={formData.available}
            onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
            className="rounded"
          />
          Available
        </label>
      </div>

      {isDeveloper && (
        <Card className="bg-slate-700 border-slate-600 p-4">
          <h4 className="text-sm font-medium text-slate-200 mb-3">Developer Settings</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">System Prompt</label>
              <textarea
                value={formData.systemPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-slate-100 text-sm"
                rows={4}
                placeholder="Enter the system prompt for this AI assistant..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Temperature</label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.modelConfig.temperature}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    modelConfig: { ...prev.modelConfig, temperature: parseFloat(e.target.value) }
                  }))}
                  className="bg-slate-800 border-slate-600 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Max Tokens</label>
                <Input
                  type="number"
                  min="100"
                  max="4000"
                  step="100"
                  value={formData.modelConfig.maxTokens}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    modelConfig: { ...prev.modelConfig, maxTokens: parseInt(e.target.value) }
                  }))}
                  className="bg-slate-800 border-slate-600 text-slate-100"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {initialData ? 'Update AI Assistant' : 'Create AI Assistant'}
        </Button>
      </div>
    </form>
  );
};
