
import React, { useState } from 'react';
import { AIStatusHeader } from './AIStatusHeader';
import { ChatHeader } from './chat/ChatHeader';
import { MessagesList } from './chat/MessagesList';
import { ChatInput } from './chat/ChatInput';
import { AIManagement } from './AIManagement';
import { AIAssistant, aiAssistantsData } from '@/data/aiAssistants';
import { 
  Message, 
  mockUser, 
  initialMessages, 
  validateFile, 
  simulateTrainingAssignment, 
  downloadPolicyReport 
} from '@/utils/chatUtils';

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [showAIManagement, setShowAIManagement] = useState(false);
  const [aiAssistants, setAiAssistants] = useState(aiAssistantsData);

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
      createdBy: mockUser.name
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

  const canManageAIs = mockUser.userType.permissions.manageAIs;
  const isDeveloper = mockUser.userType.type === 'developer' || mockUser.userType.type === 'admin';

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
    
    // Check if user is asking about PDF issues or training
    const isPdfRelated = inputValue.toLowerCase().includes('pdf') || 
                        inputValue.toLowerCase().includes('document') ||
                        inputValue.toLowerCase().includes('file');
    
    setInputValue('');
    setIsProcessing(true);

    // Simulate AI response with training assignment logic
    setTimeout(() => {
      let aiResponseContent = `Thank you for your question, ${mockUser.name}. As a ${mockUser.role} in ${mockUser.department}, I'll provide you with the appropriate guidance.`;
      
      if (isPdfRelated) {
        aiResponseContent = `I see you're having issues with PDF processing. I've assigned the "PDF Converter Training" course to your Coastal U account. This 15-minute course will teach you how to convert image-based PDFs to readable text format.

Please complete this training and then return to continue with your PDF processing task.`;
        
        // Simulate training assignment
        simulateTrainingAssignment('PDF Converter Training');
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: 'ai',
        timestamp: new Date(),
        aiAssistant: 'Coastal AI'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDownloadReport = () => {
    downloadPolicyReport(mockUser);
  };

  return (
    <div className="flex h-full bg-slate-900">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* AI Status Header */}
        <AIStatusHeader 
          currentAI={getCurrentAI()} 
          userDepartment={mockUser.department}
        />

        {/* Chat Header */}
        <ChatHeader 
          user={mockUser}
          showAIManagement={showAIManagement}
          setShowAIManagement={setShowAIManagement}
        />

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
          userName={mockUser.name}
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
          userName={mockUser.name}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      </div>
    </div>
  );
};
