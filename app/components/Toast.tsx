'use client';

import { useEffect, useState } from 'react';

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'info' | 'error';
}

let addToastFn: ((text: string, type?: 'success' | 'info' | 'error') => void) | null = null;

export function showToast(text: string, type: 'success' | 'info' | 'error' = 'success') {
  if (addToastFn) addToastFn(text, type);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    addToastFn = (text, type = 'success') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, text, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };
    return () => { addToastFn = null; };
  }, []);

  const bgColors = {
    success: 'bg-green-500/90',
    info: 'bg-primary/90',
    error: 'bg-red-500/90',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast ${bgColors[t.type]} text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium backdrop-blur-sm`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
