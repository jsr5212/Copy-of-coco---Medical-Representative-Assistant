
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
  onBulkVerify: (ids: string[]) => void;
  onToggleAdminLock: (id: string, state: boolean) => void;
}

const ClientAdminDashboard: React.FC<ClientAdminDashboardProps> = (props) => {
  const { 
    userName, companyName, data, reps, subView, setSubView, 
    verificationRequests, onFileUpload, fileInputRef, searchTerm, 
    setSearchTerm, onAddMedicine, onEditMedicine, onDeleteMedicine, onAddRep, 
    onEditRep, onDeleteRep, onApprove, onReject, onShowPresentation,
    onShowMap, activeRole, onBulkVerify, onToggleAdminLock
  } = props;

  // Identify medicines that have been extracted but not yet submitted for verification
  const unverifiedMeds = data.filter(m => !m.adminLocked && !m.seniorLocked);
  const filteredData = data.filter(m => 
    m.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.division.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    verifiedMeds: data.filter(m => m.seniorLocked).length,
    totalDivisions: new Set(data.map(m => m.division)).size,
    pendingVerifications: verificationRequests.filter(r => r.status === 'PENDING').length
  };

  const handleCommitBatch = () => {
    if (unverifiedMeds.length === 0) return;
    if (window.confirm(`Lock ${unverifiedMeds.length} clinical records and assign them to IT & Senior Verifiers for final verification?`)) {
      onBulkVerify(unverifiedMeds.map(m => m.id));
    }
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
              {tab.id === 'PORTFOLIO' && unverifiedMeds.length > 0 && (
                <span className="absolute -top-1 -right-4 w-4 h-4 bg-[#1ec3c3] text-slate-900 text-[8px] flex items-center justify-center rounded-full animate-pulse shadow-sm">
                   {unverifiedMeds.length}
                </span>
              )}
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
              <div className="flex items-center gap-4">
                 <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Therapeutic Portfolio</h2>
                    <p className="text-slate-400 font-medium mt-1">Extract clinical modules or manually register brand assets into the secure vault.</p>
                 </div>
                 <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 hidden md:block">
                    <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Vault Status</div>
                    <div className="text-xs font-black text-indigo-900">{data.length} Clinical Nodes</div>
                 </div>
              </div>
              <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-[340px]">
                  <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <input type="text" placeholder="Search brands or indications..." className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                
                {unverifiedMeds.length > 0 && (
                  <button 
                    onClick={handleCommitBatch}
                    className="bg-[#1ec3c3] text-slate-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-[#18a0a0] transition-all hover:scale-105 flex items-center gap-2 animate-pulse"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    Lock & Assign Audit ({unverifiedMeds.length})
                  </button>
                )}

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

            {filteredData.length > 0 ? (
              <ExtractionTable 
                data={filteredData} 
                onSelect={(med) => onShowPresentation([med])} 
                onEdit={onEditMedicine} 
                onDelete={onDeleteMedicine} 
                readOnly={false}
                verificationRequests={verificationRequests}
                onToggleAdminLock={onToggleAdminLock}
              />
            ) : (
              <div className="py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                   <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 7.717l.477 2.387a2 2 0 00.547 1.022l11.232-11.232a2.828 2.828 0 00-4-4L19.428 15.428z" />
                   </svg>
                </div>
                <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">
                  {data.length === 0 ? "Corporate Vault Empty" : "No Matches Found"}
                </h3>
                <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
                  {data.length === 0 
                    ? "Upload your clinical medicine glossary PDF using the AI Extraction button to populate your therapeutic portfolio." 
                    : `No brands match your search term "${searchTerm}". Try searching by Therapeutic Area or Indication instead.`}
                </p>
                {data.length > 0 && searchTerm !== '' && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-6 text-indigo-600 font-black uppercase text-[10px] tracking-widest hover:underline"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
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
