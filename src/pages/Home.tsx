
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, FileText, Vault, Workflow, Send, Home as HomeIcon, User, Sparkles, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ModernSidebar from '@/components/ModernSidebar';
import ModernDocumentCard from '@/components/ModernDocumentCard';

const Home = () => {
  const navigate = useNavigate();
  const [inputPrompt, setInputPrompt] = useState('');
  const [documents, setDocuments] = useState([]);

  // Load saved documents from localStorage
  useEffect(() => {
    const loadSavedDocuments = () => {
      const savedDocuments = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
      const savedSummaries = JSON.parse(localStorage.getItem('savedSummaries') || '[]');
      
      // Merge with mock data for demonstration
      const mockDocuments = [{
        id: 1,
        title: 'Software Development NDA',
        summary: 'Non-disclosure agreement for software development services between TechCorp and DevStudio...',
        parties: 'TechCorp, DevStudio',
        jurisdiction: 'California',
        date: '2024-01-15',
        status: 'Draft'
      }, {
        id: 2,
        title: 'Service Agreement - Marketing',
        summary: 'Comprehensive service agreement outlining marketing services, deliverables, and payment terms...',
        parties: 'Marketing Inc, ClientCorp',
        jurisdiction: 'New York',
        date: '2024-01-12',
        status: 'Review'
      }, {
        id: 3,
        title: 'Employment Contract',
        summary: 'Standard employment contract with competitive compensation package and comprehensive benefits...',
        parties: 'ABC Company, John Doe',
        jurisdiction: 'Texas',
        date: '2024-01-10',
        status: 'Final'
      }];

      // Combine saved documents with mock data, with saved documents first
      const allDocuments = [...savedDocuments, ...savedSummaries, ...mockDocuments];
      setDocuments(allDocuments);
    };
    loadSavedDocuments();

    // Listen for storage changes to update documents when new ones are saved
    const handleStorageChange = () => {
      loadSavedDocuments();
    };
    window.addEventListener('storage', handleStorageChange);

    // Also listen for a custom event in case save happens in same tab
    window.addEventListener('documentSaved', handleStorageChange);
    window.addEventListener('summarySaved', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('documentSaved', handleStorageChange);
      window.removeEventListener('summarySaved', handleStorageChange);
    };
  }, []);

  const sidebarItems = [{
    id: 'home',
    label: 'Home',
    icon: HomeIcon,
    active: true,
    path: '/home'
  }, {
    id: 'drafting',
    label: 'Drafting',
    icon: Edit3,
    active: false,
    path: '/drafting-workspace'
  }, {
    id: 'summarization',
    label: 'Summarization',
    icon: FileText,
    active: false,
    path: '/summarization'
  }, {
    id: 'vault',
    label: 'Vault',
    icon: Vault,
    active: false,
    path: '/vault'
  }, {
    id: 'workflows',
    label: 'Workflows',
    icon: Workflow,
    active: false,
    path: '/workflows'
  }];

  const handleSidebarNavigation = (item) => {
    if (item.path === '/home') {
      // Already on home, no need to navigate
      return;
    }
    navigate(item.path);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (inputPrompt.trim()) {
      // Redirect to drafting workspace with the prompt
      navigate('/drafting-workspace', {
        state: {
          prompt: inputPrompt
        }
      });
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleOpenDrafting = documentId => {
    navigate('/drafting-workspace', {
      state: {
        documentId
      }
    });
  };

  const handleDeleteDocument = documentId => {
    const savedDocuments = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
    const savedSummaries = JSON.parse(localStorage.getItem('savedSummaries') || '[]');
    
    const updatedDocuments = savedDocuments.filter(doc => doc.id !== documentId);
    const updatedSummaries = savedSummaries.filter(doc => doc.id !== documentId);
    
    localStorage.setItem('savedDocuments', JSON.stringify(updatedDocuments));
    localStorage.setItem('savedSummaries', JSON.stringify(updatedSummaries));

    // Update the displayed documents
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Draft':
        return 'bg-amber-100/80 text-amber-700';
      case 'Review':
        return 'bg-blue-100/80 text-blue-700';
      case 'Final':
        return 'bg-emerald-100/80 text-emerald-700';
      default:
        return 'bg-gray-100/80 text-gray-700';
    }
  };

  const promptSuggestions = [
    "Draft NDA for SaaS",
    "Employment Contract",
    "Service Agreement"
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-space-grotesk">
      {/* Modern Sidebar - Fixed */}
      <ModernSidebar 
        items={sidebarItems} 
        onNavigate={handleSidebarNavigation} 
      />

      {/* Main Content - With left margin to accommodate fixed sidebar */}
      <div className="ml-72 flex flex-col">
        {/* Header with User Avatar */}
        <header className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-space-grotesk">
                Welcome to QLaws.ai
              </h1>
              <p className="text-gray-500 font-space-grotesk font-normal">
                Create professional legal documents with AI-powered assistance
              </p>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                  <DropdownMenuItem className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-space-grotesk font-medium">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4" />
                    <span className="font-space-grotesk font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 px-8 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Enhanced Pill-shaped Input Section */}
            <div className="mb-16">
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-card">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                      <Sparkles className="h-6 w-6 text-brand" />
                    </div>
                    <Input 
                      value={inputPrompt} 
                      onChange={e => setInputPrompt(e.target.value)} 
                      onKeyPress={handleKeyPress} 
                      placeholder="What legal document would you like to create today?"
                      className="w-full h-16 pl-16 pr-20 text-lg border-0 bg-gray-50/50 rounded-full focus:ring-2 focus:ring-brand/20 font-space-grotesk placeholder:text-gray-400 shadow-inner" 
                    />
                    <Button 
                      type="submit" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-10 px-6 rounded-full bg-brand hover:bg-brand-600 transition-all duration-200 font-space-grotesk font-medium"
                      disabled={!inputPrompt.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Create
                    </Button>
                  </div>
                </form>
                
                {/* Suggestion Pills */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <span className="text-sm text-gray-400 font-space-grotesk font-medium">Try:</span>
                  {promptSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputPrompt(suggestion)}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-sm font-space-grotesk font-medium transition-all duration-200 border border-gray-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-space-grotesk">Recent Documents</h2>
                <Badge variant="outline" className="text-sm font-space-grotesk font-medium px-4 py-2 rounded-full bg-white border-gray-200">
                  {documents.length} documents
                </Badge>
              </div>

              {documents.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {documents.map(doc => (
                    <ModernDocumentCard
                      key={doc.id}
                      doc={doc}
                      onOpen={handleOpenDrafting}
                      onDelete={handleDeleteDocument}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-32 h-32 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <FileText className="h-16 w-16 text-brand" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-space-grotesk">No documents yet</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto font-space-grotesk font-normal leading-relaxed">
                    Enter a prompt above to start drafting your first legal document with AI assistance.
                  </p>
                  <div className="bg-white border border-gray-100 rounded-2xl p-8 max-w-md mx-auto shadow-card">
                    <h4 className="font-semibold text-brand mb-3 font-space-grotesk flex items-center justify-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Quick Tip
                    </h4>
                    <p className="text-sm text-gray-600 font-space-grotesk font-normal leading-relaxed">
                      Try prompts like "Draft an NDA for a tech startup" or "Create a service agreement for consulting work"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
