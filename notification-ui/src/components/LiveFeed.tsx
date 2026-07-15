import { Activity, Bell, Smartphone, Mail } from 'lucide-react';

interface NotificationEvent {
  eventId: string;
  recipient: string;
  channel: string;
  messageSubject: string;
  messageBody: string;
  studentName?: string;
  rollNumber?: string;
  department?: string;
  templateType?: string;
}

interface LiveFeedProps {
  liveEvents: NotificationEvent[];
}

export default function LiveFeed({ liveEvents }: LiveFeedProps) {
  return (
    <div className="flex flex-col relative overflow-hidden h-full font-mono text-zinc-300">
      
      <div className="flex items-center justify-between mb-6 z-10">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-3 uppercase text-white">
            <span className="text-white"><Activity size={22} /></span>
            Live Ingestion Stream
          </h2>
          <p className="text-zinc-600 text-[10px] uppercase tracking-wider">App 2 • Kafka -&gt; Redis -&gt; WebSockets • Port 8082</p>
        </div>
      </div>

      {/* STREAM FEED */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-10 pr-1 z-10">
        {liveEvents.length === 0 ? (
          <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-zinc-700 border border-dashed border-zinc-900 rounded-xl p-8 text-xs text-center bg-black">
            <span className="text-zinc-800 mb-3 animate-pulse"><Bell size={28}/></span>
            <span className="tracking-widest uppercase">Awaiting transaction packets...</span>
            <span className="text-[9px] text-zinc-800 block mt-1.5 uppercase">Dispatch an entity from registry to stream logs</span>
          </div>
        ) : (
          liveEvents.map((evt, idx) => (
            <div key={idx} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 hover:border-zinc-700 transition-all duration-200 shadow-xl">
              
              <div className="flex justify-between items-start mb-4 border-b border-zinc-900 pb-3">
                <div className="flex gap-2 items-center flex-wrap">
                  <span className="bg-zinc-900 text-white text-[8px] px-1.5 py-0.5 rounded font-bold border border-zinc-800 uppercase tracking-widest">
                    KAFKA_ACK
                  </span>
                  <span className="bg-zinc-900 text-white text-[8px] px-1.5 py-0.5 rounded font-bold border border-zinc-800 uppercase tracking-widest">
                    REDIS_CACHED
                  </span>
                  {/* Channel Badge (Strict Black & White Contrast) */}
                  <span className="bg-white text-black text-[8px] px-2 py-0.5 rounded uppercase font-bold border border-white flex items-center gap-1">
                    {evt.channel === 'SMS' ? <Smartphone size={9}/> : evt.channel === 'PUSH' ? <Bell size={9}/> : <Mail size={9}/>}
                    {evt.channel || 'EMAIL'}
                  </span>
                </div>
                <span className="text-zinc-600 font-mono text-[9px]">{new Date().toISOString().split('T')[1].substring(0, 8)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-[10px]">
                <div>
                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest block mb-0.5">Event Ref</span>
                  <span className="font-mono text-white font-bold">{evt.eventId}</span>
                </div>
                <div>
                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest block mb-0.5">Template Mode</span>
                  <span className="font-mono text-zinc-400 uppercase">{evt.templateType || 'WELCOME'}</span>
                </div>
              </div>
              
              <div className="bg-black rounded-lg p-4 font-mono text-[10px] leading-relaxed border border-zinc-900/60">
                <span className="text-zinc-500">Subject: </span><span className="text-white font-bold">{evt.messageSubject}</span><br/>
                <span className="text-zinc-500">Recipient: </span><span className="text-zinc-400">{evt.recipient}</span><br/><br/>
                <p className="text-zinc-300 font-sans text-xs">{evt.messageBody}</p>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
