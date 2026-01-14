import React from 'react';
import { Pill, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-4' : 'mr-4'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white' 
              : 'bg-gradient-to-br from-secondary-500 to-secondary-600 text-white'
          }`}>
            {isUser ? <User size={20} /> : <Pill size={20} />}
          </div>
        </div>
        
        {/* Message Content */}
        <div className={`px-6 py-4 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white' 
            : 'bg-white text-gray-900'
        }`}>
          <div className={`prose prose-sm max-w-none ${
            isUser ? 'prose-invert' : ''
          }`}>
            {message.content.includes('**') ? (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            ) : (
              message.content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < message.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;