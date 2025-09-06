import React, { useState, useEffect } from 'react';
import { AIStatusHeader } from './AIStatusHeader';
import { ChatHeader } from './chat/ChatHeader';
import { MessagesList } from './chat/MessagesList';
import { ChatInput } from './chat/ChatInput';
import { AIManagement } from './AIManagement';
import { HomeStateSelector } from './HomeStateSelector';
import { useUser } from '@/contexts/UserContext';
import { AIAssistant, aiAssistantsData } from '@/data/aiAssistants';
import { MemoryManager } from '@/utils/memoryManager';
import { 
  Message, 
  initialMessages, 
  validateFile, 
  assignTraining, 
  downloadPolicyReport 
} from '@/utils/chatUtils';

export const ChatInterface = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [showAIManagement, setShowAIManagement] = useState(false);
  const [aiAssistants, setAiAssistants] = useState(aiAssistantsData);
  const [sessionId] = useState(() => MemoryManager.generateSessionId());

  // Initialize memory session on component mount
  useEffect(() => {
    MemoryManager.create({
      sessionId,
      userId: user.name,
      claimId: undefined // Can be set later if working on specific claims
    });

    return () => {
      // Optional: Clean up memory on unmount
      // MemoryManager.reset(sessionId);
    };
  }, [sessionId]);

  // Get current AI from the last AI message
  const getCurrentAI = (): string => {
    const lastAIMessage = [...messages].reverse().find(msg => msg.sender === 'ai');
    return lastAIMessage?.aiAssistant || 'Coastal AI';
  };

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    
    const error = validateFile(file);
    if (error) {
      setUploadStatus(error);
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }
    
    // Add a message showing the file was uploaded
    const fileMessage: Message = {
      id: Date.now().toString(),
      content: `📎 Policy document uploaded: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, fileMessage]);
    setUploadStatus(`${file.name} uploaded successfully`);
    setTimeout(() => setUploadStatus(null), 2000);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleAddAI = (aiData: Omit<AIAssistant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAI: AIAssistant = {
      ...aiData,
      id: `ai-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.name
    };
    setAiAssistants(prev => [...prev, newAI]);
  };

  const handleUpdateAI = (id: string, updates: Partial<AIAssistant>) => {
    setAiAssistants(prev => prev.map(ai => 
      ai.id === id 
        ? { ...ai, ...updates, updatedAt: new Date() }
        : ai
    ));
  };

  const handleDeleteAI = (id: string) => {
    setAiAssistants(prev => prev.filter(ai => ai.id !== id));
  };

  const canManageAIs = user.userType.permissions.manageAIs;
  const isDeveloper = user.userType.type === 'developer' || user.userType.type === 'admin';

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Check if API key is available
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "⚠️ OpenAI API key not found. Please go to Admin panel to set up your API key first.",
        sender: 'ai',
        timestamp: new Date(),
        aiAssistant: 'System'
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Check if user is asking about PDF issues or training
    const isPdfRelated = inputValue.toLowerCase().includes('pdf') || 
                        inputValue.toLowerCase().includes('document') ||
                        inputValue.toLowerCase().includes('file');
    
    // Determine which AI should respond and get memory context
    const targetAI = getCurrentAI();
    const memoryContext = MemoryManager.injectToPrompt(sessionId, targetAI);
    
    // Get department rules if they exist
    const departmentRulesData = localStorage.getItem('department_rules');
    let departmentRules = '';
    if (departmentRulesData) {
      try {
        const rules = JSON.parse(departmentRulesData);
        departmentRules = rules[user.department] || '';
      } catch (error) {
        console.error('Failed to parse department rules:', error);
      }
    }
    
    setInputValue('');
    setIsProcessing(true);

    // Add to AI history
    MemoryManager.addToHistory(sessionId, targetAI, inputValue, 'automatic');

    try {
      // Build system message with context
      let systemMessage = `You are ${targetAI}, a conversational AI assistant designed to help ${user.name}, who works as a ${user.role} in the ${user.department} department at their company.

${departmentRules ? `Department Rules for ${user.department}:\n${departmentRules}\n` : ''}

${memoryContext ? `Previous conversation context:\n${memoryContext}\n` : ''}

Keep responses conversational, helpful, and concise. Don't provide lengthy corporate descriptions unless specifically asked. Focus on answering the user's actual question.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: systemMessage
            },
            {
              role: 'user',
              content: inputValue
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      let aiResponseContent = data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response at this time.";
      
      // Handle PDF-related training assignment
      if (isPdfRelated) {
        aiResponseContent += `\n\n📚 Training assignment functionality will be available when integrated with your learning management system.`;
        // assignTraining('PDF Converter Training'); // Disabled until LMS integration
      }

      // Update memory based on AI response
      if (targetAI === 'CCS Policy Pro') {
        MemoryManager.update(sessionId, {
          policyReviewSummary: 'Policy reviewed - Coverage A: $500,900, Hurricane Deductible: $10,018'
        });
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: 'ai',
        timestamp: new Date(),
        aiAssistant: targetAI
      };

      setMessages(prev => [...prev, aiResponse]);
      
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `❌ Sorry, I encountered an error while processing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key in the Admin panel and try again.`,
        sender: 'ai',
        timestamp: new Date(),
        aiAssistant: targetAI
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDownloadReport = () => {
    downloadPolicyReport(user);
  };

  return (
    <div className="flex h-full bg-slate-900">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* AI Status Header */}
        <AIStatusHeader 
          currentAI={getCurrentAI()} 
          userDepartment={user.department}
        />

        {/* Chat Header */}
        <ChatHeader 
          user={user}
          showAIManagement={showAIManagement}
          setShowAIManagement={setShowAIManagement}
        />

        {/* Home State Selector */}
        <div className="bg-slate-800 border-b border-slate-700 p-2 flex justify-end">
          <HomeStateSelector triggerClassName="border-slate-600 text-slate-300 hover:bg-slate-700" />
        </div>

        {/* AI Management Panel */}
        {showAIManagement && canManageAIs && (
          <div className="bg-slate-800 border-b border-slate-700 p-4">
            <AIManagement
              aiAssistants={aiAssistants}
              onAddAI={handleAddAI}
              onUpdateAI={handleUpdateAI}
              onDeleteAI={handleDeleteAI}
              isDeveloper={isDeveloper}
            />
          </div>
        )}

        {/* Messages Area */}
        <MessagesList
          messages={messages}
          isProcessing={isProcessing}
          userName={user.name}
          onDownloadReport={handleDownloadReport}
        />

        {/* Input Area */}
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
          isProcessing={isProcessing}
          isDragOver={isDragOver}
          uploadStatus={uploadStatus}
          userName={user.name}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      </div>
    </div>
  );
};
