
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBubble } from "./ChatBubble";
import { useHealthCare } from "@/context/HealthCareContext";
import { Mic, Send } from "lucide-react";

export function ChatInterface() {
  const { 
    chatMessages, 
    sendMessage, 
    isListening,
    startListening,
    stopListening
  } = useHealthCare();
  
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [chatMessages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-healthcare-background rounded-md shadow-inner">
      {/* Chat History */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {chatMessages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
        </div>
      </ScrollArea>
      
      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white rounded-b-md">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant={isListening ? "destructive" : "secondary"}
            onClick={isListening ? stopListening : startListening}
            className="flex-shrink-0"
          >
            <Mic size={18} className={isListening ? "animate-pulse" : ""} />
          </Button>
          
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your health question..."
            className="flex-1"
          />
          
          <Button type="submit" size="icon" className="flex-shrink-0 bg-healthcare-primary hover:bg-healthcare-secondary">
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
}
