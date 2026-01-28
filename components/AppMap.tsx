
import React from 'react';
import { UserRole } from '../types';

interface AppMapProps {
  currentRole: UserRole;
  onNavigateToView: (role: UserRole) => void;
  onClose: () => void;
}

const AppMap: React.FC<AppMapProps> = ({ currentRole, onNavigateToView, onClose }) => {
  const allNodes = [
    {
      role: 'SUPER_ADMIN' as UserRole,
      title: 'Pharmaintel Nexus',
      desc: 'Global oversight terminal. Business intelligence, ecosystem sanctity, and billing logs.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2 2 2 0 012 2v.657m1.945-8.471a10 10 0 11-12.69 12.689" />
        </svg>
      ),
      color: 'bg-slate-950',
      minClearance: ['SUPER_ADMIN']
    },
    {
      role: 'ADMIN' as UserRole,
      title: 'Corporate HQ',
      desc: 'Central command for extraction, portfolio strategy, and field force deployment.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011-1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-indigo-700',
      minClearance: ['SUPER_ADMIN', 'ADMIN', 'COMPANY_USER']
    },
    {
      role: 'IT_VERIFIER' as UserRole,
      title: 'Engineering Console',
      desc: 'Technical audit terminal for Stage-1 verification and data schema validation.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      color: 'bg-blue-600',
      minClearance: ['SUPER_ADMIN', 'IT_VERIFIER']
    },
    {
      role: 'SENIOR_VERIFIER' as UserRole,
      title: 'Authority Vault',
      desc: 'Executive lock terminal for final approval and clinical record immobilization.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'bg-slate-900',
      minClearance: ['SUPER_ADMIN', 'SENIOR_VERIFIER']
    },
    {
      role: 'FIELD_REP' as UserRole,
      title: 'Territory Terminal',
      desc: 'Operational hub for HCP management, follow-ups, and synchronized clinical briefings.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-[#1ec3c3]',
      minClearance: ['SUPER_ADMIN', 'ADMIN', 'FIELD_REP', 'GUEST']
    }
  ];

  // Hierarchy Logic: Only show nodes where the user's role is in the minClearance list.
  const filteredNodes = allNodes.filter(node => node.minClearance.includes(currentRole));

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950/98 backdrop-blur-3xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-700">
      <button 
        onClick={onClose}
        className="absolute top-10 right-10 text-white/20 hover:text-white transition-all p-4 hover:rotate-90"
      >
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="text-center mb-20 space-y-4">
        <h2 className="text-6xl font-black text-white tracking-tighter leading-none">Global Infrastructure</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium">Clearance Level: <span className="text-[#1ec3c3] uppercase tracking-widest">{currentRole}</span></p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(filteredNodes.length, 3)} gap-10 max-w-7xl w-full`}>
        {filteredNodes.map((node, i) => (
          <div 
            key={node.role + i} 
            className="group relative bg-white/5 border border-white/10 rounded-[4rem] p-12 flex flex-col items-center text-center hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
          >
            <div className={`w-24 h-24 rounded-[2rem] ${node.color} text-white flex items-center justify-center mb-10 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
              {node.icon}
            </div>
            
            <h3 className="text-3xl font-black text-white mb-4 tracking-tight">{node.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-12 flex-1 font-medium">{node.desc}</p>

            <button 
              onClick={() => onNavigateToView(node.role)}
              className="w-full bg-white text-slate-950 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-[#1ec3c3] hover:text-slate-950 transition-all active:scale-95 shadow-xl"
            >
              Access Instance
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 px-8 py-3 bg-white/5 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            Permission Set: {currentRole === 'SUPER_ADMIN' ? 'UNRESTRICTED' : 'HIERARCHY_ENFORCED'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppMap;
