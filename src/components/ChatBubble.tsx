
import { ChatMessage } from '@/types';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === 'You';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`${
          isUser
            ? 'bg-healthcare-primary text-white rounded-tl-xl rounded-tr-sm rounded-bl-xl rounded-br-xl'
            : 'bg-white border border-gray-200 rounded-tl-sm rounded-tr-xl rounded-bl-xl rounded-br-xl'
        } p-4 max-w-[80%] shadow-sm`}
      >
        <p className="whitespace-pre-wrap">{message.message}</p>
        <div
          className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
