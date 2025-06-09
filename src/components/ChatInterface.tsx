import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Clock, CheckCircle, Paperclip, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIStatusHeader } from './AIStatusHeader';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  aiAssistant?: string;
  status?: 'sending' | 'sent' | 'processing';
}

// Mock user data - in real implementation this would come from the portal login
const mockUser = {
  name: 'John Smith',
  department: 'CAN program',
  role: 'Public Adjuster',
  accessLevel: 'Senior'
};

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello John Smith! I can see from your login that you work in the CAN program as a Public Adjuster. Perfect! I'm Coastal AI - your AI Switchboard Operator.

I'll route your questions to the most appropriate specialist based on your role and access level.

May I first ask: is your question today procedural related or is it about claims specifically, as this will affect the list of AI assistants I can provide for you?`,
      sender: 'ai',
      timestamp: new Date(),
      aiAssistant: 'Coastal AI'
    },
    {
      id: '2',
      content: 'I have a question on how to do a policy review',
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    },
    {
      id: '3',
      content: 'Perfect! For a policy review, I\'ll need you to upload the PDF policy document. Please upload the policy PDF below and I\'ll have our Policy Expert AI analyze it for you.',
      sender: 'ai',
      timestamp: new Date(),
      aiAssistant: 'Coastal AI'
    },
    {
      id: '4',
      content: '📎 Policy document uploaded: Policy_Review_Document.pdf',
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    },
    {
      id: '5',
      content: `I cannot read your PDF. It's likely an image-based PDF or has copy protection enabled. 

To extract the text, you'll need to convert it to a readable format. Do you know how to convert it, or would you like instructions?`,
      sender: 'ai',
      timestamp: new Date(),
      aiAssistant: 'Coastal AI'
    },
    {
      id: '6',
      content: 'no i do not know how',
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    },
    {
      id: '7',
      content: 'I have added the PDF converter training to your Coastal U account. After you watch the video and have converted the PDF, please come back and drop the policy in so I can complete this policy review for you.',
      sender: 'ai',
      timestamp: new Date(),
      aiAssistant: 'Coastal AI'
    },
    {
      id: '8',
      content: '📎 Policy document uploaded: Policy_Review_Document.pdf',
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    },
    {
      id: '9',
      content: `Perfect! I've completed your policy review. Based on your role as a ${mockUser.role}, I've generated a comprehensive analysis of the Frank J. Hawkins policy. The report includes all critical details including coverage limits, deductibles, exclusions, and potential gaps that may affect claim handling.

Key highlights from the review:
• Coverage A (Dwelling): $500,900
• Hurricane Deductible: $10,018 (2% of Coverage A)
• Missing matching endorsement and cosmetic coverage
• Ensuing loss language needs clarification for sand-related damage

The complete detailed report is available for download below.`,
      sender: 'ai',
      timestamp: new Date(),
      aiAssistant: 'CCS Policy Pro'
    },
    {
      id: '10',
      content: 'This is only my second claim with coastal please advise on my next steps if you can',
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    },
    {
      id: '11',
      content: `John, I've checked the SOP procedures for what to do after completing a Policy Pro review. Here's a bullet point list of your next few steps:

• **Step 1:** Load the Policy Pro review into the Public Adjuster folder files and documents in the CRM

• **Step 2:** Complete the CCS Scope Pro template and load that into the Public Adjuster files in the Docs folder and the company's CRM

• **Step 3:** Click "Action Item Ready for Estimating"

Once the estimate is returned, please come back and let me know, and I will help you with the next few steps.`,
      sender: 'ai',
      timestamp: new Date(),
      aiAssistant: 'Coastal AI'
    },
    {
      id: '12',
      content: 'I\'ve received the estimate back from estimating what are my next steps',
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current AI from the last AI message
  const getCurrentAI = (): string => {
    const lastAIMessage = [...messages].reverse().find(msg => msg.sender === 'ai');
    return lastAIMessage?.aiAssistant || 'Coastal AI';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return 'Please upload a PDF file only.';
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return 'File size must be less than 10MB.';
    }
    return null;
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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Thank you for your question, ${mockUser.name}. As a ${mockUser.role} in ${mockUser.department}, I'll provide you with the appropriate guidance. [This is a placeholder response - the actual AI would provide specific help based on the user's question and access level]`,
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

  const downloadPolicyReport = () => {
    const reportContent = `POLICY REVIEW REPORT
