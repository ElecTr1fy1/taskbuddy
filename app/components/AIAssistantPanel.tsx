'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp, ChatMessage } from '@/app/context/AppProvider';
import { useAuth } from '@/app/components/AuthProvider';

const SUGGESTION_CHIPS = [
  'What should I focus on?',
  'Brain dump',
  'Reprioritize my day',
  'What\'s overdue?',
];

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
  const [toast, setToast] = useState<string | null>(null);
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

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSend = useCallback(async (overrideText?: string) => {
    const text = overrideText || inputText.trim();
    if (!text || isLoading || !user) return;

    if (!overrideText) setInputText('');

    // Add user message
    addMessage({ role: 'user', content: text });
    setIsLoading(true);

    try {
      // Build conversation history for the API
      const conversationHistory = aiMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversation_history: conversationHistory,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const actionsTaken = data.actions_taken || [];

        // Build action summary for the message
        let actionCards: ChatMessage['actionCards'] = undefined;
        const toastParts: string[] = [];

        const createdTasks = actionsTaken.filter((a: any) => a.type === 'task_created');
        const reprioritized = actionsTaken.find((a: any) => a.type === 'reprioritized' || a.type === 'auto_reprioritized');
        const completedTasks = actionsTaken.filter((a: any) => a.type === 'task_completed');
        const rescheduled = actionsTaken.filter((a: any) => a.type === 'tasks_rescheduled');

        if (createdTasks.length > 0 || reprioritized || completedTasks.length > 0 || rescheduled.length > 0) {
          actionCards = [];

          if (createdTasks.length > 0) {
            actionCards.push({
              type: 'tasks_created',
              tasks: createdTasks.map((a: any) => a.task),
            });
            toastParts.push(`Created ${createdTasks.length} task${createdTasks.length > 1 ? 's' : ''}`);
          }

          if (reprioritized) {
            actionCards.push({
              type: 'reprioritized',
              count: reprioritized.task_count,
            });
            toastParts.push('Reprioritized your day');
          }

          if (completedTasks.length > 0) {
            toastParts.push(`Completed ${completedTasks.length} task${completedTasks.length > 1 ? 's' : ''}`);
          }

          if (rescheduled.length > 0) {
            toastParts.push('Rescheduled tasks');
          }

          // Trigger refresh since actions were taken
          triggerRefresh();
        }

        addMessage({
          role: 'assistant',
          content: data.response,
          actionCards,
        });

        if (toastParts.length > 0) {
          setToast(toastParts.join(' · '));
        }
      } else {
        addMessage({
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        });
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
      setAiPanelOpen(true);
    } else if (diff < -50) {
      setAiPanelOpen(false);
    }
    setDragStartY(null);
  };

  const renderActionCards = (cards: NonNullable<ChatMessage['actionCards']>) => {
    return cards.map((card, i) => {
      if (card.type === 'tasks_created') {
        return (
          <div key={i} className="mt-2.5 space-y-1.5">
            {(card.tasks || []).map((task: any, j: number) => (
              <div key={j} className="flex items-center gap-2.5 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-xl px-3 py-2 border border-[#C45D3E]/15">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {task.category && (
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">{task.category}</span>
                    )}
                    {task.estimated_minutes && (
                      <span className="text-[10px] text-gray-400">{task.estimated_minutes}m</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }
      if (card.type === 'reprioritized') {
        return (
          <div key={i} className="mt-2.5 flex items-center gap-2 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-xl px-3 py-2 border border-blue-200/50 dark:border-blue-500/20">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-3L16.5 18m0 0L12 13.5m4.5 4.5V6" />
              </svg>
            </div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Reprioritized {card.count} tasks
            </p>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-gray-900/90 dark:bg-white/90 text-white dark:text-gray-900 text-xs font-medium px-4 py-2.5 rounded-full backdrop-blur-lg shadow-lg flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-green-400 dark:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            {toast}
          </div>
        </div>
      )}

      {/* Backdrop when expanded */}
      {aiPanelOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30"
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
        } bg-white/95 dark:bg-[#2A2724]/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-600/50`}
      >
        {/* Drag handle + collapsed bar */}
        <div
          className="flex items-center justify-center cursor-grab active:cursor-grabbing"
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
          onClick={() => setAiPanelOpen(!aiPanelOpen)}
        >
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C45D3E] to-[#E8845C] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#C45D3E]/20">
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
                <div className="text-center py-6">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#C45D3E]/10 to-[#E8845C]/10 flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#C45D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold mb-1">
                    Your AI chief of staff
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs max-w-[260px] mx-auto leading-relaxed">
                    I can create tasks, reprioritize your day, and help you stay focused. Just tell me what&apos;s on your mind.
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
                        ? 'bg-[#C45D3E] text-white rounded-br-md shadow-sm'
                        : 'bg-gray-100/80 dark:bg-[#1D1B17]/80 text-gray-800 dark:text-gray-200 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                    {msg.actionCards && renderActionCards(msg.actionCards)}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100/80 dark:bg-[#1D1B17]/80 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-[#C45D3E]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-[#C45D3E]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-[#C45D3E]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion chips */}
            {aiMessages.length === 0 && !isLoading && (
              <div className="flex-shrink-0 px-4 pb-2">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {SUGGESTION_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSend(chip)}
                      className="flex-shrink-0 text-xs font-medium text-[#C45D3E] bg-[#C45D3E]/8 hover:bg-[#C45D3E]/15 px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap border border-[#C45D3E]/10"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="flex-shrink-0 px-4 pb-3 pt-2 border-t border-gray-100/50 dark:border-gray-700/50">
              <div className="flex items-center gap-2 bg-gray-50/80 dark:bg-[#1D1B17]/80 rounded-2xl px-4 py-2 backdrop-blur-sm">
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
                  onClick={() => handleSend()}
                  disabled={!inputText.trim() || isLoading}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C45D3E] flex items-center justify-center text-white disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-sm shadow-[#C45D3E]/30"
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
