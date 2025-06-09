
import React from 'react';
import { 
  LayoutDashboard, 
  MessageCircle, 
  Users, 
  Calendar,
  FileText,
  Bot,
  Settings,
  User,
  Book
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: LayoutDashboard, label: 'Applications', active: false },
  { icon: MessageCircle, label: 'Messenger', active: false },
  { icon: Calendar, label: 'Calendar', active: false },
  { icon: Book, label: 'Coastal U', active: false },
  { icon: Users, label: 'Directory', active: false },
  { icon: FileText, label: 'Documents', active: false },
  { icon: Bot, label: 'Coastal AI', active: false },
  { icon: FileText, label: 'HR', active: false },
  { icon: Settings, label: 'Admin', active: false },
  { icon: User, label: 'Talent', active: false },
];

export const AppSidebar = () => {
  return (
    <Sidebar className="bg-slate-800 text-white border-r border-slate-700">
      <SidebarHeader className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-white">CCS Portal</h1>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarMenu>
          {sidebarItems.map((item, index) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                className={`w-full justify-start text-left h-12 ${
                  index === 0 
                    ? 'bg-green-500 text-white hover:bg-green-600 rounded-lg' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon size={20} className="mr-4" />
                <span className="text-base">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarRail />
    </Sidebar>
  );
};
