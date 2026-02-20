'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ActionCard {
  type: 'tasks_created' | 'reprioritized';
  tasks?: any[];
  count?: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  taskAction?: {
    type: 'created' | 'reshuffled' | 'moved' | 'completed';
    taskIds?: string[];
    message?: string;
  };
  actionCards?: ActionCard[];
}

interface AppContextType {
  // AI Panel state
  aiPanelOpen: boolean;
  setAiPanelOpen: (open: boolean) => void;
  aiMessages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;

  // Settings drawer state
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;

  // Data refresh trigger
  refreshKey: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date(),
    };
    setAiMessages(prev => [...prev, newMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    setAiMessages([]);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <AppContext.Provider
      value={{
        aiPanelOpen,
        setAiPanelOpen,
        aiMessages,
        addMessage,
        clearMessages,
        settingsOpen,
        setSettingsOpen,
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    return {
      aiPanelOpen: false,
      setAiPanelOpen: () => {},
      aiMessages: [],
      addMessage: () => {},
      clearMessages: () => {},
      settingsOpen: false,
      setSettingsOpen: () => {},
      refreshKey: 0,
      triggerRefresh: () => {},
    } as AppContextType;
  }
  return context;
}

export type { ChatMessage };
