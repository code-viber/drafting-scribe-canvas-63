
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot, User } from "lucide-react";

const ChatPanel = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'ve analyzed your document. Feel free to ask me any questions about the summary, risks, or recommendations.',
      timestamp: '14:30'
    },
    {
      id: 2,
      type: 'user',
      content: 'What are the main risks I should be concerned about?',
      timestamp: '14:31'
    },
    {
      id: 3,
      type: 'bot',
      content: 'The main risks include payment default (high risk) due to lack of penalty clauses, and liability exposure (medium risk) from limited liability caps. I recommend adding specific penalty terms.',
      timestamp: '14:31'
    }
  ]);

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
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: 'bot' as const,
          content: 'I understand your question. Let me analyze that aspect of your document...',
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
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
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
  );
};

export default ChatPanel;
