'use client';

import { useEffect, useState } from 'react';

interface AIResponseProps {
  message: string | null;
  onDismiss?: () => void;
}

export default function AIResponse({ message, onDismiss }: AIResponseProps) {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    setIsVisible(!!message);
    if (message) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message || !isVisible) return null;

  return (
    <div
      className="ai-pill fixed bottom-24 left-4 right-4 bg-card rounded-full px-4 py-2 flex items-center justify-between text-sm text-gray-700 shadow-sm animate-fade-in"
      onClick={() => {
        setIsVisible(false);
        onDismiss?.();
      }}
    >
      <span>{message}</span>
      <button
        className="ml-2 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
