'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext, AILearning, Category, DEFAULT_CONTEXT, DEFAULT_CATEGORIES } from '@/lib/types';
import { useAuth } from '@/app/components/AuthProvider';
import { useTheme } from '@/app/components/ThemeProvider';
import BottomNav from '@/app/components/BottomNav';

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { isDark, toggle } = useTheme();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [userContext, setUserContext] = useState<string>('');
  const [learnings, setLearnings] = useState<AILearning[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSavingContext, setIsSavingContext] = useState(false);
  const [contextSaved, setContextSaved] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load settings data
  const loadData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [contextRes, learningsRes, categoriesRes] = await Promise.all([
        fetch('/api/context').catch(() => null),
        fetch('/api/learnings').catch(() => null),
        fetch('/api/categories').catch(() => null),
      ]);

      // Load context
      if (contextRes?.ok) {
        const contextData = await contextRes.json();
        setUserContext(contextData.context_text || DEFAULT_CONTEXT);
      } else {
        setUserContext(DEFAULT_CONTEXT);
      }

      // Load learnings
      if (learningsRes?.ok) {
        const learningsData = await learningsRes.json();
        setLearnings(learningsData.learnings || []);
      }

      // Load categories
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
      } else {
        setCategories(DEFAULT_CATEGORIES.map((cat, idx) => ({
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
    loadData();
  }, [loadData]);

  // Save context
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

  // Delete learning
  const handleDeleteLearning = async (id: string) => {
    try {
      await fetch(`/api/learnings?id=${id}`, { method: 'DELETE' });
      setLearnings(learnings.filter(l => l.id !== id));
    } catch (error) {
      console.error('Failed to delete learning:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const isOwner = profile.role === 'owner';

  return (
    <div className="pb-20 min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <div className="sticky top-0 bg-[#FAF8F5] border-b border-gray-200 z-10">
        <div className="px-4 py-4 text-center">
          <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-6">
        {isOwner && (
          <>
            {/* My Context Section */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">My Context</h2>
              <p className="text-sm text-gray-600 mb-3">
                This helps the AI understand your priorities and work style.
              </p>
              <textarea
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C45D3E] resize-none"
              />
              <button
                onClick={handleSaveContext}
                disabled={isSavingContext}
                className="mt-3 w-full bg-[#C45D3E] hover:bg-[#A84C2F] disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                {isSavingContext ? 'Saving...' : 'Save Context'}
              </button>
              {contextSaved && (
                <p className="mt-2 text-sm text-green-600">Context saved successfully!</p>
              )}
            </div>

            {/* AI Learnings Section */}
            {learnings.length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">AI Learnings</h2>
                <p className="text-sm text-gray-600 mb-4">
                  The AI has learned these things about you. Remove any that are incorrect.
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {learnings.filter(l => l.active).map(learning => (
                    <div
                      key={learning.id}
                      className="flex items-start justify-between gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <p className="text-sm text-gray-700 flex-1">{learning.learning}</p>
                      <button
                        onClick={() => handleDeleteLearning(learning.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Delete learning"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Section */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Categories</h2>
              <div className="space-y-2">
                {categories.map(category => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    </div>
                    <button
                      onClick={() => setCategoryToDelete(category.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Delete category"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* EA Access Section */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">EA Access</h2>
              <p className="text-sm text-gray-600 mb-3">
                Your Executive Assistant can access and manage your tasks with the same permissions as you.
              </p>
              <p className="text-sm font-medium text-gray-900">Status: Not connected</p>
              <p className="text-xs text-gray-500 mt-2">
                EA emails will appear here when connected.
              </p>
            </div>
          </>
        )}

        {/* Telegram Bot Section */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Telegram Bot</h2>
          <p className="text-sm text-gray-600 mb-4">
            Get instant access to TaskBuddy on Telegram. Send tasks directly from your phone.
          </p>
          <code className="block bg-gray-50 p-3 rounded-lg text-sm font-mono text-gray-900 mb-3">
            Send /start to @TaskBuddyBot
          </code>
          <p className="text-xs text-gray-500">Status: Not connected</p>
        </div>

        {/* Account Section */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Account</h2>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Dark Mode</p>
              <p className="text-xs text-gray-600">Toggle dark theme</p>
            </div>
            <button
              onClick={toggle}
              className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                isDark ? 'bg-[#C45D3E]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors mt-4"
          >
            Log Out
          </button>
        </div>

        {/* Account Info */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Account:</span> {user.email}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            <span className="font-semibold">Role:</span> {profile.role}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Category?</h3>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone. Tasks in this category will not be deleted, but the category will be removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  // TODO: Implement category deletion API
                  setCategoryToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
