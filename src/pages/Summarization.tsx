
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ArrowLeft } from "lucide-react";
import DocumentUpload from "../components/summarization/DocumentUpload";
import ProgressSteps from "../components/summarization/ProgressSteps";
import SummaryTab from "../components/summarization/SummaryTab";
import RiskAnalysisTab from "../components/summarization/RiskAnalysisTab";
import FinancialTermsTab from "../components/summarization/FinancialTermsTab";
import QualityTab from "../components/summarization/QualityTab";
import AuditTrailTab from "../components/summarization/AuditTrailTab";
import ChatPanel from "../components/summarization/ChatPanel";

type ProcessingStage = 'upload' | 'processing' | 'results';

const Summarization = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<ProcessingStage>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('summary');

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setStage('processing');
    
    // Simulate processing delay
    setTimeout(() => {
      setStage('results');
    }, 5000);
  };

  const handleStartOver = () => {
    setStage('upload');
    setUploadedFile(null);
    setActiveTab('summary');
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBackToHome}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Document Summarization</span>
              </div>
            </div>
            {stage === 'results' && (
              <Button variant="outline" onClick={handleStartOver}>
                Start Over
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Document Results */}
          <div className="lg:col-span-2">
            {stage === 'upload' && (
              <DocumentUpload onFileUpload={handleFileUpload} />
            )}

            {stage === 'processing' && (
              <ProgressSteps fileName={uploadedFile?.name || ''} />
            )}

            {stage === 'results' && (
              <div className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-md">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                    <TabsTrigger value="financial">Financial Terms</TabsTrigger>
                    <TabsTrigger value="quality">Quality</TabsTrigger>
                    <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="mt-6">
                    <SummaryTab fileName={uploadedFile?.name || ''} />
                  </TabsContent>

                  <TabsContent value="risk" className="mt-6">
                    <RiskAnalysisTab />
                  </TabsContent>

                  <TabsContent value="financial" className="mt-6">
                    <FinancialTermsTab />
                  </TabsContent>

                  <TabsContent value="quality" className="mt-6">
                    <QualityTab />
                  </TabsContent>

                  <TabsContent value="audit" className="mt-6">
                    <AuditTrailTab />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          {/* Right Sidebar - Chat Always Visible */}
          <div className="lg:col-span-1">
            <ChatPanel fileName={uploadedFile?.name || ''} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summarization;
