import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Component Imports
import Header from './components/Header';
import Footer from './components/Footer';
import LoginView from './components/LoginView';
import RegistryNode from './components/RegistryNode';
import QuarantineZone from './components/QuarantineZone';
import LiveFeed from './components/LiveFeed';
import AuditLogs from './components/AuditLogs';

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

const REGISTRY_API = import.meta.env.VITE_REGISTRY_API || 'http://localhost:8080';
const NOTIFICATION_API = import.meta.env.VITE_NOTIFICATION_API || 'http://localhost:8082';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  
  const parseJwtRole = (jwtToken: string | null) => {
    if (!jwtToken) return null;
    try {
      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).role;
    } catch (e) {
      return null;
    }
  };

  const [role, setRole] = useState<string | null>(parseJwtRole(localStorage.getItem('jwt_token')));
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt_token'));
  const [authError, setAuthError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Tabs and Layout State
  const [activeTab, setActiveTab] = useState<'cockpit' | 'audit'>('cockpit');

  // Student Registration State
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [studentDept, setStudentDept] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('EMAIL');
  const [selectedTemplate, setSelectedTemplate] = useState('WELCOME');
  
  const [regStatus, setRegStatus] = useState<{ loading: boolean; error: string | null; success: boolean }>({
    loading: false, error: null, success: false
  });

  // Live Feed State
  const [liveEvents, setLiveEvents] = useState<NotificationEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditQuery, setAuditQuery] = useState('');
  const [auditStatus, setAuditStatus] = useState('ALL');
  const [auditChannel, setAuditChannel] = useState('ALL');
  const [auditLoading, setAuditLoading] = useState(false);
  const [inspectedLog, setInspectedLog] = useState<AuditLog | null>(null);

  // WebSocket Connection
  useEffect(() => {
    if (!isLoggedIn) return;

    const socket = new SockJS(`${NOTIFICATION_API}/ws-notifications`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        setIsConnected(true);
        stompClient.subscribe('/topic/live-events', (message) => {
          if (message.body) {
            const event: NotificationEvent = JSON.parse(message.body);
            setLiveEvents(prev => [event, ...prev]);
            if (activeTab === 'audit') fetchAuditLogs();
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        setIsConnected(false);
      },
      onWebSocketClose: () => {
        setIsConnected(false);
      }
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [isLoggedIn, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    try {
      setAuthError(null);
      const res = await fetch(`${NOTIFICATION_API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Authentication gateway rejected connection.');
      }
      
      if (data.token) {
        localStorage.setItem('jwt_token', data.token);
        setToken(data.token);
        setRole(parseJwtRole(data.token));
        setIsLoggedIn(true);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to connect to backend service.');
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setAuthError(null);

    const popupWidth = 500;
    const popupHeight = 600;
    const left = window.screen.width / 2 - popupWidth / 2;
    const top = window.screen.height / 2 - popupHeight / 2;
    
    const oauthPopup = window.open(
      "", 
      "Google Sign-In Consent", 
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );

    if (!oauthPopup) {
      setGoogleLoading(false);
      setAuthError("Popup blocked! Please allow popups for Google Sign-In simulation.");
      return;
    }

    oauthPopup.document.write(`
      <html>
        <head>
          <title>Sign in with Google</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-black text-slate-100 font-mono p-6 flex flex-col items-center justify-between h-screen border border-zinc-950">
          <div class="w-full text-center space-y-4">
            <div class="flex justify-center mt-6">
              <svg class="h-12 w-12" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-.114 2.82-.977 3.78l3.07 2.38c1.8-1.66 2.84-4.1 2.84-7.01z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.07-2.38c-.9.6-2.06.96-3.23.96-2.5 0-4.61-1.69-5.36-3.97L1.13 19.39C3.11 23.3 7.23 24 12 24z"/>
                <path fill="#FBBC05" d="M6.64 15.7c-.2-.6-.31-1.24-.31-1.9s.11-1.3.31-1.9L1.13 8.01C.41 9.47 0 11.19 0 13s.41 3.53 1.13 4.99l5.51-4.29z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.23 0 3.11 2.7 1.13 6.61l5.51 4.29c.75-2.28 2.86-6.15 5.36-6.15z"/>
              </svg>
            </div>
            <h1 class="text-sm font-bold uppercase tracking-widest text-white">OAuth Verification Request</h1>
            <p class="text-[11px] text-zinc-500">Simulating OAuth 2.0 authorization code flow</p>
          </div>

          <div class="w-full bg-zinc-950 p-4 rounded-lg border border-zinc-900 space-y-3">
            <h2 class="text-[9px] uppercase text-zinc-500 tracking-widest text-center font-bold">Simulated Enterprise Accounts</h2>
            <button onclick="selectAccount('google_operator@ops.enterprise.com')" class="w-full flex items-center justify-between p-3 rounded bg-black border border-zinc-900 hover:border-white transition-all text-left">
              <div>
                <p class="text-xs font-bold text-white">Google Operator</p>
                <p class="text-[9px] text-zinc-500">google_operator@ops.enterprise.com</p>
              </div>
              <span class="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-white uppercase tracking-widest">Select</span>
            </button>
            <button onclick="selectAccount('google_admin@ops.enterprise.com')" class="w-full flex items-center justify-between p-3 rounded bg-black border border-zinc-900 hover:border-white transition-all text-left">
              <div>
                <p class="text-xs font-bold text-white">Google Administrator</p>
                <p class="text-[9px] text-zinc-500 font-mono">google_admin@ops.enterprise.com</p>
              </div>
              <span class="text-[9px] font-bold px-2 py-0.5 rounded bg-white text-black border border-white uppercase tracking-widest">Select</span>
            </button>
          </div>

          <div class="mb-4 text-center">
            <p class="text-[8px] text-zinc-700">Enterprise simulation environment matching OAuth 2.0 specs.</p>
          </div>

          <script>
            function selectAccount(email) {
              const username = email.split('@')[0];
              window.opener.postMessage({ type: 'GOOGLE_OAUTH_SUCCESS', username: username }, '*');
              window.close();
            }
          </script>
        </body>
      </html>
    `);

    const handleOauthMessage = async (event: MessageEvent) => {
      if (event.data && event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
        const usernameParam = event.data.username;
        try {
          const res = await fetch(`${NOTIFICATION_API}/api/auth/google-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameParam })
          });
          
          if (!res.ok) throw new Error("Google Authentication failed on backend gateway.");
          
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('jwt_token', data.token);
            setToken(data.token);
            setRole(parseJwtRole(data.token));
            setIsLoggedIn(true);
          }
        } catch (err: any) {
          setAuthError(err.message || 'Google Auth Connection failed.');
        } finally {
          setGoogleLoading(false);
          window.removeEventListener('message', handleOauthMessage);
        }
      }
    };

    window.addEventListener('message', handleOauthMessage);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setRole(null);
    setIsLoggedIn(false);
    setLiveEvents([]);
    setIsConnected(false);
    setPassword('');
    setUsername('');
    setActiveTab('cockpit');
  };

  // DLQ / Simulation State
  const [faultModeActive, setFaultModeActive] = useState(false);
  const [dlqEvents, setDlqEvents] = useState<string[]>([]);

  const fetchFaultStatus = async () => {
    if (role !== 'ROLE_ADMIN' || !token) return;
    try {
      const res = await fetch(`${NOTIFICATION_API}/api/simulation/fault-status`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        setFaultModeActive(data.faultModeActive);
      }
    } catch (e) {}
  };

  const fetchDlqEvents = async () => {
    if (role !== 'ROLE_ADMIN' || !token) return;
    try {
      const res = await fetch(`${NOTIFICATION_API}/api/dlq/events`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        setDlqEvents(data);
      }
    } catch (e) {}
  };

  const fetchAuditLogs = async () => {
    if (role !== 'ROLE_ADMIN' || !token) return;
    try {
      setAuditLoading(true);
      const url = new URL(`${NOTIFICATION_API}/api/audit/logs`);
      if (auditQuery) url.searchParams.append('query', auditQuery);
      if (auditStatus !== 'ALL') url.searchParams.append('status', auditStatus);
      if (auditChannel !== 'ALL') url.searchParams.append('channel', auditChannel);

      const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } finally {
      setAuditLoading(false);
    }
  };

  const toggleFaultMode = async () => {
    try {
      const res = await fetch(`${NOTIFICATION_API}/api/simulation/toggle-fault`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ active: !faultModeActive })
      });
      if (res.ok) {
        const data = await res.json();
        setFaultModeActive(data.faultModeActive);
      }
    } catch (e) {}
  };

  const replayDlqEvents = async () => {
    try {
      await fetch(`${NOTIFICATION_API}/api/dlq/replay`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchDlqEvents();
      if (activeTab === 'audit') fetchAuditLogs();
    } catch (e) {}
  };

  useEffect(() => {
    if (isLoggedIn && role === 'ROLE_ADMIN') {
      fetchFaultStatus();
      fetchDlqEvents();
      if (activeTab === 'audit') {
        fetchAuditLogs();
      }
      const interval = setInterval(() => {
        fetchDlqEvents();
        if (activeTab === 'audit') {
          fetchAuditLogs();
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, role, token, activeTab, auditQuery, auditStatus, auditChannel]);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegStatus({ loading: true, error: null, success: false });

    try {
      const payload = {
        name: studentName,
        email: studentEmail,
        rollNumber: studentRoll,
        department: studentDept,
        channel: selectedChannel,
        templateType: selectedTemplate
      };

      const res = await fetch(`${REGISTRY_API}/api/students`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || 'Registration failed. Check uniqueness constraints.');
      }

      setRegStatus({ loading: false, error: null, success: true });
      setTimeout(() => setRegStatus(s => ({ ...s, success: false })), 3000);
      
      setStudentName('');
      setStudentEmail('');
      setStudentRoll('');
      setStudentDept('');
    } catch (err: any) {
      setRegStatus({ loading: false, error: err.message, success: false });
    }
  };

  if (!isLoggedIn) {
    return (
      <LoginView
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        authError={authError}
        googleLoading={googleLoading}
        handleLogin={handleLogin}
        handleGoogleLogin={handleGoogleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-zinc-100 flex flex-col font-mono justify-between">
      
      {/* SHARED HEADER */}
      <Header
        isConnected={isConnected}
        role={role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      {activeTab === 'cockpit' ? (
        /* COCKPIT NODE LAYOUT */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-900">
          
          {/* LEFT ZONE: APP 1 - STUDENT REGISTRY & QUARANTINE */}
          <section className="bg-black p-6 md:p-10 flex flex-col items-center relative overflow-y-auto h-[calc(100vh-130px)]">
            <RegistryNode
              studentName={studentName}
              setStudentName={setStudentName}
              studentEmail={studentEmail}
              setStudentEmail={setStudentEmail}
              studentRoll={studentRoll}
              setStudentRoll={setStudentRoll}
              studentDept={studentDept}
              setStudentDept={setStudentDept}
              selectedChannel={selectedChannel}
              setSelectedChannel={setSelectedChannel}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              regStatus={regStatus}
              handleRegistration={handleRegistration}
            />

            {role === 'ROLE_ADMIN' && (
              <QuarantineZone
                faultModeActive={faultModeActive}
                toggleFaultMode={toggleFaultMode}
                dlqEvents={dlqEvents}
                replayDlqEvents={replayDlqEvents}
              />
            )}
          </section>

          {/* RIGHT ZONE: APP 2 - LIVE INGESTION STREAM */}
          <section className="bg-black p-6 md:p-10 flex flex-col relative overflow-hidden h-[calc(100vh-130px)]">
            <LiveFeed liveEvents={liveEvents} />
          </section>

        </div>
      ) : (
        /* AUDIT TRAIL VIEW */
        <div className="flex-1 overflow-y-auto h-[calc(100vh-130px)] flex flex-col bg-black">
          <AuditLogs
            auditLogs={auditLogs}
            auditQuery={auditQuery}
            setAuditQuery={setAuditQuery}
            auditStatus={auditStatus}
            setAuditStatus={setAuditStatus}
            auditChannel={auditChannel}
            setAuditChannel={setAuditChannel}
            auditLoading={auditLoading}
            fetchAuditLogs={fetchAuditLogs}
            inspectedLog={inspectedLog}
            setInspectedLog={setInspectedLog}
          />
        </div>
      )}

      {/* SHARED FOOTER */}
      <Footer />

    </div>
  );
}