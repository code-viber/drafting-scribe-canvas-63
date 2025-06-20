
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
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Upload Document for Summarization</CardTitle>
          <CardDescription className="text-lg">
            Please upload the document(s) you want to summarize
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50/50"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Drag and drop your document here
            </h3>
            <p className="text-gray-500 mb-6">
              Supports PDF, Word documents, and text files
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
            />
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2" />
                Choose File
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;
