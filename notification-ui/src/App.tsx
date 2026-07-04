import React, { useState, useEffect } from 'react';
import { Bell, Shield, LogOut, Terminal, RefreshCw } from 'lucide-react';

interface NotificationEvent {
  eventId: string;
  recipient: string;
  channel: string;
  messageSubject: string;
  messageBody: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';

export default function App() {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt_token'));

  const [searchEventId, setSearchEventId] = useState('evt_100239');
  const [cachedEvent, setCachedEvent] = useState<NotificationEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle mock authentication flow
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      setError(null);
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (!res.ok) throw new Error('Authentication gateway rejected connection.');

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('jwt_token', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend service.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setIsLoggedIn(false);
    setCachedEvent(null);
  };

  // Poll Redis Cache Tier via our protected endpoint
  const fetchCachedNotification = async () => {
    if (!token || !searchEventId.trim()) return;
    setLoading(true);
    setError(null);
    setCachedEvent(null);

    try {
      const res = await fetch(`${API_BASE}/api/notifications/cached/${searchEventId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 404) {
        throw new Error(`Event ID "${searchEventId}" not found or expired from Redis.`);
      }
      if (!res.ok) {
        throw new Error('Access denied. Token signature verification failed.');
      }

      const data = await res.json();
      setCachedEvent(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col items-center justify-center p-6">
      {!isLoggedIn ? (
        /* LOGIN PANEL CODE */
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-600 rounded-xl text-white">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Secure Gateway</h1>
              <p className="text-slate-400 text-sm">Portfolio Microservice Cluster</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Username Identity</label>
              <input
                type="text"
                placeholder="e.g. dhroov"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors py-3 rounded-xl font-medium tracking-wide shadow-lg shadow-indigo-600/20">
              Generate Cryptographic JWT
            </button>
          </form>
          {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">{error}</div>}
        </div>
      ) : (
        /* DASHBOARD VIEW CODE */
        <div className="w-full max-w-3xl space-y-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 rounded-xl text-white">
                <Bell size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">Notification Hub Control Panel</h1>
                <p className="text-emerald-400 text-xs font-mono flex items-center gap-1.5 mt-0.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Stateless Session Active
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 transition-colors px-4 py-2.5 rounded-xl text-sm font-medium">
              <LogOut size={16} /> Disconnect
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4 h-fit">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Terminal size={16} /> Cache Interrogator
              </h2>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">Target Event ID</label>
                <input
                  type="text"
                  value={searchEventId}
                  onChange={(e) => setSearchEventId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={fetchCachedNotification}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 transition-colors py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Query Redis Layer
              </button>
              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-mono">{error}</div>}
            </div>

            <div className="md:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col min-h-[300px]">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Ingested Event Details</h2>

              {cachedEvent ? (
                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-700/50 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 block">EVENT REFERENCE</span>
                      <span className="text-indigo-400 font-bold">{cachedEvent.eventId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">CHANNEL DRIVER</span>
                      <span className="text-amber-400 font-bold">{cachedEvent.channel}</span>
                    </div>
                    <div className="col-span-2 border-t border-slate-800 pt-3">
                      <span className="text-slate-500 block">RECIPIENT MATRIX</span>
                      <span className="text-slate-300 font-medium">{cachedEvent.recipient}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-700/30 space-y-2">
                    <h3 className="text-md font-semibold text-slate-200">{cachedEvent.messageSubject}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{cachedEvent.messageBody}</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl p-8 font-mono text-xs text-center">
                  NO EVENT LOADED IN MEMORY BUFFER<br />
                  <span className="text-[10px] text-slate-600 mt-1">Specify an active event reference and hit Query</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}