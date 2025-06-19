
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scale, MessageSquare, FileText, Users, ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: 'Conversational Drafting',
      description: 'Chat with AI to create legal documents through natural conversation'
    },
    {
      icon: Users,
      title: 'Multi-Agent Collaboration',
      description: 'Watch specialized AI agents work together on your documents in real-time'
    },
    {
      icon: FileText,
      title: 'Live Document Generation',
      description: 'See your documents being typed out character by character as agents work'
    },
    {
      icon: CheckCircle,
      title: 'Legal Compliance',
      description: 'Built-in compliance checking and legal precedent integration'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">LegalDraft AI</span>
          </div>
          <Button onClick={() => navigate('/drafting-workspace')} className="bg-blue-600 hover:bg-blue-700">
            Launch Workspace
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Legal
            <span className="text-blue-600 block">Document Drafting</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Experience the future of legal drafting with conversational AI, live multi-agent collaboration, 
            and real-time document generation that transforms how legal professionals work.
          </p>
          <Button 
            onClick={() => navigate('/drafting-workspace')} 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 h-auto"
          >
            Start Drafting Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <div className="text-blue-600 mb-4">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Demo Preview */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">See It In Action</h2>
            <p className="text-gray-600 mb-6">
              Watch as multiple AI agents collaborate to draft your legal documents in real-time
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 text-white font-mono">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-400">Document Draft - Live</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">✍️ Drafting Agent:</span>
                <span className="text-green-400">Generating contract clauses...</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-400">⚖️ Compliance Agent:</span>
                <span className="text-green-400">Checking regulatory requirements...</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">🔍 Research Agent:</span>
                <span className="text-green-400">Finding relevant precedents...</span>
              </div>
              <div className="mt-4 p-3 bg-gray-800 rounded border-l-4 border-blue-500">
                <div className="text-gray-300">
                  CONFIDENTIAL AGREEMENT<span className="animate-pulse bg-blue-500 w-2 h-4 inline-block ml-1"></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button 
              onClick={() => navigate('/drafting-workspace')} 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try the Full Experience
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Index;
