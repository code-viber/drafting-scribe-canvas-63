import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, TrendingDown, Clock, Users, Loader2, Target, Info, Calendar } from "lucide-react";

interface RiskAnalysisTabProps {
  requestId: string;
  completeSummaryData?: any;
}

// Updated interface to match actual API response
interface RiskData {
  overall_risk_score: string;
  risk_summary: {
    total_risks_identified: number;
    high_risk_count: number;
    medium_risk_count: number;
    low_risk_count: number;
  };
  identified_risks: Array<{
    title: string;
    content: string;
    confidence_score: number;
    risk_level: string;
    supporting_quotes: string[];
  }>;
  mitigation_strategies: Array<{
    risk_title: string;
    strategy: string;
    priority: string;
    estimated_effort: string;
  }>;
  compliance_risks: any[];
}

// Interface for enhanced risk analysis from improved_summary
interface EnhancedRiskAnalysis {
  title: string;
  content: string;
  confidence_score: number;
  supporting_quotes: string[];
  risk_level: string;
  metadata: {
    title: string;
    content: string;
    impact: string;
    risk_level: string;
    likelihood: string;
    mitigation: string;
    affected_parties: string;
    timeline: string;
  };
}

const API_BASE_URL = 'http://localhost:8005';

const RiskAnalysisTab = ({ requestId, completeSummaryData }: RiskAnalysisTabProps) => {
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [enhancedRisks, setEnhancedRisks] = useState<EnhancedRiskAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have complete summary data, extract risk analysis data
    if (completeSummaryData?.risk_analysis_tab) {
      console.log('⚠️ Using complete summary data for Risk Analysis tab');
      console.log('⚠️ Risk data structure:', JSON.stringify(completeSummaryData.risk_analysis_tab, null, 2));
      setRiskData(completeSummaryData.risk_analysis_tab);
      
      // Also extract enhanced risk analysis from improved_summary if available
      if (completeSummaryData.quality_tab?.review_feedback?.improved_summary?.risk_analysis) {
        console.log('🔍 Found enhanced risk analysis with rich metadata');
        setEnhancedRisks(completeSummaryData.quality_tab.review_feedback.improved_summary.risk_analysis);
      }
      
      setLoading(false);
      return;
    }

    // Otherwise, fetch from individual API endpoint (fallback)
    const fetchRiskData = async () => {
      try {
        setLoading(true);
        console.log('⚠️ Fetching risk data from individual API endpoint');
        const response = await fetch(`${API_BASE_URL}/api/risk-analysis-tab/${requestId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch risk data: ${response.statusText}`);
        }

        const data = await response.json();
        setRiskData(data);
      } catch (error) {
        console.error('Error fetching risk data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch risk data');
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchRiskData();
    }
  }, [requestId, completeSummaryData]);

  const getRiskColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'HIGH': return 'text-red-600 bg-red-50';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50';
      case 'LOW': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'secondary';
      case 'LOW': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-amber-600';
    return 'text-red-600';
  };

  const renderMetadataField = (label: string, value: string | undefined, icon?: React.ReactNode) => {
    if (!value) return null;
    
    return (
      <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
        {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">{label}</div>
          <div className="text-sm text-gray-900 mt-1">{value}</div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading risk analysis data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Error loading risk analysis data: {error}</p>
          <p className="text-sm text-gray-500 mt-2">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      </Card>
    );
  }

  if (!riskData) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-600">
          <p>No risk analysis data available</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Risk Summary */}
      {riskData.risk_summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Risk Summary
              <Badge className={getRiskColor(riskData.overall_risk_score)}>
                {riskData.overall_risk_score} Risk
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {riskData.risk_summary.total_risks_identified}
                </div>
                <div className="text-sm text-gray-600">Total Risks</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {riskData.risk_summary.high_risk_count}
                </div>
                <div className="text-sm text-red-700">High Risk</div>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {riskData.risk_summary.medium_risk_count}
                </div>
                <div className="text-sm text-amber-700">Medium Risk</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {riskData.risk_summary.low_risk_count}
                </div>
                <div className="text-sm text-green-700">Low Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Risk Analysis with Rich Metadata */}
      {enhancedRisks && enhancedRisks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Enhanced Risk Analysis
              <Badge variant="outline" className="ml-2">Rich Metadata</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {enhancedRisks.map((risk, index) => (
                <div key={index} className="border rounded-lg p-6 bg-gradient-to-r from-red-50 to-orange-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{risk.title}</h4>
                    <div className="flex gap-2">
                      <Badge variant={getRiskBadgeColor(risk.risk_level) as "destructive" | "secondary" | "outline"}>
                        {risk.risk_level}
                      </Badge>
                      <Badge variant="outline" className={getConfidenceColor(risk.confidence_score)}>
                        {Math.round(risk.confidence_score * 100)}% Confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{risk.content}</p>
                  
                  {/* Rich Metadata Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {renderMetadataField(
                      "Impact", 
                      risk.metadata?.impact,
                      <Target className="h-4 w-4 text-red-600" />
                    )}
                    {renderMetadataField(
                      "Likelihood", 
                      risk.metadata?.likelihood,
                      <TrendingDown className="h-4 w-4 text-amber-600" />
                    )}
                    {renderMetadataField(
                      "Mitigation Strategy", 
                      risk.metadata?.mitigation,
                      <Shield className="h-4 w-4 text-green-600" />
                    )}
                    {renderMetadataField(
                      "Affected Parties", 
                      risk.metadata?.affected_parties,
                      <Users className="h-4 w-4 text-blue-600" />
                    )}
                    {renderMetadataField(
                      "Timeline", 
                      risk.metadata?.timeline,
                      <Calendar className="h-4 w-4 text-purple-600" />
                    )}
                    {renderMetadataField(
                      "Risk Level", 
                      risk.metadata?.risk_level,
                      <Info className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  
                  {/* Supporting Quotes */}
                  {risk.supporting_quotes && risk.supporting_quotes.length > 0 && risk.supporting_quotes[0] && (
                    <div className="mt-4 p-3 bg-white rounded border-l-4 border-red-500">
                      <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Supporting Quote</div>
                      <p className="text-sm italic text-gray-700">"{risk.supporting_quotes[0]}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standard Identified Risks */}
      {riskData.identified_risks && riskData.identified_risks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              {enhancedRisks && enhancedRisks.length > 0 ? 'Additional Identified Risks' : 'Identified Risks'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskData.identified_risks.map((risk, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{risk.title}</h4>
                    <div className="flex gap-2">
                      <Badge variant={getRiskBadgeColor(risk.risk_level) as "destructive" | "secondary" | "outline"}>
                        {risk.risk_level}
                      </Badge>
                      <Badge variant="outline" className={getConfidenceColor(risk.confidence_score)}>
                        {Math.round(risk.confidence_score * 100)}% Confidence
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{risk.content}</p>
                  {risk.supporting_quotes && risk.supporting_quotes.length > 0 && risk.supporting_quotes[0] && (
                    <p className="text-xs text-gray-500 mt-2 italic">"{risk.supporting_quotes[0]}"</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mitigation Strategies */}
      {riskData.mitigation_strategies && riskData.mitigation_strategies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Mitigation Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskData.mitigation_strategies.map((strategy, index) => (
                <div key={index} className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{strategy.risk_title}</h4>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(strategy.priority)}>
                        {strategy.priority} Priority
                      </Badge>
                      {strategy.estimated_effort && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {strategy.estimated_effort}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{strategy.strategy}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Risks */}
      {riskData.compliance_risks && riskData.compliance_risks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Compliance Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskData.compliance_risks.map((risk, index) => (
                <div key={index} className="p-4 border rounded-lg bg-amber-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{risk.title || `Compliance Risk ${index + 1}`}</h4>
                    <Badge variant={getRiskBadgeColor(risk.risk_level) as "destructive" | "secondary" | "outline"}>
                      {risk.risk_level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{risk.description}</p>
                  {risk.regulatory_framework && (
                    <p className="text-xs text-amber-700 mt-1">Framework: {risk.regulatory_framework}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {(!riskData.identified_risks || riskData.identified_risks.length === 0) &&
       (!riskData.mitigation_strategies || riskData.mitigation_strategies.length === 0) &&
       (!riskData.compliance_risks || riskData.compliance_risks.length === 0) &&
       (!enhancedRisks || enhancedRisks.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No risks identified for this document.</p>
            <p className="text-sm text-gray-500 mt-2">
              This could indicate a low-risk document or that risk analysis is still in progress.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RiskAnalysisTab;