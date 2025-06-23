import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, AlertTriangle, Calendar, Target, Info, Loader2 } from "lucide-react";

interface FinancialTermsTabProps {
  requestId: string;
  completeSummaryData?: any;
}

interface FinancialData {
  financial_summary: {
    total_financial_terms: number;
    key_amounts_identified: number;
    payment_structures: number;
    financial_risk_level: string;
  };
  key_financial_terms: any[]; // Array that might be empty
  valuation_metrics: Array<{
    term_name: string;
    description: string;
    risk_level: string;
    confidence: number;
    supporting_quote: string;
    metadata?: {
      title?: string;
      content?: string;
      amount_rate?: string;
      impact?: string;
      benchmarks?: string;
      tax_implications?: string;
      payment_schedule?: string;
      market_comparison?: string;
      implementation?: string;
    };
  }>;
  payment_terms: any[]; // Array that might be empty
  financial_obligations: any[]; // Array that might be empty
}

interface EnhancedFinancialTerm {
  title: string;
  content: string;
  confidence_score: number;
  supporting_quotes: string[];
  risk_level: string;
  metadata: {
    title: string;
    content: string;
    amount_rate: string;
    impact: string;
    benchmarks: string;
    tax_implications: string;
    payment_schedule: string;
    market_comparison?: string;
    implementation?: string;
  };
}

const API_BASE_URL = 'http://localhost:8005';

