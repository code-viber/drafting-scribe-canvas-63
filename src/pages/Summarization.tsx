import React, { useState, useEffect, useRef } from 'react';
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

interface ProgressData {
  status: string;
  progress: number;
  progress_percentage?: number;
  message: string;
  completed: boolean;
  steps?: Array<{
    step_name: string;
    status: string;
    progress_percentage?: number;
    start_time?: string;
    end_time?: string;
    duration_ms?: number | null;
    details?: string;
  }>;
}

interface CompleteSummaryData {
  summary_tab: any;
  risk_analysis_tab: any;
  financial_terms_tab: any;
  quality_tab: any;
  audit_trail_tab: any;
}

const API_BASE_URL = 'http://localhost:8005';

const Summarization = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<ProcessingStage>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [completeSummaryData, setCompleteSummaryData] = useState<CompleteSummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [componentKey, setComponentKey] = useState(Date.now()); // Force re-render key
  
  // Use refs to track polling state and prevent memory leaks
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);
  const pollCountRef = useRef(0);
  const hasCompletedRef = useRef(false);

  // Cleanup function to clear all intervals and timeouts
  const cleanup = () => {
    console.log('🧹 Cleaning up polling resources');
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
    isPollingRef.current = false;
    pollCountRef.current = 0;
    
    // Force state reset
    console.log('🧹 Cleanup completed - polling stopped');
  };

  // Cleanup on component unmount
  useEffect(() => {
    console.log('🚀 Summarization component mounted');
    return () => {
      console.log('🧹 Summarization component unmounting - cleaning up');
      cleanup();
    };
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setStage('processing');
    setError(null);
    hasCompletedRef.current = false;
    
    // Start with initial progress state
    setProgressData({
      status: 'uploading',
      progress: 0,
      progress_percentage: 0,
      message: 'Uploading document...',
      completed: false
    });

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      console.log('📤 Step 1: Calling summarize-ui API...');
      
      // Step 1: Call the summarize-ui API to get request_id
      const response = await fetch(`${API_BASE_URL}/api/summarize-ui`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      const newRequestId = result.request_id;
      
      if (!newRequestId) {
        throw new Error('No request ID received from server');
      }

      console.log('✅ Step 1 Complete: Got request ID:', newRequestId);
      setRequestId(newRequestId);
      
      // Update progress to show upload completed and processing started
      setProgressData({
        status: 'processing',
        progress: 5,
        progress_percentage: 5,
        message: 'Document uploaded. Processing started...',
        completed: false
      });
      
      console.log('🚀 Step 2: Starting progress polling immediately...');
      // Step 2: Start progress polling IMMEDIATELY in parallel
      startProgressPolling(newRequestId);

      // Save summarized document info to localStorage
      const summarizedDocument = {
        id: Date.now(),
        title: `Summary - ${file.name}`,
        summary: `AI-generated summary of ${file.name} - Processing...`,
        parties: 'Processing...',
        jurisdiction: 'Processing...',
        date: new Date().toLocaleDateString(),
        status: 'Processing',
        type: 'summary',
        fileName: file.name,
        requestId: newRequestId
      };

      const savedSummaries = JSON.parse(localStorage.getItem('savedSummaries') || '[]');
      savedSummaries.push(summarizedDocument);
      localStorage.setItem('savedSummaries', JSON.stringify(savedSummaries));

    } catch (error) {
      console.error('❌ Error in Step 1 (summarize-ui):', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      setStage('upload');
      cleanup(); // Clean up any ongoing operations
    }
  };

  const startProgressPolling = (requestId: string) => {
    // Prevent multiple polling instances
    if (isPollingRef.current) {
      console.log('⚠️ Progress polling already in progress, skipping...');
      return;
    }

    console.log('🚀 Step 2: Starting progress polling for request:', requestId);
    isPollingRef.current = true;
    pollCountRef.current = 0;
    hasCompletedRef.current = false;
    
    const maxPolls = 300; // Maximum 5 minutes of polling (300 * 1 second)

    const pollProgress = async () => {
      // Early exit if polling was cancelled or already completed
      if (!isPollingRef.current || hasCompletedRef.current) {
        console.log('🛑 Polling cancelled or already completed');
        return;
      }

      pollCountRef.current++;
      
      // Safety check to prevent infinite polling
      if (pollCountRef.current > maxPolls) {
        console.error('🚨 Progress polling exceeded maximum attempts (5 minutes)');
        cleanup();
        setError('Document processing is taking longer than expected. Please try again.');
        return;
      }

      try {
        console.log(`📊 Step 2.${pollCountRef.current}: Polling progress for request ${requestId}`);
        const response = await fetch(`${API_BASE_URL}/api/progress/${requestId}`);
        
        if (!response.ok) {
          throw new Error(`Progress fetch failed: ${response.statusText}`);
        }

        const progress = await response.json();
        console.log('📈 Progress data received:', JSON.stringify(progress, null, 2));

        // Check for step-based completion - specifically "Quality Review" step
        let isCompletedBySteps = false;
        let qualityReviewCompleted = false;
        let stepsArray = null;
        
        // Handle both direct array response and nested steps property
        if (Array.isArray(progress)) {
          stepsArray = progress;
        } else if (progress.steps && Array.isArray(progress.steps)) {
          stepsArray = progress.steps;
        }
        
        if (stepsArray) {
          // Check if Quality Review step is completed
          const qualityReviewStep = stepsArray.find(step => 
            step.step_name === "Quality Review"
          );
          qualityReviewCompleted = qualityReviewStep?.status === "completed";
          isCompletedBySteps = qualityReviewCompleted;
          
          console.log('📋 Step-based progress:', {
            totalSteps: stepsArray.length,
            completedSteps: stepsArray.filter(s => s.status === "completed").length,
            qualityReviewCompleted,
            steps: stepsArray.map(s => ({ name: s.step_name, status: s.status }))
          });
          
          // Update progress data to include steps for ProgressSteps component
          if (!hasCompletedRef.current) {
            setProgressData({
              status: qualityReviewCompleted ? 'completed' : 'processing',
              progress: qualityReviewCompleted ? 100 : (stepsArray.filter(s => s.status === "completed").length / stepsArray.length) * 100,
              progress_percentage: qualityReviewCompleted ? 100 : (stepsArray.filter(s => s.status === "completed").length / stepsArray.length) * 100,
              message: qualityReviewCompleted ? "All steps completed!" : "Processing document...",
              completed: qualityReviewCompleted,
              steps: stepsArray
            });
          }
        }

        // Fallback completion checks
        const progressPercentage = progress.progress_percentage || progress.progress || 0;
        const isCompletedByPercentage = progressPercentage >= 100;
        const isCompletedByFlag = progress.completed === true;
        const isCompletedByStatus = progress.status === 'completed' || progress.status === 'finished';
        
        console.log('🔍 Completion check:', {
          progressPercentage,
          isCompletedByPercentage,
          isCompletedByFlag,
          isCompletedByStatus,
          isCompletedBySteps,
          qualityReviewCompleted,
          status: progress.status,
          completed: progress.completed
        });

        // Primary completion condition: Quality Review step completed
        // Fallback: other completion indicators
        const isCompleted = isCompletedBySteps || isCompletedByPercentage || isCompletedByFlag || isCompletedByStatus;

        if (isCompleted && !hasCompletedRef.current) {
          console.log('🎉 Step 2 Complete: Processing completed!');
          console.log('🚀 Step 3: Calling complete-summary API...');
          hasCompletedRef.current = true;
          
          // IMMEDIATELY stop polling before calling complete summary
          isPollingRef.current = false;
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          if (pollTimeoutRef.current) {
            clearTimeout(pollTimeoutRef.current);
            pollTimeoutRef.current = null;
          }
          
          // Step 3: Get complete summary data when progress reaches 100%
          await fetchCompleteSummary(requestId);
          return; // Exit the polling function
        }

      } catch (error) {
        console.error('❌ Error in Step 2 (progress polling):', error);
        
        // Only set error if we're still actively polling (not cancelled)
        if (isPollingRef.current && !hasCompletedRef.current) {
          cleanup();
          setError(`Failed to track progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    };

    // Start the first poll immediately
    pollProgress();

    // Set up interval to poll every 1 second
    pollIntervalRef.current = setInterval(() => {
      // Double-check conditions before each poll
      if (isPollingRef.current && !hasCompletedRef.current) {
        pollProgress();
      } else {
        // Clean up if conditions are no longer met
        console.log('🛑 Stopping interval polling - conditions no longer met');
        cleanup();
      }
    }, 1000); // Poll every 1 second as requested

    // Set a maximum timeout for the entire process (5 minutes)
    pollTimeoutRef.current = setTimeout(() => {
      if (isPollingRef.current && !hasCompletedRef.current) {
        console.error('⏰ Progress polling timed out after 5 minutes');
        cleanup();
        setError('Document processing timed out. Please try again.');
      }
    }, 300000); // 5 minutes
  };

  const fetchCompleteSummary = async (requestId: string) => {
    try {
      console.log('📥 Step 3: Fetching complete summary data...');
      const response = await fetch(`${API_BASE_URL}/api/complete-summary/${requestId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch complete summary: ${response.statusText}`);
      }

      const completeData = await response.json();
      console.log('✅ Step 3 Complete: Complete summary data received');
      console.log('📥 Complete summary API response:', JSON.stringify(completeData, null, 2));
      
      setCompleteSummaryData(completeData);
      
      // Small delay to ensure UI updates before transition
      setTimeout(() => {
        setStage('results');
        
        // Update localStorage with completed status
        const savedSummaries = JSON.parse(localStorage.getItem('savedSummaries') || '[]');
        const updatedSummaries = savedSummaries.map((summary: any) => 
          summary.requestId === requestId 
            ? { ...summary, status: 'Completed', summary: 'AI-generated summary completed' }
            : summary
        );
        localStorage.setItem('savedSummaries', JSON.stringify(updatedSummaries));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('summarySaved'));
      }, 500);
      
    } catch (error) {
      console.error('❌ Error in Step 3 (complete-summary):', error);
      setError(`Failed to fetch complete summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleStartOver = () => {
    console.log('🔄 Starting over - cleaning up state');
    cleanup(); // Clean up any ongoing operations
    setStage('upload');
    setUploadedFile(null);
    setActiveTab('summary');
    setRequestId(null);
    setProgressData(null);
    setCompleteSummaryData(null);
    setError(null);
    hasCompletedRef.current = false;
    setComponentKey(Date.now()); // Force component re-render
  };

  const handleBackToHome = () => {
    console.log('🏠 Navigating back to home - cleaning up');
    cleanup(); // Clean up any ongoing operations
    navigate('/home');
  };

  return (
    <div key={componentKey} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
        {error && (
          <Card className="mb-6 p-4 bg-red-50 border-red-200">
            <div className="text-red-800">
              <strong>Error:</strong> {error}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Document Results */}
          <div className="lg:col-span-2">
            {stage === 'upload' && (
              <DocumentUpload onFileUpload={handleFileUpload} />
            )}

            {stage === 'processing' && (
              <ProgressSteps 
                fileName={uploadedFile?.name || ''} 
                progressData={progressData}
                requestId={requestId}
              />
            )}

            {stage === 'results' && requestId && completeSummaryData && (
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
                    <SummaryTab 
                      requestId={requestId} 
                      completeSummaryData={completeSummaryData}
                    />
                  </TabsContent>

                  <TabsContent value="risk" className="mt-6">
                    <RiskAnalysisTab 
                      requestId={requestId} 
                      completeSummaryData={completeSummaryData}
                    />
                  </TabsContent>

                  <TabsContent value="financial" className="mt-6">
                    <FinancialTermsTab 
                      requestId={requestId} 
                      completeSummaryData={completeSummaryData}
                    />
                  </TabsContent>

                  <TabsContent value="quality" className="mt-6">
                    <QualityTab 
                      requestId={requestId} 
                      completeSummaryData={completeSummaryData}
                    />
                  </TabsContent>

                  <TabsContent value="audit" className="mt-6">
                    <AuditTrailTab 
                      requestId={requestId} 
                      completeSummaryData={completeSummaryData}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          {/* Right Sidebar - Chat Always Visible */}
          <div className="lg:col-span-1">
            <ChatPanel 
              fileName={uploadedFile?.name || ''} 
              requestId={requestId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summarization;
