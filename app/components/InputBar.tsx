'use client';

import { useState, useRef } from 'react';

interface InputBarProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function InputBar({
  onSubmit,
  isLoading = false,
  placeholder = 'Add a task or ask me anything...',
}: InputBarProps) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const micPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleMicMouseDown = () => {
    micPressTimeoutRef.current = setTimeout(() => {
      setIsRecording(true);
    }, 200);
  };

  const handleMicMouseUp = () => {
    if (micPressTimeoutRef.current) {
      clearTimeout(micPressTimeoutRef.current);
    }
    if (isRecording) {
      setIsRecording(false);
      // Actual Web Speech API implementation would happen here
    }
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-white">
      {/* AI Response pill (placeholder - actual AIResponse component would go above) */}

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 rounded-full bg-card border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C45D3E] text-sm"
        />

        {/* Mic button */}
        <button
          type="button"
          onMouseDown={handleMicMouseDown}
          onMouseUp={handleMicMouseUp}
          onMouseLeave={handleMicMouseUp}
          onTouchStart={handleMicMouseDown}
          onTouchEnd={handleMicMouseUp}
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? 'bg-[#C45D3E] animate-pulse-mic'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          aria-label="Voice input"
        >
          <svg
            className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-[#C45D3E]'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
          </svg>
        </button>

        {/* Send button */}
        {text.trim() && (
          <button
            type="submit"
            disabled={isLoading}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C45D3E] hover:bg-[#A84C2F] disabled:opacity-50 flex items-center justify-center transition-colors"
            aria-label="Send"
          >
            {isLoading ? (
              <svg
                className="w-5 h-5 text-white animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16345539 C3.50612381,0.9 2.40999507,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99701575 L3.03521743,10.4380088 C3.03521743,10.5951061 3.19218622,10.7522035 3.50612381,10.7522035 L16.6915026,11.5376904 C16.6915026,11.5376904 17.1624089,11.5376904 17.1624089,12.0089825 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
              </svg>
            )}
          </button>
        )}
      </form>
    </div>
  );
}
