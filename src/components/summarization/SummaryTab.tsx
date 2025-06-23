import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Clock, Zap, Loader2, Info, TrendingUp, Target } from 'lucide-react';

interface SummaryTabProps {
  requestId: string;
  completeSummaryData?: any;
}

// Updated interface to match actual API response
interface SummaryData {
  document_title: string;
  document_type: string;
  file_name: string;
  processing_date: string;
  executive_summary: string;
  key_highlights: string[];
  document_metrics: {
    estimated_pages: number;
    word_count: number;
    processing_time_seconds: number;
    ai_model_used: string;
    context_sources_used: number;
  };
  confidence_score: number;
  context_sources_count: number;
}

// Interface for enhanced key clauses from improved_summary
interface EnhancedKeyClause {
  title: string;
  content: string;
  confidence_score: number;
  supporting_quotes: string[];
  risk_level: string;
  metadata: {
    title: string;
    content: string;
    risk_level: string;
    quote: string;
    market_comparison: string;
    implementation: string;
  };
}

const API_BASE_URL = 'http://localhost:8005';

const SummaryTab = ({ requestId, completeSummaryData }: SummaryTabProps) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [enhancedClauses, setEnhancedClauses] = useState<EnhancedKeyClause[]>([]);
  const [enhancedHighlights, setEnhancedHighlights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have complete summary data, extract summary tab data
    if (completeSummaryData?.summary_tab) {
      console.log('📋 Using complete summary data for Summary tab');
      console.log('📋 Summary data structure:', JSON.stringify(completeSummaryData.summary_tab, null, 2));
      setSummaryData(completeSummaryData.summary_tab);
      
      // Also extract enhanced clauses from improved_summary if available
      if (completeSummaryData.quality_tab?.review_feedback?.improved_summary?.key_clauses) {
        console.log('✨ Found enhanced key clauses with rich metadata');
        setEnhancedClauses(completeSummaryData.quality_tab.review_feedback.improved_summary.key_clauses);
      }
      
      // Extract enhanced highlights if available
      if (completeSummaryData.quality_tab?.review_feedback?.improved_summary?.key_highlights) {
        console.log('🎯 Found enhanced key highlights');
        setEnhancedHighlights(completeSummaryData.quality_tab.review_feedback.improved_summary.key_highlights);
      }
      
      setLoading(false);
      return;
    }

    // Otherwise, fetch from individual API endpoint (fallback)
    const fetchSummaryData = async () => {
      try {
        setLoading(true);
        console.log('📋 Fetching summary data from individual API endpoint');
        const response = await fetch(`${API_BASE_URL}/api/summary-tab/${requestId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch summary data: ${response.statusText}`);
        }

        const data = await response.json();
        setSummaryData(data);
      } catch (error) {
        console.error('Error fetching summary data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch summary data');
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchSummaryData();
    }
  }, [requestId, completeSummaryData]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50';
    if (score >= 0.6) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskColor = (level: string) => {
    const riskLevel = level?.split(' - ')[0]?.toUpperCase() || level?.toUpperCase();
    switch (riskLevel) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    const riskLevel = level?.split(' - ')[0]?.toUpperCase() || level?.toUpperCase();
    switch (riskLevel) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'secondary';
      case 'LOW': return 'outline';
      default: return 'outline';
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'term_sheet': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-green-100 text-green-800';
      case 'agreement': return 'bg-purple-100 text-purple-800';
      case 'legal_document': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <span>Loading summary data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Error loading summary data: {error}</p>
          <p className="text-sm text-gray-500 mt-2">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      </Card>
    );
  }

  if (!summaryData) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-600">
          <p>No summary data available</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Document Overview
            </CardTitle>
            <Badge className={getDocumentTypeColor(summaryData.document_type)}>
              {summaryData.document_type?.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {summaryData.document_title || summaryData.file_name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Processed: {formatDate(summaryData.processing_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                <span>Confidence: {Math.round((summaryData.confidence_score || 0) * 100)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {summaryData.executive_summary}
          </p>
        </CardContent>
      </Card>

      {/* Enhanced Key Clauses with Rich Metadata */}
      {enhancedClauses && enhancedClauses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Enhanced Key Clauses
              <Badge variant="outline" className="ml-2">Rich Metadata</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {enhancedClauses.map((clause, index) => (
                <div key={index} className={`border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50 ${getRiskColor(clause.risk_level)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{clause.title}</h4>
                    <div className="flex gap-2">
                      <Badge variant={getRiskBadgeColor(clause.risk_level) as "destructive" | "secondary" | "outline"}>
                        {clause.risk_level?.split(' - ')[0] || clause.risk_level}
                      </Badge>
                      <Badge variant="outline" className={getConfidenceColor(clause.confidence_score).split(' ')[0]}>
                        {Math.round(clause.confidence_score * 100)}% Confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{clause.content}</p>
                  
                  {/* Rich Metadata Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {renderMetadataField(
                      "Market Comparison", 
                      clause.metadata?.market_comparison,
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    )}
                    {renderMetadataField(
                      "Implementation", 
                      clause.metadata?.implementation,
                      <Target className="h-4 w-4 text-blue-600" />
                    )}
                    {renderMetadataField(
                      "Risk Assessment", 
                      clause.risk_level,
                      <Info className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                  
                  {/* Supporting Quotes */}
                  {clause.supporting_quotes && clause.supporting_quotes.length > 0 && clause.supporting_quotes[0] && (
                    <div className="mt-4 p-3 bg-white rounded border-l-4 border-blue-500">
                      <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Supporting Quote</div>
                      <p className="text-sm italic text-gray-700">"{clause.supporting_quotes[0]}"</p>
                    </div>
                  )}
                  
                  {/* Quote from metadata if different */}
                  {clause.metadata?.quote && clause.metadata.quote !== clause.supporting_quotes?.[0] && (
                    <div className="mt-2 p-3 bg-white rounded border-l-4 border-green-500">
                      <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Additional Quote</div>
                      <p className="text-sm italic text-gray-700">"{clause.metadata.quote}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Key Highlights */}
      {enhancedHighlights && enhancedHighlights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              Enhanced Key Highlights
              <Badge variant="outline" className="ml-2">AI Enhanced</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {enhancedHighlights.map((highlight, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-l-4 border-amber-500">
                  <p className="text-gray-700 text-sm font-medium" dangerouslySetInnerHTML={{ __html: highlight }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standard Key Highlights */}
      {summaryData.key_highlights && summaryData.key_highlights.length > 0 && (!enhancedHighlights || enhancedHighlights.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Key Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summaryData.key_highlights.map((highlight, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700 text-sm">{highlight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Metrics */}
      {summaryData.document_metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Document Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {summaryData.document_metrics.estimated_pages || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Pages</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {summaryData.document_metrics.word_count?.toLocaleString() || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Words</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {summaryData.document_metrics.processing_time_seconds 
                    ? `${Math.round(summaryData.document_metrics.processing_time_seconds)}s`
                    : 'N/A'
                  }
                </div>
                <div className="text-sm text-gray-600">Processing Time</div>
              </div>
              {summaryData.document_metrics.ai_model_used && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">
                    {summaryData.document_metrics.ai_model_used}
                  </div>
                  <div className="text-sm text-gray-600">AI Model</div>
                </div>
              )}
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {summaryData.document_metrics.context_sources_used || summaryData.context_sources_count || 0}
                </div>
                <div className="text-sm text-gray-600">Context Sources</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${getConfidenceColor(summaryData.confidence_score || 0).split(' ')[0]}`}>
                  {Math.round((summaryData.confidence_score || 0) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SummaryTab;
