import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  aiAssistant?: string;
  status?: 'sending' | 'sent' | 'processing';
}

interface AIAssistant {
  id: string;
  name: string;
  specialty: string;
  description: string;
  color: string;
  available: boolean;
}

// Mock user data - in real implementation this would come from the portal login
const mockUser = {
  name: 'John Smith',
  department: 'Claims Processing',
  role: 'Senior Claims Adjuster',
  accessLevel: 'Senior'
};

const aiAssistants: AIAssistant[] = [
  {
    id: 'claims-processor',
    name: 'Claims Processor AI',
    specialty: 'Claims Processing',
    description: 'Handles claim submissions, documentation, and processing workflows',
    color: 'bg-blue-500',
    available: true
  },
  {
    id: 'policy-expert',
    name: 'Policy Expert AI',
    specialty: 'Policy Analysis',
    description: 'Interprets insurance policies, coverage details, and exclusions',
    color: 'bg-green-500',
    available: true
  },
  {
    id: 'damage-assessor',
    name: 'Damage Assessment AI',
    specialty: 'Damage Assessment',
    description: 'Analyzes property damage reports and assessment methodologies',
    color: 'bg-purple-500',
    available: true
  },
  {
    id: 'legal-advisor',
    name: 'Legal Advisor AI',
    specialty: 'Legal Compliance',
    description: 'Provides guidance on legal requirements and compliance issues',
    color: 'bg-amber-500',
    available: false
  },
  {
    id: 'customer-service',
    name: 'Customer Service AI',
    specialty: 'Customer Relations',
    description: 'Handles customer communications and service inquiries',
    color: 'bg-teal-500',
    available: true
  }
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${mockUser.name}! I can see from your login that you work in the ${mockUser.department} department as a ${mockUser.role}. Perfect! I'm Coastal AI - your AI Switchboard Operator.

I'll route your questions to the most appropriate specialist based on your role and access level. Listed below are the AI assistants I can direct you to.

May I first ask: is your question today procedural related or is it about claims specifically, as this will affect the list of AI assistants I can provide for you?`,
      sender: 'ai',
      timestamp: new Date(),
      aiAssistant: 'Coastal AI'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAI, setSelectedAI] = useState<string | null>(null);
  const [showSpecialists, setShowSpecialists] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const determineAI = (message: string): AIAssistant => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('claim') || lowerMessage.includes('submission') || lowerMessage.includes('process')) {
      return aiAssistants.find(ai => ai.id === 'claims-processor')!;
    }
    if (lowerMessage.includes('policy') || lowerMessage.includes('coverage') || lowerMessage.includes('exclusion')) {
      return aiAssistants.find(ai => ai.id === 'policy-expert')!;
    }
    if (lowerMessage.includes('damage') || lowerMessage.includes('assessment') || lowerMessage.includes('property')) {
      return aiAssistants.find(ai => ai.id === 'damage-assessor')!;
    }
    if (lowerMessage.includes('legal') || lowerMessage.includes('compliance') || lowerMessage.includes('regulation')) {
      return aiAssistants.find(ai => ai.id === 'legal-advisor')!;
    }
    if (lowerMessage.includes('customer') || lowerMessage.includes('client') || lowerMessage.includes('service')) {
      return aiAssistants.find(ai => ai.id === 'customer-service')!;
    }
    
    return aiAssistants.find(ai => ai.id === 'claims-processor')!;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Show specialists sidebar after first user message
    if (!showSpecialists) {
      setShowSpecialists(true);
    }

    // Simulate AI routing
    setTimeout(() => {
      const routedAI = determineAI(inputValue);
      setSelectedAI(routedAI.id);

      const routingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Perfect! Based on your question and your role as a ${mockUser.role}, I'm routing this to ${routedAI.name} (${routedAI.specialty}). They have the right expertise for your access level...`,
        sender: 'ai',
        timestamp: new Date(),
        aiAssistant: 'Coastal AI'
      };

      setMessages(prev => [...prev, routingMessage]);

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 2).toString(),
          content: `Hello ${mockUser.name}! I'm the ${routedAI.name}. I can see you're a ${mockUser.role} in ${mockUser.department}, so I'll tailor my response to your experience level. Based on your inquiry about ${routedAI.specialty.toLowerCase()}, let me provide you with the detailed guidance you need. [This is a placeholder response - the actual AI would provide specific help based on the user's question and access level]`,
          sender: 'ai',
          timestamp: new Date(),
          aiAssistant: routedAI.name
        };

        setMessages(prev => [...prev, aiResponse]);
        setIsProcessing(false);
      }, 2000);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full bg-slate-900">
      {/* AI Assistants Sidebar - Only shown after first interaction */}
      {showSpecialists && (
        <div className="w-80 bg-slate-800 border-r border-slate-700 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">AI Specialists</h3>
          <p className="text-sm text-slate-400 mb-4">Available to {mockUser.role}s in {mockUser.department}</p>
          <div className="space-y-3">
            {aiAssistants.map((ai) => (
              <Card key={ai.id} className={`p-3 transition-all cursor-pointer bg-slate-700 border-slate-600 ${selectedAI === ai.id ? 'ring-2 ring-blue-400 bg-slate-600' : 'hover:bg-slate-600'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${ai.color} ${!ai.available ? 'opacity-50' : ''}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-slate-100">{ai.name}</h4>
                      <Badge variant={ai.available ? "default" : "secondary"} className="text-xs">
                        {ai.available ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{ai.specialty}</p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ai.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Development Note */}
          <div className="mt-6 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <h4 className="text-sm font-medium text-amber-400 mb-2">🚧 Development Note</h4>
            <p className="text-xs text-slate-300">
              This interface demonstrates role-based AI routing. In production, user data will come from portal authentication, and AI responses will be filtered by department access levels and user roles.
            </p>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Coastal AI</h2>
              <p className="text-sm text-slate-300">Logged in as: {mockUser.name} | {mockUser.department} | {mockUser.role}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              All systems operational
            </div>
          </div>
        </div>

        {/* Messages Area */}
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
                  <span className="text-xs font-medium">
                    {message.sender === 'user' ? mockUser.name : message.aiAssistant || 'AI Assistant'}
                  </span>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-sm whitespace-pre-line">{message.content}</div>
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
              <div className="bg-slate-700 border border-slate-600 text-slate-100 max-w-lg p-3 rounded-lg mr-12">
                <div className="flex items-center gap-2">
                  <Bot size={16} />
                  <span className="text-xs font-medium">Coastal AI</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-slate-400">Analyzing based on your role and routing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-slate-800 border-t border-slate-700 p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask your question, ${mockUser.name}...`}
              className="flex-1 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
              disabled={isProcessing}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send size={16} />
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Questions will be routed to specialists based on your department access and role level.
          </p>
        </div>
      </div>
    </div>
  );
};
