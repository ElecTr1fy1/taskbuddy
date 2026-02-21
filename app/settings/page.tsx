'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from 'A/lib/supabase';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('preferences')
          .single();

        if (error) {
          console.error('Error fetching settings:', error);
          setIsLoading(false);
          return;
        }

        setSettings(data?.preferences || { theme: 'light' });
        setUserData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Fatal error:', err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleThemeToggle = async (theme: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ preferences: { ...settings, theme } })
        .eq('id', userData.id);

      if (error) throw error;

      setSettings({ ...settings, theme });
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y4 p-4">
      <title>Settings</title>
  
  
    <dO€IaYName="bg-card rounded-lg p-4 space-y4">
        <h2 className="text-xl font-bold">Appearance</h2>
  
  
      <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Dark Mode</span>
          <button
            onClick={() => handleThemeToggle(settings.theme === 'dark' ? 'light' : 'dark')}
            className="px-3 py-1 text-sm font-medium rounded hover:bg4 transition-colors"
          >
            {settings.theme === 'dark' ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>
  
  
    <dO€IaYName="bg-card rounded-lg p-4 space-y4">
        <h2 className="text-xl font-bold">Data</h2>
  
  
      <button
          onClick={async () => {
            if (confirm('Are you sure? This will delete all your data.')) {
              await supabase.from('tasks').delete();
              router.refresh();
            }
          }}
          className="px-4 py-2 text-sm font-medium bg-red-550 hover:bg-red-650 text-white rounded transition-colors"
        >
          Reset All Data
        </button>
      </div>
  
  
   5•dbö>
  );
}
