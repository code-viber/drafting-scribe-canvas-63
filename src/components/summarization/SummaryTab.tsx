
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, User, Hash } from "lucide-react";

interface SummaryTabProps {
  fileName: string;
}

const SummaryTab = ({ fileName }: SummaryTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Document Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Document Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            This service agreement outlines the terms and conditions for professional consulting services 
            between QlawsAI Corporation and the client. The agreement establishes a 12-month term with 
            automatic renewal clauses, monthly payment schedule of $15,000, and comprehensive liability 
            limitations. Key deliverables include strategic consulting, implementation support, and 
            quarterly progress reviews.
          </p>
        </CardContent>
      </Card>

      {/* Document Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-green-600" />
            Document Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">File Name:</span>
            <span className="font-medium">{fileName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Document Type:</span>
            <Badge variant="outline">Service Agreement</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pages:</span>
            <span className="font-medium">24</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Word Count:</span>
            <span className="font-medium">8,547</span>
          </div>
        </CardContent>
      </Card>

      {/* Meta Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Meta Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Created:</span>
            <span className="font-medium">March 15, 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Effective Date:</span>
            <span className="font-medium">April 1, 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Expiration:</span>
            <span className="font-medium">March 31, 2025</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Jurisdiction:</span>
            <span className="font-medium">California, USA</span>
          </div>
        </CardContent>
      </Card>

      {/* Key Clauses */}
      <Card>
        <CardHeader>
          <CardTitle>Key Clauses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-medium text-blue-800">Payment Terms</h4>
              <p className="text-sm text-blue-700 mt-1">Monthly payments of $15,000 due within 30 days of invoice</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
              <h4 className="font-medium text-amber-800">Termination Clause</h4>
              <p className="text-sm text-amber-700 mt-1">Either party may terminate with 60 days written notice</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h4 className="font-medium text-green-800">Intellectual Property</h4>
              <p className="text-sm text-green-700 mt-1">All work products remain property of QlawsAI Corporation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium">High Priority</p>
                <p className="text-xs text-gray-600">Add force majeure clause for unforeseen circumstances</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium">Medium Priority</p>
                <p className="text-xs text-gray-600">Clarify data protection and confidentiality terms</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium">Low Priority</p>
                <p className="text-xs text-gray-600">Consider adding dispute resolution mechanism</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryTab;
