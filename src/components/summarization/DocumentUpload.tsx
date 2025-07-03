import React, { useCallback, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
interface DocumentUploadProps {
  onFileUpload: (file: File) => void;
}
interface RecentUpload {
  id: number;
  title: string;
  status: string;
  date: string;
  fileName: string;
}
const DocumentUpload = ({
  onFileUpload
}: DocumentUploadProps) => {
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  useEffect(() => {
    // Load recent uploads from localStorage
    const savedSummaries = JSON.parse(localStorage.getItem('savedSummaries') || '[]');
    const recent = savedSummaries.slice(-3).reverse(); // Get last 3, most recent first
    setRecentUploads(recent);
  }, []);
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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'Processing':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700"><Clock className="h-3 w-3 mr-1" />Processing</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-700"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
    }
  };
  return <div className="space-y-8">
      {/* Main Upload Section */}
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 font-space-grotesk">Upload Document for Summarization</CardTitle>
            <CardDescription className="text-gray-600 font-space-grotesk">
              Get AI-powered insights, risk analysis, and comprehensive summaries
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 my-0 py-[5px]">
            <div onDrop={handleDrop} onDragOver={handleDragOver} className="border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center hover:border-brand/40 hover:bg-brand/5 transition-all duration-300 cursor-pointer bg-gray-50/30 backdrop-blur-sm group py-[15px]">
              <div className="w-20 h-20 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand/20 transition-all duration-300 group-hover:scale-110">
                <Upload className="h-10 w-10 text-brand group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 font-space-grotesk">
                Drag and drop your document here
              </h3>
              <p className="text-gray-500 mb-8 font-space-grotesk font-light">
                Supports PDF, Word documents, and text files up to 50MB
              </p>
              <input type="file" id="file-upload" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileSelect} />
              <Button asChild className="bg-brand hover:bg-brand-600 text-white rounded-xl px-8 py-3 font-medium shadow-sm hover:shadow-md transition-all duration-200 font-space-grotesk hover:scale-105">
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

      {/* Recent Uploads Section */}
      {recentUploads.length > 0 && <Card className="bg-white/80 backdrop-blur-sm border-gray-100 rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 font-space-grotesk flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Previous Summarizations
            </CardTitle>
            <CardDescription className="text-gray-600 font-space-grotesk">
              Your recent document analysis history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUploads.map(upload => <div key={upload.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 font-space-grotesk">{upload.fileName || 'Untitled Document'}</h4>
                    <p className="text-sm text-gray-500 font-space-grotesk">{upload.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(upload.status)}
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>)}
          </CardContent>
        </Card>}
    </div>;
};
export default DocumentUpload;