import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot, User, Share, Eye, Loader2 } from "lucide-react";
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

const ChatPanel = ({ fileName, requestId }: ChatPanelProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage = fileName && requestId
      ? `Hello! I've analyzed "${fileName}". Feel free to ask me any questions about the summary, risks, or recommendations.`
      : "Hello! I can help you understand anything about document analysis. Please upload a document to get started, and I'll be here to answer any questions about the results.";

    setMessages([{
      id: 1,
      type: 'bot',
      content: welcomeMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    }]);
  }, [fileName, requestId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !requestId) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: 'document_analysis'
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: data.response || 'I apologize, but I was unable to process your request. Please try again.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      
      // Fallback to mock response for better user experience
      let fallbackResponse = 'I apologize, but I\'m having trouble connecting to the server. Please try again later.';
      
      const lowerMessage = userMessage.content.toLowerCase();
      if (lowerMessage.includes('clause') || lowerMessage.includes('term')) {
        fallbackResponse = 'I understand you\'re asking about clauses or terms. Once the connection is restored, I\'ll be able to provide detailed analysis of the document\'s specific clauses.';
      } else if (lowerMessage.includes('risk')) {
        fallbackResponse = 'You\'re asking about risks. When the service is available, I can analyze the document\'s risk factors in detail.';
      } else if (lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
        fallbackResponse = 'You want a summary or overview. I\'ll be able to provide comprehensive document insights once the connection is restored.';
      }

      const errorResponse: ChatMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: fallbackResponse,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
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
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            AI Assistant
          </CardTitle>
          
          {/* Action Buttons - only show when document is uploaded */}
          {fileName && requestId && (
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsPreviewOpen(true)}
                className="flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                Preview Report
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-1"
              >
                <Share className="h-3 w-3" />
                Share Report
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {msg.type === 'bot' ? (
                      <Bot className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    <span className="text-xs opacity-75">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] p-3 rounded-lg bg-gray-100 text-gray-900">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="h-3 w-3" />
                    <span className="text-xs opacity-75">now</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder={requestId ? "Ask about the document..." : "Upload a document first..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={!requestId || isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!message.trim() || !requestId || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ShareDialog 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        fileName={fileName}
      />
      
      <ReportPreview 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        fileName={fileName}
      />
    </>
  );
};

export default ChatPanel;
