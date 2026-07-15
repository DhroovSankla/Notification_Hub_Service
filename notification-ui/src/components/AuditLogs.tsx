import React from 'react';
import { FileSpreadsheet, RefreshCw, Search, Filter, Smartphone, Bell, Mail, Eye } from 'lucide-react';

interface AuditLog {
  id: number;
  eventId: string;
  recipient: string;
  channel: string;
  templateType: string;
  status: string;
  timestamp: string;
  payload: string;
}

interface AuditLogsProps {
  auditLogs: AuditLog[];
  auditQuery: string;
  setAuditQuery: (q: string) => void;
  auditStatus: string;
  setAuditStatus: (s: string) => void;
  auditChannel: string;
  setAuditChannel: (c: string) => void;
  auditLoading: boolean;
  fetchAuditLogs: () => void;
  inspectedLog: AuditLog | null;
  setInspectedLog: (log: AuditLog | null) => void;
}

export default function AuditLogs({
  auditLogs,
  auditQuery,
  setAuditQuery,
  auditStatus,
  setAuditStatus,
  auditChannel,
  setAuditChannel,
  auditLoading,
  fetchAuditLogs,
  inspectedLog,
  setInspectedLog
}: AuditLogsProps) {
  return (
    <div className="flex-1 p-6 bg-black flex flex-col font-mono text-zinc-300">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-3 uppercase text-white">
            <span className="text-white"><FileSpreadsheet size={22} /></span>
            Enterprise System Audit Logs
          </h2>
          <p className="text-zinc-600 text-[10px] uppercase tracking-wider">Immutable audit ledger of all transaction operations stored in H2 database</p>
        </div>
        <button 
          onClick={fetchAuditLogs} 
          disabled={auditLoading}
          className="px-4 py-2 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 active:scale-95 transition-all text-white"
        >
          <RefreshCw size={13} className={auditLoading ? "animate-spin" : ""} /> Refresh Log Database
        </button>
      </div>

      {/* FILTERS TOOLBAR */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-700"><Search size={14}/></span>
          <input 
            type="text"
            value={auditQuery}
            onChange={e => setAuditQuery(e.target.value)}
            placeholder="Search Event ID or Recipient email..."
            className="w-full bg-black border border-zinc-900 focus:border-white rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-800 outline-none transition-all"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter size={12} className="text-zinc-700" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Status:</span>
            <select 
              value={auditStatus}
              onChange={e => setAuditStatus(e.target.value)}
              className="bg-black border border-zinc-900 rounded px-2.5 py-1.5 text-xs text-white outline-none"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="PROCESSED">PROCESSED OK</option>
              <option value="TRAPPED_IN_DLQ">TRAPPED IN DLQ</option>
              <option value="REPLAYED_FROM_DLQ">REPLAYED</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Channel:</span>
            <select 
              value={auditChannel}
              onChange={e => setAuditChannel(e.target.value)}
              className="bg-black border border-zinc-900 rounded px-2.5 py-1.5 text-xs text-white outline-none"
            >
              <option value="ALL">ALL CHANNELS</option>
              <option value="EMAIL">EMAIL</option>
              <option value="SMS">SMS</option>
              <option value="PUSH">PUSH ALERT</option>
            </select>
          </div>
        </div>
      </div>

      {/* AUDIT TABLE */}
      <div className="flex-1 bg-zinc-950/40 border border-zinc-900 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[350px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-950 text-zinc-500 font-mono uppercase tracking-widest">
                <th className="py-3 px-4 font-bold text-[9px]">ID</th>
                <th className="py-3 px-4 font-bold text-[9px]">Event Ref</th>
                <th className="py-3 px-4 font-bold text-[9px]">Recipient To</th>
                <th className="py-3 px-4 font-bold text-[9px]">Channel</th>
                <th className="py-3 px-4 font-bold text-[9px]">Template</th>
                <th className="py-3 px-4 font-bold text-[9px] text-center">Status</th>
                <th className="py-3 px-4 font-bold text-[9px]">Timestamp</th>
                <th className="py-3 px-4 font-bold text-[9px] text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-900/20 text-zinc-300 transition-colors">
                  <td className="py-3 px-4 text-zinc-700 font-bold">#{log.id}</td>
                  <td className="py-3 px-4 text-white font-bold">{log.eventId}</td>
                  <td className="py-3 px-4 text-zinc-400 font-sans">{log.recipient}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1 text-[9px] text-zinc-400">
                      {log.channel === 'SMS' ? <Smartphone size={10} /> : log.channel === 'PUSH' ? <Bell size={10} /> : <Mail size={10} />}
                      {log.channel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-1.5 py-0.5 rounded border border-zinc-900 bg-zinc-950 text-[9px] text-zinc-500 uppercase">{log.templateType}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                      log.status === 'PROCESSED' ? 'bg-white text-black border-white' : 
                      log.status === 'TRAPPED_IN_DLQ' ? 'bg-zinc-950 text-white border-zinc-700 border-dashed' : 
                      'bg-zinc-900 text-zinc-300 border-zinc-700'
                    }`}>
                      {log.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-600">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => setInspectedLog(log)}
                      className="p-1 hover:bg-zinc-900 hover:text-white rounded border border-transparent hover:border-zinc-800 transition-all"
                    >
                      <Eye size={13} className="text-zinc-500 hover:text-white" />
                    </button>
                  </td>
                </tr>
              ))}
              {auditLogs.length === 0 && !auditLoading && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-700 uppercase tracking-widest text-[10px]">No transaction records found matching filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT LOG MODAL */}
      {inspectedLog && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 border-b border-zinc-900 flex justify-between items-center bg-zinc-950">
              <div>
                <h3 className="font-bold text-white uppercase text-xs flex items-center gap-2">
                  <span className="text-white"><Eye size={14} /></span>
                  Audit Payload Inspector
                </h3>
                <p className="text-[9px] text-zinc-500 font-mono mt-0.5">Record ID: #{inspectedLog.id} • Ref: {inspectedLog.eventId}</p>
              </div>
              <button 
                onClick={() => setInspectedLog(null)}
                className="text-zinc-500 hover:text-white font-bold uppercase text-[10px] tracking-wider"
              >
                Close
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 border-b border-zinc-900 pb-4">
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-600 block mb-0.5">Recipient To</span>
                  <span className="text-white font-sans font-medium">{inspectedLog.recipient}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-600 block mb-0.5">Timestamp</span>
                  <span className="text-white font-mono">{new Date(inspectedLog.timestamp).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 border-b border-zinc-900 pb-4">
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-600 block mb-0.5">Channel</span>
                  <span className="text-white font-mono uppercase">{inspectedLog.channel}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-600 block mb-0.5">Template</span>
                  <span className="text-white font-mono uppercase">{inspectedLog.templateType}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-600 block mb-0.5">Status</span>
                  <span className="text-white font-mono uppercase font-bold">{inspectedLog.status}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[8px] uppercase tracking-widest text-zinc-600 block">Raw Event JSON Payload</span>
                <pre className="bg-black border border-zinc-900 rounded p-4 text-[9px] text-zinc-300 leading-relaxed overflow-x-auto font-mono max-h-[220px]">
                  {JSON.stringify(JSON.parse(inspectedLog.payload), null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
