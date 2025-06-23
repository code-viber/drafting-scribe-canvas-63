import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Download, Activity, CheckCircle, Loader2 } from 'lucide-react';

interface AuditTrailTabProps {
  requestId: string;
  completeSummaryData?: any;
}

// Updated interface to match actual API response
interface AuditTrailData {
  workflow_id: string;
  processing_timeline: Array<{
    step_name: string;
    status: string;
    progress_percentage: number;
    start_time: string;
    end_time: string;
    duration_ms: number | null;
    details: string;
  }>;
  agent_interactions: Array<{
    timestamp: string;
    agent: string;
    operation: string;
    duration_ms: number | null;
    success: boolean;
    details: any;
  }>;
  llm_calls_summary: {
    total_calls: number;
    total_tokens: number;
    models_used: string[];
    average_call_duration: number;
  };
  performance_metrics: {
    total_processing_time: number;
    extraction_time: number;
    summarization_time: number;
    quality_review_time: number;
    peak_memory_usage: string;
    cpu_utilization: string;
  };
  detailed_audit_trail: Array<{
    timestamp: string;
    step: string;
    agent: string;
    operation: string;
    details: any;
    duration_ms: number | null;
    input_tokens: number | null;
    output_tokens: number | null;
    model_used: string | null;
    confidence_score: number | null;
    success: boolean;
    error_message: string | null;
  }>;
}

const API_BASE_URL = 'http://localhost:8005';

const AuditTrailTab = ({ requestId, completeSummaryData }: AuditTrailTabProps) => {
  const [auditData, setAuditData] = useState<AuditTrailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have complete summary data, extract audit trail data
    if (completeSummaryData?.audit_trail_tab) {
      console.log('📊 Using complete summary data for Audit Trail tab');
      console.log('📊 Audit data structure:', JSON.stringify(completeSummaryData.audit_trail_tab, null, 2));
      setAuditData(completeSummaryData.audit_trail_tab);
      setLoading(false);
      return;
    }

    // Otherwise, fetch from individual API endpoint (fallback)
    const fetchAuditData = async () => {
      try {
        setLoading(true);
        console.log('📊 Fetching audit trail data from individual API endpoint');
        const response = await fetch(`${API_BASE_URL}/api/audit-trail-tab/${requestId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch audit trail data: ${response.statusText}`);
        }

        const data = await response.json();
        setAuditData(data);
      } catch (error) {
        console.error('Error fetching audit trail data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch audit trail data');
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchAuditData();
    }
  }, [requestId, completeSummaryData]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getStepIcon = (step: string) => {
    switch (step.toLowerCase()) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const exportAuditTrail = () => {
    if (!auditData) return;
    
    const dataStr = JSON.stringify(auditData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `audit-trail-${requestId}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading audit trail data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Error loading audit trail data: {error}</p>
          <p className="text-sm text-gray-500 mt-2">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      </Card>
    );
  }

  if (!auditData) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-600">
          <p>No audit trail data available</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Audit Trail</h2>
          <p className="text-gray-600">Workflow ID: {auditData.workflow_id}</p>
        </div>
        <Button onClick={exportAuditTrail} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Audit Trail
        </Button>
      </div>

      {/* Performance Metrics */}
      {auditData.performance_metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {auditData.performance_metrics.total_processing_time.toFixed(2)}s
                </div>
                <div className="text-sm text-blue-700">Total Time</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {auditData.performance_metrics.extraction_time}s
                </div>
                <div className="text-sm text-green-700">Extraction</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {auditData.performance_metrics.summarization_time}s
                </div>
                <div className="text-sm text-purple-700">Summarization</div>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {auditData.performance_metrics.quality_review_time}s
                </div>
                <div className="text-sm text-amber-700">Quality Review</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-600">
                  {auditData.performance_metrics.peak_memory_usage}
                </div>
                <div className="text-sm text-gray-700">Peak Memory</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LLM Calls Summary */}
      {auditData.llm_calls_summary && (
        <Card>
          <CardHeader>
            <CardTitle>LLM Usage Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {auditData.llm_calls_summary.total_calls}
                </div>
                <div className="text-sm text-indigo-700">Total Calls</div>
              </div>
              <div className="text-center p-3 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600">
                  {auditData.llm_calls_summary.total_tokens.toLocaleString()}
                </div>
                <div className="text-sm text-pink-700">Total Tokens</div>
              </div>
              <div className="text-center p-3 bg-cyan-50 rounded-lg">
                <div className="text-2xl font-bold text-cyan-600">
                  {auditData.llm_calls_summary.average_call_duration}ms
                </div>
                <div className="text-sm text-cyan-700">Avg Duration</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-sm font-bold text-orange-600">
                  {auditData.llm_calls_summary.models_used.join(', ')}
                </div>
                <div className="text-sm text-orange-700">Models Used</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Timeline */}
      {auditData.processing_timeline && auditData.processing_timeline.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditData.processing_timeline.map((step, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getStepIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{step.step_name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(step.status) as "default" | "secondary" | "destructive" | "outline"}>
                          {step.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {step.progress_percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Started: {formatDate(step.start_time)}</div>
                      {step.end_time && <div>Ended: {formatDate(step.end_time)}</div>}
                      <div>Duration: {formatDuration(step.duration_ms)}</div>
                      {step.details && <div>Details: {step.details}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agent Interactions */}
      {auditData.agent_interactions && auditData.agent_interactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Agent Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditData.agent_interactions.map((interaction, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{interaction.agent}</Badge>
                      <span className="text-sm font-medium">{interaction.operation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={interaction.success ? "default" : "destructive"}>
                        {interaction.success ? 'Success' : 'Failed'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDuration(interaction.duration_ms)}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Time: {formatDate(interaction.timestamp)}</div>
                    {interaction.details && typeof interaction.details === 'object' && (
                      <div className="mt-2">
                        <details className="cursor-pointer">
                          <summary className="text-blue-600 hover:text-blue-800">View Details</summary>
                          <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-x-auto">
                            {JSON.stringify(interaction.details, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Audit Trail */}
      {auditData.detailed_audit_trail && auditData.detailed_audit_trail.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Audit Trail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditData.detailed_audit_trail.map((entry, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{entry.agent}</Badge>
                      <Badge variant="secondary">{entry.step}</Badge>
                      <span className="text-sm font-medium">{entry.operation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={entry.success ? "default" : "destructive"}>
                        {entry.success ? 'Success' : 'Failed'}
                      </Badge>
                      {entry.confidence_score && (
                        <Badge variant="outline">
                          {Math.round(entry.confidence_score * 100)}% conf
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Time: {formatDate(entry.timestamp)}</div>
                    <div>Duration: {formatDuration(entry.duration_ms)}</div>
                    {entry.model_used && <div>Model: {entry.model_used}</div>}
                    {entry.input_tokens && entry.output_tokens && (
                      <div>Tokens: {entry.input_tokens} in, {entry.output_tokens} out</div>
                    )}
                    {entry.error_message && (
                      <div className="text-red-600">Error: {entry.error_message}</div>
                    )}
                    {entry.details && typeof entry.details === 'object' && (
                      <details className="cursor-pointer">
                        <summary className="text-blue-600 hover:text-blue-800">View Details</summary>
                        <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-x-auto">
                          {JSON.stringify(entry.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuditTrailTab;
