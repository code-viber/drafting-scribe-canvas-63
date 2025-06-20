
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, TrendingUp } from "lucide-react";

const RiskAnalysisTab = () => {
  const risks = [
    {
      title: "Payment Default Risk",
      level: "High",
      severity: 85,
      description: "No penalty clauses for late payments or defaults",
      recommendation: "Add specific penalty terms and collection procedures"
    },
    {
      title: "Liability Exposure",
      level: "Medium",
      severity: 60,
      description: "Limited liability caps may not cover all scenarios",
      recommendation: "Review and adjust liability limitations"
    },
    {
      title: "Termination Risk",
      level: "Low",
      severity: 25,
      description: "Standard termination clauses with adequate notice period",
      recommendation: "Consider adding early termination fees"
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-amber-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Risk Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-red-700">High Risk</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">1</div>
              <div className="text-sm text-amber-700">Medium Risk</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-green-700">Low Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Details */}
      <div className="space-y-4">
        {risks.map((risk, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  {risk.title}
                </CardTitle>
                <Badge variant={getRiskBadgeColor(risk.level) as "destructive" | "secondary" | "outline"}>
                  {risk.level} Risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Severity Level</span>
                  <span>{risk.severity}%</span>
                </div>
                <Progress value={risk.severity} className="h-2" />
                <div className={`h-2 ${getRiskColor(risk.level)} rounded-full mt-[-8px] z-10 relative`} 
                     style={{ width: `${risk.severity}%` }} />
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 text-sm">{risk.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
                <p className="text-blue-600 text-sm">{risk.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mitigation Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Mitigation Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Immediate Actions</h4>
              <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
                <li>Draft penalty clauses for payment defaults</li>
                <li>Review liability cap adequacy with legal counsel</li>
              </ul>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Long-term Improvements</h4>
              <ul className="text-sm text-green-700 mt-1 list-disc list-inside">
                <li>Implement comprehensive contract review process</li>
                <li>Establish risk assessment protocols for future agreements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAnalysisTab;
