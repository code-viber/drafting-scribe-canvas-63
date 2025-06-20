
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot, User, Share, Eye } from "lucide-react";
import ShareDialog from "./ShareDialog";
import ReportPreview from "./ReportPreview";

interface ChatPanelProps {
  fileName: string;
}

const ChatPanel = ({ fileName }: ChatPanelProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello! I've analyzed "${fileName}". Feel free to ask me any questions about the summary, risks, or recommendations.`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user' as const,
        content: message,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate AI response based on user input
      setTimeout(() => {
        let response = 'I understand your question. Let me analyze that aspect of your document...';
        
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('clause') || lowerMessage.includes('term')) {
          response = 'This clause establishes the terms for payment and delivery. It specifies that payments are due within 30 days and includes standard liability limitations.';
        } else if (lowerMessage.includes('risk')) {
          response = 'The main risks I identified include payment default risk due to lack of penalty clauses, and potential liability exposure from limited caps.';
        } else if (lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
          response = 'This is a comprehensive service agreement covering consulting services, with a 12-month term, $15,000 monthly payments, and standard IP provisions.';
        } else if (lowerMessage.includes('recommend')) {
          response = 'I recommend adding specific penalty terms for late payments, clarifying IP ownership rights, and including force majeure provisions.';
        }
        
        const aiResponse = {
          id: messages.length + 2,
          type: 'bot' as const,
          content: response,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
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
          
          {/* Action Buttons */}
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
          </div>
          
          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about the document..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4" />
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
