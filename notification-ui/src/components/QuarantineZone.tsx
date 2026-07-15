import { Activity, AlertTriangle } from 'lucide-react';

interface QuarantineZoneProps {
  faultModeActive: boolean;
  toggleFaultMode: () => void;
  dlqEvents: string[];
  replayDlqEvents: () => void;
}

export default function QuarantineZone({
  faultModeActive,
  toggleFaultMode,
  dlqEvents,
  replayDlqEvents
}: QuarantineZoneProps) {
  return (
    <div className="w-full max-w-md space-y-4 pt-8 border-t border-zinc-900 font-mono">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold tracking-tight text-white uppercase flex items-center gap-2">
            Quarantine Station
          </h2>
          <p className="text-zinc-600 text-[9px] uppercase tracking-widest">Kafka Dead Letter Queue</p>
        </div>
        
        <button 
          onClick={toggleFaultMode}
          className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border transition-all ${
            faultModeActive 
              ? 'bg-white text-black border-white font-bold' 
              : 'bg-black text-zinc-500 border-zinc-900 hover:text-zinc-300 hover:border-zinc-800'
          }`}
        >
          {faultModeActive ? 'Simulation Outage ACTIVE' : 'Trigger Simulation Outage'}
        </button>
      </div>

      <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={12} className="text-zinc-500" />
            {dlqEvents.length} Events Suspended
          </span>
          {dlqEvents.length > 0 && (
            <button 
              onClick={replayDlqEvents} 
              className="bg-white hover:bg-zinc-200 text-black border border-white px-2.5 py-1 text-[9px] uppercase font-bold rounded flex items-center gap-1.5 transition-all"
            >
              <Activity size={10} /> Replay Queue
            </button>
          )}
        </div>
        
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {dlqEvents.map((ev, i) => {
            let parsed = { eventId: 'Unknown' };
            try { parsed = JSON.parse(ev); } catch(e){}
            return (
              <div key={i} className="bg-black border border-zinc-900 rounded-lg p-2.5 flex items-center justify-between font-mono text-[10px]">
                <span className="text-white">event_{parsed.eventId}</span>
                <span className="text-zinc-500 uppercase tracking-widest font-bold text-[9px] border border-zinc-800 px-1.5 py-0.5 rounded bg-zinc-950">
                  Suspended
                </span>
              </div>
            );
          })}
          {dlqEvents.length === 0 && (
            <div className="text-zinc-700 text-xs font-mono text-center py-4 uppercase tracking-widest">
              No suspended transactions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