const FinancialTermsTab = ({ requestId, completeSummaryData }: FinancialTermsTabProps) => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [enhancedTerms, setEnhancedTerms] = useState<EnhancedFinancialTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have complete summary data, extract financial terms data
    if (completeSummaryData?.financial_terms_tab) {
      console.log('💰 Using complete summary data for Financial Terms tab');
      console.log('💰 Financial data structure:', JSON.stringify(completeSummaryData.financial_terms_tab, null, 2));
      setFinancialData(completeSummaryData.financial_terms_tab);
      
      // Also extract enhanced financial terms from improved_summary if available
      if (completeSummaryData.quality_tab?.review_feedback?.improved_summary?.financial_terms) {
        console.log('💎 Found enhanced financial terms with rich metadata');
        setEnhancedTerms(completeSummaryData.quality_tab.review_feedback.improved_summary.financial_terms);
      }
      
      setLoading(false);
      return;
    }

    // Otherwise, fetch from individual API endpoint (fallback)
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        console.log('💰 Fetching financial data from individual API endpoint');
        const response = await fetch(`${API_BASE_URL}/api/financial-terms-tab/${requestId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch financial data: ${response.statusText}`);
        }

        const data = await response.json();
        setFinancialData(data);
      } catch (error) {
        console.error('Error fetching financial data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch financial data');
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchFinancialData();
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
          <span>Loading financial terms data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Error loading financial terms data: {error}</p>
          <p className="text-sm text-gray-500 mt-2">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      </Card>
    );
  }

  if (!financialData) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-600">
          <p>No financial terms data available</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      {financialData.financial_summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {financialData.financial_summary.total_financial_terms}
                </div>
                <div className="text-sm text-blue-700">Total Financial Terms</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {financialData.financial_summary.key_amounts_identified}
                </div>
                <div className="text-sm text-green-700">Key Amounts</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {financialData.financial_summary.payment_structures}
                </div>
                <div className="text-sm text-purple-700">Payment Structures</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <Badge variant={getRiskBadgeColor(financialData.financial_summary.financial_risk_level) as "destructive" | "secondary" | "outline"}>
                    {financialData.financial_summary.financial_risk_level}
                  </Badge>
                </div>
                <div className="text-sm text-gray-700">Risk Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Financial Terms with Rich Metadata */}
      {enhancedTerms && enhancedTerms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Enhanced Financial Analysis
              <Badge variant="outline" className="ml-2">Rich Metadata</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {enhancedTerms.map((term, index) => (
                <div key={index} className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{term.title}</h4>
                    <div className="flex gap-2">
                      <Badge variant={getRiskBadgeColor(term.risk_level) as "destructive" | "secondary" | "outline"}>
                        {term.risk_level}
                      </Badge>
                      <Badge variant="outline" className={getConfidenceColor(term.confidence_score)}>
                        {Math.round(term.confidence_score * 100)}% Confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{term.content}</p>
                  
                  {/* Rich Metadata Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {renderMetadataField(
                      "Amount & Rate", 
                      term.metadata?.amount_rate,
                      <DollarSign className="h-4 w-4 text-green-600" />
                    )}
                    {renderMetadataField(
                      "Impact", 
                      term.metadata?.impact,
                      <Target className="h-4 w-4 text-blue-600" />
                    )}
                    {renderMetadataField(
                      "Benchmarks", 
                      term.metadata?.benchmarks,
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    )}
                    {renderMetadataField(
                      "Tax Implications", 
                      term.metadata?.tax_implications,
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    )}
                    {renderMetadataField(
                      "Payment Schedule", 
                      term.metadata?.payment_schedule,
                      <Calendar className="h-4 w-4 text-indigo-600" />
                    )}
                    {renderMetadataField(
                      "Market Comparison", 
                      term.metadata?.market_comparison,
                      <Info className="h-4 w-4 text-cyan-600" />
                    )}
                  </div>
                  
                  {/* Supporting Quotes */}
                  {term.supporting_quotes && term.supporting_quotes.length > 0 && term.supporting_quotes[0] && (
                    <div className="mt-4 p-3 bg-white rounded border-l-4 border-blue-500">
                      <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Supporting Quote</div>
                      <p className="text-sm italic text-gray-700">"{term.supporting_quotes[0]}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standard Valuation Metrics */}
      {financialData.valuation_metrics && financialData.valuation_metrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Valuation Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData.valuation_metrics.map((metric, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{metric.term_name}</h4>
                    <div className="flex gap-2">
                      <Badge variant={getRiskBadgeColor(metric.risk_level) as "destructive" | "secondary" | "outline"}>
                        {metric.risk_level}
                      </Badge>
                      <Badge variant="outline" className={getConfidenceColor(metric.confidence)}>
                        {Math.round(metric.confidence * 100)}% Confidence
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
                  
                  {/* Metadata for standard valuation metrics */}
                  {metric.metadata && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {renderMetadataField("Amount & Rate", metric.metadata.amount_rate)}
                      {renderMetadataField("Impact", metric.metadata.impact)}
                      {renderMetadataField("Benchmarks", metric.metadata.benchmarks)}
                      {renderMetadataField("Tax Implications", metric.metadata.tax_implications)}
                      {renderMetadataField("Payment Schedule", metric.metadata.payment_schedule)}
                      {renderMetadataField("Market Comparison", metric.metadata.market_comparison)}
                      {renderMetadataField("Implementation", metric.metadata.implementation)}
                    </div>
                  )}
                  
                  {metric.supporting_quote && (
                    <p className="text-xs text-gray-500 mt-2 italic">"{metric.supporting_quote}"</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Financial Terms */}
      {financialData.key_financial_terms && financialData.key_financial_terms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Key Financial Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData.key_financial_terms.map((term, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{term.term_name || `Financial Term ${index + 1}`}</h4>
                    <Badge variant={getRiskBadgeColor(term.risk_level) as "destructive" | "secondary" | "outline"}>
                      {term.risk_level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{term.description}</p>
                  {term.amount && (
                    <p className="text-lg font-semibold text-green-600">{term.amount}</p>
                  )}
                  {term.supporting_quote && (
                    <p className="text-xs text-gray-500 mt-2 italic">"{term.supporting_quote}"</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Terms */}
      {financialData.payment_terms && financialData.payment_terms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Payment Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData.payment_terms.map((term, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{term.term_name || `Payment Term ${index + 1}`}</h4>
                  <p className="text-sm text-gray-600">{term.description}</p>
                  {term.amount && (
                    <p className="text-lg font-semibold text-green-600 mt-2">{term.amount}</p>
                  )}
                  {term.frequency && (
                    <p className="text-sm text-blue-600 mt-1">Frequency: {term.frequency}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Obligations */}
      {financialData.financial_obligations && financialData.financial_obligations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Financial Obligations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData.financial_obligations.map((obligation, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{obligation.term_name || `Obligation ${index + 1}`}</h4>
                    <Badge variant={getRiskBadgeColor(obligation.risk_level) as "destructive" | "secondary" | "outline"}>
                      {obligation.risk_level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{obligation.description}</p>
                  {obligation.amount && (
                    <p className="text-lg font-semibold text-red-600 mt-2">{obligation.amount}</p>
                  )}
                  {obligation.due_date && (
                    <p className="text-sm text-amber-600 mt-1">Due: {obligation.due_date}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {(!financialData.key_financial_terms || financialData.key_financial_terms.length === 0) &&
       (!financialData.valuation_metrics || financialData.valuation_metrics.length === 0) &&
       (!financialData.payment_terms || financialData.payment_terms.length === 0) &&
       (!financialData.financial_obligations || financialData.financial_obligations.length === 0) &&
       (!enhancedTerms || enhancedTerms.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No detailed financial terms available for this document.</p>
            <p className="text-sm text-gray-500 mt-2">
              The document may not contain specific financial terms or they may not have been identified during processing.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinancialTermsTab;
