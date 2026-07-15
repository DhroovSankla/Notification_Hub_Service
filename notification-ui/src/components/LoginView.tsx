import React from 'react';
import { User, Key, Shield, Layers } from 'lucide-react';

interface LoginViewProps {
  username: string;
  setUsername: (u: string) => void;
  password: string;
  setPassword: (p: string) => void;
  authError: string | null;
  googleLoading: boolean;
  handleLogin: (e: React.FormEvent) => void;
  handleGoogleLogin: () => void;
}

export default function LoginView({
  username,
  setUsername,
  password,
  setPassword,
  authError,
  googleLoading,
  handleLogin,
  handleGoogleLogin
}: LoginViewProps) {
  return (
    <div className="min-h-screen w-full bg-black text-zinc-100 flex flex-col justify-between font-mono select-none">
      
      {/* HEADER */}
      <header className="border-b border-zinc-900 bg-black px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white text-black border border-white rounded">
            <Layers size={16} />
          </div>
          <span className="text-xs font-bold tracking-widest uppercase">Enterprise Secure Gateway</span>
        </div>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">SYSTEM NODE: ONLINE</span>
      </header>

      {/* BODY CONTENT - SPLIT LAYOUT */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 w-full max-w-7xl mx-auto border-x border-zinc-900">
        
        {/* LEFT COLUMN: ARCHITECTURE INFO */}
        <section className="bg-black p-8 md:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded bg-zinc-950 uppercase tracking-wider w-fit block">
              System Manual Overview
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase font-sans">
              Operations Control Logistics
            </h1>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-md">
              Secure orchestration node monitoring candidate registration transactions and live event routing.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-900">
            <div className="flex items-start gap-4">
              <span className="text-zinc-700 font-bold">01</span>
              <div>
                <h3 className="text-xs font-bold text-white uppercase">Kafka Event Bus</h3>
                <p className="text-zinc-500 text-[11px] mt-0.5">Asynchronous event stream publishing verified registrations between services.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-zinc-700 font-bold">02</span>
              <div>
                <h3 className="text-xs font-bold text-white uppercase">Quarantine Routing (DLQ)</h3>
                <p className="text-zinc-500 text-[11px] mt-0.5">Automated circuit-breaking. Traps events during outages with manual re-drive controls.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-zinc-700 font-bold">03</span>
              <div>
                <h3 className="text-xs font-bold text-white uppercase">Relational Transaction Ledger</h3>
                <p className="text-zinc-500 text-[11px] mt-0.5">Immutable audit logging utilizing H2 memory engines for absolute trace fidelity.</p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <section className="bg-black p-8 md:p-12 flex items-center justify-center">
          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-xl w-full max-w-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded text-white">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase text-white">Authentication Gateway</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans">Ops Cockpit Login</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Operator Identity</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-700"><User size={14}/></span>
                  <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black border border-zinc-900 focus:border-white rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-zinc-800 outline-none transition-all"
                    placeholder="Operator Username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Security Access Token</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-700"><Key size={14}/></span>
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black border border-zinc-900 focus:border-white rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-zinc-800 outline-none transition-all"
                    placeholder="Access Token / Password"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-white hover:bg-zinc-200 text-black py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border border-white"
              >
                Access Session
              </button>
            </form>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-zinc-900"></div>
              <span className="flex-shrink mx-3 text-[9px] text-zinc-600 uppercase tracking-widest font-sans">Or Link Account</span>
              <div className="flex-grow border-t border-zinc-900"></div>
            </div>

            <button 
              onClick={handleGoogleLogin} 
              disabled={googleLoading}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium text-xs flex items-center justify-center gap-2.5 py-2.5 rounded-lg transition-all"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path fill="#EA4335" d="M12 5.04c1.65 0 3.13.57 4.3 1.69l3.22-3.22C17.55 1.58 14.99 1 12 1 7.37 1 3.4 3.73 1.58 7.7l3.86 3C6.38 8.16 8.94 5.04 12 5.04z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.45c-.28 1.48-1.12 2.74-2.38 3.58l3.71 2.87c2.17-2 3.71-4.94 3.71-8.55z"/>
                <path fill="#FBBC05" d="M5.44 14.67a6.83 6.83 0 0 1 0-4.14L1.58 7.53a11.96 11.96 0 0 0 0 10.14l3.86-3z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.96-1.08 7.95-2.92l-3.71-2.87c-1.1.74-2.5 1.18-4.24 1.18-3.06 0-5.62-3.12-6.55-5.66l-3.86 3C3.4 20.27 7.37 23 12 23z"/>
              </svg>
              Sign in with Google
            </button>

            {authError && (
              <div className="mt-4 p-2.5 bg-zinc-950 border border-zinc-800 text-white font-mono text-[10px] text-center rounded-lg">
                {authError}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-black py-4 px-6 text-center text-[9px] text-zinc-600 flex items-center justify-between">
        <span>SECURITY PROTOCOL ENVELOPE: ENABLED</span>
        <span>MANUAL PROTOCOL: JSR-383</span>
      </footer>

    </div>
  );
}
