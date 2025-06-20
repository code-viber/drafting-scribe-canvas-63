
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, XCircle, Star } from "lucide-react";

const QualityTab = () => {
  const qualityMetrics = [
    { name: "Completeness", score: 85, status: "good" },
    { name: "Clarity", score: 92, status: "excellent" },
    { name: "Legal Compliance", score: 78, status: "good" },
    { name: "Risk Coverage", score: 65, status: "needs_improvement" },
    { name: "Enforceability", score: 88, status: "excellent" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    return "text-amber-600";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'good': return <Star className="h-4 w-4 text-blue-500" />;
      case 'needs_improvement': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default: return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Quality Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Quality Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">82</div>
            <div className="text-lg text-gray-600">Quality Score</div>
            <div className="text-sm text-gray-500">Good quality with room for improvement</div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {qualityMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metric.status)}
                    <span className="font-medium">{metric.name}</span>
                  </div>
                  <span className={`font-bold ${getScoreColor(metric.score)}`}>
                    {metric.score}%
                  </span>
                </div>
                <Progress value={metric.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Clear and concise language</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Well-defined payment terms</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Comprehensive scope of work</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Proper termination clauses</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-amber-600">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-sm">Missing force majeure clause</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-sm">Limited dispute resolution options</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-sm">Vague intellectual property terms</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-sm">Insufficient data protection clauses</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Missing Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Missing or Incomplete Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
              <h4 className="font-medium text-red-800">Critical Missing</h4>
              <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                <li>Force majeure and exceptional circumstances</li>
                <li>Data security and privacy compliance</li>
              </ul>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
              <h4 className="font-medium text-amber-800">Recommended Additions</h4>
              <ul className="text-sm text-amber-700 mt-1 list-disc list-inside">
                <li>Detailed dispute resolution process</li>
                <li>Performance benchmarks and KPIs</li>
                <li>Change management procedures</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityTab;
