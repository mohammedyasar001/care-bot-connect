
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types";

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === 'You';
  
  // Check if message contains prescription
  const hasPrescription = message.message.includes("Prescription:");
  
  let mainText = message.message;
  let prescriptionText = "";
  
  if (hasPrescription) {
    const parts = message.message.split("Prescription:");
    mainText = parts[0].trim();
    prescriptionText = "Prescription: " + parts[1].trim();
  }
  
  return (
    <div 
      className={cn(
        "mb-4 max-w-[80%] animate-fade-in",
        isUser ? "ml-auto" : "mr-auto"
      )}
    >
      <div 
        className={cn(
          "rounded-lg p-3 shadow",
          isUser 
            ? "bg-healthcare-userBubble border border-green-200 rounded-tr-none" 
            : "bg-healthcare-botBubble border border-gray-200 rounded-tl-none"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          {isUser ? (
            <span className="font-bold text-sm">👤 You</span>
          ) : (
            <span className="font-bold text-sm">🤖 HealthCare Bot</span>
          )}
        </div>
        
        <div className="text-gray-800">
          <p className="font-semibold">{mainText}</p>
          
          {hasPrescription && (
            <p className="mt-2 text-sm font-medium">{prescriptionText}</p>
          )}
        </div>
      </div>
    </div>
  );
}
