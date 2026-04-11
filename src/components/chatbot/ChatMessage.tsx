
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface MessageProps {
  message: {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
  };
}

export const ChatMessage = ({ message }: MessageProps) => {
  return (
    <div className={`flex space-x-3 ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
      <Avatar className="h-8 w-8">
        <AvatarFallback className={message.isBot ? 'bg-prisma-purple text-white' : 'bg-gray-200'}>
          {message.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex-1 max-w-xs ${message.isBot ? '' : 'text-right'}`}>
        <div
          className={`inline-block p-3 rounded-lg text-sm ${
            message.isBot
              ? 'bg-gray-200 text-gray-900'
              : 'bg-prisma-purple text-white'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};
