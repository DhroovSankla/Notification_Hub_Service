import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-black py-4 px-6 text-center text-[10px] font-mono text-zinc-600 flex items-center justify-between text-white bg-black">
      <div className="flex items-center gap-2">
        <Shield size={12} className="text-zinc-500" />
        <span>SECURE GATEWAY ENCRYPTED SYSTEM</span>
      </div>
      <div>
        <span>PORT BINDINGS: 8080 (REGISTRY) | 8082 (NOTIFIER)</span>
      </div>
      <div>
        <span>OPERATIONS PROTOCOL V5.0 • © 2026</span>
      </div>
    </footer>
  );
}
