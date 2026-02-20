'use client';

import { useEffect, useState, useCallback } from 'react';
import { UserContext, AILearning, Category, DEFAULT_CONTEXT, DEFAULT_CATEGORIES } from '@/lib/types';
import { useAuth } from '@/app/components/AuthProvider';
import { useTheme } from '@/app/components/ThemeProvider';
import { useApp } from '@/app/context/AppProvider';
import { useRouter } from 'next/navigation';

export default function SettingsDrawer() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const { isDark, toggle } = useTheme();
  const { settingsOpen, setSettingsOpen } = useApp();

  const [userContext, setUserContext] = useState<string>('');
  const [learnings, setLearnings] = useState<AILearning[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSavingContext, setIsSavingContext] = useState(false);
  const [contextSaved, setContextSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load data when drawer opens
  const loadData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [contextRes, learningsRes, categoriesRes] = await Promise.all([
        fetch('/api/context').catch(() => null),
        fetch('/api/learnings').catch(() => null),
        fetch('/api/categories').catch(() => null),
      ]);

      if (contextRes?.ok) {
        const contextData = await contextRes.json();
        setUserContext(contextData.context_text || DEFAULT_CONTEXT);
      } else {
        setUserContext(DEFAULT_CONTEXT);
      }

      if (learningsRes?.ok) {
        const learningsData = await learningsRes.json();
        setLearnings(learningsData.learnings || []);
      }

      if (categoriesRes?.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories || DEFAULT_CATEGORIES.map((cat, idx) => ({
          id: `cat-${idx}`,
          user_id: user.id,
          name: cat.name,
          color: cat.color,
          sort_order: idx,
          created_at: new Date().toISOString(),
        })));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (settingsOpen) {
      loadData();
    }
  }, [settingsOpen, loadData]);

  const handleSaveContext = async () => {
    setIsSavingContext(true);
    try {
      const response = await fetch('/api/context', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context_text: userContext }),
      });
      if (response.ok) {
        setContextSaved(true);
        setTimeout(() => setContextSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save context:', error);
    } finally {
      setIsSavingContext(false);
    }
  };

  const handleDeleteLearning = async (id: string) => {
    try {
      await fetch(`/api/learnings?id=${id}`, { method: 'DELETE' });
      setLearnings(learnings.filter(l => l.id !== id));
    } catch (error) {
      console.error('Failed to delete learning:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setSettingsOpen(false);
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (!settingsOpen) return null;

  const isOwner = profile?.role === 'owner';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setSettingsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#FAF8F5] dark:bg-[#1D1B17] z-50 overflow-y-auto shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 bg-[#FAF8F5] dark:bg-[#1D1B17] border-b border-gray-200 dark:border-gray-700 z-10">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-[#F0EDE8]">Settings</h2>
            <button
              onClick={() => setSettingsOpen(false)}
              className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-5 space-y-5 pb-24">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {isOwner && (
                <>
                  {/* My Context */}
                  <div className="bg-white dark:bg-[#2A2724] rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-bold text-gray-900 dark:text-[#F0EDE8] mb-2">My Context</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Helps the AI understand your priorities and work style.
                    </p>
                    <textarea
                      value={userContext}
                      onChange={(e) => setUserContext(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1D1B17] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-[#F0EDE8] focus:outline-none focus:ring-2 focus:ring-[#C45D3E] resize-none"
                    />
                    <button
                      onClick={handleSaveContext}
                      disabled={isSavingContext}
                      className="mt-3 w-full bg-[#C45D3E] hover:bg-[#A84C2F] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
                    >
                      {isSavingContext ? 'Saving...' : contextSaved ? 'Saved!' : 'Save Context'}
                    </button>
                  </div>

                  {/* AI Learnings */}
                  {learnings.filter(l => l.active).length > 0 && (
                    <div className="bg-white dark:bg-[#2A2724] rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                      <h3 className="text-base font-bold text-gray-900 dark:text-[#F0EDE8] mb-2">AI Learnings</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Remove any that are incorrect.
                      </p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {learnings.filter(l => l.active).map(learning => (
                          <div key={learning.id} className="flex items-start justify-between gap-2 p-3 bg-gray-50 dark:bg-[#1D1B17] rounded-xl">
                            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{learning.learning}</p>
                            <button
                              onClick={() => handleDeleteLearning(learning.id)}
                              className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  <div className="bg-white dark:bg-[#2A2724] rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-bold text-gray-900 dark:text-[#F0EDE8] mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <span
                          key={cat.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"
                          style={{ backgroundColor: cat.color + '33' }}
                        >
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Account */}
              <div className="bg-white dark:bg-[#2A2724] rounded-2xl p-4 border border-gray-200 dark:border-gray-700 space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-[#F0EDE8]">Account</h3>

                {user && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                )}

                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                  <button
                    onClick={toggle}
                    className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors ${
                      isDark ? 'bg-[#C45D3E]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        isDark ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-semibold rounded-xl transition-colors"
                >
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
