import { User, Mail, Hash, BookOpen, Send, CheckCircle, Terminal } from 'lucide-react';

interface RegistryNodeProps {
  studentName: string;
  setStudentName: (name: string) => void;
  studentEmail: string;
  setStudentEmail: (email: string) => void;
  studentRoll: string;
  setStudentRoll: (roll: string) => void;
  studentDept: string;
  setStudentDept: (dept: string) => void;
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  regStatus: { loading: boolean; error: string | null; success: boolean };
  handleRegistration: (e: React.FormEvent) => void;
}

export default function RegistryNode({
  studentName,
  setStudentName,
  studentEmail,
  setStudentEmail,
  studentRoll,
  setStudentRoll,
  studentDept,
  setStudentDept,
  selectedChannel,
  setSelectedChannel,
  selectedTemplate,
  setSelectedTemplate,
  regStatus,
  handleRegistration
}: RegistryNodeProps) {
  return (
    <div className="w-full max-w-md space-y-6 relative z-10 font-mono">
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-3 uppercase text-white">
          <span className="text-white"><Terminal size={22} /></span>
          Registry Entry Node
        </h2>
        <p className="text-zinc-600 text-[10px] uppercase tracking-wider">App 1 • JSR-383 Validation Active • Port 8080</p>
      </div>

      <form onSubmit={handleRegistration} className="space-y-4">
        <div className="space-y-4 bg-zinc-950/60 p-6 rounded-xl border border-zinc-900 backdrop-blur-sm">
          
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <User size={11}/> Candidate Name
            </label>
            <input 
              type="text" 
              value={studentName} 
              onChange={e => setStudentName(e.target.value)} 
              className="w-full bg-black border border-zinc-900 focus:border-white rounded-lg px-4 py-2.5 text-xs text-white outline-none transition-all" 
              placeholder="Candidate Name"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Mail size={11}/> Primary Email
            </label>
            <input 
              type="email" 
              value={studentEmail} 
              onChange={e => setStudentEmail(e.target.value)} 
              className="w-full bg-black border border-zinc-900 focus:border-white rounded-lg px-4 py-2.5 text-xs text-white outline-none transition-all" 
              placeholder="Primary Email Address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Hash size={11}/> Roll Number
              </label>
              <input 
                type="text" 
                value={studentRoll} 
                onChange={e => setStudentRoll(e.target.value)} 
                className="w-full bg-black border border-zinc-900 focus:border-white rounded-lg px-4 py-2.5 text-xs font-mono text-white outline-none transition-all" 
                placeholder="Roll ID"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={11}/> Department
              </label>
              <input 
                type="text" 
                value={studentDept} 
                onChange={e => setStudentDept(e.target.value)} 
                className="w-full bg-black border border-zinc-900 focus:border-white rounded-lg px-4 py-2.5 text-xs text-white outline-none transition-all" 
                placeholder="Dept Branch"
              />
            </div>
          </div>

          {/* Channel & Template Selectors */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-900">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                Delivery Channel
              </label>
              <select 
                value={selectedChannel} 
                onChange={e => setSelectedChannel(e.target.value)}
                className="w-full bg-black border border-zinc-900 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
              >
                <option value="EMAIL">EMAIL</option>
                <option value="SMS">SMS</option>
                <option value="PUSH">PUSH ALERT</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                Event Template
              </label>
              <select 
                value={selectedTemplate} 
                onChange={e => setSelectedTemplate(e.target.value)}
                className="w-full bg-black border border-zinc-900 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
              >
                <option value="WELCOME">WELCOME EMAIL</option>
                <option value="ENROLLMENT">COURSE REGISTRATION</option>
                <option value="SECURITY_ALERT">SSO CLEARANCE</option>
              </select>
            </div>
          </div>

        </div>

        <button 
          disabled={regStatus.loading} 
          type="submit" 
          className="w-full bg-white hover:bg-zinc-200 text-black border border-white font-bold text-xs tracking-widest py-3 rounded-lg uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {regStatus.loading ? 'Dispatching...' : <><Send size={13}/> Dispatch Entity</>}
        </button>

        {regStatus.error && (
          <div className="p-3 bg-black border border-zinc-900 text-white text-xs rounded-lg font-mono text-center">
            {regStatus.error}
          </div>
        )}
        {regStatus.success && (
          <div className="p-3 bg-black border border-white text-white text-xs rounded-lg font-mono flex items-center justify-center gap-2">
            <CheckCircle size={13}/> PERSISTENCE SUCCESSFUL
          </div>
        )}
      </form>
    </div>
  );
}
