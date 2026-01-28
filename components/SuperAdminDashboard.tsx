
import React, { useState, useEffect } from 'react';
import { Company, Subscription, SupportTicket, PharmaintelUser } from '../types';

interface SuperAdminDashboardProps {
  companies: Company[];
  onExit: () => void;
}

const MOCK_TICKETS: SupportTicket[] = [
  { id: 'T-101', companyId: 'comp-1', companyName: 'Novartis Global', subject: 'PDF Extraction Timeout', category: 'TECHNICAL', status: 'OPEN', priority: 'HIGH', createdAt: '2025-02-14T09:00:00Z' },
  { id: 'T-102', companyId: 'comp-2', companyName: 'Pfizer Biopharma', subject: 'Billing Discrepancy (Jan)', category: 'BILLING', status: 'IN_PROGRESS', priority: 'MEDIUM', createdAt: '2025-02-12T14:30:00Z' },
  { id: 'T-103', companyId: 'comp-1', companyName: 'Novartis Global', subject: 'New MR Seat Allocation', category: 'GENERAL', status: 'RESOLVED', priority: 'LOW', createdAt: '2025-02-10T11:00:00Z' },
  { id: 'T-104', companyId: 'comp-1', companyName: 'Novartis Global', subject: 'Urgent: Senior Lock Recovery', category: 'DATA_ISSUE', status: 'OPEN', priority: 'CRITICAL', createdAt: '2025-02-15T08:15:00Z' }
];

