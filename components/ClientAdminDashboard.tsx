
import React from 'react';
import { MedicineData, MedicalRep, CompanySubView, VerificationRequest, UserRole } from '../types';
import ExtractionTable from './ExtractionTable';
import TeamManagement from './TeamManagement';
import RegionalStrategy from './RegionalStrategy';
import VerificationCenter from './VerificationCenter';

interface ClientAdminDashboardProps {
  userName: string;
  companyName: string;
  data: MedicineData[];
  reps: MedicalRep[];
  subView: CompanySubView;
  setSubView: (view: CompanySubView) => void;
  verificationRequests: VerificationRequest[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddMedicine: () => void;
  onEditMedicine: (med: MedicineData) => void;
  onDeleteMedicine: (med: MedicineData) => void;
  onAddRep: (rep: any) => void;
  onEditRep: (rep: MedicalRep) => void;
  onDeleteRep: (rep: MedicalRep) => void;
  onApprove: (id: string, level: 'IT' | 'SENIOR') => void;
  onReject: (id: string) => void;
  onShowPresentation: (meds: MedicineData[]) => void;
  onShowMap: () => void;
  activeRole: UserRole;
}

const ClientAdminDashboard: React.FC<ClientAdminDashboardProps> = (props) => {
  const { 
    userName, companyName, data, reps, subView, setSubView, 
    verificationRequests, onFileUpload, fileInputRef, searchTerm, 
    setSearchTerm, onAddMedicine, onEditMedicine, onDeleteMedicine, onAddRep, 
    onEditRep, onDeleteRep, onApprove, onReject, onShowPresentation,
    onShowMap, activeRole
  } = props;

  const stats = {
    verifiedMeds: data.filter(m => m.seniorLocked).length,
    totalDivisions: new Set(data.map(m => m.division)).size,
    pendingVerifications: verificationRequests.filter(r => r.status === 'PENDING').length
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Corporate Strategy Header */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-slate-800 p-1 shadow-2xl">
              <div className="w-full h-full rounded-[2.3rem] bg-slate-900 flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black tracking-tight leading-none">Admin <span className="text-indigo-400">Terminal</span></h1>
                <span className="px-4 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">Strategic Lead</span>
              </div>
              <p className="text-slate-400 font-medium uppercase tracking-[0.3em] text-xs">
                {companyName} Corporate Oversight // {userName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto">
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Portfolio Data</div>
              <div className="text-2xl font-black text-white">{stats.verifiedMeds}/{data.length}</div>
              <div className="text-[8px] font-bold text-indigo-400 uppercase">Verified Brands</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Capacity</div>
              <div className="text-2xl font-black text-white">{reps.length}</div>
              <div className="text-[8px] font-bold text-indigo-400 uppercase">Field Nodes</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md hidden sm:block">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Verification Queue</div>
              <div className="text-2xl font-black text-[#1ec3c3]">{stats.pendingVerifications}</div>
              <div className="text-[8px] font-bold text-indigo-400 uppercase">Awaiting Lock</div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex gap-10">
          {[
            { id: 'PORTFOLIO', label: 'Clinical Portfolio' },
            { id: 'TEAM', label: 'Field Force Management' },
            { id: 'STRATEGY', label: 'Regional Strategy' },
            { id: 'VERIFICATION', label: 'Security & Verification' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setSubView(tab.id as any)}
              className={`text-[10px] font-black uppercase tracking-[0.2em] pb-4 border-b-2 transition-all relative ${
                subView === tab.id 
                  ? 'border-indigo-600 text-slate-900' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
              {tab.id === 'VERIFICATION' && stats.pendingVerifications > 0 && (
                <span className="absolute -top-1 -right-4 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full animate-bounce">
                  {stats.pendingVerifications}
                </span>
              )}
            </button>
          ))}
        </div>
        <button 
          onClick={onShowMap}
          className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-xl hover:scale-105"
        >
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Corporate Ecosystem Map
        </button>
      </div>

      {/* Workspace Area */}
      <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl min-h-[600px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-3xl -mr-40 -mt-40 opacity-40 pointer-events-none"></div>

        {subView === 'PORTFOLIO' && (
          <div className="space-y-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                 <h2 className="text-4xl font-black text-slate-900 tracking-tight">Therapeutic Portfolio</h2>
                 <p className="text-slate-400 font-medium mt-1">Extract clinical modules or manually register brand assets into the secure vault.</p>
              </div>
              <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-[340px]">
                  <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <input type="text" placeholder="Search brands or indications..." className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <button 
                  onClick={onAddMedicine}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Manual Entry
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  AI PDF Extraction
                </button>
                <input type="file" ref={fileInputRef} onChange={onFileUpload} className="hidden" accept=".pdf" />
              </div>
            </div>
            <ExtractionTable 
              data={data.filter(m => m.brand.toLowerCase().includes(searchTerm.toLowerCase()))} 
              onSelect={(med) => onShowPresentation([med])} 
              onEdit={onEditMedicine} 
              onDelete={onDeleteMedicine} 
              readOnly={false}
            />
          </div>
        )}

        {subView === 'TEAM' && (
          <TeamManagement 
            reps={reps} 
            onAdd={onAddRep} 
            onEdit={onEditRep} 
            onDelete={onDeleteRep} 
            onSendEmail={() => {}} 
            isSenior={activeRole === 'SENIOR_VERIFIER'} 
            onBack={() => setSubView('PORTFOLIO')}
          />
        )}

        {subView === 'STRATEGY' && (
          <RegionalStrategy reps={reps} data={data} onUpdateReps={() => {}} />
        )}

        {subView === 'VERIFICATION' && (
          <VerificationCenter 
            requests={verificationRequests} 
            onApprove={onApprove} 
            onReject={onReject} 
            onBack={() => setSubView('PORTFOLIO')} 
          />
        )}
      </div>
    </div>
  );
};

export default ClientAdminDashboard;
