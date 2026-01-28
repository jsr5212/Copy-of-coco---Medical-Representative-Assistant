
import React, { useState } from 'react';
import { MedicalRep } from '../types';

interface TeamManagementProps {
  reps: MedicalRep[];
  onAdd: (rep: Omit<MedicalRep, 'id' | 'username' | 'tempPass' | 'status' | 'assignedDivisions'>) => void;
  onEdit: (rep: MedicalRep) => void;
  onDelete: (rep: MedicalRep) => void;
  onSendEmail: (id: string) => void;
  onBack?: () => void;
  isSenior?: boolean;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ reps, onAdd, onEdit, onDelete, onSendEmail, onBack, isSenior }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', region: '' });

  const isDirty = formData.name !== '' || formData.email !== '' || formData.region !== '';

  const toggleAddForm = () => {
    if (showAdd && isDirty) {
      if (window.confirm("You have entered details for a new representative. Closing the form will discard them. Continue?")) {
        setShowAdd(false);
        setFormData({ name: '', email: '', region: '' });
      }
    } else {
      setShowAdd(!showAdd);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', email: '', region: '' });
    setShowAdd(false);
  };

  const LockIcon = ({ isLocked, label }: { isLocked: boolean; label: string }) => (
    <div className="flex flex-col items-center gap-1 group/lock">
      <div className={`p-2 rounded-lg transition-all duration-500 ${isLocked ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500 animate-pulse'}`}>
        {isLocked ? (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
          </svg>
        )}
      </div>
      <span className="text-[8px] font-black uppercase tracking-tighter opacity-40 group-hover/lock:opacity-100 transition-opacity">{label}</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <button 
            onClick={onBack}
            className="text-[10px] font-black text-[#1ec3c3] uppercase tracking-widest mb-4 flex items-center gap-2 hover:underline"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </button>
          <h2 className="text-3xl font-black text-slate-900">Medical Representatives</h2>
          <p className="text-slate-500">Field force management with mandatory dual-level locking.</p>
        </div>
        <button 
          onClick={toggleAddForm}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {showAdd ? 'Close Form' : '+ Add Representative'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
            <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" placeholder="Jane Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
            <input required type="email" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" placeholder="jane@novartis.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Region / Territory</label>
            <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" placeholder="North East" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} />
          </div>
          <div className="md:col-span-3">
            <button type="submit" className="w-full bg-[#1ec3c3] text-white font-black py-4 rounded-xl shadow-lg">Submit New MR Record</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reps.map(rep => (
          <div key={rep.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl group hover:border-blue-200 transition-all relative overflow-hidden">
            {/* Double Lock Indicators */}
            <div className="absolute top-6 right-6 flex gap-3">
              <LockIcon isLocked={!!rep.itLocked} label="IT LOCK" />
              <LockIcon isLocked={!!rep.seniorLocked} label="SENIOR LOCK" />
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 ${rep.seniorLocked ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {rep.name.charAt(0)}
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-1">{rep.name}</h3>
            <p className="text-xs text-slate-400 mb-6 font-medium tracking-tight uppercase">{rep.region} Team</p>
            
            <div className="bg-slate-50 p-5 rounded-[2rem] mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / User</span>
                <span className="text-xs font-bold text-slate-800">{rep.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</span>
                <span className="text-xs font-mono font-bold text-[#1ec3c3]">{rep.tempPass}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => onSendEmail(rep.id)}
                className="w-full bg-slate-900 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all"
              >
                Dispatch Credentials
              </button>
              
              <div className="flex gap-2">
                <button 
                  disabled={rep.seniorLocked && !isSenior}
                  onClick={() => onEdit(rep)}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 transition-all ${
                    rep.seniorLocked && !isSenior 
                      ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Edit Details
                </button>
                <button 
                  disabled={rep.seniorLocked && !isSenior}
                  onClick={() => onDelete(rep)}
                  className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-50 transition-all ${
                    rep.seniorLocked && !isSenior 
                      ? 'bg-slate-50 text-slate-200 cursor-not-allowed' 
                      : 'bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600'
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>

            {rep.seniorLocked && (
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Frozen by Senior Authority</span>
              </div>
            )}
          </div>
        ))}
        {reps.length === 0 && !showAdd && (
          <div className="col-span-full py-40 text-center border-4 border-dashed border-slate-50 rounded-[4rem]">
            <div className="text-slate-300 font-black text-xl uppercase tracking-[0.2em]">Field Force Empty</div>
            <p className="text-slate-400 text-sm mt-2">Add your first medical representative to begin regional mapping.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;
