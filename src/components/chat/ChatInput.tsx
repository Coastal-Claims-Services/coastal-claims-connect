
import React from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isProcessing: boolean;
  isDragOver: boolean;
  uploadStatus: string | null;
  userName: string;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  onSendMessage,
  onKeyPress,
  isProcessing,
  isDragOver,
  uploadStatus,
  userName,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop
}) => {
  return (
    <div 
      className={`bg-slate-800 border-t border-slate-700 p-4 transition-all ${
        isDragOver ? 'bg-slate-700 border-blue-400' : ''
      }`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
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
          onKeyPress={onKeyPress}
          placeholder={`Ask your question, ${userName}... ${isDragOver ? '(Drop PDF here)' : '(or drag PDF here)'}`}
          className={`flex-1 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 transition-all ${
            isDragOver ? 'border-blue-400 bg-slate-600' : ''
          }`}
          disabled={isProcessing}
        />
        <Button 
          onClick={onSendMessage} 
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
  );
};
