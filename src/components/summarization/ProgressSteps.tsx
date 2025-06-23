import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Loader2, FileText } from "lucide-react";

interface ProgressStepsProps {
  fileName: string;
  progressData?: {
    status: string;
    progress: number;
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
  } | null;
  requestId?: string | null;
}

const defaultSteps = [
  { id: 1, title: "Extracting text from document", apiStepName: "Document Upload & Extraction", threshold: 20 },
  { id: 2, title: "Analyzing document structure", apiStepName: "Document Analysis", threshold: 40 },
  { id: 3, title: "Identifying key clauses", apiStepName: "Content Processing", threshold: 60 },
  { id: 4, title: "Analyzing risks and financial terms", apiStepName: "AI Summarization", threshold: 80 },
  { id: 5, title: "Generating comprehensive summary", apiStepName: "Quality Review", threshold: 100 },
];

const ProgressSteps = ({ fileName, progressData, requestId }: ProgressStepsProps) => {
  const [steps, setSteps] = useState(
    defaultSteps.map(step => ({ ...step, completed: false }))
  );
  const [currentMessage, setCurrentMessage] = useState("Starting document processing...");
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasRealData, setHasRealData] = useState(false);
  
  const simulationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup simulation when component unmounts
  useEffect(() => {
    return () => {
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current);
      }
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  // Effect to handle real progress data from API
  useEffect(() => {
    if (progressData) {
      console.log('📊 ProgressSteps received real data:', progressData);
      setHasRealData(true);
      setIsSimulating(false);
      
      // Clear any ongoing simulation
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current);
        simulationTimeoutRef.current = null;
      }
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
      
      // Handle step-based progress if available
      if (progressData.steps && Array.isArray(progressData.steps)) {
        console.log('📋 Processing step-based progress data');
        
        // Map API steps to UI steps and mark as completed
        const updatedSteps = defaultSteps.map((uiStep) => {
          const apiStep = progressData.steps!.find(step => step.step_name === uiStep.apiStepName);
          const isCompleted = apiStep?.status === "completed";
          
          console.log(`🔍 Step "${uiStep.title}" (${uiStep.apiStepName}): ${isCompleted ? 'COMPLETED' : 'PENDING'}`);
          
          return {
            ...uiStep,
            completed: isCompleted
          };
        });
        
        setSteps(updatedSteps);
        
        // Calculate overall progress based on completed steps
        const completedCount = updatedSteps.filter(step => step.completed).length;
        const progressPercentage = (completedCount / defaultSteps.length) * 100;
        setOverallProgress(progressPercentage);
        
        // Find current active step (first non-completed step)
        const activeStepIndex = updatedSteps.findIndex(step => !step.completed);
        setCurrentStepIndex(activeStepIndex === -1 ? defaultSteps.length : activeStepIndex);
        
        // Update message based on current step or completion
        if (activeStepIndex === -1) {
          setCurrentMessage("All steps completed! Preparing results...");
        } else {
          setCurrentMessage(`${updatedSteps[activeStepIndex].title}...`);
        }
        
      } else {
        // Fallback to percentage-based progress
        console.log('📊 Using percentage-based progress');
        const progress = progressData.progress || 0;
        
        setOverallProgress(progress);
        setCurrentMessage(progressData.message || "Processing document...");
        
        // Update steps based on progress percentage
        const updatedSteps = defaultSteps.map((step) => ({
          ...step,
          completed: progress >= step.threshold
        }));
        
        setSteps(updatedSteps);
        
        const activeStepIndex = updatedSteps.findIndex(step => !step.completed);
        setCurrentStepIndex(activeStepIndex === -1 ? defaultSteps.length : activeStepIndex);
      }
      
    } else if (requestId && !isSimulating && !hasRealData) {
      // Start simulation only if we have a requestId but no progress data yet
      console.log('🎭 Starting progress simulation');
      startProgressSimulation();
    }
  }, [progressData, requestId, isSimulating, hasRealData]);

  // Reset when requestId changes
  useEffect(() => {
    if (requestId) {
      setHasRealData(false);
      setIsSimulating(false);
      setOverallProgress(0);
      setCurrentStepIndex(-1);
      setSteps(defaultSteps.map(step => ({ ...step, completed: false })));
      setCurrentMessage("Starting document processing...");
    }
  }, [requestId]);

  // Simulate progress when we don't have real data yet
  const startProgressSimulation = () => {
    if (hasRealData || isSimulating) {
      console.log('⚠️ Skipping simulation - already have real data or simulation running');
      return;
    }
    
    setIsSimulating(true);
    let simulatedProgress = 15; // Start from 15% (after upload)
    let stepIndex = 0;
    
    const simulateStep = () => {
      if (hasRealData || !isSimulating) {
        console.log('🛑 Stopping simulation - real data available');
        return;
      }
      
      if (stepIndex < defaultSteps.length) {
        // Update current step
        setCurrentStepIndex(stepIndex);
        setCurrentMessage(`${defaultSteps[stepIndex].title}...`);
        
        // Animate progress for current step
        const targetProgress = Math.min(defaultSteps[stepIndex].threshold - 5, 85); // Don't go to 100% in simulation
        
        const animateProgress = () => {
          if (hasRealData || !isSimulating) {
            return;
          }
          
          simulatedProgress += 2;
          const currentProgress = Math.min(simulatedProgress, targetProgress);
          setOverallProgress(currentProgress);
          
          if (simulatedProgress >= targetProgress) {
            // Mark current step as completed
            setSteps(prev => prev.map((step, index) => ({
              ...step,
              completed: index <= stepIndex
            })));
            
            stepIndex++;
            
            // Continue to next step after a delay
            simulationTimeoutRef.current = setTimeout(() => {
              if (stepIndex < defaultSteps.length && !hasRealData && isSimulating) {
                simulateStep();
              }
            }, 1500);
          } else {
            // Continue animating current step
            simulationIntervalRef.current = setTimeout(animateProgress, 150);
          }
        };
        
        animateProgress();
      }
    };
    
    // Start simulation after a short delay
    simulationTimeoutRef.current = setTimeout(() => {
      if (!hasRealData && isSimulating) {
        simulateStep();
      }
    }, 1000);
  };

  const getStepStatus = (index: number) => {
    if (steps[index]?.completed) {
      return 'completed';
    } else if (currentStepIndex === index) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  const getStepIcon = (index: number) => {
    const status = getStepStatus(index);
    
    if (status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (status === 'active') {
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    } else {
      return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStepTextColor = (index: number) => {
    const status = getStepStatus(index);
    
    if (status === 'completed') {
      return 'text-green-600 font-medium';
    } else if (status === 'active') {
      return 'text-blue-600 font-medium';
    } else {
      return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Processing Document
          </CardTitle>
          <p className="text-gray-600">{fileName}</p>
          {requestId && (
            <p className="text-xs text-gray-500">Request ID: {requestId}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Current Status Message */}
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">{currentMessage}</p>
          </div>

          <div className="space-y-4">
            {defaultSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getStepIcon(index)}
                </div>
                <span className={`text-sm ${getStepTextColor(index)}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          {/* API Status */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600">
              <strong>Status:</strong> {
                progressData?.status || 
                (isSimulating ? 'Simulating' : 'Waiting for progress...')
              }
            </div>
            {progressData?.completed && (
              <div className="text-xs text-green-600 mt-1">
                ✓ Processing completed successfully
              </div>
            )}
            {isSimulating && !hasRealData && (
              <div className="text-xs text-blue-600 mt-1">
                🔄 Simulating progress while waiting for server response
              </div>
            )}
            {hasRealData && (
              <div className="text-xs text-green-600 mt-1">
                📡 Receiving real-time updates from server
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressSteps;
