
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Target } from "lucide-react";

const FinancialTermsTab = () => {
  const financialTerms = [
    {
      term: "Service Fee",
      amount: "$15,000",
      frequency: "Monthly",
      dueDate: "30 days from invoice",
      status: "Active"
    },
    {
      term: "Setup Fee",
      amount: "$5,000",
      frequency: "One-time",
      dueDate: "Upon execution",
      status: "Completed"
    },
    {
      term: "Late Payment Penalty",
      amount: "2% per month",
      frequency: "As applicable",
      dueDate: "N/A",
      status: "Conditional"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Completed': return 'secondary';
      case 'Conditional': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">$185,000</div>
              <p className="text-sm text-gray-600">Total Contract Value</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">Monthly</div>
              <p className="text-sm text-gray-600">Payment Frequency</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Net 30</div>
              <p className="text-sm text-gray-600">Payment Terms</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Financial Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Enhanced Financial Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-medium text-blue-800 mb-2">Cash Flow Impact</h4>
              <p className="text-sm text-blue-700">
                Monthly payment of $15,000 creates predictable cash flow obligations. 
                Setup fee front-loads initial costs but provides long-term value stability.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h4 className="font-medium text-green-800 mb-2">Risk Assessment</h4>
              <p className="text-sm text-green-700">
                Net 30 payment terms are industry standard. Late payment penalties 
                provide reasonable protection against payment delays.
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
              <h4 className="font-medium text-amber-800 mb-2">Cost Optimization</h4>
              <p className="text-sm text-amber-700">
                12-month commitment offers cost predictability. Consider negotiating 
                volume discounts for extended terms beyond initial contract period.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Financial Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Key Financial Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Term</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Frequency</th>
                  <th className="text-left py-2">Due Date</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {financialTerms.map((term, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 font-medium">{term.term}</td>
                    <td className="py-3">{term.amount}</td>
                    <td className="py-3">{term.frequency}</td>
                    <td className="py-3">{term.dueDate}</td>
                    <td className="py-3">
                      <Badge variant={getStatusColor(term.status) as any}>
                        {term.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialTermsTab;
