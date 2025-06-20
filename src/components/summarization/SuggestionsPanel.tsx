
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckCircle, ArrowRight } from "lucide-react";

const SuggestionsPanel = () => {
  const suggestions = [
    {
      id: 1,
      title: "Add Payment Penalty Clause",
      description: "Include specific penalties for late payments to reduce default risk",
      priority: "High",
      category: "Financial",
      applied: false
    },
    {
      id: 2,
      title: "Clarify IP Ownership",
      description: "Define intellectual property rights more explicitly",
      priority: "Medium",
      category: "Legal",
      applied: false
    },
    {
      id: 3,
      title: "Include Force Majeure",
      description: "Add clause covering unforeseeable circumstances",
      priority: "Medium",
      category: "Risk",
      applied: false
    },
    {
      id: 4,
      title: "Data Protection Terms",
      description: "Add GDPR compliance and data handling procedures",
      priority: "High",
      category: "Compliance",
      applied: true
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Financial': return 'bg-green-100 text-green-800';
      case 'Legal': return 'bg-blue-100 text-blue-800';
      case 'Risk': return 'bg-red-100 text-red-800';
      case 'Compliance': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApplySuggestion = (id: number) => {
    console.log(`Applying suggestion ${id}`);
    // Here you would implement the logic to apply the suggestion
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="p-3 border rounded-lg space-y-3">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm">{suggestion.title}</h4>
                {suggestion.applied && (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-600">{suggestion.description}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant={getPriorityColor(suggestion.priority) as any} className="text-xs">
                  {suggestion.priority}
                </Badge>
                <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(suggestion.category)}`}>
                  {suggestion.category}
                </span>
              </div>
              
              {!suggestion.applied && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleApplySuggestion(suggestion.id)}
                  className="text-xs h-7"
                >
                  Apply
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <Button variant="outline" size="sm" className="w-full text-xs">
            View All Suggestions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestionsPanel;
