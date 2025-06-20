
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, CreditCard, TrendingUp } from "lucide-react";

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

  const paymentSchedule = [
    { month: "April 2024", amount: "$15,000", status: "Pending" },
    { month: "May 2024", amount: "$15,000", status: "Scheduled" },
    { month: "June 2024", amount: "$15,000", status: "Scheduled" },
    { month: "July 2024", amount: "$15,000", status: "Scheduled" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Completed': return 'secondary';
      case 'Conditional': return 'outline';
      case 'Pending': return 'destructive';
      case 'Scheduled': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
              Total Contract Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$185,000</div>
            <p className="text-sm text-gray-600">12-month term</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              Payment Frequency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Monthly</div>
            <p className="text-sm text-gray-600">$15,000 per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Payment Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Net 30</div>
            <p className="text-sm text-gray-600">Days from invoice</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Terms Details */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Terms</CardTitle>
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

      {/* Payment Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Upcoming Payment Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentSchedule.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{payment.month}</div>
                  <div className="text-sm text-gray-600">Monthly service fee</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{payment.amount}</div>
                  <Badge variant={getStatusColor(payment.status) as any} className="text-xs">
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Obligations */}
      <Card>
        <CardHeader>
          <CardTitle>Key Financial Obligations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-medium text-blue-800">Client Obligations</h4>
              <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
                <li>Pay monthly fees within 30 days of invoice</li>
                <li>Cover any third-party costs with prior approval</li>
                <li>Provide required documentation for billing</li>
              </ul>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h4 className="font-medium text-green-800">Service Provider Obligations</h4>
              <ul className="text-sm text-green-700 mt-1 list-disc list-inside">
                <li>Deliver services as specified in SOW</li>
                <li>Provide detailed monthly invoices</li>
                <li>Maintain cost transparency and reporting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialTermsTab;
