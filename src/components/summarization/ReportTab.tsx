
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Share, Eye } from "lucide-react";

interface ReportTabProps {
  fileName: string;
}

const ReportTab = ({ fileName }: ReportTabProps) => {
  return (
    <div className="space-y-6">
      {/* Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Report Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="flex items-center gap-2 h-auto py-4">
              <Download className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Download PDF</div>
                <div className="text-xs opacity-75">Comprehensive report</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-auto py-4">
              <Eye className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Preview Report</div>
                <div className="text-xs opacity-75">View before download</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-auto py-4">
              <Share className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Share Report</div>
                <div className="text-xs opacity-75">Generate shareable link</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Report Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
            <div className="text-center space-y-4">
              <div className="w-16 h-20 bg-white border-2 border-gray-300 rounded mx-auto flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Document Analysis Report</h3>
                <p className="text-sm text-gray-600">{fileName}</p>
                <p className="text-xs text-gray-500 mt-1">Generated on {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>• Executive Summary</div>
                <div>• Risk Analysis</div>
                <div>• Financial Terms Overview</div>
                <div>• Quality Assessment</div>
                <div>• Recommendations</div>
                <div>• Audit Trail</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Report Customization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Include Sections</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Executive Summary",
                  "Risk Analysis",
                  "Financial Terms",
                  "Quality Assessment",
                  "Key Clauses",
                  "Recommendations",
                  "Audit Trail",
                  "Charts & Graphs"
                ].map((section, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{section}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Report Format</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">PDF</Button>
                <Button variant="outline" size="sm">Word</Button>
                <Button variant="outline" size="sm">PowerPoint</Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Detail Level</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Summary</Button>
                <Button variant="outline" size="sm">Standard</Button>
                <Button size="sm">Detailed</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report History */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-sm">Comprehensive Analysis Report</div>
                <div className="text-xs text-gray-600">Generated 2 hours ago • PDF • 24 pages</div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-sm">Executive Summary</div>
                <div className="text-xs text-gray-600">Generated yesterday • PDF • 8 pages</div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportTab;
