
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  name: string;
  department: string;
  role: string;
  userType: {
    permissions: {
      manageAIs: boolean;
    };
  };
}

interface ChatHeaderProps {
  user: User;
  showAIManagement: boolean;
  setShowAIManagement: (show: boolean) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  showAIManagement,
  setShowAIManagement
}) => {
  const canManageAIs = user.userType.permissions.manageAIs;

  return (
    <div className="bg-slate-800 border-b border-slate-700 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Coastal AI</h2>
          <p className="text-sm text-slate-300">Logged in as: {user.name} | {user.department} | {user.role}</p>
        </div>
        <div className="flex items-center gap-4">
          {canManageAIs && (
            <Button
              onClick={() => setShowAIManagement(!showAIManagement)}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2"
              size="sm"
            >
              <Settings size={14} className="mr-2" />
              Manage AIs
            </Button>
          )}
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            All systems operational
          </div>
        </div>
      </div>
    </div>
  );
};
