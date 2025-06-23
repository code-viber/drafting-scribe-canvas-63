import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';

interface QualityTabProps {
  requestId: string;
  completeSummaryData?: any;
}

// Updated interface to match actual API response
interface QualityData {
  overall_quality_score: number;
  quality_metrics: {
    summary_completeness: number;
    risk_analysis_coverage: number;
    financial_analysis_depth: number;
    context_utilization: number;
    overall_accuracy: number;
  };
  improvement_suggestions: string[];
  confidence_breakdown: {
    text_extraction: number;
    document_classification: number;
    content_summarization: number;
    risk_identification: number;
    financial_analysis: number;
  };
  review_feedback?: {
    feedback_report: {
      overall_score: number;
      quality_scores: Array<{
        dimension: string;
        score: number;
        feedback: string;
        suggestions: string[];
      }>;
      critical_issues: string[];
      improvement_suggestions: string[];
      confidence_adjustment: number;
      requires_regeneration: boolean;
      evaluated_at: string;
      metadata: {
        evaluation_method: string;
      };
    };
    improved_summary?: any;
    quality_improvement: {
      confidence_improvement: number;
      sections_added: number;
      quality_enhanced: boolean;
    };
    overall_quality: number;
    llm_calls: any[];
  };
}

const API_BASE_URL = 'http://localhost:8005';

const QualityTab = ({ requestId, completeSummaryData }: QualityTabProps) => {
  const [qualityData, setQualityData] = useState<QualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have complete summary data, extract quality tab data
    if (completeSummaryData?.quality_tab) {
      console.log('🎯 Using complete summary data for Quality tab');
      console.log('🎯 Quality data structure:', JSON.stringify(completeSummaryData.quality_tab, null, 2));
      setQualityData(completeSummaryData.quality_tab);
      setLoading(false);
      return;
    }

    // Otherwise, fetch from individual API endpoint (fallback)
    const fetchQualityData = async () => {
      try {
        setLoading(true);
        console.log('🎯 Fetching quality data from individual API endpoint');
        const response = await fetch(`${API_BASE_URL}/api/quality-tab/${requestId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch quality data: ${response.statusText}`);
        }

        const data = await response.json();
        setQualityData(data);
      } catch (error) {
        console.error('Error fetching quality data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch quality data');
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchQualityData();
    }
  }, [requestId, completeSummaryData]);

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 0.8) return 'default';
    if (score >= 0.6) return 'secondary';
    return 'destructive';
  };

  const formatScore = (score: number) => {
    return Math.round(score * 100);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading quality assessment data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Error loading quality assessment data: {error}</p>
          <p className="text-sm text-gray-500 mt-2">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      </Card>
    );
  }

  if (!qualityData) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-600">
          <p>No quality assessment data available</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Quality Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Overall Quality Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold ${getScoreColor(qualityData.overall_quality_score)}`}>
              {formatScore(qualityData.overall_quality_score)}%
            </div>
            <p className="text-gray-600 mt-2">Overall Quality Score</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${qualityData.overall_quality_score >= 0.8 ? 'bg-green-500' : qualityData.overall_quality_score >= 0.6 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${formatScore(qualityData.overall_quality_score)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      {qualityData.quality_metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Quality Metrics Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(qualityData.quality_metrics).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(value as number)}`}>
                        {formatScore(value as number)}%
                      </span>
                    </div>
                    <Progress value={formatScore(value as number)} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confidence Breakdown */}
      {qualityData.confidence_breakdown && (
        <Card>
          <CardHeader>
            <CardTitle>Confidence Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(qualityData.confidence_breakdown).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(value as number)}`}>
                        {formatScore(value as number)}%
                      </span>
                    </div>
                    <Progress value={formatScore(value as number)} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Improvement Suggestions */}
      {qualityData.improvement_suggestions && qualityData.improvement_suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {qualityData.improvement_suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm text-blue-800">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Feedback */}
      {qualityData.review_feedback?.feedback_report && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Detailed Review Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Review Score */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Review Score</span>
                <Badge variant={getScoreBadgeColor(qualityData.review_feedback.feedback_report.overall_score) as "default" | "secondary" | "destructive"}>
                  {formatScore(qualityData.review_feedback.feedback_report.overall_score)}%
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Evaluated on {formatDate(qualityData.review_feedback.feedback_report.evaluated_at)} 
                using {qualityData.review_feedback.feedback_report.metadata.evaluation_method}
              </p>
            </div>

            {/* Quality Dimensions */}
            {qualityData.review_feedback.feedback_report.quality_scores && qualityData.review_feedback.feedback_report.quality_scores.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Quality Dimensions</h4>
                <div className="space-y-3">
                  {qualityData.review_feedback.feedback_report.quality_scores.map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{item.dimension}</span>
                        <Badge variant={getScoreBadgeColor(item.score) as "default" | "secondary" | "destructive"}>
                          {formatScore(item.score)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{item.feedback}</p>
                      {item.suggestions && item.suggestions.length > 0 && (
                        <ul className="text-xs text-gray-500 mt-2 list-disc list-inside">
                          {item.suggestions.map((suggestion, idx) => (
                            <li key={idx}>{suggestion}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Critical Issues */}
            {qualityData.review_feedback.feedback_report.critical_issues && qualityData.review_feedback.feedback_report.critical_issues.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Critical Issues</h4>
                <div className="space-y-2">
                  {qualityData.review_feedback.feedback_report.critical_issues.map((issue, index) => (
                    <div key={index} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <p className="text-sm text-red-800">{issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Improvement Suggestions */}
            {qualityData.review_feedback.feedback_report.improvement_suggestions && qualityData.review_feedback.feedback_report.improvement_suggestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Review Improvement Suggestions</h4>
                <div className="space-y-2">
                  {qualityData.review_feedback.feedback_report.improvement_suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                      <p className="text-sm text-amber-800">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quality Improvement Status */}
            {qualityData.review_feedback.quality_improvement && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Quality Improvement Status</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Confidence Improvement:</span>
                    <div className="font-bold text-green-800">
                      {formatScore(qualityData.review_feedback.quality_improvement.confidence_improvement)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-green-700">Sections Added:</span>
                    <div className="font-bold text-green-800">
                      {qualityData.review_feedback.quality_improvement.sections_added}
                    </div>
                  </div>
                  <div>
                    <span className="text-green-700">Quality Enhanced:</span>
                    <div className="font-bold text-green-800">
                      {qualityData.review_feedback.quality_improvement.quality_enhanced ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QualityTab;
