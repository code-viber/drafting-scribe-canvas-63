

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Clock, Zap, Loader2, Info, TrendingUp, Target } from 'lucide-react';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, User, Hash } from "lucide-react";

interface SummaryTabProps {
  fileName: string;
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
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
          <span className="text-lg font-space-grotesk">Loading summary data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 bg-red-50/80 backdrop-blur-sm border-red-100 rounded-2xl">
        <div className="text-center text-red-600">
          <p className="font-semibold font-space-grotesk">Error loading summary data: {error}</p>
          <p className="text-sm text-gray-500 mt-2 font-space-grotesk">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      </Card>
    );
  }

  if (!summaryData) {
    return (
      <Card className="p-8 bg-white/80 backdrop-blur-sm border-gray-100 rounded-2xl">
        <div className="text-center text-gray-600">
          <p className="font-space-grotesk">No summary data available</p>
        </div>
      </Card>

  return (
    <div className="space-y-8 font-space-grotesk">
      {/* Document Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-100 rounded-2xl shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-brand" />
              </div>
              Document Overview
            </CardTitle>
            <Badge className={`${getDocumentTypeColor(summaryData.document_type)} rounded-full px-3 py-1 font-medium`}>
              {summaryData.document_type?.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {summaryData.document_title || summaryData.file_name}
            </h3>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand" />
                <span>Processed: {formatDate(summaryData.processing_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand" />
                <span>Confidence: {Math.round((summaryData.confidence_score || 0) * 100)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Executive Summary */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-100 rounded-2xl shadow-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed text-base">
            {summaryData.executive_summary}
          </p>
        </CardContent>
      </Card>

      {/* Enhanced Key Clauses with Rich Metadata */}
      {enhancedClauses && enhancedClauses.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 rounded-2xl shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-brand" />
              </div>
              Enhanced Key Clauses
              <Badge variant="outline" className="ml-auto border-brand/20 text-brand rounded-full">Rich Metadata</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {enhancedClauses.map((clause, index) => (
                <div key={index} className={`border rounded-2xl p-8 bg-gradient-to-r from-orange-50/50 to-brand-50/30 backdrop-blur-sm ${getRiskColor(clause.risk_level)} shadow-sm`}>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-bold text-gray-900">{clause.title}</h4>
                    <div className="flex gap-3">
                      <Badge variant={getRiskBadgeColor(clause.risk_level) as "destructive" | "secondary" | "outline"} className="rounded-full">
                        {clause.risk_level?.split(' - ')[0] || clause.risk_level}
                      </Badge>
                      <Badge variant="outline" className={`${getConfidenceColor(clause.confidence_score).split(' ')[0]} rounded-full`}>
                        {Math.round(clause.confidence_score * 100)}% Confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6 text-base leading-relaxed">{clause.content}</p>
                  
                  {/* Rich Metadata Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {renderMetadataField(
                      "Market Comparison", 
                      clause.metadata?.market_comparison,
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    )}
                    {renderMetadataField(
                      "Implementation", 
                      clause.metadata?.implementation,
                      <Target className="h-4 w-4 text-brand" />
                    )}
                    {renderMetadataField(
                      "Risk Assessment", 
                      clause.risk_level,
                      <Info className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                  
                  {/* Supporting Quotes */}
                  {clause.supporting_quotes && clause.supporting_quotes.length > 0 && clause.supporting_quotes[0] && (
                    <div className="mt-6 p-4 bg-white/80 rounded-2xl border-l-4 border-brand shadow-sm">
                      <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Supporting Quote</div>
                      <p className="text-sm italic text-gray-700 leading-relaxed">"{clause.supporting_quotes[0]}"</p>
                    </div>
                  )}
                  
                  {/* Quote from metadata if different */}
                  {clause.metadata?.quote && clause.metadata.quote !== clause.supporting_quotes?.[0] && (
                    <div className="mt-3 p-4 bg-white/80 rounded-2xl border-l-4 border-green-500 shadow-sm">
                      <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Additional Quote</div>
                      <p className="text-sm italic text-gray-700 leading-relaxed">"{clause.metadata.quote}"</p>
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
        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 rounded-2xl shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                <Zap className="h-5 w-5 text-brand" />
              </div>
              Enhanced Key Highlights
              <Badge variant="outline" className="ml-auto border-brand/20 text-brand rounded-full">AI Enhanced</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enhancedHighlights.map((highlight, index) => (
                <div key={index} className="p-6 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-2xl border-l-4 border-brand shadow-sm backdrop-blur-sm">
                  <p className="text-gray-700 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: highlight }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standard Key Highlights */}
      {summaryData.key_highlights && summaryData.key_highlights.length > 0 && (!enhancedHighlights || enhancedHighlights.length === 0) && (
        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 rounded-2xl shadow-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Key Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summaryData.key_highlights.map((highlight, index) => (
                <div key={index} className="p-6 bg-brand-50/30 rounded-2xl border-l-4 border-brand shadow-sm backdrop-blur-sm">
                  <p className="text-gray-700 leading-relaxed">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Document Metrics */}
      {summaryData.document_metrics && (
        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 rounded-2xl shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-brand" />
              </div>
              Document Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50/50 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {summaryData.document_metrics.estimated_pages || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 font-medium">Pages</div>
              </div>
              <div className="text-center p-6 bg-gray-50/50 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {summaryData.document_metrics.word_count?.toLocaleString() || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 font-medium">Words</div>
              </div>
              <div className="text-center p-6 bg-gray-50/50 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {summaryData.document_metrics.processing_time_seconds 
                    ? `${Math.round(summaryData.document_metrics.processing_time_seconds)}s`
                    : 'N/A'
                  }
                </div>
                <div className="text-sm text-gray-600 font-medium">Processing Time</div>
              </div>
              {summaryData.document_metrics.ai_model_used && (
                <div className="text-center p-6 bg-gray-50/50 rounded-2xl backdrop-blur-sm">
                  <div className="text-lg font-bold text-gray-900 mb-2">
                    {summaryData.document_metrics.ai_model_used}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">AI Model</div>
                </div>
              )}
              <div className="text-center p-6 bg-gray-50/50 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {summaryData.document_metrics.context_sources_used || summaryData.context_sources_count || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">Context Sources</div>
              </div>
              <div className="text-center p-6 bg-gray-50/50 rounded-2xl backdrop-blur-sm">
                <div className={`text-3xl font-bold mb-2 ${getConfidenceColor(summaryData.confidence_score || 0).split(' ')[0]}`}>
                  {Math.round((summaryData.confidence_score || 0) * 100)}%
                </div>
                <div className="text-sm text-gray-600 font-medium">Confidence</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryTab;
