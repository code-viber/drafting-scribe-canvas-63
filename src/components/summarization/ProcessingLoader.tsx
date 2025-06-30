
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FileText, Brain, CheckCircle } from "lucide-react";

interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed';
  icon: React.ComponentType<any>;
}

interface ProcessingLoaderProps {
  fileName: string;
  currentStep?: string;
  progress?: number;
}

const ProcessingLoader: React.FC<ProcessingLoaderProps> = ({ 
  fileName, 
  currentStep = 'Uploading', 
  progress = 0 
}) => {
  const steps: ProcessingStep[] = [
    {
      id: 'upload',
      label: 'Uploading Document',
      status: progress >= 20 ? 'completed' : currentStep === 'Uploading' ? 'processing' : 'pending',
      icon: FileText
    },
    {
      id: 'analyze',
      label: 'Analyzing Content',
      status: progress >= 60 ? 'completed' : currentStep === 'Analyzing' ? 'processing' : 'pending',
      icon: Brain
    },
    {
      id: 'summarize',
      label: 'Generating Summary',
      status: progress >= 100 ? 'completed' : currentStep === 'Summarizing' ? 'processing' : 'pending',
      icon: CheckCircle
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm border-gray-100 rounded-2xl shadow-lg">
        <CardContent className="p-8">
          {/* Header with QLaws logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/ab75498a-b915-4c60-bfd8-ad68628d9376.png" 
                alt="QLaws.ai" 
                className="h-10 w-auto"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-space-grotesk mb-2">
              Processing Document
            </h2>
            <p className="text-gray-600 font-space-grotesk">
              {fileName}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 font-space-grotesk">
                Progress
              </span>
              <span className="text-sm font-medium text-orange-600 font-space-grotesk">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Processing Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.id}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                    step.status === 'completed' 
                      ? 'bg-green-50 border border-green-100' 
                      : step.status === 'processing'
                      ? 'bg-orange-50 border border-orange-100'
                      : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    step.status === 'completed'
                      ? 'bg-green-100'
                      : step.status === 'processing'
                      ? 'bg-orange-100'
                      : 'bg-gray-100'
                  }`}>
                    {step.status === 'processing' ? (
                      <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
                    ) : (
                      <Icon className={`h-5 w-5 ${
                        step.status === 'completed'
                          ? 'text-green-600'
                          : step.status === 'processing'
                          ? 'text-orange-600'
                          : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-medium font-space-grotesk ${
                      step.status === 'completed'
                        ? 'text-green-900'
                        : step.status === 'processing'
                        ? 'text-orange-900'
                        : 'text-gray-600'
                    }`}>
                      {step.label}
                    </p>
                    {step.status === 'processing' && (
                      <p className="text-sm text-orange-600 font-space-grotesk mt-1">
                        In progress...
                      </p>
                    )}
                    {step.status === 'completed' && (
                      <p className="text-sm text-green-600 font-space-grotesk mt-1">
                        Completed
                      </p>
                    )}
                  </div>

                  {step.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-space-grotesk">
              This process typically takes 30-60 seconds
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingLoader;
