
import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { aiAssistantsData, AIAssistant } from '@/data/aiAssistants';

interface AIStatusHeaderProps {
  currentAI: string;
  userDepartment: string;
}

export const AIStatusHeader: React.FC<AIStatusHeaderProps> = ({ 
  currentAI, 
  userDepartment 
}) => {
  const [showAssistantsPopup, setShowAssistantsPopup] = useState(false);

  // Get current AI details
  const getCurrentAI = () => {
    if (currentAI === 'Coastal AI') {
      return { name: 'Coastal AI', color: 'bg-slate-500' };
    }
    const ai = aiAssistantsData.find(ai => ai.name === currentAI);
    return ai ? { name: ai.name, color: ai.color } : { name: 'Coastal AI', color: 'bg-slate-500' };
  };

  // Filter assistants by user department
  const getAvailableAssistants = (): AIAssistant[] => {
    return aiAssistantsData.filter(ai => 
      ai.available && ai.departments.includes(userDepartment)
    );
  };

  const currentAIData = getCurrentAI();
  const availableAssistants = getAvailableAssistants();

  return (
    <>
      {/* Two Status Boxes */}
      <div className="bg-slate-800 border-b border-slate-700 p-3 space-y-2">
        {/* Current AI Status Box */}
        <div className="flex items-center gap-3 p-2 bg-slate-700 rounded-lg border border-slate-600">
          <div className={`w-3 h-3 rounded-full ${currentAIData.color}`}></div>
          <span className="text-sm text-slate-200 font-medium">
            Currently speaking with: <span className="text-white">{currentAIData.name}</span>
          </span>
        </div>

        {/* Available Assistants Box */}
        <div className="flex items-center justify-between p-2 bg-slate-700 rounded-lg border border-slate-600">
          <span className="text-sm text-slate-200 font-medium">
            Available AI Assistants ({availableAssistants.length})
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAssistantsPopup(true)}
            className="text-slate-300 hover:text-white hover:bg-slate-600 p-1 h-auto"
          >
            <ChevronDown size={16} />
          </Button>
        </div>
      </div>

      {/* Popup Overlay */}
      {showAssistantsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Popup Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100">
                AI Assistants Available for {userDepartment}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAssistantsPopup(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Assistants List */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
              {availableAssistants.map((assistant) => (
                <div
                  key={assistant.id}
                  className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg border border-slate-600 hover:bg-slate-650 transition-colors"
                >
                  <div className={`w-4 h-4 rounded-full ${assistant.color} mt-1 flex-shrink-0`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-medium">{assistant.name}</h4>
                      <span className="text-xs text-slate-400 bg-slate-600 px-2 py-1 rounded">
                        {assistant.specialty}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{assistant.description}</p>
                  </div>
                </div>
              ))}
              
              {availableAssistants.length === 0 && (
                <div className="text-center text-slate-400 py-8">
                  No AI assistants available for your department.
                </div>
              )}
            </div>

            {/* Popup Footer */}
            <div className="p-4 border-t border-slate-700 bg-slate-750">
              <p className="text-xs text-slate-400 text-center">
                To speak with a specific assistant, mention them by name in your message.
                <br />
                Example: "Coastal AI, please connect me to CCS Policy Pro for policy analysis."
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
