import React, { useState } from 'react';
import { Bell, Shield, LogOut, Terminal, RefreshCw, Layers } from 'lucide-react';

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
        throw new Error(`Event ID "${searchEventId}" not found or expired.`);
      }
      if (!res.ok) {
        throw new Error('Access denied. Token invalid.');
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
    <div className="min-h-screen w-full bg-black text-slate-100 flex items-center justify-center p-4 sm:p-6 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,38,38,0.12),rgba(0,0,0,0))]">
      {!isLoggedIn ? (
        /* ULTRA-MODERN BLACK & RED SECURE GATEWAY PANEL */
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-8 w-full max-w-md backdrop-blur-md">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.15)]">
              <Shield size={26} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white uppercase">Secure Gateway</h1>
              <p className="text-zinc-500 text-xs font-mono">Stateless Cluster Node</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider">Username Identity</label>
              <input 
                type="text"
                placeholder="Enter identity (e.g., dhroov)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-zinc-800 focus:border-red-600 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-zinc-700 outline-none transition-all duration-200"
              />
            </div>
            <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white active:scale-[0.98] transition-all duration-150 py-3 rounded-xl font-medium text-sm tracking-wide uppercase shadow-lg shadow-red-600/15">
              Generate JWT Token
            </button>
          </form>
          {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-mono text-center">{error}</div>}
        </div>
      ) : (
        /* CYBER-RED CORE DASHBOARD SYSTEM */
        <div className="w-full max-w-4xl space-y-6">
          {/* HEADER ROW */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-4 justify-between sm:items-center backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">
                <Bell size={22} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white uppercase tracking-wide">Notification Hub</h1>
                <p className="text-red-500 text-xs font-mono flex items-center gap-1.5 mt-0.5 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(220,38,38,1)]" /> Session Live
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 active:scale-95 transition-all px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 border border-zinc-800 uppercase tracking-wider">
              <LogOut size={14} /> Disconnect
            </button>
          </div>

          {/* TWO COLUMN GRID PANEL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SIDE PANEL INTERROGATION CONTROLS */}
            <div className="md:col-span-1 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl space-y-5 h-fit">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Terminal size={14} className="text-red-500" /> Cache Interrogator
              </h2>
              <div className="space-y-2">
                <label className="block text-zinc-400 text-xs font-medium uppercase tracking-wider">Target Event ID</label>
                <input 
                  type="text"
                  value={searchEventId}
                  onChange={(e) => setSearchEventId(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-red-600 rounded-xl px-3 py-2.5 text-xs text-slate-200 font-mono outline-none transition-all"
                />
              </div>
              <button 
                onClick={fetchCachedNotification}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 text-white disabled:bg-zinc-900 disabled:text-zinc-700 active:scale-[0.97] transition-all py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md uppercase tracking-wider"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Query Redis Tier
              </button>
              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-mono leading-relaxed text-center">{error}</div>}
            </div>

            {/* LIVE DATA INGESTION DISPLAY */}
            <div className="md:col-span-2 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col min-h-[340px]">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 mb-5">
                <Layers size={14} className="text-red-500" /> Ingested Event Details
              </h2>
              
              {cachedEvent ? (
                <div className="space-y-5 flex-1">
                  {/* META LABELS BLOCK */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black border border-zinc-800 p-4 rounded-xl font-mono text-[11px] leading-tight">
                    <div className="space-y-1">
                      <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">EVENT REFERENCE</span>
                      <span className="text-red-500 font-bold bg-red-500/5 border border-red-500/10 px-2 py-0.5 rounded md:inline-block">{cachedEvent.eventId}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">CHANNEL DRIVER</span>
                      <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded md:inline-block">{cachedEvent.channel}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">RECIPIENT MATRIX</span>
                      <span className="text-slate-300 font-medium overflow-x-auto block whitespace-nowrap scrollbar-none">{cachedEvent.recipient}</span>
                    </div>
                  </div>

                  {/* SUBSTANCE WRAPPER BOX */}
                  <div className="bg-black/40 border border-zinc-800 p-5 rounded-xl flex-1 space-y-3">
                    <h3 className="text-sm font-bold text-white border-b border-zinc-800 pb-2 uppercase tracking-wide">{cachedEvent.messageSubject}</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed font-normal">{cachedEvent.messageBody}</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 border border-dashed border-zinc-800 rounded-xl p-8 font-mono text-xs text-center bg-black/20">
                  <span className="text-red-500/30 mb-2 block text-lg font-sans">⚠️</span>
                  NO EVENT IN MEMORY BUFFER
                  <span className="text-[10px] text-zinc-700 block mt-1">Specify active reference and trigger query execution</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}