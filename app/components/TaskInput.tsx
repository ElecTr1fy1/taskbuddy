'use client';

import { useState } from 'react';

interface TaskInputProps {
  onSubmit: (text: string) => Promise<void>;
  loading: boolean;
}

export default function TaskInput({ onSubmit, loading }: TaskInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    await onSubmit(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a task... e.g. &quot;Call lawyer about contract, urgent, 10 min&quot;"
        className="input-glow flex-1 bg-surface-light border border-gray-700/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder-gray-500"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3 rounded-xl text-sm font-medium transition-all active:scale-95"
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          'Add'
        )}
      </button>
    </form>
  );
}
