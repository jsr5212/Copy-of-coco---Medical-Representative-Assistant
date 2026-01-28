
import React from 'react';
import { VerificationRequest, MedicineData, MedicalRep } from '../types';

interface SeniorDashboardProps {
  companyName: string;
  requests: VerificationRequest[];
  medicines: MedicineData[];
  reps: MedicalRep[];
  onApprove: (requestId: string, level: 'IT' | 'SENIOR') => void;
  onReject: (requestId: string) => void;
  onBack?: () => void;
}

const SeniorDashboard: React.FC<SeniorDashboardProps> = ({ 
  companyName, 
  requests, 
  medicines, 
  reps, 
  onApprove, 
  onReject,
  onBack
}) => {
  const pendingSenior = requests.filter(r => r.status === 'PENDING' && r.itVerified && !r.seniorVerified);
  const totalLocked = [...medicines, ...reps].filter(e => e.seniorLocked).length;
  const awaitingIT = requests.filter(r => r.status === 'PENDING' && !r.itVerified).length;

  const StatCard = ({ label, value, subtext, color }: { label: string, value: number, subtext: string, color: string }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${color}`}></div>
      <div className="relative z-10">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</div>
        <div className="text-5xl font-black text-slate-900 mb-2">{value}</div>
        <div className="text-xs font-medium text-slate-500">{subtext}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <button 
            onClick={onBack}
            className="text-[10px] font-black text-[#1ec3c3] uppercase tracking-widest mb-4 flex items-center gap-2 hover:underline"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Authority Dashboard
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
            {companyName} <br/><span className="text-slate-300">Verification Hub</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Authority</div>
            <div className="text-sm font-bold text-slate-900">Senior Verifier Panel</div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          label="Awaiting Senior" 
          value={pendingSenior.length} 
          subtext="Ready for final stage locking" 
          color="bg-blue-600"
        />
        <StatCard 
          label="Frozen Records" 
          value={totalLocked} 
          subtext="Double-locked and immutable" 
          color="bg-[#1ec3c3]"
        />
        <StatCard 
          label="In IT Verification" 
          value={awaitingIT} 
          subtext="Awaiting preliminary approval" 
          color="bg-slate-900"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Approval Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">Final Verification Queue</h2>
            <span className="text-xs font-bold text-slate-400">{pendingSenior.length} Stage-2 Actions</span>
          </div>

          <div className="space-y-4">
            {pendingSenior.map(req => (
              <div key={req.id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl hover:border-blue-200 transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                      {req.type === 'MEDICINE' ? (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 7.717l.477 2.387a2 2 0 00.547 1.022l11.232-11.232a2.828 2.828 0 00-4-4L19.428 15.428z" />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">IT Approved</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{req.action}</span>
                      </div>
                      <h4 className="text-xl font-black text-slate-900 mt-1">
                        {req.proposedData?.brand || req.proposedData?.name || 'Entity Record'}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-300 uppercase">Request Date</div>
                    <div className="text-xs font-bold text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100/50">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Audit Details</h5>
                  <div className="text-sm text-slate-600 font-medium italic">
                    {req.action === 'DELETE' 
                      ? "Complete deletion request. Record has been flagged for removal by the IT team. Senior authority must confirm permanent purge."
                      : `Update request for clinical/personnel data. IT team has verified the integrity of the proposed changes.`}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => onApprove(req.id, 'SENIOR')}
                    className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Apply Senior Lock
                  </button>
                  <button 
                    onClick={() => onReject(req.id)}
                    className="px-8 font-black text-red-400 hover:text-red-600 transition-colors uppercase text-[10px] tracking-widest"
                  >
                    Reject Action
                  </button>
                </div>
              </div>
            ))}

            {pendingSenior.length === 0 && (
              <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <svg className="h-8 w-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-slate-300">Queue is Clear</h3>
                <p className="text-slate-400 text-sm mt-2">No items require senior level locking at this time.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Audit Log / Locked Records */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900">Audit Registry</h2>
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-[600px] overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {[...medicines, ...reps].filter(e => e.itLocked || e.seniorLocked).map((e: any, i) => (
                <div key={e.id} className="pb-6 border-b border-white/10 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${e.seniorLocked ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/40'}`}>
                      {e.seniorLocked ? 'Double Locked' : 'IT Locked'}
                    </div>
                    <span className="text-[8px] text-white/20 font-bold uppercase">{e.id}</span>
                  </div>
                  <div className="text-sm font-black text-white">{e.brand || e.name}</div>
                  <div className="text-[10px] text-white/40 font-medium mt-1">
                    {e.seniorLocked 
                      ? "Immutable - Only senior unlock permitted" 
                      : "Pending final stage verification"}
                  </div>
                </div>
              ))}
              {[...medicines, ...reps].filter(e => e.itLocked || e.seniorLocked).length === 0 && (
                <div className="text-center py-20 text-white/20 font-black uppercase tracking-widest text-[10px]">
                  No registry logs found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorDashboard;
