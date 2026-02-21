'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/app/context/AppProvider';

interface PriorityItem {
  task_id: string;
  title: string;
  understanding: string;
  ai_score: number;
  previous_score: number | null;
  reason: string;
  category: string;
}

interface Insight {
  emoji: string;
  title: string;
  body: string;
}

interface PlanItem {
  time: string;
  task_id: string | null;
  task_title: string;
  duration_minutes: number;
  reason: string;
}

interface ReviewData {
  priority_order: PriorityItem[];
  insights: Insight[];
  daily_plan: PlanItem[];
  summary: string;
}

type ReviewTab = 'priority' | 'insights' | 'plan';

const LOADING_MESSAGES = [
  'Analyzing your task list...',
  'Understanding strategic context...',
  'Evaluating dependencies...',
  'Calculating optimal order...',
  'Generating insights...',
  'Building your daily plan...',
];

export default function AIReviewPanel() {
  const { triggerRefresh } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [reviewState, setReviewState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [activeTab, setActiveTab] = useState<ReviewTab>('priority');
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [applying, setApplying] = useState(false);

  // Cycle loading messages
  useEffect(() => {
    if (reviewState !== 'loading') return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[idx]);
    }, 2000);
    return () => clearInterval(interval);
  }, [reviewState]);

  const runReview = async () => {
    setIsOpen(true);
    setReviewState('loading');
    setLoadingMsg(LOADING_MESSAGES[0]);

    try {
      const response = await fetch('/api/ai/review', { method: 'POST' });
      if (!response.ok) throw new Error('Review failed');
      const data = await response.json();
      setReviewData(data.review);
      setReviewState('ready');
      setActiveTab('priority');
    } catch (error) {
      console.error('AI Review error:', error);
      setReviewState('error');
    }
  };

  const applyAiOrder = async () => {
    if (!reviewData) return;
    setApplying(true);

    try {
      // Apply AI scores and ordering to tasks via individual updates
      for (let i = 0; i < reviewData.priority_order.length; i++) {
        const item = reviewData.priority_order[i];
        await fetch(`/api/tasks/${item.task_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            smart_score: item.ai_score,
            position_today: i + 1,
            is_do_now: i === 0,
            ai_reason: item.understanding,
          }),
        });
      }
      triggerRefresh();
    } catch (error) {
      console.error('Failed to apply AI order:', error);
    } finally {
      setApplying(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setReviewState('idle');
    setReviewData(null);
  };

  // Trigger button (exposed in header)
  const TriggerButton = () => (
    <button
      onClick={runReview}
      disabled={reviewState === 'loading'}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-sm disabled:opacity-50"
      style={{ background: 'linear-gradient(135deg, #C45D3E 0%, #E8845C 100%)' }}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
      </svg>
      AI Review
    </button>
  );

  if (!isOpen) {
    return <TriggerButton />;
  }

  const CATEGORY_COLORS: Record<string, string> = {
    'Tanaor': '#BFDBFE',
    'eCom Academy': '#BBF7D0',
    'Content': '#DDD6FE',
    'Investments': '#FED7AA',
    'Personal': '#FBCFE8',
    'New Venture': '#A5F3FC',
  };

  const tabs = [
    { id: 'priority' as ReviewTab, label: 'Priority Order', icon: '🎯' },
    { id: 'insights' as ReviewTab, label: 'Insights', icon: '⚡' },
    { id: 'plan' as ReviewTab, label: 'Daily Plan', icon: '📅' },
  ];

  return (
    <>
      {/* Full-screen overlay */}
      <div className="fixed inset-0 z-50 bg-[#FAF8F5] dark:bg-[#1D1B17] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-[#FAF8F5]/90 dark:bg-[#1D1B17]/90 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between px-5 py-3">
            <button
              onClick={close}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              Back
            </button>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#C45D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
              <span className="text-sm font-bold text-gray-900 dark:text-[#F0EDE8]">AI Review</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#C45D3E]/10 text-[#C45D3E] font-medium">
                Powered by Claude
              </span>
            </div>
            <div className="w-16" /> {/* spacer */}
          </div>

          {/* Tabs — only show when ready */}
          {reviewState === 'ready' && (
            <div className="flex px-5 gap-1 pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#C45D3E]/10 text-[#C45D3E]'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 py-4 pb-24">
          {/* Loading state */}
          {reviewState === 'loading' && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C45D3E]/10 to-[#E8845C]/10 flex items-center justify-center mb-6 ai-review-pulse">
                <svg className="w-8 h-8 text-[#C45D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Deep Analysis in Progress
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 transition-all duration-500">
                {loadingMsg}
              </p>
              <div className="mt-6 w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full ai-review-loading-bar" style={{ background: 'linear-gradient(90deg, #C45D3E, #E8845C)' }} />
              </div>
            </div>
          )}

          {/* Error state */}
          {reviewState === 'error' && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Review Failed</p>
              <p className="text-xs text-gray-400 mb-4">Something went wrong. Please try again.</p>
              <button
                onClick={runReview}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#C45D3E] hover:bg-[#B04E32] transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Ready state — Priority Order tab */}
          {reviewState === 'ready' && reviewData && activeTab === 'priority' && (
            <div className="space-y-3">
              {/* Summary */}
              {reviewData.summary && (
                <div className="glass-card px-4 py-3 mb-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {reviewData.summary}
                  </p>
                </div>
              )}

              {/* Apply button */}
              <button
                onClick={applyAiOrder}
                disabled={applying}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-md"
                style={{ background: 'linear-gradient(135deg, #C45D3E 0%, #E8845C 100%)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                {applying ? 'Applying...' : 'Apply AI Order'}
              </button>

              {/* Task list */}
              {reviewData.priority_order.map((item, idx) => (
                <div key={item.task_id} className="glass-card p-4 task-enter" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="flex items-start gap-3">
                    {/* Rank */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      idx === 0 ? 'bg-[#C45D3E] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title + category */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-[#F0EDE8] truncate">
                          {item.title}
                        </span>
                        {item.category && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                            style={{
                              backgroundColor: (CATEGORY_COLORS[item.category] || '#D1D5DB') + '40',
                              color: '#555',
                            }}
                          >
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* AI understanding */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">
                        {item.understanding}
                      </p>

                      {/* Score + reason */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-[#C45D3E]">{item.ai_score}</span>
                          {item.previous_score && item.previous_score !== item.ai_score && (
                            <span className="text-[10px] text-gray-400">
                              {item.ai_score > item.previous_score ? '↑' : '↓'}{item.previous_score}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 truncate">{item.reason}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Insights tab */}
          {reviewState === 'ready' && reviewData && activeTab === 'insights' && (
            <div className="space-y-3">
              {reviewData.insights.map((insight, idx) => (
                <div key={idx} className="glass-card p-4 task-enter" style={{ animationDelay: `${idx * 80}ms` }}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{insight.emoji}</span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-[#F0EDE8] mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {insight.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Daily Plan tab */}
          {reviewState === 'ready' && reviewData && activeTab === 'plan' && (
            <div className="space-y-2">
              <button
                onClick={applyAiOrder}
                disabled={applying}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-md mb-3"
                style={{ background: 'linear-gradient(135deg, #C45D3E 0%, #E8845C 100%)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {applying ? 'Applying...' : 'Apply This Plan'}
              </button>

              {reviewData.daily_plan.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 task-enter" style={{ animationDelay: `${idx * 60}ms` }}>
                  {/* Time column */}
                  <div className="w-16 flex-shrink-0 text-right">
                    <span className="text-xs font-bold text-[#C45D3E]">{item.time}</span>
                    <br />
                    <span className="text-[10px] text-gray-400">{item.duration_minutes}min</span>
                  </div>

                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      idx === 0 ? 'bg-[#C45D3E]' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                    {idx < reviewData.daily_plan.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 min-h-[40px]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-[#F0EDE8] mb-0.5">
                      {item.task_title}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {item.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
