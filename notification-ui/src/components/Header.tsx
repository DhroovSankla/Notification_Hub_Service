import { Layers, LogOut } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  role: string | null;
  activeTab: 'cockpit' | 'audit';
  setActiveTab: (tab: 'cockpit' | 'audit') => void;
  handleLogout: () => void;
}

export default function Header({ isConnected, role, activeTab, setActiveTab, handleLogout }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-black px-6 py-4 flex items-center justify-between sticky top-0 z-50 text-white">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white text-black rounded border border-white">
            <Layers size={18} />
          </div>
          <div>
            <h1 className="text-xs font-mono font-bold tracking-widest uppercase">Operations Control Cockpit</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-zinc-700'} animate-pulse`} />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                {isConnected ? 'WSS Online' : 'WSS Offline'}
              </span>
              <span className="text-[9px] font-mono text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded bg-zinc-950 uppercase">
                {role}
              </span>
            </div>
          </div>
        </div>

        {role === 'ROLE_ADMIN' && (
          <nav className="flex items-center gap-1 border-l border-zinc-800 pl-6 h-8">
            <button 
              onClick={() => setActiveTab('cockpit')}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded transition-all ${
                activeTab === 'cockpit' ? 'bg-white text-black border border-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Cockpit
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded transition-all ${
                activeTab === 'audit' ? 'bg-white text-black border border-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Audit Logs
            </button>
          </nav>
        )}
      </div>
      <button 
        onClick={handleLogout} 
        className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
      >
        <LogOut size={13} /> Disconnect
      </button>
    </header>
  );
}
