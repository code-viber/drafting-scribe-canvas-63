
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Loader2, FileText } from "lucide-react";

interface ProgressStepsProps {
  fileName: string;
}

const steps = [
  { id: 1, title: "Extracting text from document", duration: 1000 },
  { id: 2, title: "Analyzing document structure", duration: 1500 },
  { id: 3, title: "Identifying key clauses", duration: 1200 },
  { id: 4, title: "Analyzing risks and financial terms", duration: 1300 },
  { id: 5, title: "Generating comprehensive summary", duration: 1000 },
];

const ProgressSteps = ({ fileName }: ProgressStepsProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const processStep = (stepIndex: number) => {
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex);
        
        timeoutId = setTimeout(() => {
          setCompletedSteps(prev => [...prev, stepIndex]);
          setOverallProgress((stepIndex + 1) / steps.length * 100);
          processStep(stepIndex + 1);
        }, steps[stepIndex].duration);
      }
    };

    processStep(0);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Processing Document
          </CardTitle>
          <p className="text-gray-600">{fileName}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {completedSteps.includes(index) ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : currentStep === index ? (
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <span 
                  className={`text-sm ${
                    completedSteps.includes(index) 
                      ? 'text-green-600 font-medium' 
                      : currentStep === index 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressSteps;