const MOCK_INTERNAL: PharmaintelUser[] = [
  { id: 'INT-1', name: 'Alexander Vogt', role: 'SYSTEM_ADMIN', status: 'ONLINE' },
  { id: 'INT-2', name: 'Elena Rossi', role: 'IT_DIRECTOR', status: 'ONLINE' },
  { id: 'INT-3', name: 'Marcus Thorne', role: 'SALES_LEAD', status: 'OFFLINE' },
  { id: 'INT-4', name: 'Sarah Lin', role: 'FINANCIAL_CONTROLLER', status: 'ONLINE' }
];

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ companies, onExit }) => {
  const [activeTab, setActiveTab] = useState<'FLEET' | 'FINANCE' | 'SUPPORT' | 'TEAM' | 'HEALTH'>('FLEET');
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [theme, setTheme] = useState<'DARK' | 'LIGHT'>(() => {
    return (localStorage.getItem('pharmaintel_admin_theme') as 'DARK' | 'LIGHT') || 'DARK';
  });

  useEffect(() => {
    localStorage.setItem('pharmaintel_admin_theme', theme);
  }, [theme]);

  const stats = {
    totalRevenue: companies.reduce((acc, c) => acc + (c.subscription?.amount || 0), 0),
    activeClients: companies.filter(c => c.status === 'VERIFIED').length,
    openTickets: tickets.filter(t => t.status !== 'RESOLVED').length,
    averageSanctity: Math.round(companies.reduce((acc, c) => acc + c.dataSanctityScore, 0) / (companies.length || 1)),
    totalRepsOnline: companies.reduce((acc, c) => acc + Math.floor(c.repsCount * 0.4), 0) // Simulated active connections
  };

  const isDark = theme === 'DARK';

  const themeClasses = {
    bg: isDark ? 'bg-slate-950' : 'bg-slate-50',
    sidebar: isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200',
    main: isDark ? 'bg-[#020617]' : 'bg-white',
    card: isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm',
    textPrimary: isDark ? 'text-white' : 'text-slate-900',
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-500',
    border: isDark ? 'border-slate-800' : 'border-slate-100',
    tableHeader: isDark ? 'bg-slate-950/50' : 'bg-slate-50',
    navActive: isDark ? 'bg-[#1ec3c3] text-slate-950' : 'bg-slate-900 text-white',
    navIdle: isDark ? 'text-slate-500 hover:bg-white/5' : 'text-slate-400 hover:bg-slate-50',
    inputBg: isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200',
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${isDark ? 'text-slate-300' : 'text-slate-600'} flex animate-in fade-in duration-700 font-mono transition-colors duration-500`}>
      {/* Platform Sidebar */}
      <aside className={`w-80 ${themeClasses.sidebar} border-r flex flex-col p-8 transition-all duration-500 shadow-xl z-20`}>
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="bg-[#1ec3c3] p-2.5 rounded-xl shadow-[0_0_20px_rgba(30,195,195,0.4)]">
             <svg className="w-6 h-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <h1 className={`text-sm font-black ${themeClasses.textPrimary} tracking-[0.2em] uppercase leading-none`}>Nexus OS</h1>
            <p className="text-[8px] text-[#1ec3c3] font-black uppercase mt-1 tracking-widest">Global Control v4.2</p>
          </div>
        </div>

        {/* Theme Toggle Component */}
        <div className={`mb-10 p-4 rounded-2xl border transition-colors duration-500 ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center justify-between mb-3 px-1">
             <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Environmental Sync</div>
             <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#1ec3c3] animate-pulse' : 'bg-orange-400 shadow-[0_0_5px_rgba(251,146,60,0.5)]'}`}></div>
          </div>
          <div className={`flex p-1 rounded-xl relative transition-colors duration-500 ${isDark ? 'bg-slate-900/50' : 'bg-slate-200/50'}`}>
            <button 
              onClick={() => setTheme('LIGHT')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest z-10 transition-all duration-300 ${!isDark ? 'bg-white shadow-md text-slate-900 scale-100' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Daylight
            </button>
            <button 
              onClick={() => setTheme('DARK')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest z-10 transition-all duration-300 ${isDark ? 'bg-slate-950 shadow-md text-[#1ec3c3] scale-100' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Midnight
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'FLEET', label: 'Company Fleet', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011-1v5m-4 0h4" /> },
            { id: 'HEALTH', label: 'System Health', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
            { id: 'SUPPORT', label: 'Security Desk', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />, count: stats.openTickets },
            { id: 'FINANCE', label: 'Financial Hub', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
            { id: 'TEAM', label: 'Internal Nodes', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border ${activeTab === item.id ? themeClasses.navActive + ' shadow-[0_0_15px_rgba(30,195,195,0.2)]' : themeClasses.navIdle + ' border-transparent'}`}
            >
              <div className="flex items-center gap-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">{item.icon}</svg>
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              </div>
              {item.count && <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === item.id ? (isDark ? 'bg-slate-950 text-[#1ec3c3]' : 'bg-white text-slate-900') : 'bg-red-500 text-white'}`}>{item.count}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-6">
          <div className={`p-4 rounded-2xl border transition-colors duration-500 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
             <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Real-time Load</div>
             <div className={`h-1 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div className="h-full bg-[#1ec3c3] w-[42%] animate-pulse"></div>
             </div>
             <div className="flex justify-between mt-2">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Latency</span>
                <span className="text-[8px] font-bold text-[#1ec3c3]">12ms</span>
             </div>
          </div>

          <button 
            onClick={onExit}
            className={`w-full flex items-center gap-4 p-4 transition-all border border-transparent rounded-xl ${isDark ? 'text-slate-600 hover:text-red-400 hover:border-red-900/30' : 'text-slate-400 hover:text-red-600 hover:border-red-100'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7"/></svg>
            <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Console */}
      <main className={`flex-1 overflow-y-auto p-12 ${themeClasses.main} relative transition-colors duration-500`}>
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-opacity duration-1000 ${isDark ? 'bg-[#1ec3c3]/5 opacity-100' : 'bg-[#1ec3c3]/10 opacity-60'}`}></div>

        {/* Global Telemetry Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Network Value', val: `$${stats.totalRevenue.toLocaleString()}`, status: 'RECURRING', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Active Clusters', val: stats.activeClients, status: 'VERIFIED', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011-1v5m-4 0h4' },
            { label: 'Active Connections', val: stats.totalRepsOnline, status: 'SYNCING', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
            { label: 'System Health', val: '99.9%', status: 'OPTIMAL', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          ].map((s, i) => (
            <div key={i} className={`${themeClasses.card} p-8 rounded-[2rem] relative overflow-hidden group hover:border-[#1ec3c3]/30 transition-all duration-500`}>
              <div className="flex justify-between items-start mb-6">
                 <div className={`p-2 rounded-lg text-[#1ec3c3] transition-colors duration-500 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
                 </div>
                 <span className={`text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-slate-600 bg-slate-950' : 'text-slate-400 bg-slate-100'}`}>{s.status}</span>
              </div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</div>
              <div className={`text-3xl font-black transition-colors duration-500 ${themeClasses.textPrimary}`}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Tab Content Areas */}
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'FLEET' && (
             <div className={`${themeClasses.card} rounded-[3rem] overflow-hidden transition-all duration-500`}>
                <div className={`p-8 border-b ${themeClasses.border} flex justify-between items-center transition-colors duration-500 ${isDark ? 'bg-slate-900/20' : 'bg-slate-50'}`}>
                   <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors duration-500 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Corporate Entity Registry</h3>
                   <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                      <div className={`w-2 h-2 rounded-full transition-colors ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                      <div className={`w-2 h-2 rounded-full transition-colors ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                   </div>
                </div>
                <table className="w-full text-left">
                  <thead className={`transition-colors duration-500 ${themeClasses.tableHeader}`}>
                    <tr>
                      <th className="px-10 py-6 text-[8px] font-black text-slate-400 uppercase tracking-widest">Namespace</th>
                      <th className="px-10 py-6 text-[8px] font-black text-slate-400 uppercase tracking-widest">Integrity score</th>
                      <th className="px-10 py-6 text-[8px] font-black text-slate-400 uppercase tracking-widest">Uptime</th>
                      <th className="px-10 py-6 text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">Terminal</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y transition-colors duration-500 ${themeClasses.border}`}>
                    {companies.map(c => (
                      <tr key={c.id} className={`transition-colors duration-300 group ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                        <td className="px-10 py-8">
                          <div className={`font-black text-base mb-1 transition-colors duration-500 ${themeClasses.textPrimary}`}>{c.name}</div>
                          <div className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">{c.id} // {c.sector}</div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-4">
                             <div className={`flex-1 h-1 rounded-full overflow-hidden min-w-[100px] transition-colors duration-500 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                               <div className="h-full bg-[#1ec3c3] shadow-[0_0_10px_rgba(30,195,195,0.5)]" style={{ width: `${c.dataSanctityScore}%` }}></div>
                             </div>
                             <span className="text-[10px] font-black text-slate-500">{c.dataSanctityScore}%</span>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 uppercase tracking-widest">Online</span>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <button className={`text-[8px] font-black text-[#1ec3c3] uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-all border border-[#1ec3c3]/20 px-4 py-2 rounded-lg hover:bg-[#1ec3c3] hover:text-slate-950`}>Access Data Tree</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}

          {activeTab === 'HEALTH' && (
            <div className="space-y-8">
               {/* Real-time Oscilloscope Telemetry */}
               <div className={`${themeClasses.card} p-10 rounded-[3rem] transition-all duration-500`}>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className={`text-xl font-black uppercase tracking-widest transition-colors duration-500 ${themeClasses.textPrimary}`}>Core Telemetry Pulse</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Server Fleet v4.2 Status</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-[8px] font-black uppercase text-slate-400">Database</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#1ec3c3]"></div>
                          <span className="text-[8px] font-black uppercase text-slate-400">Compute</span>
                       </div>
                    </div>
                  </div>
                  
                  {/* CSS Simulated Waveform */}
                  <div className="h-48 flex items-end gap-1 px-4 border-b border-slate-800/50 mb-4 overflow-hidden">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-[#1ec3c3]/20 rounded-t-sm animate-pulse transition-all duration-700" 
                        style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.05}s` }}
                      >
                         <div className="w-full h-1 bg-[#1ec3c3] rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-8">
                     {[
                       { label: 'CPU LOAD', val: '24%', sub: 'Epyc 9654 x 2' },
                       { label: 'MEMORY', val: '64.2 GB', sub: 'of 256GB ECC' },
                       { label: 'CONNECTIONS', val: stats.totalRepsOnline, sub: 'Active P2P Syncs' },
                       { label: 'SLA UPTIME', val: '99.998%', sub: 'Last 30 Days' }
                     ].map((t, idx) => (
                       <div key={idx}>
                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{t.label}</div>
                          <div className={`text-xl font-black ${themeClasses.textPrimary}`}>{t.val}</div>
                          <div className="text-[7px] font-bold text-slate-600 uppercase tracking-tighter">{t.sub}</div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Integrity Map */}
                  <div className={`${themeClasses.card} p-10 rounded-[3rem] transition-all duration-500`}>
                     <h3 className={`text-sm font-black uppercase tracking-widest mb-6 transition-colors duration-500 ${themeClasses.textPrimary}`}>Client Integrity Map</h3>
                     <div className="space-y-6">
                        {companies.map(c => (
                          <div key={c.id} className="flex items-center justify-between group">
                             <div>
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1 group-hover:text-[#1ec3c3] transition-colors">{c.name}</div>
                               <div className="flex items-center gap-2">
                                  <div className="h-1 w-32 rounded-full bg-slate-800 overflow-hidden">
                                     <div 
                                       className={`h-full transition-all duration-1000 ${c.dataSanctityScore > 80 ? 'bg-green-500' : 'bg-orange-500'}`} 
                                       style={{ width: `${c.dataSanctityScore}%` }}
                                     ></div>
                                  </div>
                                  <span className="text-[8px] font-black text-slate-600">{c.dataSanctityScore}%</span>
                               </div>
                             </div>
                             <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${c.dataSanctityScore > 80 ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                               {c.dataSanctityScore > 80 ? 'SECURE' : 'AUDIT REQ'}
                             </span>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Active Nodes Visualization */}
                  <div className={`${themeClasses.card} p-10 rounded-[3rem] transition-all duration-500 relative overflow-hidden`}>
                     <div className={`absolute top-0 right-0 w-full h-full opacity-[0.03] transition-opacity duration-1000 ${isDark ? 'invert' : ''}`}>
                        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.1">
                           <path d="M10 10 L90 10 L90 90 L10 90 Z" />
                           <circle cx="30" cy="40" r="2" />
                           <circle cx="70" cy="20" r="2" />
                           <circle cx="50" cy="80" r="2" />
                           <path d="M30 40 L70 20 M70 20 L50 80 M50 80 L30 40" strokeDasharray="1 1" />
                        </svg>
                     </div>
                     <h3 className={`text-sm font-black uppercase tracking-widest mb-6 transition-colors duration-500 ${themeClasses.textPrimary}`}>Active P2P Sync Mesh</h3>
                     <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between p-4 bg-slate-950/20 rounded-2xl border border-slate-800">
                           <div>
                              <div className="text-[9px] font-black text-[#1ec3c3] uppercase">Peak Concurrency</div>
                              <div className={`text-2xl font-black ${themeClasses.textPrimary}`}>{stats.totalRepsOnline}</div>
                           </div>
                           <div className="text-right">
                              <div className="text-[9px] font-black text-slate-500 uppercase">Handshake Failures</div>
                              <div className="text-xl font-black text-red-500">0</div>
                           </div>
                        </div>
                        <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                           Current mesh load optimal. Real-time BroadcastChannel sessions active across {companies.length} verified corporate nodes. Encryption overhead currently utilizing 4% compute.
                        </p>
                        <button className="w-full py-3 bg-slate-800/50 rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-800 transition-all border border-slate-700/50">Recalibrate Global Handshake</button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'SUPPORT' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {tickets.map(ticket => (
                 <div key={ticket.id} className={`${themeClasses.card} p-8 rounded-[2.5rem] group hover:border-[#1ec3c3]/40 transition-all duration-500`}>
                    <div className="flex justify-between items-start mb-8">
                       <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                         ticket.status === 'OPEN' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                         ticket.status === 'RESOLVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                       }`}>
                         {ticket.status}
                       </span>
                       <span className={`text-[8px] font-black uppercase tracking-widest transition-colors duration-500 ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>{ticket.id}</span>
                    </div>
                    <h4 className={`text-lg font-black mb-2 tracking-tight transition-colors duration-500 ${themeClasses.textPrimary}`}>{ticket.subject}</h4>
                    <p className="text-[9px] font-black text-[#1ec3c3] uppercase tracking-[0.2em] mb-8">{ticket.companyName}</p>
                    <div className={`flex justify-between items-center pt-6 border-t transition-colors duration-500 ${themeClasses.border}`}>
                       <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                       <button className={`text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-xl transition-all ${isDark ? 'bg-slate-800 text-white hover:bg-[#1ec3c3] hover:text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white'}`}>Patch Instance</button>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'FINANCE' && (
             <div className="space-y-8">
                <div className={`${themeClasses.card} p-12 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-10 transition-all duration-500`}>
                   <div className="space-y-6 flex-1 text-center md:text-left">
                      <h3 className={`text-3xl font-black leading-none tracking-tight uppercase transition-colors duration-500 ${themeClasses.textPrimary}`}>Revenue Grid Oversight</h3>
                      <p className={`text-sm max-w-lg font-medium leading-relaxed transition-colors duration-500 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Financial telemetries across verified pharmaceutical nodes. System detecting 12% Month-over-Month growth in enterprise tier subscriptions.</p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                         <div className={`${themeClasses.inputBg} p-8 rounded-3xl border transition-colors duration-500`}>
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated ARR</div>
                            <div className="text-3xl font-black text-[#1ec3c3]">${stats.totalRevenue.toLocaleString()}</div>
                         </div>
                         <div className={`${themeClasses.inputBg} p-8 rounded-3xl border transition-colors duration-500`}>
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Node Count</div>
                            <div className={`text-3xl font-black transition-colors duration-500 ${themeClasses.textPrimary}`}>{companies.length}</div>
                         </div>
                      </div>
                   </div>
                   <div className={`${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-100'} w-64 h-64 rounded-full border flex flex-col items-center justify-center p-10 text-center relative transition-colors duration-500 shadow-inner`}>
                      <div className="absolute inset-0 border-t-2 border-[#1ec3c3] rounded-full animate-[spin_10s_linear_infinite]"></div>
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Collection</span>
                      <span className={`text-3xl font-black transition-colors duration-500 ${themeClasses.textPrimary}`}>98%</span>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'TEAM' && (
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {MOCK_INTERNAL.map(user => (
                  <div key={user.id} className={`${themeClasses.card} p-10 rounded-[3rem] text-center group hover:border-[#1ec3c3]/40 transition-all duration-500`}>
                    <div className={`${isDark ? 'bg-slate-900' : 'bg-slate-50'} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400 group-hover:text-[#1ec3c3] transition-colors duration-500 shadow-inner`}>
                       <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <h4 className={`text-sm font-black mb-1 uppercase tracking-widest transition-colors duration-500 ${themeClasses.textPrimary}`}>{user.name}</h4>
                    <p className="text-[8px] font-black text-[#1ec3c3] uppercase tracking-[0.2em] mb-6">{user.role.replace('_', ' ')}</p>
                    <div className="flex items-center justify-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ONLINE' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-slate-300'}`}></div>
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{user.status}</span>
                    </div>
                  </div>
                ))}
             </div>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .font-mono { font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(30,195,195,0.2); border-radius: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 500ms; }
      `}} />
    </div>
  );
};

export default SuperAdminDashboard;
