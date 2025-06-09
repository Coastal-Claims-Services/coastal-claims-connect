
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AIAssistant } from '@/data/aiAssistants';
import { AIForm } from './AIForm';

interface AIManagementProps {
  aiAssistants: AIAssistant[];
  onAddAI: (ai: Omit<AIAssistant, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateAI: (id: string, ai: Partial<AIAssistant>) => void;
  onDeleteAI: (id: string) => void;
  isDeveloper: boolean;
}

export const AIManagement: React.FC<AIManagementProps> = ({
  aiAssistants,
  onAddAI,
  onUpdateAI,
  onDeleteAI,
  isDeveloper
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAI, setEditingAI] = useState<AIAssistant | null>(null);

  const handleAddAI = (aiData: Omit<AIAssistant, 'id' | 'createdAt' | 'updatedAt'>) => {
    onAddAI(aiData);
    setIsAddDialogOpen(false);
  };

  const handleUpdateAI = (aiData: Omit<AIAssistant, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAI) {
      onUpdateAI(editingAI.id, aiData);
      setEditingAI(null);
    }
  };

  const handleDeleteAI = (id: string) => {
    if (confirm('Are you sure you want to delete this AI assistant?')) {
      onDeleteAI(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">AI Assistant Management</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add AI Assistant
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-slate-100 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New AI Assistant</DialogTitle>
            </DialogHeader>
            <AIForm onSubmit={handleAddAI} isDeveloper={isDeveloper} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiAssistants.map((ai) => (
          <Card key={ai.id} className="bg-slate-700 border-slate-600 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${ai.color}`}></div>
                <h4 className="font-medium text-slate-100">{ai.name}</h4>
              </div>
              <div className="flex items-center gap-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingAI(ai)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700 text-slate-100 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit AI Assistant</DialogTitle>
                    </DialogHeader>
                    <AIForm 
                      onSubmit={handleUpdateAI} 
                      isDeveloper={isDeveloper}
                      initialData={editingAI || undefined}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAI(ai.id)}
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-slate-300 mb-2">{ai.description}</p>
            <p className="text-xs text-slate-400 mb-3">{ai.specialty}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {ai.departments.slice(0, 2).map((dept) => (
                  <Badge key={dept} variant="outline" className="text-xs">
                    {dept}
                  </Badge>
                ))}
                {ai.departments.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{ai.departments.length - 2}
                  </Badge>
                )}
              </div>
              <Badge className={ai.available ? "bg-green-600" : "bg-red-600"}>
                {ai.available ? "Active" : "Inactive"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
