import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronRight, Search, AlertCircle, Stethoscope } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { questionTemplates } from '../../data/questions';
import { QuestionType } from '../../types';
import ChatMessage from './ChatMessage';
import LoadingSpinner from '../ui/LoadingSpinner';

const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [chatMode, setChatMode] = useState<'medicine' | 'general'>('medicine');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    activeConversation, 
    sendMessage, 
    selectedMedicine,
    sendPredefinedQuestion,
    sendGeneralHealthQuery,
    isLoading
  } = useChatStore();
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    if (chatMode === 'general') {
      sendGeneralHealthQuery(inputValue);
    } else {
      sendMessage(inputValue);
    }
    setInputValue('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleQuestionClick = (questionType: QuestionType) => {
    sendPredefinedQuestion(questionType);
  };
  
  if (!activeConversation) {
    return null;
  }
  
  return (
    <div className="flex flex-col h-full relative bg-gray-50">
      {/* Chat Mode Toggle */}
      <div className="bg-white px-6 py-3 border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Chat Mode:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setChatMode('medicine')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  chatMode === 'medicine'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Medicine Info
              </button>
              <button
                onClick={() => setChatMode('general')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  chatMode === 'general'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Health Assistant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Medicine Info Header - Only show in medicine mode */}
      {chatMode === 'medicine' && selectedMedicine && (
        <div className="p-6 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex justify-between items-start max-w-3xl mx-auto">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selectedMedicine.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedMedicine.category}
                </span>
                <span className="text-sm text-gray-600">
                  by {selectedMedicine.manufacturer}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                ₹{selectedMedicine.price.toFixed(2)}
              </p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedMedicine.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedMedicine.inStock ? '● In Stock' : '● Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Question Templates - Only show in medicine mode */}
      {chatMode === 'medicine' && selectedMedicine && (
        <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Questions</h3>
            <div className="flex flex-wrap gap-2">
              {questionTemplates.map(question => (
                <button
                  key={question.id}
                  onClick={() => handleQuestionClick(question.id)}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all
                    bg-white border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Search size={16} className="mr-2" />
                  {question.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {activeConversation.messages.length === 0 ? (
            <div className="text-center py-12">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                chatMode === 'general' ? 'bg-secondary-100' : 'bg-primary-100'
              }`}>
                {chatMode === 'general' ? (
                  <Stethoscope size={32} className="text-secondary-600" />
                ) : (
                  <AlertCircle size={32} className="text-primary-600" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {chatMode === 'general' 
                  ? 'Ask about your health' 
                  : selectedMedicine 
                    ? `Ask about ${selectedMedicine.name}`
                    : 'Select a Medicine'
                }
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {chatMode === 'general' 
                  ? 'Ask me about symptoms, general health questions, or get basic medical information. Remember to consult a healthcare professional for serious concerns.'
                  : selectedMedicine
                    ? 'Get detailed information about this medicine including dosage, side effects, and alternatives. Use the quick questions above or type your own query.'
                    : 'Choose a medicine from the list on the left to view information and ask questions about it.'
                }
              </p>
            </div>
          ) : (
            activeConversation.messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="small" />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative rounded-lg shadow-sm">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                chatMode === 'general' 
                  ? "Ask about symptoms, health concerns, or general medical questions..."
                  : `Ask about ${selectedMedicine?.name || 'this medicine'}...`
              }
              className="block w-full pl-4 pr-12 py-3 text-base rounded-lg border-0 ring-1 ring-inset ring-gray-300
                focus:ring-2 focus:ring-primary-500 resize-none placeholder:text-gray-400"
              rows={1}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full
                text-primary-600 hover:text-primary-800 hover:bg-primary-50 disabled:text-gray-400
                disabled:hover:bg-transparent transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="mt-3 text-xs text-center text-gray-500">
            {chatMode === 'general' 
              ? 'PharmaVault provides general health information. Always consult a healthcare professional for medical advice.'
              : 'PharmaVault provides general medicine information. Always consult a healthcare professional.'
            }
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;