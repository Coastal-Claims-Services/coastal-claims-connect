
import React, { useRef, useEffect } from 'react';
import { Bot, User, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  aiAssistant?: string;
  status?: 'sending' | 'sent' | 'processing';
}

interface MessagesListProps {
  messages: Message[];
  isProcessing: boolean;
  userName: string;
  onDownloadReport: () => void;
}

export const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isProcessing,
  userName,
  onDownloadReport
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-lg p-3 rounded-lg ${
            message.sender === 'user' 
              ? 'bg-blue-600 text-white ml-12' 
              : 'bg-slate-700 border border-slate-600 text-slate-100 mr-12'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {message.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
              <div className="flex flex-col">
                <span className="text-xs font-medium">
                  {message.sender === 'user' ? userName : (message.aiAssistant || 'AI Assistant')}
                </span>
                {message.sender === 'ai' && message.aiAssistant && message.aiAssistant !== 'Coastal AI' && (
                  <span className="text-xs opacity-60">
                    via Coastal AI
                  </span>
                )}
              </div>
              <span className="text-xs opacity-70 ml-auto">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="text-sm whitespace-pre-line">{message.content}</div>
            {message.id === '9' && message.sender === 'ai' && (
              <div className="mt-3 pt-3 border-t border-slate-600">
                <Button 
                  onClick={onDownloadReport}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2"
                  size="sm"
                >
                  <Download size={14} className="mr-2" />
                  Download Full Policy Report
                </Button>
              </div>
            )}
            {message.status === 'processing' && (
              <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
                <Clock size={12} />
                Processing...
              </div>
            )}
          </div>
        </div>
      ))}
      
      {isProcessing && (
        <div className="flex justify-start">
          <div className="max-w-lg p-3 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 mr-12">
            <div className="flex items-center gap-2 mb-1">
              <Bot size={16} />
              <span className="text-xs font-medium">Coastal AI</span>
            </div>
            <div className="flex items-center gap-1 text-xs opacity-70">
              <Clock size={12} />
              Processing...
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
