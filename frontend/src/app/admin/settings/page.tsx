'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';
import { useAdminAuthGuard } from '@/lib/useAdminAuthGuard';

export default function AdminSettingsPage() {
  useAdminAuthGuard();
  const [settings, setSettings] = useState<any>({ site_name: '', contact_email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await adminFetch('/api/admin/settings');
        const result = await response.json();
        setSettings(result.data || result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await adminFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Settings saved successfully.');
      } else {
        setMessage(result.message || 'Unable to save settings.');
      }
    } catch (error) {
      setMessage('Unable to save settings.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-500">Loading settings…</div>;
  }

  return (
    <div className="space-y-8 rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">Store settings</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Site name</span>
          <input
            type="text"
            value={settings.site_name || ''}
            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Contact email</span>
          <input
            type="email"
            value={settings.contact_email || ''}
            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-700"
          />
        </label>
        {message && <p className="text-sm text-slate-700">{message}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
