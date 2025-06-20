
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share, Calendar, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
}

const ReportPreview = ({ isOpen, onClose, fileName }: ReportPreviewProps) => {
  const handleDownload = () => {
    console.log('Downloading report...');
    // Implement download functionality
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Report Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Report Header */}
          <div className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Document Analysis Report</h2>
                <p className="text-sm text-gray-600">{fileName}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Generated: {new Date().toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                24 pages • 8,547 words
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Executive Summary</h3>
            <p className="text-gray-700 leading-relaxed">
              This service agreement outlines the terms and conditions for professional consulting services 
              between QlawsAI Corporation and the client. The agreement establishes a 12-month term with 
              automatic renewal clauses, monthly payment schedule of $15,000, and comprehensive liability 
              limitations. Key deliverables include strategic consulting, implementation support, and 
              quarterly progress reviews.
            </p>
          </div>

          {/* Key Findings */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Key Findings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-green-800">Strengths</h4>
                <ul className="text-sm space-y-1">
                  <li>• Clear payment terms and schedule</li>
                  <li>• Comprehensive IP ownership clauses</li>
                  <li>• Well-defined termination procedures</li>
                  <li>• Standard liability limitations</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-red-800">Areas of Concern</h4>
                <ul className="text-sm space-y-1">
                  <li>• Missing penalty clauses for late payments</li>
                  <li>• Insufficient force majeure provisions</li>
                  <li>• Limited data protection terms</li>
                  <li>• Unclear dispute resolution mechanism</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Risk Assessment</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                <div>
                  <div className="font-medium text-red-800">Payment Default Risk</div>
                  <div className="text-sm text-red-700">No penalties for late payments could encourage delays</div>
                </div>
                <Badge variant="destructive">High</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                <div>
                  <div className="font-medium text-amber-800">Liability Exposure</div>
                  <div className="text-sm text-amber-700">Limited liability caps may not provide adequate protection</div>
                </div>
                <Badge variant="secondary">Medium</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div>
                  <div className="font-medium text-blue-800">Compliance Risk</div>
                  <div className="text-sm text-blue-700">Data protection clauses need strengthening for GDPR compliance</div>
                </div>
                <Badge variant="secondary">Medium</Badge>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Recommendations</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-sm">High Priority: Add Payment Penalty Clause</p>
                  <p className="text-xs text-gray-600">Include specific penalties for late payments to reduce default risk and encourage timely payment</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-sm">Medium Priority: Enhance Data Protection Terms</p>
                  <p className="text-xs text-gray-600">Strengthen data handling procedures to ensure GDPR compliance</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-sm">Low Priority: Add Dispute Resolution</p>
                  <p className="text-xs text-gray-600">Consider adding mediation or arbitration clauses for conflict resolution</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-4 text-center text-xs text-gray-500">
            <p>This report was generated by QlawsAI Document Analysis System</p>
            <p>Confidential and Proprietary • Not for redistribution</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportPreview;
