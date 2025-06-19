
import React, { useState, useEffect, useRef } from 'react';
import { Send, FileText, Scale, Settings, User, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const DraftingWorkspace = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your legal drafting assistant. What type of document would you like me to help you create today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentDocument, setCurrentDocument] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeAgents, setActiveAgents] = useState([]);
  const [agentActivities, setAgentActivities] = useState([]);
  const [legalReferences, setLegalReferences] = useState([]);
  const documentRef = useRef(null);
  const messagesEndRef = useRef(null);

  const agents = [
    { id: 'drafting', name: 'Drafting Agent', color: 'bg-blue-500', avatar: '✍️' },
    { id: 'compliance', name: 'Compliance Agent', color: 'bg-green-500', avatar: '⚖️' },
    { id: 'research', name: 'Research Agent', color: 'bg-purple-500', avatar: '🔍' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = async (text, agentId) => {
    setIsTyping(true);
    setActiveAgents([agentId]);
    
    for (let i = 0; i <= text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setCurrentDocument(text.substring(0, i));
    }
    
    setIsTyping(false);
    setActiveAgents([]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response and document generation
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'll help you draft that document. Let me gather some information and start working on it.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);

      // Simulate agent activities
      setAgentActivities([
        { id: 1, agent: 'Drafting Agent', activity: 'Analyzing document requirements', status: 'active' },
        { id: 2, agent: 'Research Agent', activity: 'Searching legal precedents', status: 'active' }
      ]);

      // Simulate legal references
      setLegalReferences([
        { id: 1, title: 'Contract Formation Principles', type: 'Case Law', relevance: 'High' },
        { id: 2, title: 'UCC § 2-201 Statute of Frauds', type: 'Statute', relevance: 'Medium' }
      ]);

      // Start document generation
      setTimeout(() => {
        const sampleDocument = `CONFIDENTIAL AGREEMENT

This Confidential Agreement ("Agreement") is entered into on [DATE], by and between [PARTY A], a [STATE] corporation ("Company"), and [PARTY B], an individual ("Recipient").

WHEREAS, Company possesses certain confidential and proprietary information;

WHEREAS, Recipient desires to receive such confidential information for evaluation purposes;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. CONFIDENTIAL INFORMATION
   Company may disclose to Recipient certain confidential information including but not limited to...`;

        simulateTyping(sampleDocument, 'drafting');
      }, 2000);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">LegalDraft AI</span>
          </div>
          <div className="text-sm text-gray-500">Matter: Johnson v. Smith Contract Review</div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Chat Panel */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <MessageSquare className="h-5 w-5" />
              <span>AI Assistant</span>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="p-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me to draft any legal document..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Center - Drafting Canvas */}
        <div className="flex-1 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Document Draft</h2>
              <div className="flex items-center space-x-2">
                {activeAgents.map(agentId => {
                  const agent = agents.find(a => a.id === agentId);
                  return (
                    <Badge key={agentId} variant="secondary" className="animate-pulse">
                      {agent?.avatar} {agent?.name} Active
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-auto">
            <div 
              ref={documentRef}
              className="bg-white border border-gray-200 rounded-lg p-8 min-h-full font-mono text-sm leading-relaxed"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {currentDocument && (
                <div className="whitespace-pre-wrap">
                  {currentDocument}
                  {isTyping && (
                    <span className="inline-flex items-center ml-1">
                      <span className="animate-pulse bg-blue-500 w-0.5 h-5 mr-2"></span>
                      {activeAgents.map(agentId => {
                        const agent = agents.find(a => a.id === agentId);
                        return (
                          <Badge key={agentId} variant="outline" className="text-xs">
                            {agent?.avatar} {agent?.name}
                          </Badge>
                        );
                      })}
                    </span>
                  )}
                </div>
              )}
              {!currentDocument && !isTyping && (
                <div className="text-gray-400 text-center py-20">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Your document will appear here as it's being drafted...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Agent Activity & Legal References */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Agent Activity</h3>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {agentActivities.map((activity) => (
                <Card key={activity.id} className="p-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{activity.agent}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.activity}</p>
                    </div>
                  </div>
                </Card>
              ))}
              
              {agentActivities.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Agents will appear here when active</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3">Legal References</h4>
              <div className="space-y-2">
                {legalReferences.map((ref) => (
                  <Card key={ref.id} className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{ref.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{ref.type}</p>
                      </div>
                      <Badge variant={ref.relevance === 'High' ? 'default' : 'secondary'} className="text-xs">
                        {ref.relevance}
                      </Badge>
                    </div>
                  </Card>
                ))}
                
                {legalReferences.length === 0 && (
                  <div className="text-center py-4 text-gray-400">
                    <p className="text-sm">References will appear as agents research</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default DraftingWorkspace;
