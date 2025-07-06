import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Image, File, Eye, X } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  url?: string;
}

interface FileUploadZoneProps {
  title: string;
  existingFiles?: UploadedFile[];
  onFilesUploaded?: (files: UploadedFile[]) => void;
  acceptedTypes?: string[];
  maxSize?: number;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  title,
  existingFiles = [],
  onFilesUploaded,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt'],
  maxSize = 10
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(existingFiles);
  const [isOpen, setIsOpen] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  }, []);

  const processFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      url: URL.createObjectURL(file)
    }));

    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesUploaded?.(updatedFiles);
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesUploaded?.(updatedFiles);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4 text-red-400" />;
    if (fileType.includes('image')) return <Image className="h-4 w-4 text-blue-400" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileText className="h-4 w-4 text-blue-600" />;
    return <File className="h-4 w-4 text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const viewFile = (file: UploadedFile) => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-slate-300 border-slate-600">
          <Upload className="h-3 w-3 mr-1" />
          Upload
          {uploadedFiles.length > 0 && (
            <Badge className="ml-2 bg-green-500/20 text-green-400 text-xs px-1">
              {uploadedFiles.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Upload documents, images, and files. Drag and drop or click to select.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto max-h-96">
          <Card 
            className={`border-2 border-dashed transition-colors ${
              isDragActive 
                ? 'border-green-400 bg-green-400/10' 
                : 'border-slate-600 bg-slate-700/30'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <CardContent className="p-6 text-center">
              <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragActive ? 'text-green-400' : 'text-slate-400'}`} />
              <p className="text-slate-300 mb-2">
                {isDragActive ? 'Drop files here' : 'Drag and drop files here, or click to select'}
              </p>
              <p className="text-sm text-slate-500 mb-4">
                Supported: {acceptedTypes.join(', ')} • Max size: {maxSize}MB
              </p>
              <input
                type="file"
                multiple
                accept={acceptedTypes.join(',')}
                onChange={handleFileInput}
                className="hidden"
                id={`file-upload-${Math.random().toString(36).substring(7)}`}
              />
              <label htmlFor={`file-upload-${Math.random().toString(36).substring(7)}`}>
                <Button variant="outline" className="text-slate-300 border-slate-600" asChild>
                  <span className="cursor-pointer">Select Files</span>
                </Button>
              </label>
            </CardContent>
          </Card>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-medium">Uploaded Files ({uploadedFiles.length})</h4>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="text-sm font-medium text-white">{file.name}</p>
                      <p className="text-xs text-slate-400">
                        {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewFile(file)}
                      className="text-blue-400 hover:bg-blue-400/10"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-400 hover:bg-red-400/10"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="text-slate-300 border-slate-600"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};