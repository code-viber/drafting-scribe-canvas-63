
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, FileText, Vault, Workflow, Send, Download, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Home = () => {
  const navigate = useNavigate();
  const [inputPrompt, setInputPrompt] = useState('');
  
  // Mock generated documents data
  const [documents] = useState([
    {
      id: 1,
      title: 'Software Development NDA',
      summary: 'Non-disclosure agreement for software development services between TechCorp and DevStudio...',
      parties: 'TechCorp, DevStudio',
      jurisdiction: 'California',
      date: '2024-01-15',
      status: 'Draft'
    },
    {
      id: 2,
      title: 'Service Agreement - Marketing',
      summary: 'Comprehensive service agreement outlining marketing services, deliverables, and payment terms...',
      parties: 'Marketing Inc, ClientCorp',
      jurisdiction: 'New York',
      date: '2024-01-12',
      status: 'Review'
    },
    {
      id: 3,
      title: 'Employment Contract',
      summary: 'Standard employment contract with competitive compensation package and comprehensive benefits...',
      parties: 'ABC Company, John Doe',
      jurisdiction: 'Texas',
      date: '2024-01-10',
      status: 'Final'
    }
  ]);

  const sidebarItems = [
    { id: 'drafting', label: 'Drafting', icon: Edit3, active: true },
    { id: 'summarization', label: 'Summarization', icon: FileText, active: false },
    { id: 'vault', label: 'Vault', icon: Vault, active: false },
    { id: 'workflows', label: 'Workflows', icon: Workflow, active: false }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputPrompt.trim()) {
      // Redirect to drafting workspace with the prompt
      navigate('/drafting-workspace', { state: { prompt: inputPrompt } });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleOpenDrafting = (documentId) => {
    navigate('/drafting-workspace', { state: { documentId } });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Review': return 'bg-blue-100 text-blue-800';
      case 'Final': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Edit3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LegalDraft AI</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    item.active 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 text-center">
            © 2024 LegalDraft AI
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to LegalDraft AI</h1>
            <p className="text-gray-600">Create professional legal documents with AI-powered assistance</p>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Input Section */}
            <div className="mb-12">
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                  <Input
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Draft an NDA for a SaaS company, Create a service agreement for marketing services, Generate an employment contract..."
                    className="w-full h-14 pl-6 pr-16 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 shadow-sm"
                  />
                  <Button 
                    type="submit"
                    className="absolute right-2 top-2 h-10 px-4 rounded-lg"
                    disabled={!inputPrompt.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
              <p className="text-sm text-gray-500 mt-3 text-center">
                Enter a prompt to start drafting your legal document with AI assistance
              </p>
            </div>

            {/* Generated Documents Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Recent Documents</h2>
                <Badge variant="outline" className="text-sm">
                  {documents.length} documents
                </Badge>
              </div>

              {documents.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {doc.title}
                          </CardTitle>
                          <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription className="text-sm text-gray-600 line-clamp-2">
                          {doc.summary}
                        </CardDescription>
                        
                        <div className="space-y-2 text-xs text-gray-500">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Parties:</span>
                            <span>{doc.parties}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Jurisdiction:</span>
                            <span>{doc.jurisdiction}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Date:</span>
                            <span>{doc.date}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 pt-2">
                          <Button 
                            onClick={() => handleOpenDrafting(doc.id)}
                            className="flex-1 h-8 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Open
                          </Button>
                          <Button variant="outline" className="h-8 px-2">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" className="h-8 px-2 text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Enter a prompt above to start drafting your first legal document with AI assistance.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-md mx-auto">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Tip</h4>
                    <p className="text-sm text-blue-800">
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
