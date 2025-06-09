
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
  User,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', active: false },
  { icon: LayoutDashboard, label: 'Applications', path: '/applications', active: false },
  { icon: MessageCircle, label: 'Messenger', path: '/messenger', active: false },
  { icon: Calendar, label: 'Calendar', path: '/calendar', active: false },
  { icon: BookOpen, label: 'Coastal U', path: '/coastal-u', active: false },
  { icon: Users, label: 'Directory', path: '/directory', active: false },
  { icon: FileText, label: 'Documents', path: '/documents', active: false },
  { icon: Bot, label: 'Coastal AI', path: '/', active: false },
  { icon: FileText, label: 'HR', path: '/hr', active: false },
  { icon: Settings, label: 'Admin', path: '/admin', active: false },
  { icon: User, label: 'Talent', path: '/talent', active: false },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

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
          {sidebarItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => handleNavigation(item.path)}
                className={`w-full justify-start text-left h-12 ${
                  isActive 
                    ? 'bg-green-500 text-white hover:bg-green-600 rounded-lg' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon size={20} className="mr-4" />
                <span className="text-base">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
