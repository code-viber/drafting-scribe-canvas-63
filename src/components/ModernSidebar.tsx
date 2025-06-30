
import React, { useState } from 'react';
import { Edit3, FileText, Vault, Workflow, Home as HomeIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  active: boolean;
  path: string;
}

interface ModernSidebarProps {
  items: SidebarItem[];
  onNavigate: (item: SidebarItem) => void;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({ items, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <TooltipProvider>
      <div className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } bg-white/80 backdrop-blur-xl border-r border-gray-100/50 flex flex-col transition-all duration-300 ease-out relative`}>
        
        {/* Logo and Toggle */}
        <div className="p-6 border-b border-gray-100/30 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Edit3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 font-inter">QlawsAI</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 rounded-full hover:bg-gray-100/50 transition-all duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {items.map(item => {
              const Icon = item.icon;
              const NavButton = (
                <button 
                  key={item.id}
                  onClick={() => onNavigate(item)}
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl text-left transition-all duration-200 group ${
                    item.active 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm border border-blue-100/30' 
                      : 'text-gray-600 hover:bg-gray-50/50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
                    item.active ? 'text-blue-600' : 'group-hover:scale-110'
                  }`} />
                  {!isCollapsed && (
                    <span className="font-medium font-inter transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}
                </button>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      {NavButton}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-inter">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return NavButton;
            })}
          </div>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100/30">
          <div className="text-xs text-gray-400 text-center font-inter">
            {isCollapsed ? '© 2024' : '© 2024 LegalDraft AI'}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ModernSidebar;