Generated by: Coastal Claims Services Policy Pro™
Generated on: ${new Date().toLocaleDateString()}
Reviewed by: ${mockUser.name} (${mockUser.role})

📘 POLICY BASICS

Named Insured(s): FRANK J HAWKINS
Insured Address: 2917 CAPTIVA WAY, SARASOTA, FL 34231

✅ Mortgage
Name: Not Specified
Loan #: Not Specified
Mailing Address: Not Specified

✅ Insurance Carrier
Carrier: Farmers Casualty Insurance Company
Policy Period: 10/14/2023 to 10/14/2024
Agent (information and address): Not Specified

🏠 PROPERTY DETAILS (UNDERWRITING SNAPSHOT)

County property appraiser search website: https://www.sc-pa.com/
Year Built: 1974
Square Footage: Not Specified
Roof Year: Not Specified
Foundation: Frame Construction
Interior/Exterior: Not Specified

🧾 DEDUCTIBLES SECTION

Type                    Amount
Hurricane              $10,018 (2% of Coverage A)
All Other Perils       $1,000

🛡️ COVERAGE TOTALS SECTION

Coverage    Description                    Limit
A          Dwelling                       $500,900
B          Other Structures               $100,180
C          Personal Property              $375,675
D          Loss of Use (up to 24 mo.)     $264,665
A,B,C,D    Total Combined                 $1,241,420

📄 ENDORSEMENTS

Limited Replacement Plus Incl
Replacement Cost on Contents Incl
13 - Back Up of Sewer, Drain and Sump Pump Coverage: $250 Deductible
15 - Ordinance or Law 50% of Coverage A
25 - Personal Injury Coverage
Forms and Endorsements: 7083-000 (0698), H633F, H768, H698G, H302B, H326, H101, H445FL, H781, H870, H331C, H708C, H603

⚠️ EXCLUSIONS / GAPS / LIMITATIONS

Matching endorsement: No
Cosmetic Endorsement: No
Roof payment schedule: No
Right to repair / Our option: Clarification Needed – language unclear
ACV (actual cash value endorsement): No
Ensuing loss: (storm/wind created an opening)
Language not found regarding "Sand" or associated ensuing loss coverage.

📝 EXAMINATION UNDER OATH (EUO)

Party                    EUO Requirement
Insured                 ✅ Yes
Public Adjuster (PA)    ❌ No

Note: PAs cannot be compelled to EUO, but may be subpoenaed for records or deposition in litigation.

⏳ LEGAL / STATUTORY INFO

Statute of Limitations to File Claim: Not Specified
"Suit Against Us" Clause Language: Not Specified

Appraisal
Appraisal Clause Present? Yes — Language not provided in excerpts, assumed present based on standard Florida HO policies.

🗓️ REVIEW DATA

Generated on: ${new Date().toLocaleDateString()}
Reviewed by: Coastal Claims Services Policy Pro™

---
This report was generated by Coastal AI Policy Expert for ${mockUser.name}
Department: ${mockUser.department}
Role: ${mockUser.role}`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Frank_Hawkins_Policy_Review_Report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full bg-slate-900">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* AI Status Header - NEW */}
        <AIStatusHeader 
          currentAI={getCurrentAI()} 
          userDepartment={mockUser.department}
        />

        {/* Original Chat Header - Updated to remove redundant info */}
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
                {message.id === '9' && message.sender === 'ai' && (
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <Button 
                      onClick={downloadPolicyReport}
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

        {/* Input Area with Drag and Drop */}
        <div 
          className={`bg-slate-800 border-t border-slate-700 p-4 transition-all ${
            isDragOver ? 'bg-slate-700 border-blue-400' : ''
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {uploadStatus && (
            <div className="mb-2 text-xs text-slate-300 flex items-center gap-1">
              <Paperclip size={12} />
              {uploadStatus}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask your question, ${mockUser.name}... ${isDragOver ? '(Drop PDF here)' : '(or drag PDF here)'}`}
              className={`flex-1 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 transition-all ${
                isDragOver ? 'border-blue-400 bg-slate-600' : ''
              }`}
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
            Questions will be routed to specialists based on your department access and role level. {isDragOver ? 'Release to upload PDF.' : 'Drag PDF files here to upload.'}
          </p>
        </div>
      </div>
    </div>
  );
};
