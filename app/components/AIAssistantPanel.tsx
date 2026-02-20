'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp, ChatMessage } from '@/app/context/AppProvider';
import { useAuth } from '@/app/components/AuthProvider';

export default function AIAssistantPanel() {
  const { user } = useAuth();
  const {
    aiPanelOpen,
    setAiPanelOpen,
    aiMessages,
    addMessage,
    triggerRefresh,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (aiPanelOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, aiPanelOpen]);

  // Focus input when panel opens
  useEffect(() => {
    if (aiPanelOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [aiPanelOpen]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading || !user) return;

    const userText = inputText.trim();
    setInputText('');

    // Add user message
    addMessage({ role: 'user', content: userText });
    setIsLoading(true);

    try {
      // Build conversation history for the API
      const conversationHistory = aiMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      // Try the chat endpoint first
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          conversation_history: conversationHistory,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addMessage({
          role: 'assistant',
          content: data.response,
        });
      } else {
        // Fallback: try the parse endpoint for task creation
        const parseResponse = await fetch('/api/ai/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: userText,
            user_id: user.id,
            source: 'app_text',
          }),
        });

        const parseData = await parseResponse.json();

        if (parseResponse.ok) {
          addMessage({
            role: 'assistant',
            content: parseData.response || 'Done!',
            taskAction: parseData.type === 'task' ? {
              type: 'created',
              message: `Created task: ${parseData.task?.title}`,
            } : undefined,
          });

          // Trigger task list refresh
          if (parseData.type === 'task' || parseData.type === 'command') {
            triggerRefresh();
          }
        } else {
          addMessage({
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
          });
        }
      }
    } catch (error) {
      console.error('AI chat error:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, user, aiMessages, addMessage, triggerRefresh]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Touch drag handlers
  const handleDragStart = (e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY);
  };

  const handleDragEnd = (e: React.TouchEvent) => {
    if (dragStartY === null) return;
    const diff = dragStartY - e.changedTouches[0].clientY;

    if (diff > 50) {
      // Dragged up → open
      setAiPanelOpen(true);
    } else if (diff < -50) {
      // Dragged down → close
      setAiPanelOpen(false);
    }
    setDragStartY(null);
  };

  return (
    <>
      {/* Backdrop when expanded */}
      {aiPanelOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setAiPanelOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ease-out ${
          aiPanelOpen
            ? 'bottom-16 h-[60vh] rounded-t-3xl shadow-2xl'
            : 'bottom-16 h-14'
        } bg-white dark:bg-[#2A2724] border-t border-gray-200 dark:border-gray-600`}
      >
        {/* Drag handle + collapsed bar */}
        <div
          className="flex items-center justify-center cursor-grab active:cursor-grabbing"
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
          onClick={() => setAiPanelOpen(!aiPanelOpen)}
        >
          {/* Drag indicator */}
          <div className="pt-2 pb-1">
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
        </div>

        {!aiPanelOpen ? (
          /* Collapsed state */
          <div
            className="flex items-center gap-3 px-5 pb-2 cursor-pointer"
            onClick={() => setAiPanelOpen(true)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C45D3E] to-[#E8845C] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
              </svg>
            </div>
            <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">
              Ask your AI assistant...
            </span>
          </div>
        ) : (
          /* Expanded state */
          <div className="flex flex-col h-[calc(100%-28px)]">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {aiMessages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#C45D3E]/10 to-[#E8845C]/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#C45D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                    Your AI task assistant
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs max-w-[240px] mx-auto">
                    Try: "I have 20 minutes before my meeting" or "Brain dump: call Lior, review Q3"
                  </p>
                </div>
              )}

              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#C45D3E] text-white rounded-br-md'
                        : 'bg-gray-100 dark:bg-[#1D1B17] text-gray-800 dark:text-gray-200 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                    {msg.taskAction && (
                      <div className="mt-2 pt-2 border-t border-white/20 text-xs opacity-80">
                        {msg.taskAction.message}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-[#1D1B17] px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="flex-shrink-0 px-4 pb-3 pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#1D1B17] rounded-2xl px-4 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm text-gray-900 dark:text-[#F0EDE8] placeholder:text-gray-400 outline-none"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || isLoading}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C45D3E] flex items-center justify-center text-white disabled:opacity-30 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
