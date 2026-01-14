import { create } from 'zustand';
import { Conversation, ChatMessage, Medicine, QuestionType } from '../types';
import { getMedicineByName } from '../data/medicines';
import { questionTemplates } from '../data/questions';

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  selectedMedicine: Medicine | null;
  isLoading: boolean;

  // Actions
  createConversation: () => void;
  setActiveConversation: (id: string) => void;
  selectMedicine: (medicine: Medicine | null) => void;
  sendMessage: (content: string) => void;
  sendPredefinedQuestion: (questionType: QuestionType) => void;
  sendGeneralHealthQuery: (content: string) => void;
  clearActiveConversation: () => void;
}

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  selectedMedicine: null,
  isLoading: false,

  createConversation: () => {
    const newConversation: Conversation = {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      type: 'general'
    };

    set(state => ({
      conversations: [newConversation, ...state.conversations],
      activeConversation: newConversation
    }));
  },

  setActiveConversation: (id: string) => {
    const { conversations } = get();
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      set({ activeConversation: conversation });
    }
  },

  selectMedicine: (medicine: Medicine | null) => {
    set({ selectedMedicine: medicine });
  },

  sendMessage: async (content: string) => {
    const { activeConversation, selectedMedicine } = get();

    if (!activeConversation) {
      // Create a conversation if none exists
      const newConversation: Conversation = {
        id: generateId(),
        title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        type: 'general'
      };

      set(state => ({
        conversations: [newConversation, ...state.conversations],
        activeConversation: newConversation
      }));

      // Re-run sendMessage now that we have an active conversation
      get().sendMessage(content);
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
      relatedMedicine: selectedMedicine?.id,
    };

    set(state => {
      const updatedConversation = {
        ...state.activeConversation!,
        messages: [...state.activeConversation!.messages, userMessage],
        updatedAt: new Date()
      };

      return {
        activeConversation: updatedConversation,
        conversations: state.conversations.map(c =>
          c.id === updatedConversation.id ? updatedConversation : c
        ),
        isLoading: true
      };
    });

    try {
      let responseText = '';

      // If we have a selected medicine, use it as context for Gemini
      if (selectedMedicine) {
        const { generateGeminiResponse } = await import('../services/geminiService');
        responseText = await generateGeminiResponse(content, [selectedMedicine]);
      } else {
        // Fallback to general health response which searches for context
        // OR try to detect medicine in the query first (legacy logic adapted)

        // Extract medicine name from message if no medicine is selected
        const lines = content.split('\n');
        let detectedMedicine: Medicine | undefined;

        for (const line of lines) {
          // Check for medicine mentions
          // Enhanced regex to catch more natural language mentions
          const medicineMatch = /about|for|is\s+(\w+)/.exec(line) || /\b(\w+)\b/.exec(line);
          if (medicineMatch) {
            // Very basic matching, might need loop over all medicines if this is too broad
            // but let's try to find if any word matches a medicine name
            const words = content.split(' ');
            for (const word of words) {
              detectedMedicine = getMedicineByName(word);
              if (detectedMedicine) break;
            }
          }
          if (detectedMedicine) break;
        }

        if (detectedMedicine) {
          set({ selectedMedicine: detectedMedicine });
          const { generateGeminiResponse } = await import('../services/geminiService');
          // We found a medicine, answered based on it
          responseText = await generateGeminiResponse(content, [detectedMedicine]);
        } else {
          // Treat as general query
          const { generateHealthResponse } = await import('../utils/healthAssistant');
          responseText = await generateHealthResponse(content);
        }
      }

      const botMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        relatedMedicine: selectedMedicine?.id,
      };

      set(state => {
        const updatedConversation = {
          ...state.activeConversation!,
          messages: [...state.activeConversation!.messages, botMessage],
          updatedAt: new Date()
        };

        return {
          activeConversation: updatedConversation,
          conversations: state.conversations.map(c =>
            c.id === updatedConversation.id ? updatedConversation : c
          ),
          isLoading: false
        };
      });
    } catch (error) {
      console.error("Error in sendMessage:", error);
      set({ isLoading: false });
    }
  },

  sendGeneralHealthQuery: async (content: string) => {
    const { activeConversation, selectedMedicine } = get();

    if (!activeConversation) {
      // Create a conversation if none exists
      const newConversation: Conversation = {
        id: generateId(),
        title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        type: 'general'
      };

      set(state => ({
        conversations: [newConversation, ...state.conversations],
        activeConversation: newConversation
      }));

      // Re-run sendGeneralHealthQuery now that we have an active conversation
      get().sendGeneralHealthQuery(content);
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
      relatedMedicine: selectedMedicine?.id // Typo fix: removed undefined variable
    };

    set(state => {
      const updatedConversation = {
        ...state.activeConversation!,
        messages: [...state.activeConversation!.messages, userMessage],
        updatedAt: new Date()
      };

      return {
        activeConversation: updatedConversation,
        conversations: state.conversations.map(c =>
          c.id === updatedConversation.id ? updatedConversation : c
        ),
        isLoading: true
      };
    });

    try {
      // Generate health response
      const { generateHealthResponse } = await import('../utils/healthAssistant');
      const responseText = await generateHealthResponse(content);

      const botMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      set(state => {
        const updatedConversation = {
          ...state.activeConversation!,
          messages: [...state.activeConversation!.messages, botMessage],
          updatedAt: new Date()
        };

        return {
          activeConversation: updatedConversation,
          conversations: state.conversations.map(c =>
            c.id === updatedConversation.id ? updatedConversation : c
          ),
          isLoading: false
        };
      });
    } catch (error) {
      console.error("Error in sendGeneralHealthQuery:", error);
      set({ isLoading: false });
    }
  },

  sendPredefinedQuestion: (questionType: QuestionType) => {
    const { selectedMedicine } = get();
    if (!selectedMedicine) {
      return;
    }

    const template = questionTemplates.find(t => t.id === questionType);
    if (!template) {
      return;
    }

    get().sendMessage(template.text);
  },

  clearActiveConversation: () => {
    set({ activeConversation: null });
  }
}));