
import React, { useState } from 'react';
import { Edit3, FileText, Vault, Workflow, Home as HomeIcon, ChevronLeft, ChevronRight, Settings, HelpCircle } from 'lucide-react';
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

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings, onClick: () => console.log('Settings clicked') },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, onClick: () => console.log('Help clicked') }
  ];

  return (
    <TooltipProvider>
      <div className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-out relative shadow-sm h-screen`}>
        
        {/* Logo and Toggle */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/ab75498a-b915-4c60-bfd8-ad68628d9376.png" 
                alt="QLaws.ai" 
                className="h-8 w-auto"
              />
            </div>
          )}
          
          {isCollapsed && (
            <img 
              src="/lovable-uploads/20556907-3467-4c1d-849f-d0c607e5e9df.png" 
              alt="QLaws" 
              className="h-8 w-8 mx-auto object-contain"
            />
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 rounded-full hover:bg-gray-100 transition-all duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {items.map(item => {
              const Icon = item.icon;
              const NavButton = (
                <button 
                  key={item.id}
                  onClick={() => onNavigate(item)}
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl text-left transition-all duration-200 group ${
                    item.active 
                      ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
                    item.active ? 'text-orange-600' : 'group-hover:scale-110'
                  }`} />
                  {!isCollapsed && (
                    <span className="font-medium font-space-grotesk transition-opacity duration-200">
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
                    <TooltipContent side="right" className="font-space-grotesk">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return NavButton;
            })}
          </div>
        </nav>
        
        {/* Bottom Items - Fixed */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <div className="space-y-2 mb-4">
            {bottomItems.map(item => {
              const Icon = item.icon;
              const BottomButton = (
                <button 
                  key={item.id}
                  onClick={item.onClick}
                  className="w-full flex items-center space-x-4 px-4 py-3 rounded-2xl text-left transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Icon className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  {!isCollapsed && (
                    <span className="font-medium font-space-grotesk transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}
                </button>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      {BottomButton}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-space-grotesk">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return BottomButton;
            })}
          </div>
          
          <div className="text-xs text-gray-400 text-center font-space-grotesk">
            {isCollapsed ? '© 2024' : '© 2024 QLaws.ai'}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ModernSidebar;
