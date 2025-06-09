
import React from 'react';
import { 
  LayoutDashboard, 
  MessageCircle, 
  Users, 
  Calendar,
  FileText,
  Bot,
  Settings,
  HelpCircle,
  Building2,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: false },
  { icon: LayoutDashboard, label: 'Applications', active: false },
  { icon: MessageCircle, label: 'Messenger', active: false },
  { icon: Calendar, label: 'Calendar', active: false },
  { icon: FileText, label: 'Coastal U', active: false },
  { icon: Users, label: 'Directory', active: false },
  { icon: FileText, label: 'Documents', active: false },
  { icon: Bot, label: 'Coastal AI', active: true },
  { icon: FileText, label: 'HR', active: false },
  { icon: Settings, label: 'Admin', active: false },
  { icon: User, label: 'Talent', active: false },
];

export const Sidebar = () => {
  return (
    <div className="w-64 bg-slate-800 text-white h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-white">CCS Portal</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {sidebarItems.map((item, index) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full justify-start text-left h-12 ${
                item.active 
                  ? 'bg-green-500 text-white hover:bg-green-600 rounded-lg' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon size={20} className="mr-4" />
              <span className="text-base">{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
};
