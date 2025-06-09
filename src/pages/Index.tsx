
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatInterface } from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="h-screen flex bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
