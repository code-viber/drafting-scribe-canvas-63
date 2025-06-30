
import React, { useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";

interface DocumentUploadProps {
  onFileUpload: (file: File) => void;
}

const DocumentUpload = ({ onFileUpload }: DocumentUploadProps) => {
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border-gray-100 rounded-2xl shadow-card">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900 font-space-grotesk">Upload Document for Summarization</CardTitle>
          <CardDescription className="text-lg text-gray-600 font-space-grotesk font-light">
            Upload your document to begin AI-powered analysis and summarization
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div
            className="border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center hover:border-brand/40 hover:bg-brand/5 transition-all duration-300 cursor-pointer bg-gray-50/30 backdrop-blur-sm group"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="w-20 h-20 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand/20 transition-colors duration-300">
              <Upload className="h-10 w-10 text-brand group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 font-space-grotesk">
              Drag and drop your document here
            </h3>
            <p className="text-gray-500 mb-8 font-space-grotesk font-light">
              Supports PDF, Word documents, and text files up to 50MB
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
            />
            <Button 
              asChild 
              className="bg-brand hover:bg-brand-600 text-white rounded-xl px-8 py-3 font-medium shadow-sm hover:shadow-md transition-all duration-200 font-space-grotesk"
            >
              <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Choose File
              </label>
            </Button>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-400 font-space-grotesk">
                Your documents are processed securely and privately
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;
