
import React, { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return 'Please upload a PDF file only.';
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return 'File size must be less than 10MB.';
    }
    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setUploadError(null);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <Card className={`
      p-6 border-2 border-dashed transition-all cursor-pointer
      ${isDragOver 
        ? 'border-blue-400 bg-blue-50/10' 
        : 'border-slate-600 bg-slate-700/50'
      }
      hover:border-slate-500 hover:bg-slate-700/70
    `}>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`p-3 rounded-full ${isDragOver ? 'bg-blue-500/20' : 'bg-slate-600'}`}>
            <Upload size={24} className={isDragOver ? 'text-blue-400' : 'text-slate-300'} />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-slate-100 mb-2">
              Upload Policy Document
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              Drag and drop your PDF policy document here, or click to browse
            </p>
            
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <span className="flex items-center gap-2">
                  <FileText size={16} />
                  Choose PDF File
                </span>
              </Button>
            </label>
          </div>
          
          <p className="text-xs text-slate-400">
            Supported: PDF files up to 10MB
          </p>
        </div>
        
        {uploadError && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <X size={16} />
              <span className="text-sm">{uploadError}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
