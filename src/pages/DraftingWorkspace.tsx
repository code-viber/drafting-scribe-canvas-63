
import React, { useState, useEffect, useRef } from 'react';
import { Send, FileText, Scale, Settings, User, MessageSquare, Clock, CheckCircle, AlertCircle, Edit3, Eye, Gavel, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

const DraftingWorkspace = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your legal drafting assistant. I'll help you create a comprehensive legal document. Let's start by gathering some essential information. What type of document would you like me to draft for you today? (e.g., Contract, NDA, Service Agreement, etc.)",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentDocument, setCurrentDocument] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeAgents, setActiveAgents] = useState([]);
  const [agentActivities, setAgentActivities] = useState([]);
  const [legalReferences, setLegalReferences] = useState([]);
  const [documentData, setDocumentData] = useState({
    partyA: '[PARTY A]',
    partyB: '[PARTY B]',
    state: '[STATE]',
    date: '[DATE]',
    documentType: '[DOCUMENT TYPE]'
  });
  const [conversationStage, setConversationStage] = useState('document-type');
  const [agentCursors, setAgentCursors] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);
  const [selectedReference, setSelectedReference] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const documentRef = useRef(null);
  const messagesEndRef = useRef(null);

  const agents = [
    { id: 'drafting', name: 'Drafting Agent', color: 'bg-blue-500', avatar: '✍️', description: 'Generates document structure and content' },
    { id: 'compliance', name: 'Compliance Agent', color: 'bg-green-500', avatar: '⚖️', description: 'Ensures regulatory compliance' },
    { id: 'research', name: 'Research Agent', color: 'bg-purple-500', avatar: '🔍', description: 'Finds relevant legal precedents' },
    { id: 'validation', name: 'Validation Agent', color: 'bg-orange-500', avatar: '✅', description: 'Validates legal accuracy' },
    { id: 'risk', name: 'Risk Agent', color: 'bg-red-500', avatar: '⚠️', description: 'Identifies potential risks' }
  ];

  const conversationFlow = {
    'document-type': { next: 'party-a', prompt: "Perfect! Now, could you please provide the name of the first party (Company/Individual A)?" },
    'party-a': { next: 'party-b', prompt: "Thank you! Now, what's the name of the second party (Company/Individual B)?" },
    'party-b': { next: 'jurisdiction', prompt: "Great! In which state or jurisdiction will this agreement be governed?" },
    'jurisdiction': { next: 'effective-date', prompt: "Excellent! What should be the effective date of this agreement? (e.g., today's date, specific future date)" },
    'effective-date': { next: 'additional-details', prompt: "Perfect! Are there any specific terms, clauses, or requirements you'd like me to include in this document?" },
    'additional-details': { next: 'start-drafting', prompt: "Excellent! I have all the information needed. Let me start drafting your document with our specialized agents working together." }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addToAuditTrail = (action, agent, details) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date(),
      action,
      agent,
      details
    };
    setAuditTrail(prev => [entry, ...prev]);
  };

  const updateDocumentData = (key, value) => {
    setDocumentData(prev => ({
      ...prev,
      [key]: value
    }));
    addToAuditTrail('data_update', 'System', `Updated ${key} to: ${value}`);
  };

  const simulateAgentCursor = (agentId, position) => {
    setAgentCursors(prev => [
      ...prev.filter(cursor => cursor.agentId !== agentId),
      { agentId, position, timestamp: Date.now() }
    ]);
    
    setTimeout(() => {
      setAgentCursors(prev => prev.filter(cursor => cursor.agentId !== agentId));
    }, 3000);
  };

  const simulateFullDocumentDrafting = async (docType, data) => {
    setIsTyping(true);
    
    // Initialize all agents
    const allAgents = ['drafting', 'research', 'compliance', 'validation', 'risk'];
    setActiveAgents(allAgents);
    
    // Set initial agent activities
    setAgentActivities([
      { id: 1, agent: 'Drafting Agent', activity: 'Structuring document framework', status: 'active' },
      { id: 2, agent: 'Research Agent', activity: 'Gathering legal precedents', status: 'active' },
      { id: 3, agent: 'Compliance Agent', activity: 'Checking regulatory requirements', status: 'active' },
      { id: 4, agent: 'Validation Agent', activity: 'Preparing validation checks', status: 'active' },
      { id: 5, agent: 'Risk Agent', activity: 'Analyzing potential risks', status: 'active' }
    ]);

    // Enhanced legal references
    setLegalReferences([
      { 
        id: 1, 
        title: 'Contract Formation Principles', 
        type: 'Case Law', 
        relevance: 'High',
        summary: 'Fundamental principles governing contract formation including offer, acceptance, and consideration.',
        citation: 'Restatement (Second) of Contracts § 17'
      },
      { 
        id: 2, 
        title: 'UCC § 2-201 Statute of Frauds', 
        type: 'Statute', 
        relevance: 'Medium',
        summary: 'Requirements for written contracts in sale of goods over $500.',
        citation: 'Uniform Commercial Code § 2-201'
      },
      { 
        id: 3, 
        title: 'Unconscionability Doctrine', 
        type: 'Legal Principle', 
        relevance: 'High',
        summary: 'Protection against unfair or oppressive contract terms.',
        citation: 'Williams v. Walker-Thomas Furniture Co., 350 F.2d 445 (D.C. Cir. 1965)'
      }
    ]);

    const fullDocument = `${docType.toUpperCase()}

This ${docType} ("Agreement") is entered into on ${data.date}, by and between ${data.partyA}, a ${data.state} corporation ("Company"), and ${data.partyB}, an individual ("Recipient").

RECITALS

WHEREAS, Company possesses certain confidential and proprietary information that is valuable to its business operations;

WHEREAS, Recipient desires to receive such confidential information for evaluation and potential business purposes;

WHEREAS, the parties wish to establish clear terms governing the disclosure and use of such confidential information;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. DEFINITIONS

1.1 "Confidential Information" means all non-public, proprietary, or confidential information disclosed by Company to Recipient, whether orally, in writing, or in any other form, including but not limited to:
   (a) Technical data, trade secrets, know-how, research, product plans, products, services, customers, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances, or other business information;
   (b) Information concerning Company's actual or anticipated business, research, or development;
   (c) Information identified as confidential or proprietary by Company.

1.2 "Purpose" means the evaluation of potential business relationships between the parties.

2. CONFIDENTIALITY OBLIGATIONS

2.1 Recipient agrees to:
   (a) Hold all Confidential Information in strict confidence;
   (b) Not disclose any Confidential Information to third parties without prior written consent;
   (c) Use Confidential Information solely for the Purpose stated herein;
   (d) Take reasonable precautions to protect the confidentiality of such information.

2.2 The obligations set forth in Section 2.1 shall not apply to information that:
   (a) Is or becomes publicly available through no breach of this Agreement;
   (b) Is rightfully received from a third party without restriction;
   (c) Is independently developed without use of Confidential Information;
   (d) Is required to be disclosed by law or court order, provided Recipient gives Company reasonable notice.

3. TERM AND TERMINATION

3.1 This Agreement shall commence on the date first written above and shall remain in effect for a period of three (3) years, unless terminated earlier.

3.2 Either party may terminate this Agreement at any time upon thirty (30) days written notice.

3.3 Upon termination, Recipient shall return or destroy all Confidential Information.

4. REMEDIES

4.1 Recipient acknowledges that any breach of this Agreement may cause irreparable harm to Company for which monetary damages would be inadequate.

4.2 Company shall be entitled to seek equitable relief, including temporary and permanent injunctive relief, without prejudice to any other rights or remedies.

5. GENERAL PROVISIONS

5.1 This Agreement shall be governed by the laws of the State of ${data.state}.

5.2 Any disputes arising under this Agreement shall be resolved in the courts of ${data.state}.

5.3 This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements.

5.4 This Agreement may only be modified in writing signed by both parties.

5.5 If any provision of this Agreement is found to be unenforceable, the remainder shall remain in full force and effect.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

${data.partyA}                           ${data.partyB}

By: _________________________           By: _________________________
Name:                                    Name:
Title:                                   Title: 
Date:                                    Date:`;

    // Simulate section-by-section drafting with agent cursors
    const sections = fullDocument.split('\n\n');
    let currentContent = '';
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const agentId = ['drafting', 'compliance', 'research', 'validation', 'risk'][i % 5];
      
      // Update agent activity
      setAgentActivities(prev => prev.map(activity => 
        activity.agent === agents.find(a => a.id === agentId)?.name 
          ? { ...activity, activity: `Working on section ${i + 1}`, status: 'active' }
          : activity
      ));
      
      // Show agent cursor
      simulateAgentCursor(agentId, currentContent.length);
      
      // Type out the section
      for (let j = 0; j <= section.length; j++) {
        await new Promise(resolve => setTimeout(resolve, 20));
        currentContent = sections.slice(0, i).join('\n\n') + (i > 0 ? '\n\n' : '') + section.substring(0, j);
        setCurrentDocument(currentContent);
      }
      
      if (i < sections.length - 1) {
        currentContent += '\n\n';
        setCurrentDocument(currentContent);
      }
      
      addToAuditTrail('section_completed', agents.find(a => a.id === agentId)?.name, `Completed section ${i + 1}`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Mark all agents as completed
    setAgentActivities(prev => prev.map(activity => ({
      ...activity,
      status: 'completed',
      activity: activity.activity.replace('Working on', 'Completed')
    })));
    
    setIsTyping(false);
    setActiveAgents([]);
    addToAuditTrail('document_completed', 'System', 'Full document generation completed');
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
    const currentInput = inputMessage;
    setInputMessage('');

    // Update document data based on conversation stage
    if (conversationStage === 'document-type') {
      updateDocumentData('documentType', currentInput);
    } else if (conversationStage === 'party-a') {
      updateDocumentData('partyA', currentInput);
    } else if (conversationStage === 'party-b') {
      updateDocumentData('partyB', currentInput);
    } else if (conversationStage === 'jurisdiction') {
      updateDocumentData('state', currentInput);
    } else if (conversationStage === 'effective-date') {
      updateDocumentData('date', currentInput);
    }

    // AI response based on conversation flow
    setTimeout(() => {
      const currentFlow = conversationFlow[conversationStage];
      
      if (currentFlow && currentFlow.next !== 'start-drafting') {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: currentFlow.prompt,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setConversationStage(currentFlow.next);
      } else if (currentFlow && currentFlow.next === 'start-drafting') {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: currentFlow.prompt,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        
        // Start full document generation
        setTimeout(() => {
          simulateFullDocumentDrafting(documentData.documentType, documentData);
        }, 2000);
      } else {
        // Continue conversation for additional details
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: "Thank you for that information. I'll incorporate that into the document. Is there anything else you'd like me to add or modify?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSectionEdit = (sectionText) => {
    setEditingSection(sectionText);
  };

  const applyEdit = (newText) => {
    const updatedDocument = currentDocument.replace(editingSection, newText);
    setCurrentDocument(updatedDocument);
    setEditingSection(null);
    addToAuditTrail('user_edit', 'User', `Edited section: ${editingSection.substring(0, 50)}...`);
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
        {/* Left Sidebar - Enhanced Chat Panel */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                <MessageSquare className="h-5 w-5" />
                <span>AI Assistant</span>
              </div>
              <Badge variant="outline" className="text-xs">
                Stage: {conversationStage.replace('-', ' ')}
              </Badge>
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
                placeholder="Provide the requested information..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Center - Enhanced Drafting Canvas */}
        <div className="flex-1 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Live Document Draft</h2>
              <div className="flex items-center space-x-2">
                {activeAgents.map(agentId => {
                  const agent = agents.find(a => a.id === agentId);
                  return (
                    <Badge key={agentId} variant="secondary" className="animate-pulse">
                      {agent?.avatar} {agent?.name}
                    </Badge>
                  );
                })}
                {agentCursors.map(cursor => {
                  const agent = agents.find(a => a.id === cursor.agentId);
                  return (
                    <Badge key={cursor.agentId} variant="outline" className="animate-pulse text-xs">
                      {agent?.avatar} Active
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-auto">
            <div 
              ref={documentRef}
              className="bg-white border border-gray-200 rounded-lg p-8 min-h-full font-mono text-sm leading-relaxed relative"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {currentDocument && (
                <div className="whitespace-pre-wrap relative">
                  {currentDocument.split('\n\n').map((section, index) => (
                    <div key={index} className="mb-4 group relative">
                      <div className="hover:bg-blue-50 p-2 rounded cursor-pointer" onClick={() => handleSectionEdit(section)}>
                        {section}
                      </div>
                      <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" onClick={() => handleSectionEdit(section)}>
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <span className="inline-flex items-center ml-1">
                      <span className="animate-pulse bg-blue-500 w-0.5 h-5 mr-2"></span>
                    </span>
                  )}
                </div>
              )}
              {!currentDocument && !isTyping && (
                <div className="text-gray-400 text-center py-20">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Your document will appear here as our agents draft it section by section...</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div>Party A: {documentData.partyA}</div>
                    <div>Party B: {documentData.partyB}</div>
                    <div>State: {documentData.state}</div>
                    <div>Date: {documentData.date}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Enhanced Agent Activity & Legal References */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Multi-Agent Activity</h3>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Audit
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Audit Trail</SheetTitle>
                    <SheetDescription>
                      Complete activity log for transparency and compliance
                    </SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="h-full mt-6">
                    <div className="space-y-3">
                      {auditTrail.map((entry) => (
                        <Card key={entry.id} className="p-3">
                          <div className="flex items-start justify-between text-xs">
                            <div className="flex-1">
                              <p className="font-medium">{entry.action.replace('_', ' ').toUpperCase()}</p>
                              <p className="text-gray-600 mt-1">{entry.details}</p>
                              <p className="text-gray-400 mt-1">by {entry.agent}</p>
                            </div>
                            <span className="text-gray-400">{entry.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {agentActivities.map((activity) => (
                <Card key={activity.id} className="p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      activity.status === 'active' 
                        ? 'bg-green-500 animate-pulse' 
                        : activity.status === 'completed'
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-gray-900">{activity.agent}</p>
                        <Badge variant={activity.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {activity.status}
                        </Badge>
                      </div>
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
              <h4 className="font-semibold text-gray-900 mb-3">Legal References & Research</h4>
              <div className="space-y-2">
                {legalReferences.map((ref) => (
                  <Sheet key={ref.id}>
                    <SheetTrigger asChild>
                      <Card className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
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
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{ref.title}</SheetTitle>
                        <SheetDescription>{ref.type} - {ref.relevance} Relevance</SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Summary</h4>
                          <p className="text-sm text-gray-600">{ref.summary}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Citation</h4>
                          <p className="text-sm font-mono bg-gray-100 p-2 rounded">{ref.citation}</p>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                ))}
                
                {legalReferences.length === 0 && (
                  <div className="text-center py-4 text-gray-400">
                    <Gavel className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Legal references will appear as agents research</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 p-6">
            <h3 className="font-semibold mb-4">Edit Section</h3>
            <Textarea
              value={editingSection}
              onChange={(e) => setEditingSection(e.target.value)}
              className="mb-4 min-h-32"
            />
            <div className="flex space-x-2">
              <Button onClick={() => applyEdit(editingSection)} className="flex-1">
                Apply Changes
              </Button>
              <Button variant="outline" onClick={() => setEditingSection(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DraftingWorkspace;
