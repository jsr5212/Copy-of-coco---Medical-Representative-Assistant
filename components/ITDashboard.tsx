
import React, { useState, useEffect } from 'react';
import { VerificationRequest, MedicineData } from '../types';
import ExtractionTable from './ExtractionTable';

interface ITDashboardProps {
  companyName: string;
  requests: VerificationRequest[];
  onApprove: (requestId: string, level: 'IT' | 'SENIOR') => void;
  onReject: (requestId: string) => void;
  onExit: () => void;
}

const ITDashboard: React.FC<ITDashboardProps> = ({ companyName, requests, onApprove, onReject, onExit }) => {
  const [activeTab, setActiveTab] = useState<'AUDIT' | 'EXPLORE'>('AUDIT');
  const [filter, setFilter] = useState<'ALL' | 'MEDICINE' | 'REPRESENTATIVE'>('ALL');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState<'DARK' | 'LIGHT'>(() => {
    return (localStorage.getItem('pharmaintel_admin_theme') as 'DARK' | 'LIGHT') || 'DARK';
  });

  const isDark = theme === 'DARK';

  // Only show requests that need IT verification (Stage 1)
  const pendingIT = requests.filter(r => !r.itVerified && r.status === 'PENDING');
  const filteredRequests = pendingIT.filter(r => filter === 'ALL' || r.type === filter);
  
  // Auto-select the first pending request if none is selected
  useEffect(() => {
    if (!selectedRequestId && filteredRequests.length > 0) {
      setSelectedRequestId(filteredRequests[0].id);
    }
  }, [filteredRequests, selectedRequestId]);

  const activeRequest = requests.find(r => r.id === selectedRequestId);

  const themeClasses = {
    bg: isDark ? 'bg-[#020617]' : 'bg-slate-50',
    sidebar: isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900 border-r border-slate-200',
    card: isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm',
    textPrimary: isDark ? 'text-white' : 'text-slate-900',
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-500',
    tabActive: isDark ? 'border-[#1ec3c3] text-[#1ec3c3]' : 'border-slate-900 text-slate-900',
    tabIdle: 'border-transparent text-slate-500 hover:text-slate-400'
  };

  const StatTile = ({ label, value, sub, icon }: any) => (
    <div className={`${themeClasses.card} p-6 rounded-3xl flex items-center gap-5 transition-all duration-500`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-slate-950 text-[#1ec3c3]' : 'bg-slate-900 text-[#1ec3c3]'}`}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
        <div className={`text-2xl font-black ${themeClasses.textPrimary}`}>{value}</div>
        <div className="text-[10px] text-slate-400 font-bold">{sub}</div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${themeClasses.bg} flex animate-in fade-in duration-500 transition-colors duration-500 font-mono`}>
      {/* Technical Sidebar */}
      <aside className={`w-80 ${themeClasses.sidebar} p-10 flex flex-col transition-all duration-500 z-20`}>
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 bg-[#1ec3c3] rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-[0.2em]">IT Console</h1>
            <p className="text-[9px] text-[#1ec3c3] font-black uppercase">Verificator Engine v4</p>
          </div>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar pb-10">
          <div className="flex items-center justify-between mb-4 px-1">
             <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Queue</h2>
             <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">{filteredRequests.length} Tasks</span>
          </div>

          {filteredRequests.map(req => (
            <button
              key={req.id}
              onClick={() => { setActiveTab('AUDIT'); setSelectedRequestId(req.id); }}
              className={`w-full text-left p-4 rounded-2xl transition-all border group ${
                selectedRequestId === req.id && activeTab === 'AUDIT'
                  ? (isDark ? 'bg-white/10 border-[#1ec3c3]/30 text-white shadow-lg scale-[1.02]' : 'bg-slate-900 border-slate-900 text-white shadow-md scale-[1.02]')
                  : (isDark ? 'bg-transparent border-transparent text-slate-500 hover:bg-white/5' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100')
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[8px] font-black uppercase tracking-widest ${selectedRequestId === req.id ? 'text-[#1ec3c3]' : ''}`}>{req.type}</span>
                <span className="text-[8px] opacity-40">{new Date(req.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="text-xs font-black truncate">{req.proposedData?.brand || req.proposedData?.name || 'Unknown Entity'}</div>
              <div className="text-[9px] font-bold opacity-40 uppercase tracking-tighter mt-1">{req.action} Request</div>
            </button>
          ))}
          
          {filteredRequests.length === 0 && (
            <div className="py-20 text-center opacity-30">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-[10px] font-black uppercase italic">Audit Complete</p>
            </div>
          )}
        </div>

        <button 
          onClick={onExit}
          className={`mt-auto flex items-center gap-3 transition-colors p-4 ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 8.959 8.959 0 01-18 0z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
        </button>
      </aside>

      {/* Audit Workspace */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className={`text-4xl font-black tracking-tight transition-colors duration-500 ${themeClasses.textPrimary}`}>Technical Console</h2>
              <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 transition-colors duration-500 ${isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-100'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                Node: {companyName}
              </div>
            </div>
            <div className="flex gap-8 mt-4 border-b border-slate-800/20">
              <button 
                onClick={() => setActiveTab('AUDIT')}
                className={`pb-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'AUDIT' ? themeClasses.tabActive : themeClasses.tabIdle}`}
              >
                Work Desk
              </button>
              <button 
                onClick={() => setActiveTab('EXPLORE')}
                className={`pb-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'EXPLORE' ? themeClasses.tabActive : themeClasses.tabIdle}`}
              >
                Vault Explorer
              </button>
            </div>
          </div>

          <div className={`flex p-1.5 rounded-2xl shadow-sm border transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            {['ALL', 'MEDICINE', 'REPRESENTATIVE'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? (isDark ? 'bg-white text-slate-950' : 'bg-slate-900 text-white') : 'text-slate-400 hover:text-slate-600'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        {activeTab === 'AUDIT' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <StatTile 
                label="Queue Depth" 
                value={pendingIT.length} 
                sub="Awaiting Technical Review" 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
              />
              <StatTile 
                label="Registry Health" 
                value="99.4%" 
                sub="Compliance score" 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
              />
              <StatTile 
                label="Verificator Speed" 
                value="1.2m" 
                sub="Average Audit Latency" 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
              />
            </div>

            {/* Audit Details */}
            {activeRequest ? (
              <div className={`${themeClasses.card} rounded-[3rem] shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 transition-all duration-500`}>
                <div className={`p-10 border-b flex flex-col md:flex-row justify-between items-center gap-6 transition-colors duration-500 ${isDark ? 'bg-slate-950/30 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                  <div>
                    <h3 className={`text-2xl font-black mb-1 transition-colors duration-500 ${themeClasses.textPrimary}`}>{activeRequest.proposedData?.brand || activeRequest.proposedData?.name}</h3>
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black text-[#1ec3c3] uppercase tracking-widest">{activeRequest.type} • {activeRequest.action}</span>
                       <span className="text-[10px] font-bold text-slate-400">Assignment ID: {activeRequest.id}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                     <button 
                      onClick={() => onReject(activeRequest.id)}
                      className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                     >
                        Reject Entry
                     </button>
                     <button 
                      onClick={() => onApprove(activeRequest.id, 'IT')}
                      className={`bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1ec3c3] hover:text-slate-900 shadow-lg transition-all flex items-center gap-2`}
                     >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Apply Stage 1 Lock
                     </button>
                  </div>
                </div>

                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Original Data Panel */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Production Record (Frozen)</h4>
                    <div className={`rounded-[2rem] p-8 space-y-4 border transition-colors duration-500 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                      {Object.entries(activeRequest.originalData || {}).map(([key, val]: [string, any]) => (
                        <div key={key} className="flex flex-col gap-1">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{key}</span>
                          <span className={`text-xs font-bold ${themeClasses.textSecondary}`}>{String(val)}</span>
                        </div>
                      ))}
                      {(!activeRequest.originalData || Object.keys(activeRequest.originalData).length === 0) && (
                         <div className="text-center py-10 text-xs font-black text-slate-300 uppercase italic">Initializing New Node</div>
                      )}
                    </div>
                  </div>

                  {/* Proposed Data Panel */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-[#1ec3c3] uppercase tracking-widest px-4">Proposed Modification State</h4>
                    <div className={`rounded-[2rem] p-8 space-y-4 border-2 transition-colors duration-500 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-inner'}`}>
                      {Object.entries(activeRequest.proposedData || {}).map(([key, val]: [string, any]) => {
                        const isChanged = activeRequest.originalData && activeRequest.originalData[key] !== val;
                        return (
                          <div key={key} className={`flex flex-col gap-1 p-2 rounded-lg transition-colors ${isChanged ? (isDark ? 'bg-green-500/5 ring-1 ring-green-500/20' : 'bg-green-50/50 ring-1 ring-green-100') : ''}`}>
                            <div className="flex justify-between items-center">
                              <span className={`text-[8px] font-black uppercase tracking-tighter ${isChanged ? 'text-green-500' : 'text-slate-400'}`}>{key}</span>
                              {isChanged && <span className="text-[7px] font-black text-green-600 bg-green-100 px-1 rounded">DELTA DETECTED</span>}
                            </div>
                            <span className={`text-xs font-black transition-colors duration-500 ${isChanged ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-400'}`}>{String(val)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Technical Note */}
                <div className={`p-6 flex items-center gap-4 transition-colors duration-500 ${isDark ? 'bg-slate-950/30' : 'bg-slate-50'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1ec3c3] shadow-[0_0_5px_rgba(30,195,195,0.5)]"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verify medical USPs and indications for clinical consistency before Stage 1 escalation.</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-40">
                 <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                   <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                   </svg>
                 </div>
                 <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">Workspace Operational</h3>
                 <p className="text-slate-400 text-sm mt-2">Select a task from the verification queue to begin Stage 1 audit.</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-2xl font-black tracking-tight ${themeClasses.textPrimary}`}>Vault Inventory Explorer</h3>
              <div className="relative w-72">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input 
                  type="text" 
                  placeholder="Search clinical brands..." 
                  className={`w-full pl-12 pr-6 py-3 border rounded-2xl outline-none transition-all font-bold ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {/* Find the medicine list - needs to be passed via props or context. 
                Assuming we use a global store for simplicity in this demo, but ITDashboard 
                currently doesn't have `medicines` prop. Adding it would require updating App.tsx.
                For now, showing a placeholder that the list is in the Vault tab. */}
            <div className={`p-20 text-center ${themeClasses.card} rounded-[3rem]`}>
               <p className="text-slate-400 font-black uppercase tracking-widest">Accessing Clinical Registry...</p>
               <p className="text-[10px] text-slate-500 mt-2 italic font-medium">To enable full portfolio browsing for IT Verifiers, ensure the 'medicines' prop is linked in the IT Console instantiation.</p>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .font-mono { font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .transition-colors { transition-property: background-color, border-color, color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 500ms; }
      `}} />
    </div>
  );
};

export default ITDashboard;
