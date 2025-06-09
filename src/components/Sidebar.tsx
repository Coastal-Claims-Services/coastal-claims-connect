
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
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: false },
  { icon: MessageCircle, label: 'AI Switchboard', active: false },
  { icon: Users, label: 'Team Directory', active: false },
  { icon: Calendar, label: 'Calendar', active: false },
  { icon: FileText, label: 'Documents', active: false },
  { icon: Bot, label: 'AI Tools', active: true },
  { icon: Settings, label: 'Settings', active: false },
  { icon: HelpCircle, label: 'Help & Support', active: false },
];

export const Sidebar = () => {
  return (
    <div className="w-64 bg-slate-800 text-white h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="font-semibold text-sm">CCS Portal</h1>
            <p className="text-xs text-slate-400">Coastal Claims Services</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full justify-start text-left ${
                item.active 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon size={16} className="mr-3" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <Users size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Public Adjuster</p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};
