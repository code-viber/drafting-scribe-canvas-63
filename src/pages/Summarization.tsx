import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ArrowLeft, Home, ChevronRight, Wand2 } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
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

const API_BASE_URL = 'http://44.211.87.191:8005';

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
      
      // Step 1: Call the summarize-ui API to get request_id with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${API_BASE_URL}/api/summarize-ui`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Check if it's a network error
        if (response.status === 0 || !response.status) {
          throw new Error('Unable to connect to the server. Please check if the backend service is running.');
        }
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
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
      
      // Provide more specific error messages
      let errorMessage = 'Upload failed';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Upload timed out. Please try again with a smaller file or check your connection.';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Unable to connect to the server. Please ensure the backend service is running on localhost:8005.';
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Unable to reach the server. Please check if the backend is running and accessible.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
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
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout per request
        
        const response = await fetch(`${API_BASE_URL}/api/progress/${requestId}`, {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Progress fetch failed: ${response.status} ${response.statusText}`);
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
          let errorMessage = 'Failed to track progress';
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              errorMessage = 'Progress tracking timed out. Please try again.';
            } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
              errorMessage = 'Lost connection to server during processing. Please check if the backend is still running.';
            } else {
              errorMessage = `Failed to track progress: ${error.message}`;
            }
          }
          cleanup();
          setError(errorMessage);
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
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`${API_BASE_URL}/api/complete-summary/${requestId}`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch complete summary: ${response.status} ${response.statusText}`);
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
      
      let errorMessage = 'Failed to fetch complete summary';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Summary fetch timed out. Please try again.';
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to fetch summary data. Please check server connection.';
        } else {
          errorMessage = `Failed to fetch complete summary: ${error.message}`;
        }
      }
      
      setError(errorMessage);
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
    <div key={componentKey} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 font-space-grotesk">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/home" className="flex items-center gap-1 text-gray-600 hover:text-brand transition-colors">
                  <Home className="h-4 w-4" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900 font-medium">Document Summarization</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 font-space-grotesk">Document Summarization</h1>
                  <p className="text-gray-600 mt-1">AI-powered document analysis and insights</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleBackToHome}
                className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 rounded-xl font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              {stage === 'results' && (
                <Button 
                  onClick={handleStartOver}
                  className="bg-brand hover:bg-brand-600 text-white rounded-xl font-medium shadow-sm"
                >
                  Start Over
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <Card className="mb-8 p-6 bg-red-50/80 backdrop-blur-sm border-red-100 rounded-2xl">
            <div className="text-red-800 font-medium">
              <strong>Error:</strong> {error}
              {error.includes('localhost:8005') && (
                <div className="mt-2 text-sm text-red-700">
                  <p>Make sure the backend server is running on port 8005.</p>
                  <p>You can check if it's running by visiting: <code className="bg-red-100 px-1 rounded">http://localhost:8005</code></p>
                </div>
              )}
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
              <div className="space-y-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-gray-100">
                    <TabsTrigger value="summary" className="rounded-xl font-medium data-[state=active]:bg-brand data-[state=active]:text-white">Summary</TabsTrigger>
                    <TabsTrigger value="risk" className="rounded-xl font-medium data-[state=active]:bg-brand data-[state=active]:text-white">Risk Analysis</TabsTrigger>
                    <TabsTrigger value="financial" className="rounded-xl font-medium data-[state=active]:bg-brand data-[state=active]:text-white">Financial Terms</TabsTrigger>
                    <TabsTrigger value="quality" className="rounded-xl font-medium data-[state=active]:bg-brand data-[state=active]:text-white">Quality</TabsTrigger>
                    <TabsTrigger value="audit" className="rounded-xl font-medium data-[state=active]:bg-brand data-[state=active]:text-white">Audit Trail</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="mt-8">
                    <SummaryTab 
                      requestId={requestId} 
                      completeSummaryData={completeSummaryData}
                    />
                  </TabsContent>

                  <TabsContent value="risk" className="mt-8">
                    <RiskAnalysisTab 
                      requestId={requestId} 
                      completeSummaryData={completeSummaryData}
                    />
                  </TabsContent>

                  <TabsContent value="financial" className="mt-8">
                    <FinancialTermsTab 
                      requestId={requestId} 
                      completeSummaryData={completeSummaryData}
                    />
                  </TabsContent>

                  <TabsContent value="quality" className="mt-8">
                    <QualityTab 
                      requestId={requestId} 
                      completeSummaryData={completeSummaryData}
                    />
                  </TabsContent>

                  <TabsContent value="audit" className="mt-8">
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
