import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Send, BarChart3, Globe } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SuggestionTags from "./suggestion-tags";
import type { Location, Query } from "@shared/schema";

interface ChatInterfaceProps {
  location: Location;
  sessionId: string;
  onChangeLocation: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatInterface({ location, sessionId, onChangeLocation }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: existingQueries } = useQuery({
    queryKey: ["/api/locations", location.id, "queries"],
    enabled: !!location.id,
  });

  const sendQueryMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/queries", {
        prompt,
        locationId: location.id,
      });
      return response.json();
    },
    onSuccess: (query: Query) => {
      setIsTyping(false);
      addMessage(query.response || "No response generated", 'assistant');
    },
    onError: () => {
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (content: string, sender: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = () => {
    const message = inputValue.trim();
    if (!message) return;

    setHasStartedChat(true);
    addMessage(message, 'user');
    setInputValue("");
    setIsTyping(true);
    
    sendQueryMutation.mutate(message);
    
    // Auto-resize textarea back to single line
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleTagClick = (text: string) => {
    setInputValue(text);
    textareaRef.current?.focus();
    autoResize();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };



  if (!hasStartedChat) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="text-green-600" />
                  <span className="font-medium text-gray-900">{location.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={onChangeLocation} className="text-green-600 hover:text-green-700">
                  Change Location
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="text-green-600" />
                <span className="font-bold text-gray-900">GeoQuery</span>
              </div>
            </div>
          </div>
        </header>

        {/* Centered Input Dialog */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-white text-3xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to GeoQuery</h1>
              <p className="text-gray-600 text-lg">Ask questions about geographic data for {location.name}.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg mb-6">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    autoResize();
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask about geographic data for ${location.name}... (e.g., 'Show me rainfall patterns from 2001 to 2020')`}
                  className="w-full pr-12 resize-none focus:ring-2 focus:ring-green-600 focus:border-transparent border-0 text-lg"
                  rows={2}
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || sendQueryMutation.isPending}
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm mb-4">Try these suggestions:</p>
              <SuggestionTags onTagClick={handleTagClick} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="text-green-600" />
                <span className="font-medium text-gray-900">{location.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onChangeLocation} className="text-green-600 hover:text-green-700">
                Change Location
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="text-green-600" />
              <span className="font-bold text-gray-900">GeoQuery</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 pb-32">
        {/* Chat Messages */}
        <div className="space-y-6 pt-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-2xl px-6 py-4 ${
                  message.sender === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.sender === 'assistant' && (
                  <BarChart3 className="text-green-600 mr-2 mb-2 inline" />
                )}
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-6 py-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="text-green-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto p-4">
          <SuggestionTags onTagClick={handleTagClick} />
          
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                autoResize();
              }}
              onKeyPress={handleKeyPress}
              placeholder={`Ask about geographic data for ${location.name}... (e.g., 'Show me rainfall patterns from 2001 to 2020')`}
              className="w-full pr-12 resize-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || sendQueryMutation.isPending}
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
