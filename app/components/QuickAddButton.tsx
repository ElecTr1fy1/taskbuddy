'use client';

import { useState, useRef, useEffect } from 'react';

interface QuickAddButtonProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

export default function QuickAddButton({ onSubmit, isLoading = false }: QuickAddButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = () => {
    if (!text.trim() || isLoading) return;
    onSubmit(text.trim());
    setText('');
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
    if (e.key === 'Escape') { setText(''); setIsExpanded(false); }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#2A2724] rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:border-[#C45D3E] hover:text-[#C45D3E] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span className="text-sm font-medium">Add a task...</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-[#2A2724] rounded-2xl border border-[#C45D3E] px-4 py-2 shadow-sm">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (!text.trim()) setIsExpanded(false); }}
        placeholder="What do you need to do?"
        className="flex-1 bg-transparent text-sm text-gray-900 dark:text-[#F0EDE8] placeholder:text-gray-400 outline-none"
        disabled={isLoading}
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || isLoading}
        className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C45D3E] flex items-center justify-center text-white disabled:opacity-40 transition-opacity"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>
        )}
      </button>
    </div>
  );
}
