
import React from 'react';
import { FileText, Download, Trash2, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DocumentCardProps {
  doc: {
    id: string | number;
    title: string;
    summary: string;
    parties: string;
    jurisdiction: string;
    date: string;
    status: string;
  };
  onOpen: (id: string | number) => void;
  onDelete: (id: string | number) => void;
  getStatusColor: (status: string) => string;
}

const ModernDocumentCard: React.FC<DocumentCardProps> = ({ 
  doc, 
  onOpen, 
  onDelete, 
  getStatusColor 
}) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Final':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Review':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Summarized':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      {/* Header with Icon and Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
            <FileText className="h-5 w-5 text-brand" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand transition-colors duration-200 font-space-grotesk line-clamp-2 mb-2">
              {doc.title}
            </h3>
            <Badge className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadgeColor(doc.status)} border`}>
              {doc.status}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Summary */}
      <p className="text-sm text-gray-600 mb-6 line-clamp-2 font-space-grotesk font-light leading-relaxed">
        {doc.summary}
      </p>
      
      {/* Metadata */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-medium font-space-grotesk">Parties</span>
          <span className="text-gray-700 font-space-grotesk text-right">{doc.parties}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-medium font-space-grotesk">Jurisdiction</span>
          <span className="text-gray-700 font-space-grotesk">{doc.jurisdiction}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-medium font-space-grotesk">Date</span>
          <span className="text-gray-700 font-space-grotesk">{doc.date}</span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button 
            onClick={() => onOpen(doc.id)}
            className="h-9 px-4 text-xs font-medium bg-brand hover:bg-brand-600 text-white rounded-xl transition-all duration-200 font-space-grotesk shadow-sm"
          >
            Open
          </Button>
          <Button 
            variant="outline" 
            className="h-9 px-3 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(doc.id);
            }}
          >
            <Trash2 className="h-3 w-3 text-red-500" />
          </Button>
        </div>
        
        {/* Arrow icon bottom-right */}
        <button 
          onClick={() => onOpen(doc.id)}
          className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group-hover:bg-brand/10"
        >
          <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-brand" />
        </button>
      </div>
    </div>
  );
};

export default ModernDocumentCard;
