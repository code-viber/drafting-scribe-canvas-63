
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText, MessageSquare, Download } from "lucide-react";

const AuditTrailTab = () => {
  const auditEntries = [
    {
      id: 1,
      timestamp: "2024-03-20 14:30:22",
      actor: "AI Agent",
      action: "Document Analysis Completed",
      details: "Generated comprehensive summary with risk analysis",
      type: "system"
    },
    {
      id: 2,
      timestamp: "2024-03-20 14:25:15",
      actor: "AI Agent",
      action: "Risk Assessment Started",
      details: "Analyzing contract clauses for potential risks",
      type: "system"
    },
    {
      id: 3,
      timestamp: "2024-03-20 14:20:08",
      actor: "AI Agent",
      action: "Financial Terms Extracted",
      details: "Identified payment schedules and monetary obligations",
      type: "system"
    },
    {
      id: 4,
      timestamp: "2024-03-20 14:15:03",
      actor: "AI Agent",
      action: "Document Structure Analysis",
      details: "Parsed document sections and identified key clauses",
      type: "system"
    },
    {
      id: 5,
      timestamp: "2024-03-20 14:10:45",
      actor: "John Doe",
      action: "Document Uploaded",
      details: "Service_Agreement_2024.pdf (2.3 MB)",
      type: "user"
    },
    {
      id: 6,
      timestamp: "2024-03-20 14:10:30",
      actor: "John Doe",
      action: "Session Started",
      details: "Initiated document summarization workflow",
      type: "user"
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="h-4 w-4 text-blue-500" />;
      case 'system': return <FileText className="h-4 w-4 text-green-500" />;
      case 'chat': return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'download': return <Download className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'user': return 'default';
      case 'system': return 'secondary';
      case 'chat': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Audit Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">6</div>
              <div className="text-sm text-blue-700">Total Actions</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">4</div>
              <div className="text-sm text-green-700">AI Actions</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">2</div>
              <div className="text-sm text-purple-700">User Actions</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-600">00:20:22</div>
              <div className="text-sm text-gray-700">Session Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle>Chronological Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditEntries.map((entry, index) => (
              <div key={entry.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(entry.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {entry.action}
                    </h4>
                    <Badge variant={getBadgeVariant(entry.type) as any} className="ml-2">
                      {entry.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{entry.details}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {entry.actor}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {entry.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Export as CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" />
              Export as PDF
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrailTab;
