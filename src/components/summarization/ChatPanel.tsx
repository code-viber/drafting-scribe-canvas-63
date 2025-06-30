import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Bot, User, Share, Eye, Loader2, Sparkles } from "lucide-react";
import ShareDialog from "./ShareDialog";
import ReportPreview from "./ReportPreview";

interface ChatPanelProps {
  fileName: string;
  requestId?: string | null;
}

interface ChatMessage {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp: string;
}

const API_BASE_URL = 'http://localhost:8005';

const ChatPanel = ({
  fileName,
  requestId
}: ChatPanelProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize with enhanced welcome message
    const welcomeMessage = fileName && requestId 
      ? `Hello! I'm Qyn, your AI legal assistant. I've analyzed "${fileName}" and I'm ready to help you understand the summary, identify risks, or explain any complex terms. What would you like to know?`
      : "Hello! I'm Qyn, your AI legal assistant. I can help you understand document analysis results. Please upload a document to get started, and I'll be here to answer any questions about the insights.";
    
    setMessages([{
      id: 1,
      type: 'bot',
      content: welcomeMessage,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      })
    }]);
  }, [fileName, requestId]);

  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || message;
    if (!messageToSend.trim() || !requestId) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      type: 'user',
      content: messageToSend,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_BASE_URL}/api/chat/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: 'document_analysis'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: data.response || 'I apologize, but I was unable to process your request. Please try again.',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending chat message:', error);

      let fallbackResponse = 'I apologize, but I\'m having trouble connecting to the server.';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          fallbackResponse = 'The request timed out. Please try again with a shorter message.';
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          fallbackResponse = 'Unable to connect to the chat service. Please check if the backend server is running on localhost:8005.';
        } else if (error.message.includes('500')) {
          fallbackResponse = 'The server encountered an error processing your message. Please try again.';
        } else {
          const lowerMessage = message.toLowerCase();
          if (lowerMessage.includes('clause') || lowerMessage.includes('term')) {
            fallbackResponse = 'I understand you\'re asking about clauses or terms. Once the connection is restored, I\'ll be able to provide detailed analysis of the document\'s specific clauses.';
          } else if (lowerMessage.includes('risk')) {
            fallbackResponse = 'You\'re asking about risks. When the service is available, I can analyze the document\'s risk factors in detail.';
          } else if (lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
            fallbackResponse = 'You want a summary or overview. I\'ll be able to provide comprehensive document insights once the connection is restored.';
          }
        }
      }

      const errorResponse: ChatMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: fallbackResponse,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="sticky top-8 z-10">
        <Card className="h-[60vh] flex flex-col bg-white/90 backdrop-blur-sm border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4 border-b border-gray-100 flex-shrink-0">
            {/* Enhanced Assistant Header with Avatar */}
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900 font-space-grotesk">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  Qyn
                  <Badge variant="secondary" className="bg-brand/10 text-brand text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Assistant
                  </Badge>
                </div>
                <p className="text-sm font-normal text-gray-600 mt-1">Your Legal Analysis Partner</p>
              </div>
            </CardTitle>
            
            {/* Action Buttons */}
            {fileName && requestId && (
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsPreviewOpen(true)} 
                  className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 rounded-xl font-medium font-space-grotesk transition-all duration-200 hover:scale-105"
                >
                  <Eye className="h-4 w-4" />
                  Preview Report
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsShareOpen(true)} 
                  className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 rounded-xl font-medium font-space-grotesk transition-all duration-200 hover:scale-105"
                >
                  <Share className="h-4 w-4" />
                  Share Report
                </Button>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            {/* Enhanced Messages with Better Styling */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full px-6 py-4">
                <div className="space-y-4 pr-3">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${
                        msg.type === 'user' 
                          ? 'bg-gradient-to-r from-brand to-brand-600 text-white rounded-2xl rounded-br-md shadow-sm' 
                          : 'bg-gray-50 text-gray-900 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                      } px-4 py-3`}>
                        <div className="flex items-center gap-2 mb-2">
                          {msg.type === 'bot' ? (
                            <div className="w-5 h-5 bg-brand/10 rounded-full flex items-center justify-center">
                              <Bot className="h-3 w-3 text-brand" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                              <User className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <span className={`text-xs font-space-grotesk ${msg.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                            {msg.type === 'bot' ? 'Qyn' : 'You'} • {msg.timestamp}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed font-space-grotesk">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Enhanced Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] bg-gray-50 text-gray-900 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 bg-brand/10 rounded-full flex items-center justify-center">
                            <Bot className="h-3 w-3 text-brand" />
                          </div>
                          <span className="text-xs text-gray-500 font-space-grotesk">Qyn • now</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-brand" />
                          <span className="text-sm font-space-grotesk">Analyzing your request...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced Empty state */}
                  {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full min-h-[200px]">
                      <div className="text-center p-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-brand/10 to-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <MessageSquare className="h-8 w-8 text-brand" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 font-space-grotesk">
                          Ready to Help
                        </h3>
                        <p className="text-gray-500 font-space-grotesk font-light">
                          {requestId ? "Ask me anything about your document" : "Upload a document to start chatting"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            
            {/* Enhanced Input Section */}
            <div className="p-4 border-t border-gray-100 flex-shrink-0 bg-gray-50/50">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Input 
                    placeholder={requestId ? "Ask me about clauses, risks, terms..." : "Upload a document first..."} 
                    value={message} 
                    onChange={e => setMessage(e.target.value)} 
                    onKeyPress={handleKeyPress} 
                    className="rounded-2xl border-gray-200 bg-white px-4 py-3 font-space-grotesk placeholder:text-gray-400 focus:border-brand focus:ring-brand/20 shadow-sm" 
                    disabled={!requestId || isLoading} 
                  />
                </div>
                <Button 
                  onClick={() => handleSendMessage()} 
                  disabled={!message.trim() || !requestId || isLoading} 
                  className="bg-brand hover:bg-brand-600 text-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
              {!requestId && (
                <p className="text-xs text-gray-400 mt-2 font-space-grotesk">
                  Upload a document to enable chat functionality
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ShareDialog isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} fileName={fileName} />
      <ReportPreview isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} fileName={fileName} />
    </>
  );
};

export default ChatPanel;
