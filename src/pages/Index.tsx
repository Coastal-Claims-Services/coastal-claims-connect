
import React from 'react';
import { AppSidebar } from '@/components/Sidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-100">
        <AppSidebar />
        <SidebarInset>
          <ChatInterface />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
