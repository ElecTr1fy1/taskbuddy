'use client';

import { useState } from 'react';
import { RecommendResponse } from '@/lib/types';

export default function RecommendPanel() {
  const [energy, setEnergy] = useState('');
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendResponse | null>(null);

  const energyOptions = [
    { value: 'low', label: '😴 Low', desc: 'Tired, need easy tasks' },
    { value: 'medium', label: '😊 Medium', desc: 'Normal, can focus' },
    { value: 'high', label: '🔥 High', desc: 'Energetic, deep work' },
  ];

  const timeOptions = [
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
  ];

  const handleRecommend = async () => {
    if (!energy || !time) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available_minutes: time, energy }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ message: 'Something went wrong. Try again!', recommended: [], time_plan: [], reasoning: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Energy selector */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block">How are you feeling?</label>
        <div className="grid grid-cols-3 gap-2">
          {energyOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setEnergy(opt.value)}
              className={`p-3 rounded-xl text-center transition-all ${
                energy === opt.value
                  ? 'bg-primary/20 border-2 border-primary'
                  : 'bg-surface-light border-2 border-transparent hover:border-gray-600'
              }`}
            >
              <div className="text-xl">{opt.label.split(' ')[0]}</div>
              <div className="text-xs text-gray-400 mt-1">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time selector */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block">How much time do you have?</label>
        <div className="flex gap-2">
          {timeOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setTime(opt.value)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                time === opt.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-light text-gray-300 hover:bg-surface-lighter'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Go button */}
      <button
        onClick={handleRecommend}
        disabled={!energy || !time || loading}
        className="w-full py-3 bg-gradient-to-r from-primary to-primary-light rounded-xl font-medium text-sm disabled:opacity-40 transition-all active:scale-[0.98] hover:shadow-lg hover:shadow-primary/20"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing your tasks...
          </span>
        ) : (
          '🎯 Get Recommendations'
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="bg-surface-light rounded-xl p-4 space-y-3 animate-fade-in">
          <p className="text-sm whitespace-pre-line">{result.message}</p>

          {result.time_plan && result.time_plan.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-gray-400 font-medium">📋 Your Plan:</p>
              {result.time_plan.map((step, i) => (
                <div key={i} className="text-sm text-gray-300 pl-3 border-l-2 border-primary/30">
                  {step}
                </div>
              ))}
            </div>
          )}

          {result.recommended && result.recommended.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {result.recommended.map(t => (
                <span key={t.id} className="text-xs bg-primary/20 text-primary-light px-2.5 py-1 rounded-full">
                  {t.title}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
