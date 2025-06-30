
import React from 'react';
import { Eye, Download, Trash2 } from 'lucide-react';
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
  return (
    <div className="group relative bg-white/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1">
      {/* Glassmorphic overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 font-inter line-clamp-2">
            {doc.title}
          </h3>
          <Badge className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(doc.status)} border-0`}>
            {doc.status}
          </Badge>
        </div>
        
        {/* Summary */}
        <p className="text-sm text-gray-600 mb-6 line-clamp-3 font-inter font-light leading-relaxed">
          {doc.summary}
        </p>
        
        {/* Metadata */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium font-inter">Parties</span>
            <span className="text-gray-700 font-inter">{doc.parties}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium font-inter">Jurisdiction</span>
            <span className="text-gray-700 font-inter">{doc.jurisdiction}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium font-inter">Date</span>
            <span className="text-gray-700 font-inter">{doc.date}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2">
          <Button 
            onClick={() => onOpen(doc.id)}
            className="flex-1 h-9 text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-inter shadow-sm"
          >
            <Eye className="h-3 w-3 mr-2" />
            Open
          </Button>
          <Button 
            variant="outline" 
            className="h-9 px-3 rounded-xl border-gray-200/50 hover:bg-gray-50/50 transition-all duration-200"
          >
            <Download className="h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            className="h-9 px-3 text-red-500 hover:text-red-600 hover:bg-red-50/50 border-gray-200/50 rounded-xl transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(doc.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModernDocumentCard;
